# City Desk

Static site generator for City Desk: 20 trades x 50 cities = 1,000 finished
landing pages, plus city and trade indexes, a sitemap and a 404 page.

## Build

```bash
node build.js        # writes everything into site/
```

The build is deterministic (seeded hashing), so rebuilding with unchanged
`data.js` produces no git diff.

## Configure

`config.js` holds `replyTo` (contact address shown on pages), `origin` (public
URL used for canonicals and the sitemap) and `studio` (brand name).
`data.js` holds `SERVICES` and `CITIES`.

## Test

```bash
node --test
```

Zero dependencies. Checks the page count, that every internal link and
sitemap entry resolves, that titles/descriptions/canonicals exist and titles are
unique, that no template placeholders leak, and that Netlify serves real 404s.

## Deploy

Netlify runs `node build.js` and publishes `site/` (see `netlify.toml`).
