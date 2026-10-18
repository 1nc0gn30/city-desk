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
<section class="sect" id="estimator" aria-label="Interactive Written Price Estimator">
  <header class="sect-head">
    <p class="kicker"><span class="tape" aria-hidden="true"></span>Interactive 60-Second Estimator</p>
    <h2>Preview a ballpark written estimate before calling</h2>
  </header>
  <div style="background:#ffffff;border:1px solid #ddd4c7;border-radius:16px;padding:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;align-items:center;">
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5a5248;margin-bottom:6px;">1. Select Service Scope</label>
        <select id="estScopeSelect" onchange="window.updateTradeEstimate && window.updateTradeEstimate()" style="width:100%;padding:12px;border:1px solid #d6d3d1;border-radius:8px;font-size:15px;background:#fafaf9;color:#1c1917;">
          ${work.map(([title], idx) => `<option value="${idx}">${esc(title)} (${esc(city.name)})</option>`).join('\n          ')}
        </select>
      </div>
      <div>
        <label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5a5248;margin-bottom:6px;">2. Project Size &amp; Timing</label>
        <select id="estUrgencySelect" onchange="window.updateTradeEstimate && window.updateTradeEstimate()" style="width:100%;padding:12px;border:1px solid #d6d3d1;border-radius:8px;font-size:15px;background:#fafaf9;color:#1c1917;">
          <option value="1">Standard Single Job / Scheduled Visit</option>
          <option value="1.8">Multi-Room / Full System Scope</option>
          <option value="1.35">Priority Same-Week Dispatch</option>
        </select>
      </div>
    </div>
    <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;padding:20px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9a3412;">ESTIMATED WRITTEN RANGE (${esc(place)})</div>
      <div id="estRangeOutput" style="font-size:32px;font-weight:800;color:#1c1917;margin:6px 0;">$185 – $420</div>
      <p style="font-size:13px;color:#57534e;margin:0 0 14px 0;">Final written price is confirmed before any work begins. Request a callback below:</p>
      <form name="trade-lead-capture" method="POST" data-netlify="true" onsubmit="return window.submitNetlifyForm ? window.submitNetlifyForm(event, 'tradeEstStatus') : true" style="display:flex;gap:8px;flex-wrap:wrap;">
        <input type="hidden" name="form-name" value="trade-lead-capture">
        <input type="hidden" name="city" value="${esc(place)}">
        <input type="hidden" name="trade" value="${esc(service.name)}">
        <input type="text" name="customer_name" placeholder="Your Name" required style="flex:1 1 120px;padding:10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;">
        <input type="tel" name="customer_phone" placeholder="Your Phone #" required style="flex:1 1 130px;padding:10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;">
        <button type="submit" class="btn-gold" style="padding:10px 16px;font-size:13px;border-radius:6px;">Request Written Price</button>
      </form>
      <div id="tradeEstStatus" style="font-size:12px;color:#15803d;font-weight:700;margin-top:8px;display:none;">✓ Request logged! The owner will text/call you with a written window.</div>
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
      <p>Add the business name, phone, and email to the contact lines and publish. Choose Self-Serve HTML ($19), Done-For-You 48-Hour Domain Launch ($149), or add a 24/7 AI Receptionist ($299).</p>
    </div>
    <div class="offer-price">
      <strong><s style="opacity:0.45;font-size:0.45em;margin-right:8px;">${esc(price)}</s>$149</strong>
      <span>Done-For-You 48h Launch · ${esc(place)} (or $19 Self-Serve HTML)</span>
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
  <a class="mark" href="#top"><img src="/media/icon.png" alt="City Desk Icon" class="logo-img" style="width:24px;height:24px;border-radius:4px;vertical-align:middle;margin-right:6px;">${esc(shop.name)} <span>${esc(shop.city)}</span></a>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
    <span id="licenseBadge" class="license-badge" onclick="window.openProModal()" style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:9999px;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.12);color:#9A3412;cursor:pointer;">⚡ FREE TIER</span>
    <button type="button" onclick="window.openVipModal()" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:9999px;background:#1c1917;color:#ffffff;border:none;cursor:pointer;min-height:28px;">🎁 Paid / Onboarding</button>
    <nav>
      <a href="#work">Work</a>
      <a href="#estimator">Estimator</a>
      <a href="#ask">Questions</a>
      <a class="nav-cta" href="#offer">Claim This Site</a>
    </nav>
  </div>
  </div>
</header>`
    : `<header class="bar">
  <div class="wrap bar-row">
  <a class="mark" href="/"><img src="/media/icon.png" alt="City Desk Icon" class="logo-img" style="width:24px;height:24px;border-radius:4px;vertical-align:middle;margin-right:6px;">${esc(studio.split(' ')[0])} <span>${esc(studio.split(' ').slice(1).join(' ') || 'Desk')}</span><span class="tag-badge" style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:9999px;background:rgba(234,88,12,0.15);color:#ea580c;border:1px solid rgba(234,88,12,0.3);margin-left:6px;">v2.6 SOVEREIGN</span></a>
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
    <span id="licenseBadge" class="license-badge" onclick="window.openProModal()" style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:9999px;background:rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.12);color:#9A3412;cursor:pointer;">⚡ FREE TIER</span>
    <button type="button" onclick="window.openVipModal()" style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:9999px;background:#1c1917;color:#ffffff;border:none;cursor:pointer;min-height:28px;">🎁 VIP Onboarding / Download</button>
    <nav>
      <a href="/">Cities</a>
      <a href="/services/">Trades</a>
    </nav>
  </div>
  </div>
