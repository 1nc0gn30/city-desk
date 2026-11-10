<div align="center">
  <img src="assets/hero-banner.svg" alt="City Desk — Sovereign Architecture Banner" width="100%" />
</div>

<br />

<div align="center">
  <a href="https://zoth.nullai.tech/tools/city-desk"><img src="https://img.shields.io/badge/Zoth_Studio_v2-Workspace-D4AF37?style=for-the-badge&logo=sparkles&logoColor=black" alt="Zoth Studio Workspace" /></a>
  <a href="http://127.0.0.1:8087"><img src="https://img.shields.io/badge/Daemon-Port_:8087-38BDF8?style=for-the-badge&logo=fastapi&logoColor=black" alt="Port :8087" /></a>
  <a href="https://nullai.tech"><img src="https://img.shields.io/badge/Security-100%25_Zero--Egress-10B981?style=for-the-badge&logo=shield&logoColor=black" alt="Zero Egress" /></a>
  <a href="https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X"><img src="https://img.shields.io/badge/☕_Buy_Us_a_Coffee-Stripe-D4AF37?style=for-the-badge" alt="Buy Us a Coffee" /></a>
</div>

# ⚡ City Desk

> **City Desk — 1,000 localized service landing pages across 20 trades and 50 mid-size cities with live customizer and standalone HTML export.**

---

## 🏛️ Architectural Overview

**City Desk** is an official sovereign tool in the **[Zoth Studio v2](https://zoth.nullai.tech)** (77-Tool Matrix) and **[ZothOS Linux 3.3](https://zothos.nullai.tech)** ecosystem, engineered by **1nc0gn30 • NullAI ([@1nc0gn30](https://github.com/1nc0gn30))**.

| Property | Specification |
| :--- | :--- |
| **Tool ID** | `city-desk` |
| **Category** | `Growth & SEO` |
| **Loopback Daemon Port** | `http://127.0.0.1:8087` |
| **Execution Mode** | `browser` + Python Server Daemon |
| **Zoth Studio Route** | [`http://127.0.0.1:3000/tools/city-desk`](http://127.0.0.1:3000/tools/city-desk) |
| **License** | **100% Free & Open Access (Zero Paywalls)** |

---

## 💎 What It Does & How It Works

- **1,000 Localized Landing Pages**: Pre-synthesized matrix across 20 high-demand home service trades and 50 mid-size American cities.
- **Client-Side Live Synthesizer**: Dynamically configures trade copy, local city context, contractor telephone, and business name in real-time.
- **Standalone HTML Exporter**: Generates a self-contained, 20kb production-ready HTML file with zero external CSS or JS framework dependencies.
- **Semantic Schema.org LocalBusiness Graphs**: Embedded JSON-LD structured data for instant Google Local & AI Answer Engine (AEO) ranking.
- **100% Zero-Egress Local Enclave Execution**: Runs completely on `127.0.0.1:8087` with zero third-party telemetry.

---

## 🛠️ ZothOS CLI & Daemon Commands

The CLI is pre-installed in `/usr/local/bin/city-desk`:

```bash
# Check daemon health & ZothOS integration status
city-desk --status

# List all 20 supported trade services and baseline scopes
city-desk --trades

# List all 50 target municipal cities
city-desk --cities

# Rebuild all 1,000 localized landing pages
city-desk --build

# Deterministic JSON telemetry output
city-desk --json

# Start the standalone server daemon on port 8087
city-desk --serve
# Or directly via Python:
python3 ~/NullAITech/city-desk/server.py --port 8087
```

---

## ☕ Support 1nc0gn30 • NullAI (Zero Paywalls)

All tools across the Zoth Studio ecosystem are 100% free, unlocked, and open-source by default. If this utility provides value to your workflow, support development via:

- **Stripe "Buy Us a Coffee"**: [https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X](https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X)
- **Solana Tip Address**: `GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK`

---

<div align="center">
  <sub>Engineered by <b>1nc0gn30 • NullAI</b> (<a href="https://github.com/1nc0gn30">@1nc0gn30</a>) &bull; <a href="https://nullai.tech">NullAI Platform</a> &bull; <a href="https://zoth.nullai.tech">Zoth Studio v2</a></sub>
</div>

---

## 🏛️ ZothOS v3.4, Zoth Studio v2 & Obsidian Second Brain Ecosystem

```mermaid
flowchart LR
    subgraph ZothOS["🐧 ZothOS v3.4 CLI & Braille TUI"]
        CLI["city-desk --help / --json"]
        TUI["city-desk-tui<br/>Unicode U+2800 2x4 Braille"]
    end

    subgraph Workstation["⚡ Sovereign Workstation"]
        WEB["http://127.0.0.1:8087<br/>REST API & /health"]
    end

    subgraph Studio["🌌 Zoth Studio v2 & ZothOS-Lite"]
        GODMODE["http://127.0.0.1:3000/tools/city-desk<br/>God-Mode Workstation"]
        LITE["http://127.0.0.1:8145<br/>ZothOS-Lite Web Desktop"]
    end

    subgraph SecondBrain["💎 Obsidian Second Brain & STDP"]
        TRACKER["http://127.0.0.1:8151<br/>Zoth Obsidian Tracker"]
        NEURO["http://127.0.0.1:8094<br/>Neuro-Memory STDP Cortex"]
        NOTE["Studio/Tools/Studio city-desk.md"]
    end

    CLI --> WEB
    TUI --> WEB
    WEB <--> GODMODE
    WEB <--> LITE
    WEB --> TRACKER
    TRACKER <--> NOTE
    NOTE <--> NEURO
```

### Cross-Surface Integration Matrix

| Surface | Endpoint / Binary | Capabilities |
| :--- | :--- | :--- |
| **Standalone Workstation** | `http://127.0.0.1:8087` | 100% Free & Open-Access Web Deck, live `/health` & REST telemetry |
| **Zoth Studio v2 Route** | `http://127.0.0.1:3000/tools/city-desk` | Interactive God-Mode component inside Zoth Studio (`https://zoth.nullai.tech`) |
| **ZothOS v3.4 CLI & TUI** | `city-desk` / `city-desk-tui` | Global binary in `/usr/local/bin/` with Unicode `U+2800` Braille TUI & `--json` output |
| **ZothOS-Lite Web Desktop** | `http://127.0.0.1:8145` | Browser-native KDE-style window manager & terminal launcher |
| **Zoth Obsidian Tracker** | `http://127.0.0.1:8151` | Interactive Obsidian Second Brain vault explorer (`~/Documents/Obsidian Vault/Studio/Tools/Studio city-desk.md`) |
| **Neuro-Memory STDP Cortex** | `http://127.0.0.1:8094` | 3-Factor STDP synaptic memory daemon & 21-tool MCP server |

```bash
# Inspect CLI & Unicode U+2800 Braille TUI on ZothOS v3.4
city-desk --help
city-desk-tui --status
city-desk-tui --json

# Verify Second Brain Vault & 12-Step Verification Gallery on :8151
zoth-obsidian-tracker --verify
```

