/**
 * City Desk — Interactive Trade Page Synthesizer & Client-Side Engine
 * Engineered by Neal Frazier Tech (@1nc0gn30) • NullAI Platform
 */

(function () {
  'use strict';

  let isPro = false;

  function init() {
    checkLicense();
    setupEventListeners();
  }

  // Pro License Storage Keys
  const STORAGE_KEY = 'city_desk_pro_licensed';
  const STORAGE_KEY_ALT = 'zoth_city_desk_licensed';
  const STORAGE_KEY_PRO = 'pro_licensed';

  function checkLicense() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('licensed') === 'true' || urlParams.get('pro') === 'true' || urlParams.get('key') === 'CITY-PRO-2026') {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY_ALT, 'true');
      localStorage.setItem(STORAGE_KEY_PRO, 'true');
      try {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      } catch (e) {}
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
        el.style.pointerEvents = 'auto';
        el.style.userSelect = 'auto';
      });
      if (proPaywallContent) {
        proPaywallContent.style.filter = 'none';
        proPaywallContent.style.pointerEvents = 'auto';
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
        el.style.pointerEvents = 'none';
        el.style.userSelect = 'none';
      });
      if (proPaywallContent) {
        proPaywallContent.style.filter = 'blur(6px)';
        proPaywallContent.style.pointerEvents = 'none';
        proPaywallContent.style.userSelect = 'none';
      }
      paywallOverlay.forEach(el => el.classList.remove('hidden'));
      if (paywallOverlaySingle) {
        paywallOverlaySingle.style.display = 'flex';
      }
    }
  }

  window.openProModal = function () {
    const modal = document.getElementById('proModal') || document.querySelector('[data-alias="licenseModal"]');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeProModal = function () {
    const modal = document.getElementById('proModal') || document.querySelector('[data-alias="licenseModal"]');
    if (modal) modal.classList.add('hidden');
  };

  window.openLicenseModal = window.openProModal;
  window.closeLicenseModal = window.closeProModal;

  window.activateWithKey = function (key) {
    if (!key) {
      const input = document.getElementById('licenseKeyInput');
      if (input && input.value.trim()) {
        key = input.value.trim();
      }
    }
    const val = (key || '').trim();
    const upper = val.toUpperCase();
    if (upper === 'CITY-PRO-2026' || val.includes('@') || val.length >= 8 || upper === 'SOVEREIGN-PRO-2026' || upper.startsWith('CITY-')) {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY_ALT, 'true');
      localStorage.setItem(STORAGE_KEY_PRO, 'true');
      isPro = true;
      updateProUI();
      window.closeProModal();
      showToast('⭐ City Desk Pro successfully unlocked! Full standalone production exports active.');
      return true;
    } else {
      showToast('Invalid key. Enter your receipt email or order license key.');
      console.warn('Invalid license key');
      return false;
    }
  };

  window.activateLicenseKey = window.activateWithKey;
  window.activateLicense = window.activateWithKey;

  window.handleExportBundle = function () {
    if (!isPro) {
      window.openProModal();
      return;
    }

    const tradeEl = document.getElementById('synthTradeSelect');
    const cityEl = document.getElementById('synthCitySelect');
    const bizEl = document.getElementById('synthBizInput');
    const phoneEl = document.getElementById('synthPhoneInput');

    const trade = tradeEl ? tradeEl.options[tradeEl.selectedIndex].text : 'House Painting';
    const city = cityEl ? cityEl.options[cityEl.selectedIndex].text : 'Boise, ID';
    const biz = bizEl ? bizEl.value : 'Apex Craftsman';
    const phone = phoneEl ? phoneEl.value : '(208) 555-0199';

    const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${biz} — ${trade} in ${city}</title>
<meta name="description" content="${trade} services in ${city} by ${biz}. Call ${phone} for a written estimate.">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; background: #fdfbf7; color: #1c1917; line-height: 1.6; }
  .card { max-width: 680px; margin: 40px auto; background: #fff; padding: 36px; border-radius: 12px; border: 1px solid #e7e5e4; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  h1 { font-size: 28px; margin-top: 0; color: #0c0a09; }
  .btn { display: inline-block; background: #9a3412; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; margin-top: 16px; }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${biz}",
  "telephone": "${phone}",
  "address": { "@type": "PostalAddress", "addressLocality": "${city.split(',')[0]}", "addressRegion": "${(city.split(',')[1] || '').trim()}" }
}
</script>
</head>
<body>
  <div class="card">
    <p style="color: #9a3412; font-weight: 700; text-transform: uppercase; font-size: 13px;">${city} · ${trade}</p>
    <h1>${biz}</h1>
    <p>A written price before work begins. Estimates in writing with prep, materials, and walk-through listed.</p>
    <div style="background: #f5f5f4; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #57534e;">DIRECT CONTACT:</p>
      <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: bold; color: #1c1917;">${phone}</p>
    </div>
    <a href="tel:${phone.replace(/[^0-9]/g, '')}" class="btn">Call for Estimate</a>
  </div>
</body>
</html>`;

    const blob = new Blob([standaloneHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${biz.toLowerCase().replace(/[^a-z0-9]/g, '-')}-site.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`💾 Standalone page bundle generated for ${biz}!`);
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
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#1c1917;color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,0.3);border:1px solid #44403c;transition:opacity 0.3s ease;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
