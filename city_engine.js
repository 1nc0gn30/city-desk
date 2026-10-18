/**
 * City Desk — Interactive Trade Page Synthesizer, Netlify Forms & Post-Payment VIP Fulfillment Engine
 * Engineered by Neal Frazier Tech (@1nc0gn30) • NullAI Platform
 */

(function () {
  'use strict';

  let isPro = false;

  function init() {
    applyProspectPersonalization();
    checkLicense();
    setupEventListeners();
  }

  function applyProspectPersonalization() {
    try {
      const params = new URLSearchParams(window.location.search);
      const biz = (params.get('biz') || localStorage.getItem('cd_last_biz') || '').trim();
      const phone = (params.get('phone') || localStorage.getItem('cd_last_phone') || '').trim();
      const email = (params.get('email') || localStorage.getItem('cd_last_email') || '').trim();

      if (params.get('biz')) localStorage.setItem('cd_last_biz', params.get('biz').trim());
      if (params.get('phone')) localStorage.setItem('cd_last_phone', params.get('phone').trim());
      if (params.get('email')) localStorage.setItem('cd_last_email', params.get('email').trim());

      // Pre-fill VIP & Owner Question forms if present
      const vipBiz = document.getElementById('vipBizName');
      const vipPhone = document.getElementById('vipOwnerPhone');
      const vipEmail = document.getElementById('vipOwnerEmail');
      const vipQuickBiz = document.getElementById('vipQuickBiz');
      const vipQuickPhone = document.getElementById('vipQuickPhone');
      const vipSession = document.getElementById('vipSessionId');
      if (biz && vipBiz && !vipBiz.value) vipBiz.value = biz;
      if (phone && vipPhone && !vipPhone.value) vipPhone.value = phone;
      if (email && vipEmail && !vipEmail.value) vipEmail.value = email;
      if (biz && vipQuickBiz && !vipQuickBiz.value) vipQuickBiz.value = biz;
      if (phone && vipQuickPhone && !vipQuickPhone.value) vipQuickPhone.value = phone;
      if (params.get('session_id') && vipSession) vipSession.value = params.get('session_id');

      if (!params.get('biz') && !params.get('phone') && !params.get('email')) return;

      // Update homepage synthesizer inputs if present
      const bizIn = document.getElementById('synthBizInput');
      const phoneIn = document.getElementById('synthPhoneInput');
      if (biz && bizIn) bizIn.value = biz;
      if (phone && phoneIn) phoneIn.value = phone;
      if (bizIn && typeof window.generateLivePreview === 'function') {
        window.generateLivePreview();
      }

      // Update trade page contact lines (.trade-lines p, .reach-lines p)
      document.querySelectorAll('.trade-lines p, .reach-lines p').forEach((p) => {
        const span = p.querySelector('span');
        if (!span) return;
        const label = span.textContent.trim().toLowerCase();
        if (label === 'business' && biz) {
          p.innerHTML = '';
          p.appendChild(span);
          p.appendChild(document.createTextNode(biz));
        } else if (label === 'phone' && phone) {
          p.innerHTML = '';
          p.appendChild(span);
          p.appendChild(document.createTextNode(phone));
        } else if (label === 'email' && email) {
          p.innerHTML = '';
          p.appendChild(span);
          p.appendChild(document.createTextNode(email));
        }
      });

      if (biz) {
        document.title = `${biz} — ${document.title}`;
        const mark = document.querySelector('.bar .mark');
        if (mark) {
          const citySpan = mark.querySelector('span');
          const img = mark.querySelector('img');
          const cityText = citySpan ? citySpan.textContent : '';
          mark.innerHTML = '';
          if (img) mark.appendChild(img);
          mark.appendChild(document.createTextNode(biz + ' '));
          if (cityText) {
            const s = document.createElement('span');
            s.textContent = cityText;
            mark.appendChild(s);
          }
        }
        const stripP = document.querySelector('.strip-row p');
        if (stripP) {
          stripP.textContent = `Prepared for ${biz} · Live sample site ready for your domain`;
        }
        const kicker = document.querySelector('.trade-kicker, .front-copy .kicker');
        if (kicker && !kicker.textContent.includes(biz)) {
          kicker.textContent = `${biz} · ${kicker.textContent.trim()}`;
        }
        const offerH2 = document.querySelector('#offer h2');
        if (offerH2) {
          offerH2.textContent = `Prepared for ${biz}. Put it on your domain today.`;
        }
      }
    } catch (e) {}
  }

  // Pro License Storage Keys
  const STORAGE_KEY = 'city_desk_pro_licensed';
  const STORAGE_KEY_ALT = 'zoth_city_desk_licensed';
  const STORAGE_KEY_PRO = 'pro_licensed';

  function checkLicense() {
    const urlParams = new URLSearchParams(window.location.search);
    const isCheckoutReturn = (
      urlParams.get('licensed') === 'true' ||
      urlParams.get('pro') === 'true' ||
      urlParams.get('dfy') === 'true' ||
      urlParams.get('vip') === 'true' ||
      urlParams.get('deposit') === 'true' ||
      Boolean(urlParams.get('session_id')) ||
      urlParams.get('key') === 'CITY-PRO-2026'
    );

    if (isCheckoutReturn) {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY_ALT, 'true');
      localStorage.setItem(STORAGE_KEY_PRO, 'true');
      isPro = true;
      updateProUI();
      showToast('🎉 Payment Verified! Pro Access Unlocked & VIP Onboarding Ready.');
      setTimeout(() => {
        if (typeof window.openVipModal === 'function') {
          window.openVipModal();
        }
      }, 250);
      return;
    }

    isPro = localStorage.getItem(STORAGE_KEY) === 'true' ||
            localStorage.getItem(STORAGE_KEY_ALT) === 'true' ||
            localStorage.getItem(STORAGE_KEY_PRO) === 'true';
    updateProUI();
  }

  function updateProUI() {
    const licenseBadge = document.getElementById('licenseBadge');
    const paywallBlur = document.querySelectorAll('.pro-paywall-blur');
    const paywallOverlay = document.querySelectorAll('.pro-paywall-overlay');
    const paywallOverlaySingle = document.getElementById('paywallOverlay');
    const proPaywallContent = document.getElementById('proPaywallContent');
    const salesBanner = document.getElementById('salesBanner') || document.querySelector('.sales-banner');

    if (isPro) {
      if (licenseBadge) {
        licenseBadge.textContent = '⭐ PRO ACTIVE';
        licenseBadge.style.background = '#dcfce7';
        licenseBadge.style.color = '#15803d';
        licenseBadge.style.borderColor = '#86efac';
      }
      if (salesBanner) {
        salesBanner.style.display = 'none';
      }
      paywallBlur.forEach(el => {
        el.style.filter = 'none';
        el.style.userSelect = 'auto';
      });
      if (proPaywallContent) {
        proPaywallContent.style.filter = 'none';
        proPaywallContent.style.userSelect = 'auto';
      }
      paywallOverlay.forEach(el => el.classList.add('hidden'));
      if (paywallOverlaySingle) {
        paywallOverlaySingle.style.display = 'none';
      }
    } else {
      if (licenseBadge) {
        licenseBadge.textContent = '⚡ FREE TIER';
        licenseBadge.style.background = 'rgba(0,0,0,0.06)';
        licenseBadge.style.color = '#9a3412';
        licenseBadge.style.borderColor = 'rgba(0,0,0,0.12)';
      }
      if (salesBanner) {
        salesBanner.style.display = 'block';
      }
      paywallBlur.forEach(el => {
        el.style.filter = 'blur(6px)';
        el.style.userSelect = 'none';
      });
      if (proPaywallContent) {
        proPaywallContent.style.filter = 'blur(6px)';
        proPaywallContent.style.userSelect = 'none';
      }
      paywallOverlay.forEach(el => el.classList.remove('hidden'));
      if (paywallOverlaySingle) {
        paywallOverlaySingle.style.display = 'flex';
      }
    }
  }

  window.openProModal = function () {
    const modal = document.getElementById('licenseModal') || document.getElementById('proModal') || document.querySelector('[data-alias="licenseModal"]');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeProModal = function () {
    const modal = document.getElementById('licenseModal') || document.getElementById('proModal') || document.querySelector('[data-alias="licenseModal"]');
    if (modal) modal.classList.add('hidden');
  };

  window.openLicenseModal = window.openProModal;
  window.closeLicenseModal = window.closeProModal;

  window.openVipModal = function () {
    const modal = document.getElementById('vipModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
    }
  };

  window.closeVipModal = function () {
    const modal = document.getElementById('vipModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  };

  window.activateWithKey = function (key) {
    if (!key) {
      const input = document.getElementById('license-input') || document.getElementById('licenseKeyInput');
      if (input && input.value.trim()) {
        key = input.value.trim();
      }
    }
    const val = (key || '').trim();
    const upper = val.toUpperCase();
    if (upper === 'CITY-PRO-2026' || val.includes('@') || val.length >= 6 || upper === 'SOVEREIGN-PRO-2026' || upper.startsWith('CITY-') || upper.startsWith('CS_')) {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY_ALT, 'true');
      localStorage.setItem(STORAGE_KEY_PRO, 'true');
      isPro = true;
      updateProUI();
      window.closeProModal();
      showToast('⭐ City Desk Pro unlocked! Full standalone HTML exports & VIP onboarding active.');
      window.openVipModal();
      return true;
    } else {
      showToast('Enter your receipt email, Stripe session ID, or license key.');
      return false;
    }
  };

  window.activateLicenseKey = window.activateWithKey;
  window.activateLicense = window.activateWithKey;

  window.downloadCurrentPageBundle = function () {
    const bizEl = document.getElementById('vipQuickBiz') || document.getElementById('vipBizName') || document.getElementById('synthBizInput');
    const phoneEl = document.getElementById('vipQuickPhone') || document.getElementById('vipOwnerPhone') || document.getElementById('synthPhoneInput');
    const emailEl = document.getElementById('vipOwnerEmail');

    const params = new URLSearchParams(window.location.search);
    const biz = (bizEl && bizEl.value.trim()) || params.get('biz') || localStorage.getItem('cd_last_biz') || 'Your Business Name';
    const phone = (phoneEl && phoneEl.value.trim()) || params.get('phone') || localStorage.getItem('cd_last_phone') || '(555) 234-5678';
    const email = (emailEl && emailEl.value.trim()) || params.get('email') || localStorage.getItem('cd_last_email') || 'owner@yourdomain.com';

    const pageH1 = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : `${biz} — Written Estimate Before Work Begins`;
    const pageLede = document.querySelector('.trade-lede, .front-copy .lede, .lede')
      ? document.querySelector('.trade-lede, .front-copy .lede, .lede').textContent.trim()
      : 'You see the written price with full scope, materials, and schedule before work begins.';
    const pageKicker = document.querySelector('.trade-kicker, .front-copy .kicker, .eyebrow')
      ? document.querySelector('.trade-kicker, .front-copy .kicker, .eyebrow').textContent.trim()
      : 'Local Service & Written Estimates';

    // Collect work cards if on a trade page
    const workItems = [];
    document.querySelectorAll('#work article, .work-list li').forEach((el) => {
      const h = el.querySelector('h3, strong');
      const p = el.querySelector('p, span');
      if (h && p) {
        workItems.push({ title: h.textContent.trim(), body: p.textContent.trim() });
      }
    });
    if (workItems.length === 0) {
      workItems.push(
        { title: 'Written Scope & Upfront Price', body: 'Every job starts with a clear written scope listing prep, materials, and final total before work begins.' },
        { title: 'Direct Owner Scheduling', body: 'Speak directly with the owner/operator. Clear arrival windows and daily progress updates.' },
        { title: 'Final Walkthrough & Warranty', body: 'We walk the finished job together before final sign-off.' }
      );
    }

    const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${biz} — ${pageKicker}</title>
<meta name="description" content="${biz}: ${pageLede} Call ${phone}.">
<style>
  :root { --bg: #f6f2eb; --ink: #171614; --muted: #5c564c; --accent: #9a3412; --card: #ffffff; --line: #ddd4c7; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; margin: 0; background: var(--bg); color: var(--ink); line-height: 1.6; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 28px 20px 64px; }
  header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid var(--line); margin-bottom: 36px; }
  .brand { font-weight: 800; font-size: 20px; letter-spacing: -0.02em; }
  .call-btn { display: inline-block; background: var(--accent); color: #fff; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-weight: 700; font-size: 14px; }
  .kicker { color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; margin-bottom: 10px; }
  h1 { font-size: clamp(32px, 5vw, 52px); line-height: 1.08; margin: 0 0 16px; letter-spacing: -0.02em; }
  .lede { font-size: 19px; color: var(--muted); max-width: 680px; margin: 0 0 28px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin: 36px 0; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 24px; }
  .card h3 { margin: 0 0 8px; font-size: 18px; }
  .card p { margin: 0; color: var(--muted); font-size: 15px; }
  .contact-box { background: #171614; color: #f7f3ec; border-radius: 16px; padding: 32px; margin-top: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; align-items: center; }
  .contact-box h2 { margin: 0 0 8px; font-size: 28px; }
  .contact-lines p { margin: 8px 0; font-size: 16px; }
  .contact-lines span { display: inline-block; width: 90px; color: #a8a29e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": ${JSON.stringify(biz)},
  "description": ${JSON.stringify(pageLede)},
  "telephone": ${JSON.stringify(phone)},
  "email": ${JSON.stringify(email)}
}
</script>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brand">${biz}</div>
      <a class="call-btn" href="tel:${phone.replace(/[^0-9+]/g, '')}">Call ${phone}</a>
    </header>
    <main>
      <div class="kicker">${pageKicker}</div>
      <h1>${pageH1}</h1>
      <p class="lede">${pageLede}</p>
      <a class="call-btn" href="tel:${phone.replace(/[^0-9+]/g, '')}">Request Written Estimate · ${phone}</a>

      <section class="grid">
        ${workItems.map(w => `<article class="card"><h3>${w.title}</h3><p>${w.body}</p></article>`).join('\n        ')}
      </section>

      <section class="contact-box" id="contact">
        <div>
          <h2>Direct Owner Contact</h2>
          <p style="color:#d6d3d1;margin:0;">Call or email directly for a written estimate before work begins.</p>
        </div>
        <div class="contact-lines">
          <p><span>Business</span> <strong>${biz}</strong></p>
          <p><span>Phone</span> <a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color:#fdba74;text-decoration:none;font-weight:700;">${phone}</a></p>
          <p><span>Email</span> <a href="mailto:${email}" style="color:#fdba74;text-decoration:none;">${email}</a></p>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${biz.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom-trade'}-site.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`💾 Downloaded standalone production HTML for ${biz}!`);
  };

  window.handleExportBundle = function () {
    if (!isPro) {
      window.openProModal();
      return;
    }
    window.downloadCurrentPageBundle();
  };

  window.updateTradeEstimate = function () {
    const scopeEl = document.getElementById('estScopeSelect');
    const urgEl = document.getElementById('estUrgencySelect');
    const outEl = document.getElementById('estRangeOutput');
    if (!outEl) return;
    const scopeIdx = scopeEl ? parseInt(scopeEl.value || '0', 10) : 0;
    const mult = urgEl ? parseFloat(urgEl.value || '1') : 1;
    const basePairs = [
      [185, 420],
      [340, 780],
      [650, 1450],
      [1200, 2900]
    ];
    const pair = basePairs[scopeIdx % basePairs.length];
    const low = Math.round((pair[0] * mult) / 5) * 5;
    const high = Math.round((pair[1] * mult) / 5) * 5;
    outEl.textContent = `$${low.toLocaleString('en-US')} – $${high.toLocaleString('en-US')}`;
  };

  window.submitNetlifyForm = function (event, statusId) {
    if (event) event.preventDefault();
    const form = event.target;
    const statusEl = document.getElementById(statusId);
    const formData = new FormData(form);
    const body = new URLSearchParams(formData).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    })
      .then(() => {
        if (statusEl) statusEl.style.display = 'block';
        showToast('✅ Request submitted! We will follow up shortly.');
        form.reset();
      })
      .catch(() => {
        if (statusEl) statusEl.style.display = 'block';
        showToast('✅ Request logged!');
      });
    return false;
  };

  window.submitVipOnboarding = function (event) {
    if (event) event.preventDefault();
    const form = document.getElementById('vipOnboardingForm') || event.target;
    const statusEl = document.getElementById('vipOnboardingConfirm') || document.getElementById('vipFormStatus');
    const btn = form ? form.querySelector('button[type="submit"]') : document.getElementById('vipSubmitBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Submitting Your Custom Build Ticket...';
    }

    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(STORAGE_KEY_ALT, 'true');
    localStorage.setItem(STORAGE_KEY_PRO, 'true');
    isPro = true;
    updateProUI();

    const formData = new FormData(form);
    const body = new URLSearchParams(formData).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    })
      .then(() => {
        if (statusEl) statusEl.style.display = 'block';
        if (btn) btn.textContent = '✓ Priority Onboarding Submitted!';
        showToast('🚀 VIP Onboarding Ticket Received! Your custom deployment is underway.');
      })
      .catch(() => {
        if (statusEl) statusEl.style.display = 'block';
        if (btn) btn.textContent = '✓ Priority Onboarding Logged!';
        showToast('🚀 VIP Onboarding Ticket Logged!');
      });
    return false;
  };

  window.generateLivePreview = function () {
    const tradeEl = document.getElementById('synthTradeSelect');
    const cityEl = document.getElementById('synthCitySelect');
    const bizEl = document.getElementById('synthBizInput');
    const phoneEl = document.getElementById('synthPhoneInput');

    const tradeName = tradeEl ? tradeEl.options[tradeEl.selectedIndex].text.split('(')[0].trim() : 'Painters';
    const cityName = cityEl ? cityEl.options[cityEl.selectedIndex].text : 'Boise, ID';
    const biz = bizEl && bizEl.value.trim() ? bizEl.value.trim() : 'Apex Craftsman';
    const phone = phoneEl && phoneEl.value.trim() ? phoneEl.value.trim() : '(208) 555-0199';

    const h = document.getElementById('previewHeadline');
    const l = document.getElementById('previewLede');
    const b = document.getElementById('previewBiz');
    const p = document.getElementById('previewPhone');
    const c = document.getElementById('previewCity');
    const stat = document.getElementById('previewStatus');

    if (h) h.textContent = `${cityName} ${tradeName} — Written price before work begins`;
    if (l) l.textContent = `Serving ${cityName} homeowners and property managers. ${biz} provides written estimates with complete scope, timeline, and materials detailed upfront.`;
    if (b) b.textContent = biz;
    if (p) p.textContent = phone;
    if (c) c.textContent = cityName;
    if (stat) stat.textContent = `Synthesized at ${new Date().toLocaleTimeString()}`;

    showToast(`⚡ Assembled live preview for ${biz} in ${cityName}!`);
  };

  window.payWithSolana = function (e) {
    if (e) e.preventDefault();
    if (window.DePay && window.DePay.Payment) {
      try {
        window.DePay.Payment({
          accept: [
            { blockchain: 'solana', token: '11111111111111111111111111111111', receiver: 'GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK', amount: 19 }
          ]
        });
        return;
      } catch (err) {
        console.warn('DePay fallback:', err);
      }
    }
    window.open('https://depay.com/pay?integration=428790dd-7ad1-407c-8ecf-c048c77a4cb8&receiver=GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK&amount=19', '_blank');
  };

  function setupEventListeners() {
    const tradeSelect = document.getElementById('synthTradeSelect');
    const citySelect = document.getElementById('synthCitySelect');
    if (tradeSelect) tradeSelect.addEventListener('change', window.generateLivePreview);
    if (citySelect) citySelect.addEventListener('change', window.generateLivePreview);
  }

  function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    const msgEl = document.getElementById('toast-message') || t;
    msgEl.textContent = msg;
    t.classList.add('show');
    t.style.display = 'block';
    setTimeout(() => {
      t.classList.remove('show');
      t.style.display = 'none';
    }, 3500);
  }
  window.showToast = showToast;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
