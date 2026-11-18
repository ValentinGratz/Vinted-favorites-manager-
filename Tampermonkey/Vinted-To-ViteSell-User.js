// ==UserScript==
// @name         Vinted → Vitesell
// @namespace    https://github.com/ValentinGratz/vinted2vitesell
// @version      1.0.9
// @description  Télécharge les photos et prépare les textes pour un copier-coller propre sur Vitesell.
// @author       ValentinGratz
// @match        https://www.vinted.fr/*
// @match        https://*.vinted.fr/*
// @match        https://vitesell.com/*
// @match        https://*.vitesell.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_notification
// @connect      vinted.net
// @connect      vinted.fr
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const IS_VINTED = location.hostname.includes('vinted');
  const IS_VITESELL = location.hostname.endsWith('vitesell.com');
  const EXPORT_KEY = 'lastVitesellExport';
  const MAX_PHOTOS = 10;
  const VITESELL_URL = 'https://vitesell.com/publier';
  const STYLE_ID = 'v2vs-v109-style';

  if (!IS_VINTED && !IS_VITESELL) return;

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .v2vs-img-badge{position:absolute;top:8px;left:8px;z-index:999998;background:#7c3aed;color:#fff;font:700 11px sans-serif;padding:4px 8px;border-radius:6px;box-shadow:0 1px 4px #0005;pointer-events:none}
      .v2vs-grid-badge{position:absolute;top:4px;left:4px;z-index:998;background:#7c3aed;color:#fff;font:700 11px sans-serif;line-height:1;padding:4px 6px;border-radius:50%;box-shadow:0 1px 3px #0004;pointer-events:none}
      #v2vs-panel,#v2vs-vitesell-panel{box-sizing:border-box;color:#171717;font:13px/1.4 Arial,sans-serif}
      #v2vs-panel button,#v2vs-vitesell-panel button{display:block;box-sizing:border-box;width:100%;min-height:38px;font:700 13px Arial,sans-serif;border:0;border-radius:8px;padding:9px 11px;cursor:pointer;margin-top:6px}
      #v2vs-panel #v2vs-preview{display:block;max-height:120px;overflow:auto;white-space:pre-wrap}
      .v2vs-copy-btn{background:#f3e8ff;border:1px solid #7c3aed;color:#7c3aed;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:bold;margin-top:4px;}
    `;
    document.head.appendChild(style);
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const itemIdFromUrl = url => (url || location.href).match(/\/items\/(\d+)/)?.[1] || null;
  const exportedKey = id => `vinted2vitesell_exported_${id}`;
  const getExportedState = id => id ? GM_getValue(exportedKey(id), null) : null;
  const setExportedState = (id, url) => {
    if (id) GM_setValue(exportedKey(id), { date: new Date().toISOString(), url });
  };
  const clearExportedState = id => { if (id) GM_deleteValue(exportedKey(id)); };
  const formatDate = value => {
    try { return new Date(value).toLocaleDateString('fr-FR'); }
    catch (_) { return ''; }
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  let cachedItemId = null;
  let cachedItemPromise = null;

  function getItemApi() {
    const id = itemIdFromUrl();
    if (!id) return Promise.resolve(null);
    if (cachedItemId === id && cachedItemPromise) return cachedItemPromise;
    cachedItemId = id;
    cachedItemPromise = (async () => {
      try {
        const response = await fetch(`/api/v2/items/${id}`, {
          credentials: 'include',
          headers: { accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`API Vinted : HTTP ${response.status}`);
        const json = await response.json();
        return json?.item || null;
      } catch (error) {
        return null;
      }
    })();
    return cachedItemPromise;
  }

  function getTitle(item) {
    return String(item?.title || document.querySelector('h1')?.innerText || document.title.split('|')[0] || '').trim();
  }

  async function getDescription(item) {
    const fromApi = String(item?.description || '').trim();
    if (fromApi) return fromApi;
    const block = document.querySelector('[itemprop="description"],[data-testid="item-description"]');
    return String(block?.innerText || '').trim();
  }

  function getPriceRaw(item) {
    const apiPrice = item?.price?.amount ?? item?.price ?? null;
    if (apiPrice !== null && apiPrice !== undefined && String(apiPrice).trim() !== '') {
      const currency = item?.price?.currency_code || 'EUR';
      return `${String(apiPrice).replace('.', ',')} ${currency === 'EUR' ? '€' : currency}`;
    }
    const node = document.querySelector('[data-testid="item-price"]');
    return node?.innerText?.trim() || document.body.innerText.match(/\d+[.,]\d+\s*€/)?.[0] || '';
  }

  function cleanNumericPrice(raw) {
    const normalized = String(raw ?? '').replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, '');
    const amount = Number.parseFloat(normalized);
    if (!Number.isFinite(amount)) return '';
    return String(amount);
  }

  async function getPhotoUrls(item) {
    const apiPhotos = (item?.photos || [])
      .map(photo => photo?.full_size_url || photo?.url)
      .filter(Boolean);
    if (apiPhotos.length) return [...new Set(apiPhotos)].slice(0, MAX_PHOTOS);

    const selectors = [
      'img[data-testid^="item-photo-"]',
      '[data-testid^="item-photo-"] img',
      '[data-testid="item-photos"] img',
      '.item-photos img'
    ];
    for (const selector of selectors) {
      const urls = [...document.querySelectorAll(selector)]
        .map(img => img.currentSrc || img.src)
        .filter(url => url && /vinted\.net/i.test(url));
      if (urls.length) return [...new Set(urls)].slice(0, MAX_PHOTOS);
    }

    const first = document.querySelector('img[data-testid*="photo"]');
    const zone = first?.closest('section,aside,[class*="photo"],[class*="gallery"]') || document;
    return [...new Set([...zone.querySelectorAll('img[src*="vinted.net"]')]
      .map(img => img.currentSrc || img.src)
      .filter(url => url && !/avatar|25x25|50x50|\.svg(?:\?|$)/i.test(url)))].slice(0, MAX_PHOTOS);
  }

  function fetchPhotoAsDataUrl(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        timeout: 30000,
        onload(response) {
          try {
            if (response.status < 200 || response.status >= 300 || !response.response) return resolve(null);
            const typeHeader = response.responseHeaders?.match(/content-type:\s*([^;\r\n]+)/i)?.[1];
            const mime = typeHeader?.startsWith('image/') ? typeHeader : 'image/jpeg';
            const blob = new Blob([response.response], { type: mime });
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          } catch (error) {
            resolve(null);
          }
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }

  async function extractListing(status) {
    const id = itemIdFromUrl();
    const item = await getItemApi();
    const title = getTitle(item);
    const description = await getDescription(item);
    const priceRaw = getPriceRaw(item);
    const price = cleanNumericPrice(priceRaw);
    const photoUrls = await getPhotoUrls(item);
    const photosData = [];

    for (let i = 0; i < photoUrls.length; i++) {
      if (status) status.textContent = `Téléchargement photos : ${i + 1}/${photoUrls.length}…`;
      const dataUrl = await fetchPhotoAsDataUrl(photoUrls[i]);
      if (dataUrl) photosData.push(dataUrl);
    }

    return {
      itemId: id,
      sourceUrl: location.href,
      fullTitle: title,
      description,
      price: priceRaw,
      numericPrice: price,
      photoUrls,
      photosData,
      exportedAt: new Date().toISOString()
    };
  }

  function renderImageBadge(show) {
    const existing = document.getElementById('v2vs-img-badge');
    if (!show) { existing?.remove(); return; }
    if (existing) return;
    const image = document.querySelector('img[data-testid^="item-photo-1"]') ||
      document.querySelector('img[data-testid*="photo"]') ||
      document.querySelector('[data-testid="item-page-summary-plugin"] img');
    const container = image?.closest('div');
    if (!container) return;
    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    const badge = document.createElement('div');
    badge.id = 'v2vs-img-badge';
    badge.className = 'v2vs-img-badge';
    badge.textContent = '🚀 Vitesell ✓';
    container.appendChild(badge);
  }

  function findCard(link) {
    return link.closest('[data-testid*="grid-item"]') ||
      link.closest('[data-testid*="item-box"]') || link.closest('article') ||
      link.closest('div') || link;
  }

  async function scanGrid(root = document) {
    const links = root.querySelectorAll('a[href*="/items/"]');
    for (const link of links) {
      const id = itemIdFromUrl(link.href);
      if (!id) continue;
      const card = findCard(link);
      const hasBadge = !!card.querySelector('.v2vs-grid-badge');
      const exported = !!getExportedState(id);
      if (exported && !hasBadge) {
        if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
        const badge = document.createElement('span');
        badge.className = 'v2vs-grid-badge';
        badge.textContent = '🚀';
        card.appendChild(badge);
      } else if (!exported && hasBadge) {
        card.querySelectorAll('.v2vs-grid-badge').forEach(node => node.remove());
      }
    }
  }

  function renderExportedPanel(itemId, host) {
    const state = getExportedState(itemId) || { date: new Date().toISOString() };
    host.innerHTML = `
      <div style="font-weight:700">🚀 Vinted → Vitesell</div>
      <div style="background:#ede9fe;color:#5b21b6;padding:8px;border-radius:8px;font-weight:700;text-align:center">✓ Annonces & Photos prêtes</div>
      <div class="v2vs-muted">Export : ${escapeHtml(formatDate(state.date))}</div>
      <button type="button" id="v2vs-reexport" style="background:#7c3aed;color:#fff">↻ Re-télécharger les photos</button>
      <button type="button" id="v2vs-reset" style="background:#eee;color:#333">Réinitialiser</button>
      <a href="${VITESELL_URL}" target="_blank" rel="noopener" style="display:block;margin-top:8px;font-size:12px;color:#555;text-align:center">Ouvrir Vitesell</a>`;
    host.querySelector('#v2vs-reexport').onclick = () => prepareExport(itemId, host, true);
    host.querySelector('#v2vs-reset').onclick = () => {
      clearExportedState(itemId);
      renderImageBadge(false);
      renderReadyPanel(itemId, host);
      scanGrid();
    };
  }

  function renderReadyPanel(itemId, host) {
    host.innerHTML = `
      <div style="font-weight:700;margin-bottom:7px">🚀 Export Vinted → Vitesell</div>
      <div id="v2vs-preview" style="font-size:11px;background:#fff;padding:7px;border-radius:7px;max-height:100px;overflow:auto;white-space:pre-wrap">Chargement…</div>
      <div id="v2vs-status" class="v2vs-muted" style="margin:7px 0">Prêt</div>
      <button type="button" id="v2vs-export" style="background:#7c3aed;color:#fff">📥 Télécharger photos & Ouvrir Vitesell</button>`;
    host.querySelector('#v2vs-export').onclick = () => prepareExport(itemId, host, false);
    (async () => {
      const item = await getItemApi();
      const title = getTitle(item);
      const description = await getDescription(item);
      const raw = getPriceRaw(item);
      const preview = host.querySelector('#v2vs-preview');
      if (preview) preview.textContent = `${title}\n\nPrix : ${raw || 'inconnu'}`;
    })();
  }

  // Déclenche le téléchargement automatique des photos sur le PC
  function downloadPhotosToPC(photosData) {
    photosData.forEach((dataUrl, index) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `vitesell-photo-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  async function prepareExport(itemId, host, isReexport) {
    const button = host.querySelector('#v2vs-export') || host.querySelector('#v2vs-reexport');
    const status = host.querySelector('#v2vs-status') || host.querySelector('.v2vs-muted');
    if (button) { button.disabled = true; button.textContent = '⏳ Téléchargement…'; }
    try {
      const payload = await extractListing(status);
      if (!payload.fullTitle) throw new Error('Titre introuvable.');
      if (!payload.price) throw new Error('Prix introuvable.');
      if (!payload.photosData.length) throw new Error('Aucune photo récupérée.');

      // Téléchargement direct des photos sur le PC
      downloadPhotosToPC(payload.photosData);

      GM_setValue(EXPORT_KEY, payload);
      setExportedState(itemId, location.href);
      renderImageBadge(true);
      scanGrid();

      if (status) status.textContent = `✓ Photos téléchargées ! Ouverture de Vitesell…`;
      renderExportedPanel(itemId, host);
      GM_openInTab(VITESELL_URL, { active: true, insert: true, setParent: true });
    } catch (error) {
      if (status) status.textContent = `⚠️ ${error.message}`;
      if (button) { button.disabled = false; button.textContent = '📥 Réessayer'; }
    }
  }

  function initVinted() {
    if (!/\/items\/\d+/.test(location.href)) { scanGrid(); return; }
    const itemId = itemIdFromUrl();
    if (!itemId || !document.querySelector('h1')) return;
    let panel = document.getElementById('v2vs-panel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'v2vs-panel';
      panel.style.cssText = [
        'position:fixed', 'top:90px', 'right:18px',
        'width:min(380px, calc(100vw - 24px))',
        'max-height:calc(100vh - 110px)', 'overflow-y:auto',
        'display:block', 'z-index:2147483647', 'box-sizing:border-box',
        'background:#f3e8ff', 'color:#171717',
        'border:2px solid #7c3aed', 'padding:12px',
        'border-radius:12px', 'box-shadow:0 3px 16px #0004'
      ].join(';');
      document.body.appendChild(panel);
    }
    if (getExportedState(itemId)) {
      renderExportedPanel(itemId, panel);
      renderImageBadge(true);
    } else {
      renderReadyPanel(itemId, panel);
    }
  }

  // --- PANNEAU VITESELL : BOUTONS COPIER-COLLER PROPRES ---
  function initVitesell() {
    if (!location.pathname.includes('/publier')) return;
    const payload = GM_getValue(EXPORT_KEY, null);
    if (!payload || document.getElementById('v2vs-vitesell-panel')) return;

    const panel = document.createElement('aside');
    panel.id = 'v2vs-vitesell-panel';
    panel.style.cssText = 'position:fixed;right:12px;top:80px;z-index:9999999;background:#f3e8ff;border:2px solid #7c3aed;padding:12px;border-radius:12px;width:min(360px,calc(100vw - 24px));max-height:80vh;overflow:auto;box-shadow:0 6px 18px #0003';
    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
        <b style="flex:1">🚀 Copier Vinted → Vitesell</b>
        <button type="button" id="v2vs-vitesell-close" title="Fermer" style="width:auto;min-height:auto;padding:2px 7px;background:#fee2e2;color:#991b1b">×</button>
      </div>
      <div id="v2vs-vitesell-body">
        <div style="font-size:11px;margin-bottom:4px"><b>Titre :</b></div>
        <div style="font-size:12px;background:#fff;padding:6px;border-radius:6px;word-break:break-all">${escapeHtml(payload.fullTitle)}</div>
        <button type="button" class="v2vs-copy-btn" id="copy-title">📋 Copier le Titre</button>

        <div style="font-size:11px;margin:8px 0 4px 0"><b>Description :</b></div>
        <div style="font-size:11px;background:#fff;padding:6px;border-radius:6px;max-height:90px;overflow:auto;white-space:pre-wrap">${escapeHtml(payload.description || 'Aucune description.')}</div>
        <button type="button" class="v2vs-copy-btn" id="copy-desc">📋 Copier la Description</button>

        <div style="font-size:11px;margin:8px 0 4px 0"><b>Prix :</b> ${escapeHtml(payload.price || '—')}</div>
        <button type="button" class="v2vs-copy-btn" id="copy-price">📋 Copier le Prix (${payload.numericPrice || ''})</button>

        <div style="font-size:11px;margin-top:10px;color:#555;text-align:center">📸 ${payload.photosData?.length || 0} photo(s) téléchargées sur ton PC.</div>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelector('#copy-title').onclick = () => {
      navigator.clipboard.writeText(payload.fullTitle);
      alert('Titre copié !');
    };
    panel.querySelector('#copy-desc').onclick = () => {
      navigator.clipboard.writeText(payload.description || '');
      alert('Description copiée !');
    };
    panel.querySelector('#copy-price').onclick = () => {
      navigator.clipboard.writeText(payload.numericPrice || '');
      alert('Prix copié !');
    };
    panel.querySelector('#v2vs-vitesell-close').onclick = () => {
      panel.remove();
      GM_deleteValue(EXPORT_KEY);
    };
  }

  if (IS_VINTED) {
    const startVinted = () => {
      if (/\/items\/\d+/.test(location.href)) initVinted();
      scanGrid();
    };
    startVinted();
    let lastUrl = location.href;
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        cachedItemId = null;
        cachedItemPromise = null;
        setTimeout(startVinted, 700);
      }
    }, 700);
    const observer = new MutationObserver(() => {
      clearTimeout(window.__v2vsGridTimer);
      window.__v2vsGridTimer = setTimeout(() => {
        scanGrid();
        if (/\/items\/\d+/.test(location.href) && document.querySelector('h1') && !document.getElementById('v2vs-panel')) initVinted();
      }, 350);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (IS_VITESELL) {
    const startVitesell = () => initVitesell();
    startVitesell();
    let lastUrl = location.href;
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(startVitesell, 800);
      }
      if (location.pathname.includes('/publier') && !document.getElementById('v2vs-vitesell-panel')) startVitesell();
    }, 1000);
  }

})();