</header>`;
  const footer = foot || `<p>${esc(studio)} is one studio. These pages are finished sites for owners. They are not local offices, and they are not a count of who else is selling in town.</p>`;
  const primaryNode = Object.assign({}, json);
  delete primaryNode['@context'];
  const fullGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      primaryNode,
      {
        '@type': 'WebApplication',
        name: title,
        url: ogUrl,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        description,
        creator: {
          '@type': 'Person',
          name: 'Neal Frazier',
          jobTitle: 'Principal AI Systems Architect',
          url: 'https://www.nealfrazier.tech',
          worksFor: { '@type': 'Organization', name: 'Neal Frazier Tech' }
        },
        offers: [
          { '@type': 'Offer', name: 'Instant AI Search & Lead Booster Pack ($7 Flash Starter)', price: '7.00', priceCurrency: 'USD', url: 'https://buy.stripe.com/fZu00i7s9gWA3Ha4Ocfw40W' },
          { '@type': 'Offer', name: 'Self-Serve Standalone HTML Bundle', price: '19.00', priceCurrency: 'USD', url: 'https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N' },
          { '@type': 'Offer', name: 'Done-For-You 1-Page Custom Launch (48h Delivery)', price: '149.00', priceCurrency: 'USD', url: 'https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O' },
          { '@type': 'Offer', name: '24/7 AI Receptionist & Missed-Call Text-Back', price: '299.00', priceCurrency: 'USD', url: 'https://buy.stripe.com/00w8wO6o50XC2D60xWfw40S' },
          { '@type': 'Offer', name: 'Turnkey 5-Page Custom Website & Local AEO', price: '499.00', priceCurrency: 'USD', url: 'https://buy.stripe.com/3cIcN48wdbCgelOeoMfw40T' }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does the Done-For-You $149 Launch vs $19 Self-Serve HTML work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'For $19 one-time, you can immediately download the standalone HTML + Schema.org bundle in your browser. For $149 one-time, Neal Frazier Tech customizes your business name, phone number, email, 60-second price estimator, and connects your domain within 48 hours with zero monthly retainer.'
            }
          },
          {
            '@type': 'Question',
            name: 'What happens immediately after I complete Stripe or Solana checkout?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You are redirected back with Pro Access active, unlocking instant 1-click standalone HTML bundle downloads and launching the VIP 48-Hour Concierge Onboarding form so you can submit your domain, phone number, and custom build specifications immediately.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does the interactive 60-second price estimator capture customer leads?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Homeowners can select their service scope and urgency to view an instant ballpark range and submit their name and phone number via Netlify Forms for a written estimate.'
            }
          }
        ]
      }
    ]
  };
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
<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs Index">
<link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs Full Corpus">
<link rel="alternate" type="application/json" href="/api/index.json" title="AI Agent Discovery API">
<link rel="alternate" type="application/json" href="/api/services.json" title="Services &amp; Checkout API">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/media/icon.png">
<link rel="apple-touch-icon" href="/media/icon.png">
<script src="https://integrate.depay.com/widgets/v13.js" defer></script>
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">${jsonLd(fullGraph)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${shop ? `<div class="strip"><div class="strip-row"><p>${esc(studio)} · Live sample page ready for your domain</p><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;"><a href="https://buy.stripe.com/fZu00i7s9gWA3Ha4Ocfw40W" style="color:#86efac;font-weight:800;">★ $7 Instant AI + HTML Pack</a><a href="#offer">Claim ($149 DFY / $19 HTML)</a><a href="javascript:void(0)" onclick="window.openVipModal()">Already Paid? Onboarding</a></div></div></div>\n` : ''}${header}
<main id="main"${shop ? '' : ' class="wrap"'}>
${body}
</main>
<footer>
  <div class="wrap">
  ${footer}
  <p style="margin-top:1.5rem;font-size:0.75rem;color:#78716c;">Engineered by Neal Frazier Tech (@1nc0gn30) • NullAI Platform • Direct Support: <a href="mailto:neal@nealfrazier.tech">neal@nealfrazier.tech</a> · <a href="tel:7575760980">(757) 576-0980</a></p>
  </div>
</footer>

<!-- Hidden Netlify Form Detection Shells -->
<form name="vip-onboarding" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="hidden" name="form-name" value="vip-onboarding">
  <input type="text" name="business_name">
  <input type="email" name="owner_email">
  <input type="tel" name="owner_phone">
  <input type="text" name="target_domain">
  <input type="text" name="package_purchased">
  <input type="text" name="stripe_session_id">
  <textarea name="custom_notes"></textarea>
  <input type="text" name="bot-field">
</form>
<form name="owner-question" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="hidden" name="form-name" value="owner-question">
  <input type="text" name="business_name">
  <input type="email" name="owner_email">
  <input type="tel" name="owner_phone">
  <input type="text" name="page_url">
  <textarea name="question"></textarea>
  <input type="text" name="bot-field">
</form>
<form name="trade-lead-capture" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="hidden" name="form-name" value="trade-lead-capture">
  <input type="text" name="city">
  <input type="text" name="trade">
  <input type="text" name="customer_name">
  <input type="tel" name="customer_phone">
  <input type="text" name="bot-field">
</form>

