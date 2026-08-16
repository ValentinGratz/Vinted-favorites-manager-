// ==UserScript==
// @name         Vinted → Leboncoin - L'extension du siècle ⚡️ [FIX dressing]
// @namespace    https://github.com/ValentinGratz/vinted2leboncoin-
// @version      1.1.0
// @description  Copie tes annonces Vinted vers Leboncoin en 1 clic. Fix: bouton seulement sur page annonce.
// @author       ValentinGratz
// @match        https://www.vinted.fr/*
// @match        https://www.vinted.com/*
// @match        https://www.leboncoin.fr/deposer-une-annonce*
// @match        https://www.leboncoin.fr/cl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function(){
console.log("[V>L Tampermonkey FIX] loaded", location.href);

function isItemPage(){
  const isItemUrl = location.pathname.includes('/items/') || location.pathname.includes('/item/');
  const hasTitle = !!document.querySelector('[data-testid="item-title"], h1[data-testid="item-title"]');
  const isMemberPage = location.pathname.includes('/member/') || location.pathname.includes('/members/') || location.pathname.includes('/wardrobe');
  return isItemUrl && hasTitle && !isMemberPage;
}

function getListingFromVinted(){
  const title = document.querySelector('h1')?.innerText || document.querySelector('[data-testid="item-title"]')?.innerText || document.title.split('-')[0];
  const descEl = document.querySelector('[data-testid="item-description"]') || document.querySelector('[itemprop="description"]');
  const description = descEl?.innerText || "";
  const priceText = document.querySelector('[data-testid="item-price"]')?.innerText || document.body.innerHTML.match(/([0-9]+[.,]?[0-9]*)\s*€/)?.[0] || "";
  const price = priceText.replace(/[^0-9.,]/g,'').replace(',','.').trim();
  const imgs = [...document.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('vinted') && s.includes('.jpg')).slice(0,8);
  const uniqueImgs = [...new Set(imgs)];
  const bodyText = document.body.innerText;
  const brand = (bodyText.match(/Marque\s*:\s*(.*)/i)?.[1] || "").split('\n')[0];
  const size = (bodyText.match(/Taille\s*:\s*(.*)/i)?.[1] || "").split('\n')[0];
  return {title: title?.trim(), description: description.trim(), price, images: uniqueImgs, brand, size, url: location.href, date: Date.now()};
}

function injectVintedButton(){
  if(!isItemPage()){
    document.getElementById('vinted-to-lbc-btn')?.remove();
    return;
  }
  if(document.getElementById('vinted-to-lbc-btn')) return;
  const h1 = document.querySelector('h1');
  if(!h1) return;
  const btn = document.createElement('button');
  btn.id='vinted-to-lbc-btn';
  btn.innerHTML='⚡️ Importer sur Leboncoin (Tampermonkey)';
  btn.style.cssText='background:#ff6e14;color:white;border:none;padding:14px 18px;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer;margin:12px 0;display:block;width:100%;box-shadow:0 4px 12px rgba(255,110,20,.3);z-index:9999';
  btn.onclick=()=>{
    const d = getListingFromVinted();
    GM_setValue('lastImport', JSON.stringify(d));
    let listings = [];
    try{ listings = JSON.parse(GM_getValue('listings','[]')); }catch(e){}
    listings.unshift(d);
    GM_setValue('listings', JSON.stringify(listings.slice(0,50)));
    GM_setClipboard(d.title + "\n\n" + d.description);
    alert('✅ Annonce copiee ! Ouverture de Leboncoin...');
    window.open('https://www.leboncoin.fr/deposer-une-annonce','_blank');
  };
  h1.parentElement.insertBefore(btn, h1.nextSibling);
  console.log("[V>L] bouton injecte FIX");
}

async function injectLeboncoinPanel(){
  if(document.getElementById('lbc-tamper-helper')) return;
  let raw = GM_getValue('lastImport', null);
  if(!raw) return;
  let data;
  try{ data = JSON.parse(raw); }catch(e){ return; }
  if(!data) return;
  const panel = document.createElement('div');
  panel.id='lbc-tamper-helper';
  panel.innerHTML=`<div style="position:fixed;top:80px;right:20px;z-index:999999;background:white;border:2px solid #ff6e14;border-radius:16px;padding:16px;width:360px;box-shadow:0 8px 30px rgba(0,0,0,.2);font-family:Inter,sans-serif"><div style="font-weight:900;font-size:16px;margin-bottom:8px">⚡️ Tampermonkey - Vinted detectee</div><div style="font-size:13px;color:#555;margin-bottom:12px"><b>${data.title}</b><br>${data.price} EUR • ${data.images?.length||0} photos</div><div id="photo-status-tm" style="font-size:12px;background:#fff3e0;padding:8px;border-radius:8px;margin-bottom:10px">Pret a remplir</div><button id="tm-fill" style="width:100%;background:#ff6e14;color:white;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;margin-bottom:8px">1. Remplir texte + prix</button><button id="tm-photos" style="width:100%;background:#111;color:white;border:none;padding:12px;border-radius:10px;font-weight:800;cursor:pointer">2. Telecharger photos</button><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${(data.images||[]).map(s=>`<img src="${s}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:2px solid #ff6e14">`).join('')}</div></div>`;
  document.body.appendChild(panel);
  document.getElementById('tm-fill').onclick=()=>{
    const subject = document.querySelector('input[name="subject"]') || document.querySelector('input[data-qa-id="ad_subject"]');
    if(subject){ subject.focus(); subject.value=data.title; subject.dispatchEvent(new Event('input',{bubbles:true})); }
    const body = document.querySelector('textarea[name="body"]') || document.querySelector('textarea[data-qa-id="ad_body"]');
    if(body){ body.focus(); body.value = data.description + "\n\n---\nMarque: "+data.brand+" | Taille: "+data.size+"\nVinted: "+data.url; body.dispatchEvent(new Event('input',{bubbles:true})); }
    const price = document.querySelector('input[name="price"]');
    if(price && data.price){ price.focus(); price.value=data.price; price.dispatchEvent(new Event('input',{bubbles:true})); }
    document.getElementById('photo-status-tm').innerText='✅ Texte rempli !';
  };
  document.getElementById('tm-photos').onclick=()=>{
    (data.images||[]).forEach((url,i)=>{ GM_download({url, name: `vinted-import/vinted-${i+1}.jpg`}); });
    document.getElementById('photo-status-tm').innerText='📥 Photos en telechargement dans Telechargements/vinted-import/';
  };
}

if(location.hostname.includes('vinted')){
  setInterval(()=>{ if(document.querySelector('h1')) injectVintedButton(); }, 2000);
  setTimeout(injectVintedButton, 1500);
}
if(location.hostname.includes('leboncoin')){
  setTimeout(injectLeboncoinPanel, 2000);
  setInterval(()=>{ if(!document.getElementById('lbc-tamper-helper')) injectLeboncoinPanel(); }, 3000);
}
})();
