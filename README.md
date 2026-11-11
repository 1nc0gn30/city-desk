<p align="center">
  <img src="assets/hero-banner.svg" alt="City Desk" width="100%">
</p>

# City Desk

Deterministic static site compiler and local service landing page publisher generating 1,000 finished HTML pages across 20 residential/commercial trades and 50 mid-size US cities, served locally by a zero-dependency Python 3 HTTP daemon.

- **Version**: `2.5.0`
- **Local Workstation Port**: `127.0.0.1:8087`
- **Zoth Studio Dossier**: [https://zoth.nullai.tech/tools/city-desk](https://zoth.nullai.tech/tools/city-desk)
- **Author**: [1nc0gn30](https://1nc0gn30.si) (`@1nc0gn30`) · [NullAI](https://nullai.tech)

## Overview

`city-desk` compiles 20 service trade blueprints (`painters`, `roofers`, `plumbers`, `electricians`, `hvac`, `landscapers`, `carpenters`, `cleaners`, `concrete`, `drywall`, `fencing`, `flooring`, `gutters`, `handyman`, `insulation`, `locksmith`, `masonry`, `pest-control`, `siding`, `tree-service`) across 50 US cities into standalone, zero-framework HTML documents (`site/`).

Each compiled page includes:
- Unique deterministic copy rotation (FNV-1a hash seeded per city and trade) verified at build time against duplicate titles, broken internal links, and banned hype phrases.
- Interactive 60-second ballpark written price estimator and URL query prospect personalization (`?biz=...&phone=...&email=...&city=...`).
- Embedded `Schema.org` `@graph` (`LocalBusiness` / `Service`, `WebApplication`, and `FAQPage` JSON-LD), canonical tags, `sitemap.xml`, `robots.txt`, `llms.txt`, and `.well-known/mcp.json`.
- Client-side single-file HTML bundle exporter (`city_engine.js`) so contractors can download a self-contained `.html` file ready for static hosting.

## Architecture

```text
city-desk/
├── build.js                 # Zero-dependency Node.js static compiler + build invariant checker
├── data.js                  # 20 trade blueprints & 50 mid-size US city definitions
├── config.js                # Canonical origin, studio label, and reply-to settings
├── city_engine.js           # Client-side URL personalization, price estimator & HTML bundle exporter
├── style.css                # Editorial typography & responsive layout stylesheet
├── server.py                # Python 3 ThreadingHTTPServer & REST API (:8087)
├── bin/city-desk-tui        # Terminal Braille telemetry & benchmark utility
├── site/                    # Compiled static output (1,000 trade×city pages + indexes + JSON APIs)
└── test/build.test.js       # Node.js built-in test runner suite (links, titles, sitemap, 404s)
```

## Quickstart

Clone the repository, compile all 1,000 pages into `site/`, and launch the local server on `127.0.0.1:8087`:

```bash
git clone https://github.com/1nc0gn30/city-desk.git
cd city-desk

# Compile all 1,000 localized trade pages, sitemaps, and JSON indexes
node build.js

# Start the local HTTP & REST server on 127.0.0.1:8087
python3 server.py --host 127.0.0.1 --port 8087
```

Open `http://127.0.0.1:8087` in a browser or query the health endpoint:

```bash
curl -s http://127.0.0.1:8087/health
```

## CLI & MCP Usage

### CLI Commands

`server.py`, `build.js`, `bin/city-desk-tui`, and ZothOS v3.4.0 `/usr/local/bin/city-desk` provide:

```bash
# Server CLI flags
python3 server.py --help
python3 server.py --version
python3 server.py --status --json
python3 server.py --host 127.0.0.1 --port 8087

# Rebuild static site and run built-in invariant checks
npm run build

# Terminal benchmark & JSON telemetry
python3 bin/city-desk-tui --json
```

### REST API & Static Discovery Endpoints (`127.0.0.1:8087`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Daemon health, uptime, port (`8087`), trade/city/page counts |
| `GET` | `/api/status`, `/api/info` | Service metadata, `site/` directory path, and workbench links |
| `GET` | `/api/trades`, `/api/services` | Catalog of 20 trade blueprints and baseline pricing |
| `GET` | `/api/cities` | Indexed US city slugs and state codes |
| `POST` | `/api/synth`, `/api/generate` | Assemble a personalized preview URL for `{trade, city, biz, phone}` |
| `GET` | `/offers.json` | Full manifest of 1,000 compiled `{city, state, service, price, path}` routes |
| `GET` | `/.well-known/mcp.json` | Static MCP resource descriptor for `api/services.json` and `offers.json` |

## Testing & Verification

Run the zero-dependency Node.js test suite (compiles all 1,000 pages and validates internal links, unique `<title>` tags, `sitemap.xml` parity, template placeholder hygiene, and 404 routing):

```bash
npm test
python3 server.py --status --json
```

## Support

City Desk is 100% free and open-source with zero paywalls. Optional support:
- [Buy Us a Coffee (Stripe)](https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X)

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 1nc0gn30 · NullAI ([https://nullai.tech](https://nullai.tech)).