<!-- Post-Payment VIP Fulfillment & Instant Delivery Concierge Modal -->
<div id="vipModal" class="modal-overlay hidden">
  <div class="modal-content" style="max-width:560px;max-height:92vh;overflow-y:auto;">
    <button onclick="window.closeVipModal()" class="modal-close" aria-label="Close VIP modal">✕</button>
    <div style="text-align:center;margin-bottom:14px;">
      <div style="display:inline-block;padding:4px 12px;border-radius:999px;background:#dcfce7;color:#15803d;font-size:11px;font-weight:800;margin-bottom:8px;">✓ INSTANT FULFILLMENT &amp; VIP ONBOARDING</div>
      <h3 style="font-size:1.25rem;font-weight:800;color:#1c1917;margin:0 0 4px 0;">Claim Your Site &amp; Submit Launch Specs</h3>
      <p style="font-size:0.82rem;color:#57534e;margin:0;">
        Download your personalized standalone HTML bundle right now, or submit your domain &amp; business details below so Neal Frazier deploys your site live within 48 hours.
      </p>
    </div>

    <!-- Step 1: Instant Browser Download -->
    <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:10px;padding:14px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:800;color:#9a3412;text-transform:uppercase;margin-bottom:6px;">STEP 1 · INSTANT SELF-CONTAINED FILE DOWNLOAD</div>
      <p style="font-size:12px;color:#57534e;margin:0 0 10px 0;">Generate and download the complete standalone HTML + Schema.org JSON-LD file for this page with your business name, phone, and email pre-wired:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <input type="text" id="vipQuickBiz" placeholder="Your Business Name" style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;">
        <input type="tel" id="vipQuickPhone" placeholder="Your Phone Number" style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;">
      </div>
      <button type="button" onclick="window.downloadCurrentPageBundle()" class="btn-gold" style="width:100%;justify-content:center;padding:10px;font-size:13px;">
        💾 Download Ready-to-Host Website HTML Bundle (.html)
      </button>
    </div>

    <!-- Step 2: Done-For-You / Custom Build Onboarding Form (Netlify Forms) -->
    <div style="background:#ffffff;border:1px solid #d6d3d1;border-radius:10px;padding:14px;">
      <div style="font-size:11px;font-weight:800;color:#1c1917;text-transform:uppercase;margin-bottom:6px;">STEP 2 · DONE-FOR-YOU 48-HOUR LAUNCH &amp; AI SETUP FORM</div>
      <p style="font-size:12px;color:#57534e;margin:0 0 10px 0;">Purchased the $7 Starter Pack, $149 Done-For-You Launch, $299 AI Receptionist, $499 5-Page Site, or $99 Kickoff Deposit? Submit your specs here for 48-hour deployment:</p>
      <form id="vipOnboardingForm" name="vip-onboarding" method="POST" data-netlify="true" onsubmit="return window.submitVipOnboarding(event)" style="display:flex;flex-direction:column;gap:8px;">
        <input type="hidden" name="form-name" value="vip-onboarding">
        <input type="hidden" id="vipSessionId" name="stripe_session_id" value="">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <input type="text" id="vipBizName" name="business_name" placeholder="Business Name *" required style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;">
          <input type="email" id="vipOwnerEmail" name="owner_email" placeholder="Your Best Email *" required style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <input type="tel" id="vipOwnerPhone" name="owner_phone" placeholder="Phone # for Calls/SMS *" required style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;">
          <input type="text" id="vipTargetDomain" name="target_domain" placeholder="Your Domain (e.g. myshop.com)" style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;">
        </div>
        <select id="vipPackageSelect" name="package_purchased" style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;background:#fafaf9;">
          <option value="$7 Flash Starter AI + HTML Pack ($7)">★ $7 Flash Starter AI + HTML Pack ($7)</option>
          <option value="Done-For-You 1-Page Launch ($149)">⚡ Done-For-You 1-Page Launch ($149)</option>
          <option value="24/7 AI Receptionist & Missed-Call Text-Back ($299)">🤖 24/7 AI Receptionist &amp; Missed-Call SMS ($299)</option>
          <option value="Turnkey 5-Page Custom Website ($499)">🚀 Turnkey 5-Page Custom Website ($499)</option>
          <option value="Custom Build Kickoff Deposit ($99)">🤝 Custom Build Kickoff Deposit ($99)</option>
          <option value="Custom AI Swarm / SaaS Sprint ($997)">🔥 Custom AI Swarm / SaaS Sprint ($997)</option>
          <option value="Self-Serve HTML Pro Pass ($19)">💳 Self-Serve HTML Pro Pass ($19)</option>
        </select>
        <textarea id="vipCustomNotes" name="custom_notes" rows="2" placeholder="Service areas, hours, logo link, or special requests..." style="padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:13px;"></textarea>
        <button type="submit" class="btn" style="background:#1c1917;color:#ffffff;justify-content:center;padding:10px;font-size:13px;border-radius:6px;font-weight:700;">
          🚀 Submit VIP Launch Specs (48-Hour SLA)
        </button>
      </form>
      <div id="vipOnboardingConfirm" style="display:none;margin-top:10px;padding:12px;background:#dcfce7;border:1px solid #86efac;border-radius:8px;color:#14532d;font-size:12px;">
        <strong>✓ VIP Onboarding Ticket Logged!</strong> Neal Frazier has received your specs and will email/text your live staging preview within 24–48 hours. Direct line: <a href="tel:7575760980" style="color:#14532d;font-weight:700;">(757) 576-0980</a> · <a href="mailto:neal@nealfrazier.tech" style="color:#14532d;font-weight:700;">neal@nealfrazier.tech</a>.
      </div>
    </div>
  </div>
</div>

