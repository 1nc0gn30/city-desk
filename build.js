#!/usr/bin/env node
/**
 * City Desk static site.
 * Twenty trades × fifty cities = 1,000 finished pages, plus indexes.
 * A page is the site. City Desk is one studio, not a local shop.
 */
const fs = require('fs');
const path = require('path');
const { SERVICES, CITIES } = require('./data');
const { replyTo, origin, studio } = require('./config');

const ROOT = __dirname;
const SITE = path.join(ROOT, 'site');

function hash(seed) {
  let n = 2166136261;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619) >>> 0;
  return n;
}

function pick(seed, list) {
  return list[hash(seed) % list.length];
}

function rotate(list, seed) {
  const i = hash(seed) % list.length;
  return list.slice(i).concat(list.slice(0, i));
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function money(n) {
  return '$' + Number(n).toLocaleString('en-US');
}

function href(to) {
  const target = String(to || '').replace(/^\/+/, '');
  return target ? '/' + target : '/';
}

function jsonLd(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

function fill(text, city) {
  return String(text).replaceAll('{city}', city.name).replaceAll('{state}', city.state);
}

const MARK = '<svg class="mark-svg" viewBox="0 0 32 32" aria-hidden="true"><rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="none" stroke="#9a3412" stroke-width="1.5"/><path d="M7 23c5-10 9-11 18-15" fill="none" stroke="#9a3412" stroke-width="2.2" stroke-linecap="round"/></svg>';

const SHOTS = {
  painters: {
    hero: { file: 'hero.jpg', alt: 'A living room mid-paint, tape on the trim and a roller on the drop cloth' },
    cards: {
      Exterior: { file: 'exterior.jpg', alt: 'Fresh siding on a craftsman house, a ladder beside the taped window' },
      Cabinets: { file: 'cabinets.jpg', alt: 'Warm-white cabinet doors with a brush and a plain can on the counter' },
      Interior: { file: 'interior.jpg', alt: 'A roller laying a smooth coat of paint in window light' }
    }
  }
};

function shotsFor(service) {
  const pack = SHOTS[service.slug];
  if (!pack) return null;
  const dir = path.join(ROOT, 'media', service.slug);
  if (!fs.existsSync(path.join(dir, pack.hero.file))) return null;
  return pack;
}

function copyTree(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}

function emphCity(headline, cityName) {
  const at = headline.lastIndexOf(cityName);
  if (at < 0) return esc(headline);
  return esc(headline.slice(0, at)) + '<em>' + esc(cityName) + '</em>' + esc(headline.slice(at + cityName.length));
}

function painterBody({ service, city, pack, headline, lede, work, steps, points, faqs, slots, ask, other }) {
  const price = money(service.price);
  const src = (file) => esc(href('media/' + service.slug + '/' + file));
  const place = `${city.name}, ${city.state}`;
  const homeLines = points.filter((p) => !/first screen/i.test(p));
  const plates = work.map(([title, bodyText], i) => {
    const shot = pack.cards[title];
    const photo = shot ? `<img src="${src(shot.file)}" alt="${esc(shot.alt)}" loading="lazy">` : '';
    const num = String(i + 1).padStart(2, '0');
    return `  <article class="plate"${i === 0 ? ' id="work"' : ''}>
    <figure>${photo}</figure>
    <div class="plate-copy"><span class="num">${num}</span><h3>${esc(title)}</h3><p>${esc(bodyText)}</p></div>
  </article>`;
  }).join('\n');
  return `
<section class="front" id="top">
  <div class="front-copy">
    <p class="kicker"><span class="tape" aria-hidden="true"></span>House painting · ${esc(place)}</p>
    <h1>${emphCity(headline, city.name)}</h1>
    <p class="front-lede">${esc(lede)}</p>
    <div class="front-actions">
      <a class="btn-tape" href="#contact">Ask for a written price</a>
      <a class="btn-line" href="#work">See the work</a>
    </div>
    <dl class="facts">
      <div><dt>Written</dt><dd>Price before paint</dd></div>
      <div><dt>Listed</dt><dd>Prep in the price</dd></div>
      <div><dt>Walked</dt><dd>When it is dry</dd></div>
    </dl>
  </div>
  <figure class="front-photo">
    <img src="${src(pack.hero.file)}" alt="${esc(pack.hero.alt)}" fetchpriority="high">
  </figure>
</section>
<section class="sect" aria-label="Work">
  <header class="sect-head"><p class="kicker"><span class="tape" aria-hidden="true"></span>The work</p><h2>Three kinds of job, priced apart</h2></header>
  <div class="plates">
${plates}
  </div>
</section>
<section class="sect" id="job">
  <header class="sect-head"><p class="kicker"><span class="tape" aria-hidden="true"></span>How a job goes</p><h2>Three steps, all written down</h2></header>
  <ol class="steps-row">
${steps.map(([title, bodyText], i) => `    <li><span class="num">${String(i + 1).padStart(2, '0')}</span><strong>${esc(title)}</strong><p>${esc(bodyText)}</p></li>`).join('\n')}
  </ol>
</section>
<section class="sect sect-two" id="ask">
  <div>
    <header class="sect-head"><p class="kicker"><span class="tape" aria-hidden="true"></span>Before the visit</p><h2>What to expect</h2></header>
    <ul class="ticks">
${homeLines.map((item) => `      <li>${esc(item)}</li>`).join('\n')}
    </ul>
  </div>
  <div>
    <header class="sect-head"><p class="kicker"><span class="tape" aria-hidden="true"></span>Questions</p><h2>Asked before every job</h2></header>
    <div class="faqs">
${faqs.map(([q, a]) => `      <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
    </div>
  </div>
</section>
<section class="contact" id="contact">
  <div class="contact-copy">
    <p class="kicker"><span class="tape" aria-hidden="true"></span>Get a written price</p>
    <h2>Send the rooms and a few photos</h2>
    <p>The owner answers from these lines. Replace them with the real name, phone, and email.</p>
  </div>
  <div class="reach-lines">
${slots.map(([label, value]) => `    <p><span>${esc(label)}</span>${esc(value)}</p>`).join('\n')}
  </div>
</section>
<section class="offer-block" id="offer" aria-label="Offer to the owner">
  <div class="offer-inner">
    <div class="offer-head">
      <p class="kicker kicker-light">For the painting owner in ${esc(city.name)}</p>
      <h2>This page is finished. Put your name on it.</h2>
      <p>Add the business name, phone, and email to the contact lines and publish. Nothing else to write.</p>
    </div>
    <div class="offer-price">
      <strong>${esc(price)}</strong>
      <span>One finished page · ${esc(place)}</span>
      ${ask.action}
    </div>
  </div>
  ${ask.rest}
</section>
<section class="sect sect-more">
  <h2>Other finished pages in ${esc(city.name)}</h2>
  <div class="trades">
${other.map((s) => `    <a href="${esc(href('cities/' + city.slug + '/' + s.slug + '/'))}">${esc(s.name)}</a>`).join('\n')}
  </div>
  <p class="note"><a href="${esc(href('cities/' + city.slug + '/'))}">All trades in ${esc(city.name)}</a> · <a href="${esc(href('services/' + service.slug + '/'))}">${esc(service.name)} in other cities</a></p>
</section>`;
}

function page({ from, title, description, json, body, shop, foot, theme }) {
  const canonical = origin
    ? `\n<link rel="canonical" href="${esc(origin.replace(/\/$/, '') + (from ? '/' + from + '/' : '/'))}">`
    : '';
  const ogUrl = origin ? esc(origin.replace(/\/$/, '') + (from ? '/' + from + '/' : '/')) : 'https://city-desk.netlify.app/';
  const header = shop
    ? `<header class="bar">
  <div class="wrap bar-row">
  <a class="mark" href="#top">${esc(shop.name)} <span>${esc(shop.city)}</span></a>
  <nav>
    <a href="#work">Work</a>
    <a href="#job">A job</a>
    <a href="#ask">Questions</a>
    <a class="nav-cta" href="#contact">Get a price</a>
  </nav>
  </div>
</header>`
    : `<header class="bar">
  <div class="wrap bar-row">
  <a class="mark" href="/">${esc(studio.split(' ')[0])} <span>${esc(studio.split(' ').slice(1).join(' ') || 'Desk')}</span></a>
  <nav>
    <a href="/">Cities</a>
    <a href="/services/">Trades</a>
  </nav>
  </div>
</header>`;
  const footer = foot || `<p>${esc(studio)} is one studio. These pages are finished sites for owners. They are not local offices, and they are not a count of who else is selling in town.</p>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="${theme || '#f3efe6'}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">${canonical}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${ogUrl}">
<meta property="og:image" content="https://city-desk.netlify.app/media/painters/hero.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@1nc0gn30">
<meta name="twitter:creator" content="@1nc0gn30">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="https://city-desk.netlify.app/media/painters/hero.jpg">
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">${jsonLd(json)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${shop ? `<div class="strip"><div class="strip-row"><p>${esc(studio)} · sample page, finished and unclaimed</p><a href="#offer">See the offer</a></div></div>\n` : ''}${header}
<main id="main"${shop ? '' : ' class="wrap"'}>
${body}
</main>
<footer>
  <div class="wrap">
  ${footer}
  <p style="margin-top:1.5rem;font-size:0.75rem;color:#78716c;">Engineered by Neal Frazier Tech (@1nc0gn30) • NullAI Platform</p>
  </div>
</footer>
</body>
</html>
`;
}

function sendNote(service, city) {
  const place = `${city.name}, ${city.state}`;
  return [
    `${studio} — finished page`,
    `${service.name} in ${place}`,
    `${money(service.price)}`,
    '',
    'The page is finished. Put the business name, phone, and email on the contact lines and publish it.',
    `${studio} is one studio. This is not a local office in ${city.name}.`,
    'No reviews were written for this page. There is no promise of a ranking.'
  ].join('\n');
}

function cta(text) {
  const stripeUrl = 'https://buy.stripe.com/7sI7sA8hM2X8eFG8ww';
  const depayUrl = 'https://depay.com/pay?integration=428790dd-7ad1-407c-8ecf-c048c77a4cb8&receiver=GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK';
  if (replyTo) {
    const subject = text.split('\n')[0];
    const mail = `mailto:${encodeURIComponent(replyTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return {
      action: `<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
  <a class="btn" href="${esc(mail)}">Send this page</a>
  <a class="btn" style="background:#635bff;color:#ffffff;" href="${stripeUrl}" target="_blank" rel="noopener">Claim via Stripe</a>
  <a class="btn" style="background:#9945ff;color:#ffffff;" href="${depayUrl}" target="_blank" rel="noopener">Pay Solana</a>
</div>`,
      rest: ''
    };
  }
  return {
    action: '<button type="button" id="copyOffer">Copy send note</button>',
    rest: `<pre class="copy" id="offerText">${esc(text)}</pre>
<script>
document.getElementById('copyOffer').addEventListener('click', function () {
  var btn = this;
  var value = document.getElementById('offerText').textContent;
  function done(label) { btn.textContent = label; }
  function legacy() {
    var area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.left = '0';
    area.style.width = '1px';
    area.style.height = '1px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    area.remove();
    done(ok ? 'Copied' : 'Select the note below');
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(function () { done('Copied'); }, legacy);
  } else {
    legacy();
  }
});
</script>`
  };
}

function pairs(list, city) {
  return list.map(([title, body]) => [fill(title, city), fill(body, city)]);
}

function tradeBody({ service, city, headline, lede, work, steps, points, faqs, slots, ask, other }) {
  const price = money(service.price);
  const place = `${city.name}, ${city.state}`;
  const homeLines = points.filter((item) => !/first screen/i.test(item));
  return `
<section class="trade" id="top">
  <div class="trade-copy">
    <p class="trade-kicker">${esc(service.name)} · ${esc(place)}</p>
    <h1>${emphCity(headline, city.name)}</h1>
    <p class="trade-lede">${esc(lede)}</p>
    <div class="trade-actions">
      <a class="t-btn" href="#contact">Ask the owner</a>
      <a class="t-line" href="#work">See the work</a>
    </div>
  </div>
  <dl class="trade-facts">
${steps.map(([title], i) => `    <div><dt>${String(i + 1).padStart(2, '0')}</dt><dd>${esc(title)}</dd></div>`).join('\n')}
  </dl>
</section>
<section class="trade-sect" id="work">
  <h2>The work</h2>
  <div class="trade-grid">
${work.map(([title, bodyText]) => `    <article><h3>${esc(title)}</h3><p>${esc(bodyText)}</p></article>`).join('\n')}
  </div>
</section>
<section class="trade-sect" id="job">
  <h2>How a job goes</h2>
  <ol class="trade-steps">
${steps.map(([title, bodyText], i) => `    <li><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(title)}</strong><p>${esc(bodyText)}</p></li>`).join('\n')}
  </ol>
</section>
<section class="trade-sect trade-split" id="ask">
  <div>
    <h2>Before the visit</h2>
    <ul class="trade-list">
${homeLines.map((item) => `      <li>${esc(item)}</li>`).join('\n')}
    </ul>
  </div>
  <div>
    <h2>Questions</h2>
    <div class="trade-faqs">
${faqs.map(([q, a]) => `      <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
    </div>
  </div>
</section>
<section class="trade-contact" id="contact">
  <div>
    <h2>The owner answers here</h2>
    <p>Replace these lines with the real name, phone, and email.</p>
  </div>
  <div class="trade-lines">
${slots.map(([label, value]) => `    <p><span>${esc(label)}</span>${esc(value)}</p>`).join('\n')}
  </div>
</section>
<section class="trade-offer" id="offer" aria-label="Offer to the owner">
  <div class="trade-offer-inner">
    <div>
      <p class="trade-kicker trade-kicker-light">For the owner in ${esc(city.name)}</p>
      <h2>This page is finished. Put your name on it.</h2>
      <p>Add the business name, phone, and email to the contact lines and publish. Nothing else to write.</p>
    </div>
    <div class="trade-price">
      <strong>${esc(price)}</strong>
      <span>One finished page · ${esc(place)}</span>
      ${ask.action}
    </div>
  </div>
  ${ask.rest}
</section>
<section class="trade-sect trade-more">
  <h2>Other finished pages in ${esc(city.name)}</h2>
  <div class="trades">
${other.map((s) => `    <a href="${esc(href('cities/' + city.slug + '/' + s.slug + '/'))}">${esc(s.name)}</a>`).join('\n')}
  </div>
  <p class="note"><a href="${esc(href('cities/' + city.slug + '/'))}">All trades in ${esc(city.name)}</a> · <a href="${esc(href('services/' + service.slug + '/'))}">${esc(service.name)} in other cities</a></p>
</section>`;
}

function offerPage(service, city) {
  const place = `${city.name}, ${city.state}`;
  const from = `cities/${city.slug}/${service.slug}`;
  const seed = service.slug + ':' + city.slug;
  const headline = fill(pick(seed + ':h1', service.headlines), city);
  const lede = fill(pick(seed + ':lede', service.ledes), city);
  const work = rotate(pairs(service.work, city), seed + ':work');
  const steps = pairs(service.steps, city);
  const points = rotate(service.points.map((item) => fill(item, city)), seed + ':points');
  const faqs = rotate(pairs(service.faqs, city), seed + ':faq');
  const slots = [['Business', 'Your name'], ['Phone', 'Your phone'], ['Email', 'Your email']].concat(service.slots || []);
  const description = `${service.name} in ${place}. A finished page. The owner adds a name and a phone.`;
  const text = sendNote(service, city);
  const ask = cta(text);
  const other = SERVICES.filter((s) => s.slug !== service.slug);
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${place}`,
    serviceType: `Finished one-page site for ${service.buyer}`,
    description: service.line,
    areaServed: {
      '@type': 'City',
      name: city.name,
      address: { '@type': 'PostalAddress', addressRegion: city.state, addressCountry: 'US' }
    },
    provider: { '@type': 'Organization', name: studio },
    offers: { '@type': 'Offer', price: String(service.price), priceCurrency: 'USD' }
  };
  const pack = shotsFor(service);
  if (pack) {
    return page({
      from,
      title: `${service.name} in ${place} | ${studio}`,
      description,
      json,
      shop: { name: service.name, city: city.name },
      theme: '#efeae3',
      body: painterBody({ service, city, pack, headline, lede, work, steps, points, faqs, slots, ask, other }),
      foot: `<p>This is not a local office in ${esc(city.name)}. ${esc(studio)} finished the page. The owner who publishes it puts their own name, phone, and email on the contact lines. No reviews were written here.</p>`
    });
  }
  return page({
    from,
    title: `${service.name} in ${place} | ${studio}`,
    description,
    json,
    shop: { name: service.name, city: city.name },
    theme: '#f4f0ea',
    body: tradeBody({ service, city, headline, lede, work, steps, points, faqs, slots, ask, other }),
    foot: `<p>This is not a local office in ${esc(city.name)}. ${esc(studio)} finished the page. The owner who publishes it puts their own name, phone, and email on the contact lines. No reviews were written here.</p>`
  });
}

function cityPage(city) {
  const place = `${city.name}, ${city.state}`;
  const from = `cities/${city.slug}`;
  const body = `
<p class="eyebrow">${esc(studio)} · ${esc(place)}</p>
<h1>Finished pages for ${esc(city.name)}</h1>
<hr class="rule">
<p class="lede">Twenty finished pages for owners in ${esc(place)}. Open one. The owner adds their name, phone, and email. You send the page.</p>
<div class="grid">
${SERVICES.map((s) => `  <a class="card" href="${esc(href('cities/' + city.slug + '/' + s.slug + '/'))}"><h2>${esc(s.name)}</h2><p>${esc(money(s.price))} · ${esc(s.line)}</p></a>`).join('\n')}
</div>
<p class="note">This is not a local office in ${esc(city.name)}.</p>
`;
  return page({
    from,
    title: `Finished pages in ${place} | ${studio}`,
    description: `Twenty finished trade pages for owners in ${place}. One studio. A set price.`,
    json: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Finished pages in ${place}`,
      isPartOf: { '@type': 'WebSite', name: studio },
      about: { '@type': 'City', name: city.name }
    },
    body
  });
}

function servicePage(service) {
  const from = `services/${service.slug}`;
  const body = `
<p class="eyebrow">${esc(studio)} · ${esc(service.name)}</p>
<h1>${esc(service.name)}</h1>
<hr class="rule">
<p class="lede">${esc(service.line)} ${esc(money(service.price))} for the finished page. The city is on the first screen. Fifty cities. One studio.</p>
<div class="grid">
  <article class="card"><h2>Who publishes it</h2><p>${esc(service.buyer[0].toUpperCase() + service.buyer.slice(1))} who already does the work. They add their name, phone, and email.</p></article>
  <article class="card"><h2>What the customer reads</h2><p>${esc(service.line)}</p></article>
  <article class="card"><h2>Price</h2><p>${esc(money(service.price))} for the finished page. No ads. No rank promise. No reviews written by us.</p></article>
</div>
<h2>Cities</h2>
<div class="cities">
${CITIES.map((c) => `  <a href="${esc(href('cities/' + c.slug + '/' + service.slug + '/'))}">${esc(c.name)}, ${esc(c.state)}</a>`).join('\n')}
</div>
`;
  return page({
    from,
    title: `${service.name} | ${studio}`,
    description: `${service.line} ${money(service.price)} for the finished page.`,
    json: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      serviceType: `Finished one-page site for ${service.buyer}`,
      description: service.line,
      provider: { '@type': 'Organization', name: studio },
      offers: { '@type': 'Offer', price: String(service.price), priceCurrency: 'USD' }
    },
    body
  });
}

function homePage() {
  const low = Math.min(...SERVICES.map((s) => s.price));
  const high = Math.max(...SERVICES.map((s) => s.price));
  const body = `
<p class="eyebrow">One studio · ${SERVICES.length} trades · ${CITIES.length} cities</p>
<h1>Finished pages for one trade in one city</h1>
<hr class="rule">
<p class="lede">${esc(studio)} writes the page complete. You send that page. The owner adds their name, phone, and email and can publish it. The first month is a few cities you can finish.</p>
<div class="price">
  <div>
    <strong>${esc(money(low))}–${esc(money(high))}</strong>
    <p>A finished page. No ads. No rank promise. No reviews written by us.</p>
  </div>
</div>
<h2>Trades</h2>
<div class="grid">
${SERVICES.map((s) => `  <a class="card" href="${esc(href('services/' + s.slug + '/'))}"><h2>${esc(s.name)}</h2><p>${esc(money(s.price))} · ${esc(s.line)}</p></a>`).join('\n')}
</div>
<h2>Cities</h2>
<p class="note">Fifty mid-size cities. This is not a survey of who else is selling there. A page does not become a local company because the city is in the headline.</p>
<div class="cities">
${CITIES.map((c) => `  <a href="${esc(href('cities/' + c.slug + '/'))}">${esc(c.name)}, ${esc(c.state)}</a>`).join('\n')}
</div>
`;
  return page({
    from: '',
    title: `${studio} — finished pages for one trade in one city`,
    description: 'One studio finishes one page for one trade in one city. Twenty trades, fifty mid-size cities, a set price.',
    json: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: studio,
      description: 'A finished page for one trade in one city, from one studio.'
    },
    body
  });
}

function servicesIndex() {
  const from = 'services';
  const body = `
<p class="eyebrow">${esc(studio)}</p>
<h1>Trades</h1>
<hr class="rule">
<p class="lede">Twenty finished pages a solo studio can send. Each one is the site for an owner who already does the work.</p>
<div class="grid">
${SERVICES.map((s) => `  <a class="card" href="${esc(href('services/' + s.slug + '/'))}"><h2>${esc(s.name)}</h2><p>${esc(money(s.price))} · ${esc(s.buyer)}</p></a>`).join('\n')}
</div>
`;
  return page({
    from,
    title: `Trades | ${studio}`,
    description: 'Twenty finished trade pages. One studio. A set price.',
    json: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Trades', isPartOf: { '@type': 'WebSite', name: studio } },
    body
  });
}

function write(rel, contents) {
  const file = path.join(SITE, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function build() {
  if (fs.existsSync(SITE)) fs.rmSync(SITE, { recursive: true, force: true });
  fs.mkdirSync(SITE, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'style.css'), path.join(SITE, 'style.css'));
  copyTree(path.join(ROOT, 'media'), path.join(SITE, 'media'));

  const slugs = new Set();
  for (const city of CITIES) {
    if (slugs.has(city.slug)) throw new Error('Duplicate city slug ' + city.slug);
    slugs.add(city.slug);
  }
  const serviceSlugs = new Set();
  for (const service of SERVICES) {
    if (serviceSlugs.has(service.slug)) throw new Error('Duplicate service slug ' + service.slug);
    serviceSlugs.add(service.slug);
    if (!service.headlines || service.headlines.length < 3) throw new Error('Need 3 headlines for ' + service.slug);
    if (!service.ledes || service.ledes.length < 3) throw new Error('Need 3 ledes for ' + service.slug);
    if (!service.work || service.work.length < 3) throw new Error('Need 3 work blocks for ' + service.slug);
    if (!service.line) throw new Error('Need a line for ' + service.slug);
  }
  if (SERVICES.length !== 20) throw new Error('Expected 20 services, got ' + SERVICES.length);
  if (CITIES.length !== 50) throw new Error('Expected 50 cities, got ' + CITIES.length);

  write('index.html', homePage());
  write('services/index.html', servicesIndex());
  write('404.html', page({
    from: '',
    title: `Not on this desk | ${studio}`,
    description: 'That page is not on this desk.',
    json: { '@context': 'https://schema.org', '@type': 'WebSite', name: studio },
    body: `<h1>That page is not on this desk.</h1><p><a href="/">Back to ${esc(studio)}</a></p>`
  }));

  const offers = [];
  for (const service of SERVICES) write(`services/${service.slug}/index.html`, servicePage(service));
  for (const city of CITIES) {
    write(`cities/${city.slug}/index.html`, cityPage(city));
    for (const service of SERVICES) {
      const rel = `cities/${city.slug}/${service.slug}/index.html`;
      write(rel, offerPage(service, city));
      offers.push({
        city: city.name,
        state: city.state,
        service: service.slug,
        price: service.price,
        path: `/cities/${city.slug}/${service.slug}/`
      });
    }
  }
  write('offers.json', JSON.stringify(offers, null, 2) + '\n');

  const paths = ['/', '/services/', ...SERVICES.map((s) => `/services/${s.slug}/`), ...CITIES.map((c) => `/cities/${c.slug}/`), ...offers.map((o) => o.path)];
  const base = (origin || '').replace(/\/$/, '');
  const locs = paths.map((p) => `  <url><loc>${esc(base + p)}</loc></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs}\n</urlset>\n`);
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: Googlebot',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Applebot',
    'Allow: /',
    '',
    base ? `Sitemap: ${base}/sitemap.xml` : 'Sitemap: https://city-desk.netlify.app/sitemap.xml'
  ];
  write('robots.txt', robots.join('\n') + '\n');
  write('_headers', [
    '/*',
    '  X-Frame-Options: DENY',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    ''
  ].join('\n'));

  check(offers);
  console.log(`Built ${offers.length} finished pages in ${SITE}`);
  if (!base) console.log('origin is blank. Sitemap locations are root-relative until config.origin is set.');
  if (!replyTo) console.log('replyTo is blank. The send note copies to the clipboard.');
}

const BANNED = [
  /only 2/i,
  /only two/i,
  /lorem ipsum/i,
  /#1/,
  /page one of google/i,
  /will rank/i,
  /guaranteed/i,
  /unsaturated/i,
  /limited time/i,
  /act now/i,
  /five stars/i,
  /our crew in/i,
  /we are based in/i,
  /draft outline/i,
  /specimen only/i,
  /handoff sheet/i
];

function check(offers) {
  if (offers.length !== 1000) throw new Error('Expected 1000 offers, got ' + offers.length);
  const titles = new Set();
  const painterBodies = new Set();
  for (const offer of offers) {
    const rel = offer.path.slice(1) + 'index.html';
    const html = fs.readFileSync(path.join(SITE, rel), 'utf8');
    if (!html.includes(offer.city)) throw new Error('Missing city in ' + rel);
    if (!html.includes(offer.state)) throw new Error('Missing state in ' + rel);
    if (!html.includes('<h1')) throw new Error('Missing h1 in ' + rel);
    if (!html.includes('id="work"')) throw new Error('Missing work in ' + rel);
    if (!html.includes('id="contact"')) throw new Error('Missing contact in ' + rel);
    if (!html.includes('Your phone')) throw new Error('Missing phone line in ' + rel);
    if (!html.includes('application/ld+json')) throw new Error('Missing json-ld in ' + rel);
    if (!html.includes('not a local office')) throw new Error('Missing office line in ' + rel);
    if (!html.includes('$' + offer.price.toLocaleString('en-US'))) throw new Error('Missing price in ' + rel);
    if (!html.includes('style.css')) throw new Error('Missing css in ' + rel);
    if (html.includes('aggregateRating')) throw new Error('Unexpected rating in ' + rel);
    for (const rule of BANNED) {
      if (rule.test(html)) throw new Error('Banned ' + rule + ' in ' + rel);
    }
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    if (titles.has(title)) throw new Error('Duplicate title ' + title);
    titles.add(title);
    if (offer.service === 'painters') {
      const stripped = html.replaceAll(offer.city, '').replaceAll(offer.state, '');
      painterBodies.add(stripped);
    }
  }
  if (painterBodies.size < 3) throw new Error('Painter pages are the same text with the city swapped');
  const home = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
  if (!home.includes('not a survey')) throw new Error('Home page is missing the city-list limit');
  if (!home.includes('Finished pages')) throw new Error('Home page is still a pitch');
  if (!fs.existsSync(path.join(SITE, 'robots.txt'))) throw new Error('Missing robots.txt');
  if (!fs.existsSync(path.join(SITE, 'sitemap.xml'))) throw new Error('Missing sitemap.xml');
  if (!fs.existsSync(path.join(SITE, 'style.css'))) throw new Error('Missing style.css');
  const med = fs.readFileSync(path.join(SITE, 'cities/corpus-christi-tx/med-spas/index.html'), 'utf8');
  if (!med.includes('clinician decides')) throw new Error('Med spa page lost the clinician line');
  const painted = fs.readFileSync(path.join(SITE, 'cities/boise-id/painters/index.html'), 'utf8');
  if (!painted.includes('/media/painters/hero.jpg')) throw new Error('Painter hero image missing');
  if (!painted.includes('alt="')) throw new Error('Painter page is missing alt text');
  if (!painted.includes('class="front"')) throw new Error('Painter page lost the front');
  if (painted.includes('class="trade"')) throw new Error('Painter page picked up the trade layout');
  const plumber = fs.readFileSync(path.join(SITE, 'cities/boise-id/plumbers/index.html'), 'utf8');
  if (!plumber.includes('class="trade"')) throw new Error('Plumber page lost the trade layout');
  if (!plumber.includes('id="offer"')) throw new Error('Plumber page lost the offer block');
  if (plumber.includes('class="front"')) throw new Error('Plumber page picked up the painter layout');
  if (plumber.includes('The city is on the first screen')) throw new Error('Owner pitch is still on the plumber page');
  if (!painted.includes('/media/painters/exterior.jpg')) throw new Error('Painter exterior still missing');
  if (!fs.existsSync(path.join(SITE, 'media/painters/hero.jpg'))) throw new Error('Hero file was not copied');
}

build();
