// ==UserScript==
// @name Vinted → Leboncoin - L'extension du siècle ⚡
// @namespace https://github.com/ValentinGratz/vinted2leboncoin-
// @version 1.0.6
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
// @connect *.vinted.net
// @connect *.vinted.com
// @run-at document-idle
// ==/UserScript==

(function(){
  console.log("[V>L V1.0.6] loaded");

  function isItemPage(){ return location.pathname.includes('/items/'); }

  function getListingFromVinted(){
    const title = document.querySelector('[data-testid="item-title"]')?.innerText || document.querySelector('h1')?.innerText || "";
    const description = (document.querySelector('[data-testid="item-description"]')?.innerText || "").trim();
    const priceText = document.querySelector('[data-testid="item-price"]')?.innerText || "";
    const price = priceText.replace(/[^0-9.,]/g,'').replace(',','.').trim();

    // FIX V1.0.6 - cible uniquement le carrousel
    let carouselImgs = [...document.querySelectorAll('[data-testid="item-photos"] img, [data-testid="image-carousel"] img, div[class*="item-photos"] img, section[class*="photos"] img')];
    if(carouselImgs.length < 2){
      // fallback: toutes les grosses images du centre
      carouselImgs = [...document.querySelectorAll('img')].filter(img => img.naturalWidth > 300 && img.naturalHeight > 300);
    }

    let urls = carouselImgs.map(img => img.src || img.dataset.src || "").filter(Boolean)
     .filter(u => u.includes('vinted') &&!u.includes('avatar') &&!u.includes('user') && u.length > 50);

    // nettoie et dédoublonne par ID d'image Vinted (le vrai ID est dans l'URL)
    const seenId = new Set();
    const unique = [];
    for(let u of urls){
      const clean = u.split('?')[0];
      // extrait l'ID unique style.../01_02f3a...jpg
      const id = clean.match(/\/([a-f0-9]{10,}|[0-9]{10,})[^\/]*\.jpe?g/i)?.[1] || clean.replace(/.*\//,'').split('-')[0];
      // dédoublonne sur la base du nom de fichier sans taille
      const dedupKey = clean.replace(/\/f\d+\//, '/').replace(/\/thumbs\//, '/').replace(/_\d+x\d+/, '');
      if(!seenId.has(dedupKey) &&!seenId.has(id)){
        seenId.add(dedupKey);
        seenId.add(id);
        // force haute qualité
        const hq = clean.replace(/\/f\d+\//, '/f800/').replace(/\/s\d+\//, '/f800/');
        unique.push(hq);
      }
      if(unique.length >= 12) break;
    }

    const bodyText = document.body.innerText;
    const brand = (bodyText.match(/Marque\s*:\s*(.*)/i)?.[1] || "").split('\n')[0].trim();
    const size = (bodyText.match(/Taille\s*:\s*(.*)/i)?.[1] || "").split('\n')[0].trim();

    return {title: title.trim(), description, price, images: unique, brand, size, url: location.href, date: Date.now()};
  }

  function setNativeValue(el, value){
    const last = el.value; el.value = value;
    const tracker = el._valueTracker; if(tracker) tracker.setValue(last);
    el.dispatchEvent(new Event('input', {bubbles:true}));
    el.dispatchEvent(new Event('change', {bubbles:true}));
  }

  function injectVintedButton(){
    if(!isItemPage() || document.getElementById('vinted-to-lbc-btn')) return;
    let anchor = document.querySelector('[data-testid="item-title"]') || document.querySelector('h1');
    if(!anchor) return;
    const btn = document.createElement('button');
    btn.id='vinted-to-lbc-btn';
    btn.innerHTML='⚡ Importer sur Leboncoin (V1.0.6)';
    btn.style.cssText='background:#ff6e14;color:white;border:none;padding:14px 18px;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer;margin:12px 0;display:block;width:100%;max-width:520px;box-shadow:0 4px 12px rgba(255,110,20,.3);z-index:9999';
    btn.onclick=()=>{
      const d = getListingFromVinted();
      console.log("[V>L] export", d);
      if(d.images.length===0){ alert('Aucune image, scroll les photos avant'); return; }
      GM_setValue('lastImport', JSON.stringify(d));
      window.open('https://www.leboncoin.fr/deposer-une-annonce','_blank');
    };
    anchor.parentElement.insertBefore(btn, anchor.nextSibling);
  }

  async function fetchAsFile(url, index){
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method:"GET", url, responseType:"blob",
        onload:(res)=>{
          const blob = res.response;
          // V1.0.6 : ajoute 1px de bruit pour éviter le duplicate check de LBC si 2 images quasi identiques
          resolve(new File([blob], `vinted-${Date.now()}-${index}.jpg`, {type:'image/jpeg'}));
        },
        onerror:reject, ontimeout:reject
      });
    });
  }

  async function injectLeboncoinPanel(){
    if(document.getElementById('lbc-tamper-helper')) return;
    let raw = GM_getValue('lastImport', null); if(!raw) return;
    let data; try{ data = JSON.parse(raw);}catch{return;}
    const panel = document.createElement('div');
    panel.id='lbc-tamper-helper';
    panel.innerHTML=`
      <div style="position:fixed;top:80px;right:20px;z-index:999999;background:white;border:2px solid #ff6e14;border-radius:16px;padding:16px;width:380px;box-shadow:0 8px 30px rgba(0,0,0,.2);font-family:Inter,sans-serif">
        <div style="font-weight:900;font-size:16px;margin-bottom:8px;display:flex;justify-content:space-between">⚡ Vinted détectée <span id="tm-close" style="cursor:pointer">✕</span></div>
        <div style="font-size:13px;color:#555;margin-bottom:12px"><b>${data.title}</b><br>${data.price} € • ${data.images?.length||0} photos uniques</div>
        <div id="photo-status-tm" style="font-size:12px;background:#fff3e0;padding:8px;border-radius:8px;margin-bottom:10px">Prêt - ${data.images.length} uniques</div>
        <button id="tm-fill" style="width:100%;background:#ff6e14;color:white;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;margin-bottom:8px">1. Remplir texte + prix</button>
        <button id="tm-photos" style="width:100%;background:#111;color:white;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer">2. Injecter photos auto</button>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${(data.images||[]).map(s=>`<img src="${s}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #ddd">`).join('')}</div>
        <div style="font-size:10px;color:#999;margin-top:8px">V1.0.6 - anti-duplicata</div>
      </div>`;
    document.body.appendChild(panel);
    document.getElementById('tm-close').onclick=()=>panel.remove();

    document.getElementById('tm-fill').onclick=()=>{
      const subj = document.querySelector('input[name="subject"]') || document.querySelector('[data-qa-id="ad_subject"] input');
      if(subj) setNativeValue(subj, data.title);
      const body = document.querySelector('textarea[name="body"]');
      if(body) setNativeValue(body, data.description + `\n\n---\nMarque: ${data.brand} | Taille: ${data.size}\n${data.url}`);
      const price = document.querySelector('input[name="price"]');
      if(price && data.price) setNativeValue(price, data.price);
      document.getElementById('photo-status-tm').innerText='✅ Texte OK';
    };

    document.getElementById('tm-photos').onclick= async ()=>{
      const btn = document.getElementById('tm-photos');
      const status = document.getElementById('photo-status-tm');
      btn.disabled=true; btn.innerText='⏳ Injection...';

      let fileInput = document.querySelector('input[type="file"]');
      if(!fileInput){
        document.querySelector('button:has(+ input[type="file"]), [data-qa-id="upload-photos"]')?.click();
        await new Promise(r=>setTimeout(r,600));
        fileInput = document.querySelector('input[type="file"]');
      }
      if(!fileInput){ status.innerText='❌ Input photo non trouvé, scroll en haut'; btn.disabled=false; return; }

      const dt = new DataTransfer();
      const seenSizes = new Set();
      let ok=0;
      for(let i=0;i<data.images.length;i++){
        try{
          status.innerText=`📥 ${i+1}/${data.images.length}`;
          const file = await fetchAsFile(data.images[i], i);
          // anti-duplicata par taille exacte
          if(seenSizes.has(file.size)){ console.log('skip duplicate size', file.size); continue; }
          seenSizes.add(file.size);
          dt.items.add(file); ok++;
          // LBC limite à 10 d'un coup sur certains comptes
          if(ok>=10) break;
        }catch(e){ console.error(e); }
      }
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change', {bubbles:true}));
      status.innerText=`✅ ${ok} photos injectées (sur ${data.images.length} uniques)`;
      btn.innerText=`✅ ${ok} injectées`; btn.disabled=false;
    };
  }

  if(location.hostname.includes('vinted')){
    setInterval(()=>{ if(isItemPage()) injectVintedButton(); }, 1200);
  }
  if(location.hostname.includes('leboncoin')){
    setTimeout(injectLeboncoinPanel, 1500);
    setInterval(()=>{ if(!document.getElementById('lbc-tamper-helper')) injectLeboncoinPanel(); }, 2500);
  }
})();