<!-- Pro Paywall Modal -->
<div id="licenseModal" data-alias="proModal" class="modal-overlay hidden">
  <div class="modal-content">
    <button id="closeProModal" onclick="window.closeProModal()" class="modal-close" aria-label="Close modal">✕</button>

    <div style="text-align:center;margin-bottom:16px;">
      <img src="/media/icon.png" alt="City Desk Icon" style="width:36px;height:36px;border-radius:6px;margin:0 auto 8px auto;display:block;">
      <h3 style="font-size:1.15rem;font-weight:800;color:#292524;margin-bottom:4px;">CLAIM THIS SITE OR UNLOCK PRO</h3>
      <p style="font-size:0.8rem;color:#78716c;margin:0;">
        Choose $7 Flash Starter Pack, Done-For-You 48-Hour Launch ($149), or Full Custom Build packages.
      </p>
    </div>

    <div style="font-size:0.8rem;color:#44403c;display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
      <div><strong style="color:#9a3412;">✓</strong> <strong>1,000 Multi-City Pages:</strong> 20 trades across 50 mid-size cities</div>
      <div><strong style="color:#9a3412;">✓</strong> <strong>Standalone HTML Export:</strong> Deploy anywhere (Netlify, Vercel, S3)</div>
      <div><strong style="color:#9a3412;">✓</strong> <strong>Interactive 60s Quote Calculator:</strong> Pre-wired lead capture form</div>
      <div><strong style="color:#9a3412;">✓</strong> <strong>Schema.org LocalBusiness Graph:</strong> Automated Google &amp; Perplexity SEO</div>
      <div><strong style="color:#9a3412;">✓</strong> <strong>48-Hour Done-For-You Option:</strong> We wire your domain, logo &amp; phone</div>
      <div><strong style="color:#9a3412;">✓</strong> <strong>Lifetime Ownership:</strong> Zero monthly hosting or platform fees</div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;">
      <a href="https://buy.stripe.com/fZu00i7s9gWA3Ha4Ocfw40W" target="_blank" rel="noopener noreferrer" class="btn" style="justify-content:center;padding:10px;font-size:0.85rem;background:#16a34a;color:#ffffff;text-decoration:none;text-align:center;border-radius:6px;font-weight:800;">
        ★ $7 Flash Starter: Instant AI Search + HTML Pack ($7)
      </a>
      <a href="https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O" target="_blank" rel="noopener noreferrer" class="btn-gold" style="justify-content:center;padding:10px;font-size:0.85rem;">
        ⚡ Done-For-You 1-Page Launch + Domain ($149)
      </a>
      <a href="https://buy.stripe.com/00w8wO6o50XC2D60xWfw40S" target="_blank" rel="noopener noreferrer" class="btn" style="justify-content:center;padding:10px;font-size:0.82rem;background:#1c1917;color:#ffffff;text-decoration:none;text-align:center;border-radius:6px;font-weight:700;">
        🤖 24/7 AI Receptionist &amp; Missed-Call SMS ($299)
      </a>
      <a href="https://buy.stripe.com/3cIcN48wdbCgelOeoMfw40T" target="_blank" rel="noopener noreferrer" class="btn" style="justify-content:center;padding:10px;font-size:0.82rem;background:#292524;color:#ffffff;text-decoration:none;text-align:center;border-radius:6px;font-weight:700;">
        🚀 Turnkey 5-Page Custom Website ($499)
      </a>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <a href="https://buy.stripe.com/eVqbJ05k1gWA3HacgEfw40V" target="_blank" rel="noopener noreferrer" class="btn" style="justify-content:center;padding:8px;font-size:0.78rem;background:#44403c;color:#ffffff;text-decoration:none;text-align:center;border-radius:6px;font-weight:700;">
          🤝 $99 Kickoff Deposit
        </a>
        <a href="https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N" target="_blank" rel="noopener noreferrer" class="btn" style="justify-content:center;padding:8px;font-size:0.78rem;background:#9a3412;color:#ffffff;text-decoration:none;text-align:center;border-radius:6px;font-weight:700;">
          💳 $19 Self-Serve HTML
        </a>
      </div>
      <a href="https://depay.com/pay?integration=428790dd-7ad1-407c-8ecf-c048c77a4cb8&amp;receiver=GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK&amp;amount=19" target="_blank" rel="noopener noreferrer" class="btn-purple" style="padding:10px;text-decoration:none;text-align:center;display:block;font-size:0.85rem;" onclick="window.payWithSolana(event)">
        🟣 Pay with Solana (DePay Widget)
      </a>
    </div>

    <!-- Instant Key Activation -->
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid #e7e5e4;">
      <label for="license-input" style="display:block;font-size:0.75rem;color:#78716c;margin-bottom:4px;">Already purchased? Enter License Key or Receipt Email:</label>
      <div style="display:flex;gap:6px;">
        <input type="text" id="license-input" name="licenseKeyInput" placeholder="e.g. CITY-PRO-2026 or email" style="flex:1;padding:6px 10px;font-size:0.8rem;border:1px solid #d6d3d1;border-radius:6px;">
        <button id="btnActivateKey" data-alias="btnActivateKey" onclick="window.activateWithKey()" class="btn-gold" style="white-space:nowrap;padding:6px 12px;font-size:0.8rem;">
          Activate &amp; Download
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Toast Notification Container -->
<div id="toast" class="toast">
  <span id="toast-message"></span>
</div>

