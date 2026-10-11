// Run: node --test   (no dependencies)
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
execFileSync(process.execPath, [path.join(ROOT, 'build.js')], { cwd: ROOT, stdio: 'pipe' });

const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p); else if (p.endsWith('.html')) pages.push(p);
  }
})(SITE);

test('builds 1,000 trade x city pages plus indexes', () => {
  const { SERVICES, CITIES } = require('../data');
  assert.strictEqual(SERVICES.length * CITIES.length, 1000);
  assert.ok(pages.length >= 1000);
});

test('every internal link resolves to a built file', () => {
  const broken = new Set();
  for (const f of pages) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/href="(\/[^"#?]*)"/g)) {
      let t = path.join(SITE, m[1]);
      if (m[1].endsWith('/')) t = path.join(t, 'index.html');
      if (!fs.existsSync(t) && !m[1].startsWith('/media/')) broken.add(m[1]);
    }
  }
  assert.deepStrictEqual([...broken], []);
});

test('pages have title, description and canonical, and titles are unique', () => {
  const titles = new Map();
  for (const f of pages.filter((p) => !p.endsWith('404.html'))) {
    const h = fs.readFileSync(f, 'utf8');
    const t = (h.match(/<title>([^<]+)<\/title>/) || [])[1];
    assert.ok(t, `missing <title> in ${f}`);
    assert.match(h, /<meta name="description" content="[^"]+"/, f);
    assert.match(h, /rel="canonical"/, f);
    titles.set(t, (titles.get(t) || 0) + 1);
  }
  const dupes = [...titles].filter(([, n]) => n > 1);
  assert.deepStrictEqual(dupes, []);
});

test('sitemap lists only pages that exist', () => {
  const sm = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.ok(locs.length >= 1000);
  for (const p of locs) {
    const t = p.endsWith('/') ? path.join(SITE, p, 'index.html') : path.join(SITE, p);
    assert.ok(fs.existsSync(t), `sitemap points at missing ${p}`);
  }
});

test('no raw template placeholders leak into output', () => {
  for (const f of pages) assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /\$\{|undefined|NaN/, f);
});

test('netlify serves real 404s (no catch-all SPA rewrite on a static site)', () => {
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  assert.doesNotMatch(toml, /from = "\/\*"\s*\n\s*to = "\/index\.html"\s*\n\s*status = 200/);
  assert.ok(fs.existsSync(path.join(SITE, '404.html')));
});
