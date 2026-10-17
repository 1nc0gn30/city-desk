# City Desk

> ⚡ **Live Production Storefront**: [https://city-desk.netlify.app](https://city-desk.netlify.app)  
> 💳 **Done-For-You Custom Launch + Domain Setup ($149 One-Time, $0/mo)**: **[Order Done-For-You Launch via Stripe](https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O)**  
> 📦 **Self-Serve Standalone HTML + Schema.org Bundle ($19 One-Time)**: **[Instant Download via Stripe](https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N)** *(Use promo code `FOUNDER25` for 25% off)*

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