<script src="/city_engine.js"></script>
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
  const stripeImpulse7Url = 'https://buy.stripe.com/fZu00i7s9gWA3Ha4Ocfw40W';
  const stripeDfyUrl = 'https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O';
  const stripeAiUrl = 'https://buy.stripe.com/00w8wO6o50XC2D60xWfw40S';
  const stripe5PageUrl = 'https://buy.stripe.com/3cIcN48wdbCgelOeoMfw40T';
  const stripeDepositUrl = 'https://buy.stripe.com/eVqbJ05k1gWA3HacgEfw40V';
  const stripeProUrl = 'https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N';
  const depayUrl = 'https://depay.com/pay?integration=428790dd-7ad1-407c-8ecf-c048c77a4cb8&receiver=GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK';
  const inlineOwnerForm = `<div style="max-width:1440px;margin:0 auto;padding:12px clamp(16px,4vw,48px) 56px;">
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);border-radius:14px;padding:20px;">
    <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#f59e0b;margin-bottom:6px;">HAVE A QUESTION OR WANT US TO CUSTOMIZE THIS FIRST?</div>
    <p style="font-size:14px;color:#d6d3d1;margin:0 0 12px 0;">Send your business name, phone, and what you want changed — Neal Frazier will reply personally, or click <strong>Paid / Onboarding</strong> if you already checked out:</p>
    <form name="owner-question" method="POST" data-netlify="true" onsubmit="return window.submitNetlifyForm ? window.submitNetlifyForm(event, 'ownerQuestionStatus') : true" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
      <input type="hidden" name="form-name" value="owner-question">
      <input type="hidden" name="page_url" value="">
      <input type="text" name="business_name" placeholder="Your Business Name *" required style="padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.35);color:#fff;font-size:14px;">
      <input type="tel" name="owner_phone" placeholder="Your Phone Number *" required style="padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.35);color:#fff;font-size:14px;">
      <input type="email" name="owner_email" placeholder="Your Email Address *" required style="padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.35);color:#fff;font-size:14px;">
      <input type="text" name="question" placeholder="Domain name or question..." required style="padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.35);color:#fff;font-size:14px;">
      <button type="submit" class="btn-gold" style="justify-content:center;padding:10px 18px;font-size:14px;border-radius:8px;">Send Direct Note to Neal</button>
    </form>
    <div id="ownerQuestionStatus" style="display:none;margin-top:10px;color:#86efac;font-size:13px;font-weight:700;">✓ Message sent! Neal Frazier will text/email you back shortly.</div>
  </div>
</div>`;
  if (replyTo) {
    return {
      action: `<div style="display:flex;gap:0.55rem;flex-wrap:wrap;align-items:center;">
  <a class="btn" style="background:#16a34a;color:#ffffff;font-weight:800;" href="${stripeImpulse7Url}" target="_blank" rel="noopener">★ $7 Instant AI + HTML Pack</a>
  <a class="btn" style="background:#ea580c;color:#ffffff;font-weight:700;" href="${stripeDfyUrl}" target="_blank" rel="noopener">⚡ $149 Done-For-You 1-Page Launch</a>
  <a class="btn" style="background:#635bff;color:#ffffff;font-weight:700;" href="${stripeAiUrl}" target="_blank" rel="noopener">🤖 $299 Add 24/7 AI Receptionist</a>
  <a class="btn" style="background:#0f766e;color:#ffffff;font-weight:700;" href="${stripe5PageUrl}" target="_blank" rel="noopener">🚀 $499 Turnkey 5-Page Website</a>
  <a class="btn" style="background:#44403c;color:#ffffff;font-weight:700;" href="${stripeDepositUrl}" target="_blank" rel="noopener">🤝 $99 Kickoff Deposit</a>
  <a class="btn" style="background:#9945ff;color:#ffffff;" href="${depayUrl}" target="_blank" rel="noopener">🟣 Solana Pay</a>
  <button type="button" class="btn" style="background:#ffffff;color:#1c1917;font-weight:700;" onclick="window.openVipModal()">🎁 Already Paid? Download / Onboarding</button>
</div>`,
      rest: inlineOwnerForm
    };
  }
  return {
    action: '<button type="button" id="copyOffer">Copy send note</button>',
    rest: inlineOwnerForm
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
      <a class="t-btn" href="#estimator">60-Second Price Estimator</a>
      <a class="t-line" href="#offer">Claim This Site ($149 DFY / $19 HTML)</a>
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
<section class="trade-sect" id="estimator" aria-label="Interactive Written Price Estimator">
  <h2>Interactive 60-Second Written Estimate &amp; Callback Request</h2>
  <div style="background:#ffffff;border:1px solid #ddd4c7;border-radius:16px;padding:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;align-items:center;">
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div>
        <label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5c564c;margin-bottom:6px;">1. Select Service Needed</label>
        <select id="estScopeSelect" onchange="window.updateTradeEstimate && window.updateTradeEstimate()" style="width:100%;padding:12px;border:1px solid #d6d3d1;border-radius:8px;font-size:15px;background:#fafaf9;color:#1c1917;">
          ${work.map(([title], idx) => `<option value="${idx}">${esc(title)} (${esc(city.name)})</option>`).join('\n          ')}
        </select>
      </div>
      <div>
        <label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5c564c;margin-bottom:6px;">2. Visit Type &amp; Urgency</label>
        <select id="estUrgencySelect" onchange="window.updateTradeEstimate && window.updateTradeEstimate()" style="width:100%;padding:12px;border:1px solid #d6d3d1;border-radius:8px;font-size:15px;background:#fafaf9;color:#1c1917;">
          <option value="1">Standard Scheduled Visit</option>
          <option value="1.75">Full System / Multi-Area Scope</option>
          <option value="1.35">Same-Day / Priority Dispatch</option>
        </select>
      </div>
    </div>
    <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;padding:20px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9a3412;">ESTIMATED BALLPARK RANGE (${esc(place)})</div>
      <div id="estRangeOutput" style="font-size:32px;font-weight:800;color:#1c1917;margin:6px 0;">$165 – $380</div>
      <p style="font-size:13px;color:#57534e;margin:0 0 14px 0;">Exact written price is provided before work begins. Test the instant lead capture form below:</p>
      <form name="trade-lead-capture" method="POST" data-netlify="true" onsubmit="return window.submitNetlifyForm ? window.submitNetlifyForm(event, 'tradeEstStatus') : true" style="display:flex;gap:8px;flex-wrap:wrap;">
        <input type="hidden" name="form-name" value="trade-lead-capture">
        <input type="hidden" name="city" value="${esc(place)}">
        <input type="hidden" name="trade" value="${esc(service.name)}">
        <input type="text" name="customer_name" placeholder="Your Name" required style="flex:1 1 120px;padding:10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;">
        <input type="tel" name="customer_phone" placeholder="Your Phone #" required style="flex:1 1 130px;padding:10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;">
        <button type="submit" class="btn-gold" style="padding:10px 16px;font-size:13px;border-radius:6px;">Request Written Quote</button>
      </form>
      <div id="tradeEstStatus" style="font-size:12px;color:#15803d;font-weight:700;margin-top:8px;display:none;">✓ Request logged! The owner will text/call you with a visit window.</div>
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
      <p>Add the business name, phone, and email to the contact lines and publish. Choose Done-For-You 48-Hour Launch ($149), Self-Serve HTML ($19), 24/7 AI Receptionist ($299), or 5-Page Custom Website ($499).</p>
    </div>
    <div class="trade-price">
      <strong><s style="opacity:0.45;font-size:0.45em;margin-right:8px;">${esc(price)}</s>$149</strong>
      <span>Done-For-You 48h Launch · ${esc(place)} (or $19 Self-Serve HTML)</span>
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
<aside id="salesBanner" aria-label="Founding Studio Promotion" class="sales-banner">
  <div class="sales-content">
    <div class="sales-left">
      <span class="pulse-dot"></span>
      <strong>⚡ FOUNDING LEAD STUDIO ACCESS:</strong>
      <span>Lifetime Local Trade Page Synthesizer —</span>
      <span style="text-decoration: line-through; opacity: 0.6;">$79</span>
      <strong style="color: #ea580c; font-size: 14px;">$19 Self-Serve</strong>
      <span class="banner-sub">or <strong>$149 Done-For-You 48h Launch</strong> • Instant 1,000-city HTML exports.</span>
    </div>
    <div class="sales-actions">
      <a href="https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O" target="_blank" rel="noopener noreferrer" class="btn-gold" style="background:#ea580c;">⚡ $149 Done-For-You Launch</a>
      <a href="https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N" target="_blank" rel="noopener noreferrer" class="btn-gold">💳 $19 Self-Serve HTML</a>
      <a href="https://depay.com/pay?integration=428790dd-7ad1-407c-8ecf-c048c77a4cb8&amp;receiver=GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK&amp;amount=19" target="_blank" rel="noopener noreferrer" class="btn-purple" onclick="window.payWithSolana(event)">🟣 Solana Pay</a>
      <button id="btnActivateBanner" onclick="window.openVipModal()" class="btn-text">🎁 Already Paid? Download / Onboarding</button>
    </div>
  </div>
</aside>

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

<!-- Interactive Studio Workspace -->
<section class="sect studio-workspace" style="margin-top:28px;margin-bottom:32px;padding:24px;background:#ffffff;border:1px solid #e7e5e4;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;border-bottom:1px solid #f5f5f4;padding-bottom:12px;">
    <div>
      <h2 style="font-size:22px;font-weight:700;color:#1c1917;margin:0;">⚡ Live Lead Page Synthesizer</h2>
      <p style="font-size:14px;color:#78716c;margin:4px 0 0 0;">Select trade and city, inject owner contact lines, and live assemble a ready-to-pitch page.</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <button id="btnExportBundleLive" onclick="window.handleExportBundle()" class="btn-gold" style="font-size:13px;padding:8px 16px;">
        💾 Export Standalone HTML Bundle
      </button>
      <button type="button" onclick="window.openVipModal()" style="background:#1c1917;color:#fff;border:none;border-radius:6px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;">
        🎁 VIP Onboarding / Download
      </button>
    </div>
  </div>

  <div class="synthesizer-controls" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:18px;">
    <div>
      <label style="display:block;font-size:11px;font-weight:700;color:#78716c;text-transform:uppercase;margin-bottom:4px;">Trade Service</label>
      <select id="synthTradeSelect" style="width:100%;padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;background:#fafaf9;">
        ${SERVICES.map(s => `<option value="${s.slug}">${s.name} (${money(s.price)})</option>`).join('\n')}
      </select>
    </div>
    <div>
      <label style="display:block;font-size:11px;font-weight:700;color:#78716c;text-transform:uppercase;margin-bottom:4px;">Target City</label>
      <select id="synthCitySelect" style="width:100%;padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;background:#fafaf9;">
        ${CITIES.map(c => `<option value="${c.slug}">${c.name}, ${c.state}</option>`).join('\n')}
      </select>
    </div>
    <div>
      <label style="display:block;font-size:11px;font-weight:700;color:#78716c;text-transform:uppercase;margin-bottom:4px;">Owner Company Name</label>
      <input type="text" id="synthBizInput" value="Apex Craftsman" style="width:100%;padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;background:#fafaf9;">
    </div>
    <div>
      <label style="display:block;font-size:11px;font-weight:700;color:#78716c;text-transform:uppercase;margin-bottom:4px;">Phone Number</label>
      <input type="text" id="synthPhoneInput" value="(208) 555-0199" style="width:100%;padding:8px 10px;border:1px solid #d6d3d1;border-radius:6px;font-size:14px;background:#fafaf9;">
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
    <button id="btnGeneratePreview" onclick="window.generateLivePreview()" class="btn" style="background:#1c1917;color:#ffffff;font-size:13px;padding:8px 18px;border:none;border-radius:6px;cursor:pointer;font-weight:700;">
      ⚡ Live Assemble Page Preview
    </button>
    <span id="previewStatus" style="font-size:12px;color:#78716c;font-family:monospace;">Ready to assemble</span>
  </div>

  <!-- Live Assembled Preview Box -->
  <div id="synthPreviewCard" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;padding:18px;">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e7e5e4;padding-bottom:8px;margin-bottom:12px;">
      <span style="font-size:11px;font-weight:700;color:#9a3412;text-transform:uppercase;" id="previewBadge">ASSEMBLED LEAD PAGE SPEC</span>
      <span style="font-size:13px;font-weight:700;color:#1c1917;" id="previewPrice">$800 · Written Price</span>
    </div>
    <h3 style="font-size:18px;font-weight:700;color:#1c1917;margin:0 0 8px 0;" id="previewHeadline">Boise House Painting — Written price before the first can opens</h3>
    <p style="font-size:14px;color:#57534e;line-height:1.5;margin:0 0 12px 0;" id="previewLede">Three rooms or the whole house, inside or out. You see the price in writing with prep, coats, and paint all listed before work begins.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:10px;font-size:13px;background:#ffffff;padding:12px;border-radius:6px;border:1px solid #e7e5e4;">
      <div><strong>Company:</strong> <span id="previewBiz">Apex Craftsman</span></div>
      <div><strong>Phone:</strong> <span id="previewPhone">(208) 555-0199</span></div>
      <div><strong>Target Market:</strong> <span id="previewCity">Boise, ID</span></div>
    </div>
  </div>

  <!-- Pro Output Paywall Section -->
  <div id="proPaywallSection" style="position:relative;margin-top:20px;border-radius:8px;overflow:hidden;border:1px solid #e7e5e4;">
    <div id="proPaywallContent" class="pro-paywall-blur" style="filter:blur(6px);user-select:none;padding:16px;background:#ffffff;">
      <div style="font-family:monospace;font-size:11px;color:#78716c;line-height:1.6;">
        <div>&lt;!DOCTYPE html&gt;&lt;html lang="en"&gt;&lt;head&gt;&lt;meta charset="utf-8"&gt;</div>
        <div>&lt;title&gt;Apex Craftsman — House Painting in Boise, ID&lt;/title&gt;</div>
        <div>&lt;meta name="description" content="Written price before the first can opens. Call (208) 555-0199."&gt;</div>
        <div>&lt;link rel="canonical" href="https://apexboise.com/"&gt;</div>
        <div>&lt;!-- Full 20kb self-contained single-page bundle with responsive CSS, semantic schema.org graph, and client contact handler --&gt;</div>
        <div>&lt;script type="application/ld+json"&gt;{"@context":"https://schema.org","@type":"LocalBusiness","name":"Apex Craftsman","telephone":"(208) 555-0199"}&lt;/script&gt;</div>
      </div>
    </div>

    <!-- Glowing centered lock card -->
    <div id="paywallOverlay" class="pro-paywall-overlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10;background:rgba(243,239,230,0.88);backdrop-filter:blur(2px);">
      <div style="background:#ffffff;border:1px solid #9a3412;box-shadow:0 8px 30px rgba(154,52,18,0.15);border-radius:12px;max-width:460px;width:90%;padding:20px;text-align:center;">
        <div style="font-size:24px;margin-bottom:6px;">🔒</div>
        <h4 style="font-size:15px;font-weight:800;color:#1c1917;margin:0 0 6px 0;">PRO STUDIO: FULL PRODUCTION EXPORT &amp; DFY LAUNCH</h4>
        <p style="font-size:12px;color:#78716c;line-height:1.4;margin:0 0 14px 0;">
          Export standalone production HTML bundles ready for your domain ($19), or choose Done-For-You 48-Hour Launch ($149) and we configure everything for you.
        </p>
        <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:6px;padding:6px;margin-bottom:12px;font-size:12px;">
          <span style="color:#a8a29e;text-decoration:line-through;">$800 Agency Rate</span>
          <strong style="color:#9a3412;font-size:14px;margin-left:6px;">$149 Done-For-You · or $19 Self-Serve HTML</strong>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <a href="https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O" target="_blank" rel="noopener noreferrer" class="btn-gold" style="justify-content:center;padding:8px;font-size:12px;background:#ea580c;">
            ⚡ $149 Done-For-You 48-Hour Launch (We Set It Up)
          </a>
          <a href="https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N" target="_blank" rel="noopener noreferrer" class="btn-gold" style="justify-content:center;padding:8px;font-size:12px;">
            💳 $19 Instant Self-Serve HTML Bundle Unlock
          </a>
          <a href="https://depay.com/pay?integration=428790dd-7ad1-407c-8ecf-c048c77a4cb8&amp;receiver=GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK&amp;amount=19" target="_blank" rel="noopener noreferrer" class="btn-purple" style="justify-content:center;padding:8px;text-decoration:none;display:flex;align-items:center;font-size:12px;" onclick="window.payWithSolana(event)">
            🟣 Pay with Solana (DePay)
          </a>
          <button id="btn-paywall-key" data-alias="btnKeyOverlay" onclick="window.openVipModal()" style="background:none;border:none;color:#78716c;font-size:11px;text-decoration:underline;cursor:pointer;margin-top:4px;">
            Already purchased? Click here for Instant Download &amp; VIP Onboarding
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

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
  if (fs.existsSync(path.join(ROOT, 'media', 'favicon.ico'))) {
    fs.copyFileSync(path.join(ROOT, 'media', 'favicon.ico'), path.join(SITE, 'favicon.ico'));
  }
  if (fs.existsSync(path.join(ROOT, 'city_engine.js'))) {
    fs.copyFileSync(path.join(ROOT, 'city_engine.js'), path.join(SITE, 'city_engine.js'));
  }

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
  write('llms.txt', `# City Desk (by Neal Frazier Tech & NullAI Platform)
> 1,000 Finished Local Trade Websites & Interactive Lead Synthesizers Across 50 US Cities and 20 Service Trades — Engineered by Neal Frazier (Neal Frazier Tech / @1nc0gn30).

- **Canonical URL**: https://city-desk.netlify.app
- **Creator & Principal Architect**: Neal Frazier (Neal Frazier Tech) — https://www.nealfrazier.tech
- **Direct Contact**: neal@nealfrazier.tech | (757) 576-0980
- **Machine-Readable Web APIs**:
  - \`https://city-desk.netlify.app/api/index.json\`
  - \`https://city-desk.netlify.app/api/services.json\`
  - \`https://city-desk.netlify.app/api/faq.json\`
  - \`https://city-desk.netlify.app/offers.json\`
  - \`https://city-desk.netlify.app/.well-known/agent.json\`
  - \`https://city-desk.netlify.app/.well-known/mcp.json\`

## Instant Checkout & Turnkey Fulfillment Tiers
- **Done-For-You 1-Page Custom Launch ($149 One-Time)**: https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O (We customize your business name, phone, email, 60-second estimator, and connect your domain within 48 hours).
- **24/7 AI Voice & SMS Receptionist + Missed-Call Text-Back ($299 One-Time)**: https://buy.stripe.com/00w8wO6o50XC2D60xWfw40S
- **Turnkey 5-Page Custom Website & Local AEO Package ($499 One-Time)**: https://buy.stripe.com/3cIcN48wdbCgelOeoMfw40T
- **Custom Build Kickoff Deposit ($99 One-Time)**: https://buy.stripe.com/eVqbJ05k1gWA3HacgEfw40V
- **Self-Serve Standalone HTML Bundle ($19 One-Time)**: https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N
- **Post-Payment Fulfillment**: Every checkout redirects to \`https://city-desk.netlify.app/?licensed=true&dfy=true\` which unlocks immediate standalone HTML downloads and opens the VIP 48-Hour Launch Concierge Form (\`vip-onboarding\`).
`);
  write('llms-full.txt', `# City Desk — Complete 1,000-Page Local Trade Directory & Turnkey Fulfillment Specification
Engineered by Neal Frazier (Neal Frazier Tech | https://www.nealfrazier.tech | neal@nealfrazier.tech | (757) 576-0980).

## 20 Covered Service Trades
${SERVICES.map(s => `- **${s.name}** (\`/services/${s.slug}/\`): ${s.line}`).join('\n')}

## 50 Covered US Cities
${CITIES.map(c => `- **${c.name}, ${c.state}** (\`/cities/${c.slug}/\`)`).join('\n')}
`);
  write('api/index.json', JSON.stringify({
    status: 'ok',
    name: 'City Desk Local Trade Web API',
    creator: 'Neal Frazier (Neal Frazier Tech)',
    url: 'https://city-desk.netlify.app',
    totalPages: offers.length,
    citiesCount: CITIES.length,
    servicesCount: SERVICES.length,
    endpoints: {
      offers: 'https://city-desk.netlify.app/offers.json',
      services: 'https://city-desk.netlify.app/api/services.json',
      faq: 'https://city-desk.netlify.app/api/faq.json',
      agentCard: 'https://city-desk.netlify.app/.well-known/agent.json'
    }
  }, null, 2) + '\n');
  write('api/services.json', JSON.stringify({
    provider: 'Neal Frazier Tech (City Desk)',
    checkoutTiers: [
      { id: 'dfy-1page', name: 'Done-For-You 1-Page Custom Launch (48h Delivery)', priceUSD: 149, checkoutUrl: 'https://buy.stripe.com/9B6fZg7s96hWa5ya8wfw40O' },
      { id: 'ai-receptionist', name: '24/7 AI Receptionist & Missed-Call SMS Text-Back', priceUSD: 299, checkoutUrl: 'https://buy.stripe.com/00w8wO6o50XC2D60xWfw40S' },
      { id: 'turnkey-5page', name: 'Turnkey 5-Page Custom Website & Local AEO', priceUSD: 499, checkoutUrl: 'https://buy.stripe.com/3cIcN48wdbCgelOeoMfw40T' },
      { id: 'kickoff-deposit', name: 'Custom Build Kickoff Deposit', priceUSD: 99, checkoutUrl: 'https://buy.stripe.com/eVqbJ05k1gWA3HacgEfw40V' },
      { id: 'self-serve-html', name: 'Self-Serve Standalone HTML Bundle', priceUSD: 19, checkoutUrl: 'https://buy.stripe.com/6oU7sK3bTcGk5Pia8wfw40N' }
    ],
    trades: SERVICES.map(s => ({ slug: s.slug, name: s.name, line: s.line, agencyValueUSD: s.price }))
  }, null, 2) + '\n');
  write('api/faq.json', JSON.stringify({
    faqs: [
      { question: 'What happens immediately after I pay on Stripe or Solana?', answer: 'You are redirected back with ?licensed=true&dfy=true which unlocks 1-click standalone HTML bundle downloads AND opens the VIP 48-Hour Concierge Onboarding form so our engineering team puts your business name, phone, logo, and domain live within 48 hours.' },
      { question: 'Are there any monthly agency retainers?', answer: 'No. Every tier ($19 Self-Serve, $149 Done-For-You 1-Page, $299 AI Receptionist, $499 5-Page Custom Site) is a flat one-time payment.' }
    ]
  }, null, 2) + '\n');
  write('.well-known/agent.json', JSON.stringify({
    schema_version: '1.0',
    name: 'City Desk — Neal Frazier Tech Local Trade Engine',
    url: 'https://city-desk.netlify.app',
    contact: { email: 'neal@nealfrazier.tech', phone: '+1-757-576-0980' },
    apis: {
      index: 'https://city-desk.netlify.app/api/index.json',
      services: 'https://city-desk.netlify.app/api/services.json',
      offers: 'https://city-desk.netlify.app/offers.json',
      llmsTxt: 'https://city-desk.netlify.app/llms.txt'
    }
  }, null, 2) + '\n');
  write('.well-known/mcp.json', JSON.stringify({
    mcpVersion: '2025-01-01',
    name: 'city-desk-mcp',
    provider: 'Neal Frazier Tech',
    resources: [
      { uri: 'https://city-desk.netlify.app/api/services.json', name: 'Checkout Tiers & 20 Trades', mimeType: 'application/json' },
      { uri: 'https://city-desk.netlify.app/offers.json', name: '1,000 City x Trade Pages', mimeType: 'application/json' }
    ]
  }, null, 2) + '\n');
  write('_headers', [
    '/*',
    '  X-Frame-Options: SAMEORIGIN',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    '',
    '/api/*',
    '  Access-Control-Allow-Origin: *',
    '  Content-Type: application/json; charset=utf-8',
    '',
    '/.well-known/*',
    '  Access-Control-Allow-Origin: *',
    '  Content-Type: application/json; charset=utf-8',
    '',
    '/llms.txt',
    '  Access-Control-Allow-Origin: *',
    '  Content-Type: text/plain; charset=utf-8',
    '',
    '/llms-full.txt',
    '  Access-Control-Allow-Origin: *',
    '  Content-Type: text/plain; charset=utf-8',
    ''
  ].join('\n'));
  write('_redirects', [
    '/cities/:city/:trade/* /cities/virginia-beach-va/:trade/index.html 200',
    '/cities/:city/:trade /cities/virginia-beach-va/:trade/index.html 200',
    '/cities/:city/* /cities/virginia-beach-va/index.html 200',
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
  /#1\s/,
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
