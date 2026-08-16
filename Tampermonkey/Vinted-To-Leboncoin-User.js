// ==UserScript==
// @name Vinted → Leboncoin - L'extension du siècle ⚡
// @namespace https://github.com/ValentinGratz/vinted2leboncoin-
// @version 1.0.5
// @description Copie tes annonces Vinted vers Leboncoin en 1 clic. Fini Flowdino.
// @author ValentinGratz
// @match https://www.vinted.fr/*
// @match https://www.vinted.com/*
// @match https://www.vinted.de/*
// @match https://www.leboncoin.fr/deposer-une-annonce*
// @match https://www.leboncoin.fr/cl/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @connect images.vinted.net
// @connect images1.vinted.net
// @connect images2.vinted.net
// @connect *.vinted.net
// @connect *.vinted.com
// @run-at document-idle
// ==/UserScript==

(function(){
  console.log("[V>L TM V1.0.5] loaded", location.href);

  function isItemPage(){
    return location.pathname.includes('/items/');
  }

  function getListingFromVinted(){
    const title = document.querySelector('[data-testid="item-title"]')?.innerText || document.querySelector('h1')?.innerText || document.title.split('-')[0] || "";
    const descEl = document.querySelector('[data-testid="item-description"]') || document.querySelector('[itemprop="description"]');
    const description = descEl?.innerText || "";
    const priceText = document.querySelector('[data-testid="item-price"]')?.innerText || (document.body.innerHTML.match(/([0-9]+[.,]?[0-9]*)\s*€/)||[])[0] || "";
    const price = priceText.replace(/[^0-9.,]/g,'').replace(',','.').trim();

    // FIX IMAGES - beaucoup plus robuste
    const rawImgs = [...document.querySelectorAll('img')]
     .map(img => img.src || img.dataset.src || img.getAttribute('data-src') || (img.srcset? img.srcset.split(' ')[0] : ''))
     .filter(Boolean);

    const imgs = rawImgs.filter(s =>
      (s.includes('vinted') || s.includes('vinted.net')) &&
     !s.includes('avatar') &&!s.includes('logo') &&!s.includes('user') &&
     !s.includes('30x30') &&!s.includes('50x50')
    );

    // garde la haute résolution (enleve /thumbs ou _small)
    const cleaned = imgs.map(u => u.split('?')[0].replace(/\/thumbs\/.*/, '').replace(/\/small\//, '/')).slice(0,12);
    const uniqueImgs = [...new Set(cleaned)];

    const bodyText = document.body.innerText;
    const brand = (bodyText.match(/Marque\s*:\s*(.*)/i)?.[1] || "").split('\n')[0].trim();
    const size = (bodyText.match(/Taille\s*:\s*(.*)/i)?.[1] || "").split('\n')[0].trim();

    return {title: title.trim(), description: description.trim(), price, images: uniqueImgs, brand, size, url: location.href, date: Date.now()};
  }

  function setNativeValue(el, value){
    const lastValue = el.value;
    el.value = value;
    const event = new Event('input', { bubbles: true });
    const tracker = el._valueTracker;
    if (tracker) tracker.setValue(lastValue);
    el.dispatchEvent(event);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function injectVintedButton(){
    if(!isItemPage()) return;
    if(document.getElementById('vinted-to-lbc-btn')) return;
    let anchor = document.querySelector('[data-testid="item-title"]') || document.querySelector('h1');
    if(!anchor) return;

    const btn = document.createElement('button');
    btn.id='vinted-to-lbc-btn';
    btn.innerHTML='⚡ Importer sur Leboncoin (V1.0.5)';
    btn.style.cssText='background:#ff6e14;color:white;border:none;padding:14px 18px;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer;margin:12px 0;display:block;width:100%;max-width:520px;box-shadow:0 4px 12px rgba(255,110,20,.3);z-index:9999;position:relative';
    btn.onclick=()=>{
      const d = getListingFromVinted();
      if(!d.images.length) alert('⚠️ Aucune image trouvée, essaye de scroller les photos avant');
      GM_setValue('lastImport', JSON.stringify(d));
      GM_setClipboard(d.title + "\n\n" + d.description);
      window.open('https://www.leboncoin.fr/deposer-une-annonce','_blank');
    };
    anchor.parentElement.insertBefore(btn, anchor.nextSibling);
    console.log("[V>L] bouton injecte", getListingFromVinted());
  }

  async function fetchAsFile(url, index){
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        headers: { "Referer": "https://www.vinted.fr/" },
        onload: (res) => {
          try{
            const blob = res.response;
            const file = new File([blob], `vinted-${index+1}.jpg`, { type: blob.type || 'image/jpeg' });
            resolve(file);
          }catch(e){ reject(e); }
        },
        onerror: reject,
        ontimeout: reject
      });
    });
  }

  async function injectLeboncoinPanel(){
    if(document.getElementById('lbc-tamper-helper')) return;
    let raw = GM_getValue('lastImport', null);
    if(!raw) return;
    let data;
    try{ data = JSON.parse(raw); }catch(e){ return; }
    if(!data ||!data.title) return;

    const panel = document.createElement('div');
    panel.id='lbc-tamper-helper';
    panel.innerHTML=`
      <div style="position:fixed;top:80px;right:20px;z-index:999999;background:white;border:2px solid #ff6e14;border-radius:16px;padding:16px;width:380px;box-shadow:0 8px 30px rgba(0,0,0,.2);font-family:Inter,sans-serif">
        <div style="font-weight:900;font-size:16px;margin-bottom:8px;display:flex;justify-content:space-between">⚡ Vinted détectée <span id="tm-close" style="cursor:pointer">✕</span></div>
        <div style="font-size:13px;color:#555;margin-bottom:12px;line-height:1.3"><b>${data.title}</b><br>${data.price} € • ${data.images?.length||0} photos • ${data.brand} ${data.size}</div>
        <div id="photo-status-tm" style="font-size:12px;background:#fff3e0;padding:8px;border-radius:8px;margin-bottom:10px;word-break:break-word">Prêt</div>
        <button id="tm-fill" style="width:100%;background:#ff6e14;color:white;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;margin-bottom:8px">1. Remplir texte + prix</button>
        <button id="tm-photos" style="width:100%;background:#111;color:white;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer">2. Injecter photos auto</button>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${(data.images||[]).map((s)=>`<img src="${s}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #ff6e14">`).join('')}</div>
        <div style="font-size:10px;color:#999;margin-top:8px">V1.0.5 - injection directe</div>
      </div>`;
    document.body.appendChild(panel);
    document.getElementById('tm-close').onclick = () => panel.remove();

    document.getElementById('tm-fill').onclick=()=>{
      const subject = document.querySelector('input[name="subject"]') || document.querySelector('[data-qa-id="ad_subject"] input') || document.querySelector('input[placeholder*="titre" i]');
      if(subject) setNativeValue(subject, data.title);

      const body = document.querySelector('textarea[name="body"]') || document.querySelector('[data-qa-id="ad_body"] textarea') || document.querySelector('textarea');
      if(body) setNativeValue(body, data.description + "\n\n---\nMarque: "+data.brand+" | Taille: "+data.size+"\nOrigine: "+data.url);

      const price = document.querySelector('input[name="price"]') || document.querySelector('input[type="number"]');
      if(price && data.price) setNativeValue(price, data.price);

      document.getElementById('photo-status-tm').innerText='✅ Texte rempli! Clique sur injecter photos';
    };

    document.getElementById('tm-photos').onclick= async ()=>{
      const btn = document.getElementById('tm-photos');
      const status = document.getElementById('photo-status-tm');
      btn.disabled = true;
      btn.innerText = '⏳ Injection...';

      // Cherche tous les inputs file de leboncoin
      let fileInput = document.querySelector('input[type="file"]');
      // parfois caché dans un div upload
      if(!fileInput){
        // clique sur la zone pour le faire apparaître
        document.querySelector('[data-qa-id="upload-photos"]')?.click();
        await new Promise(r=>setTimeout(r,500));
        fileInput = document.querySelector('input[type="file"]');
      }

      if(!fileInput){
        status.innerText = '❌ Input fichier Leboncoin introuvable. Scrolle jusqu\'aux photos';
        btn.disabled = false;
        return;
      }

      const dt = new DataTransfer();
      let ok = 0;
      for(let i=0;i<data.images.length;i++){
        try{
          status.innerText = `📥 ${i+1}/${data.images.length} - ${data.images[i].slice(0,40)}...`;
          const file = await fetchAsFile(data.images[i], i);
          dt.items.add(file);
          ok++;
        }catch(e){
          console.error('img fail', e);
        }
      }

      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change', {bubbles:true}));
      fileInput.dispatchEvent(new Event('input', {bubbles:true}));

      status.innerText = `✅ ${ok}/${data.images.length} photos injectées dans Leboncoin!`;
      btn.innerText = `✅ ${ok} photos injectées`;
      setTimeout(()=>{btn.disabled=false; btn.innerText='2. Re-injecter photos'}, 2000);
    };
  }

  if(location.hostname.includes('vinted')){
    setInterval(()=>{ if(isItemPage()) injectVintedButton(); }, 1200);
    setTimeout(injectVintedButton, 800);
  }
  if(location.hostname.includes('leboncoin')){
    setTimeout(injectLeboncoinPanel, 1500);
    setInterval(()=>{ if(!document.getElementById('lbc-tamper-helper')) injectLeboncoinPanel(); }, 2500);
  }
})();
