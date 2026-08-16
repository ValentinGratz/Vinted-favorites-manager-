// ==UserScript==
// @name Vinted → Leboncoin - L'extension du siècle ⚡
// @namespace https://github.com/ValentinGratz/vinted2leboncoin-
// @version 1.0.9
// @description Copie Vinted vers Leboncoin - fix crash base64
// @author ValentinGratz
// @match https://www.vinted.fr/items/*
// @match https://www.vinted.com/items/*
// @match https://www.leboncoin.fr/deposer-une-annonce*
// @match https://www.leboncoin.fr/cl/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_setClipboard
// @connect images.vinted.net
// @connect *.vinted.net
// @run-at document-idle
// ==/UserScript==

(function(){
  const VERSION = "1.0.9";
  console.log(`[V>L ${VERSION}]`);

  function isItemPage(){ return location.pathname.includes('/items/'); }

  function getVintedUrls(){
    let imgs = [...document.querySelectorAll('[data-testid="item-photos"] img, [data-testid="item-photo"] img')];
    if(imgs.length<1) imgs = [...document.querySelectorAll('img')].filter(i=>i.src.includes('vinted.net') && i.width>300);
    let urls = [...new Set(imgs.map(i=>i.src.split('?')[0]))].filter(u=>u.includes('vinted') &&!u.includes('avatar'));
    const seen=new Set(); const out=[];
    for(let u of urls){
      const k=u.replace(/\/f\d+\//,'/f800/'); if(!seen.has(k)){seen.add(k); out.push(k);} if(out.length>=8) break;
    }
    return out;
  }

  function blobToDataUrl(blob){ return new Promise(r=>{ const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(blob); }); }

  function compressImage(blob, maxSize, quality){
    return new Promise((resolve)=>{
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload=()=>{
        let w=img.width, h=img.height;
        if(w>maxSize || h>maxSize){
          const ratio = Math.min(maxSize/w, maxSize/h);
          w=Math.round(w*ratio); h=Math.round(h*ratio);
        }
        const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
        const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0,w,h);
        URL.revokeObjectURL(url);
        canvas.toBlob(b=>resolve(b), 'image/jpeg', quality);
      };
      img.onerror=()=>{ URL.revokeObjectURL(url); resolve(blob); };
      img.src=url;
    });
  }

  async function fetchAndCompress(url){
    const blob = await new Promise((res, rej)=>{
      GM_xmlhttpRequest({method:"GET", url, responseType:"blob", onload:r=>res(r.response), onerror:rej, ontimeout:()=>rej('timeout')});
    });
    const full = await compressImage(blob, 1200, 0.8); // 1200px pour LBC
    const thumb = await compressImage(blob, 120, 0.6); // 120px pour le panel
    const fullData = await blobToDataUrl(full);
    const thumbData = await blobToDataUrl(thumb);
    return {fullData, thumbData, size:full.size};
  }

  function injectVintedButton(){
    if(!isItemPage() || document.getElementById('vinted-to-lbc-btn')) return;
    const anchor=document.querySelector('[data-testid="item-title"]')||document.querySelector('h1'); if(!anchor) return;
    const btn=document.createElement('button');
    btn.id='vinted-to-lbc-btn'; btn.textContent=`⚡ Importer sur Leboncoin (${VERSION})`;
    btn.style.cssText='background:#ff6e14;color:white;border:none;padding:14px 18px;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer;margin:12px 0;display:block;width:100%;max-width:520px;';
    btn.onclick=async()=>{
      const urls=getVintedUrls();
      if(!urls.length){ alert('Scroll les photos avant'); return; }
      btn.disabled=true;
      const cache=[];
      for(let i=0;i<urls.length;i++){
        btn.textContent=`⏳ ${i+1}/${urls.length} compression...`;
        try{
          const c=await fetchAndCompress(urls[i]);
          cache.push({fullData:c.fullData, thumbData:c.thumbData, size:c.size, name:`vinted-${i}.jpg`});
        }catch(e){ console.error(e); }
      }
      const data={
        title:(document.querySelector('[data-testid="item-title"]')?.innerText||document.querySelector('h1')?.innerText||"").trim(),
        description:(document.querySelector('[data-testid="item-description"]')?.innerText||"").trim(),
        price:(document.querySelector('[data-testid="item-price"]')?.innerText||"").replace(/[^0-9.,]/g,'').replace(',','.').trim(),
        brand:(document.body.innerText.match(/Marque\s*:\s*(.*)/i)?.[1]||"").split('\n')[0].trim(),
        size:(document.body.innerText.match(/Taille\s*:\s*(.*)/i)?.[1]||"").split('\n')[0].trim(),
        url:location.href,
        cachedImages:cache
      };
      GM_setValue('lastImport', JSON.stringify(data));
      btn.textContent=`✅ ${cache.length} photos prêtes`;
      window.open('https://www.leboncoin.fr/deposer-une-annonce','_blank');
      setTimeout(()=>{btn.disabled=false; btn.textContent=`⚡ Importer sur Leboncoin (${VERSION})`},1500);
    };
    anchor.parentElement.insertBefore(btn, anchor.nextSibling);
  }

  function setNativeValue(el, v){ const last=el.value; el.value=v; const t=el._valueTracker; if(t) t.setValue(last); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); }
  function dataUrlToFile(dataUrl, name){ const a=dataUrl.split(','), m=a[0].match(/:(.*?);/)[1]; const b=atob(a[1]); const u=new Uint8Array(b.length); for(let i=0;i<b.length;i++) u[i]=b.charCodeAt(i); return new File([u], name, {type:m}); }

  function injectLeboncoinPanel(){
    if(document.getElementById('lbc-tamper-helper')) return;
    let raw=GM_getValue('lastImport',null); if(!raw) return; let data; try{data=JSON.parse(raw);}catch{return;}
    if(!data.cachedImages?.length) return;

    const div=document.createElement('div'); div.id='lbc-tamper-helper';
    // IMPORTANT: on n'injecte PAS les grosses dataURL dans l'HTML, seulement les thumb 120px
    const thumbsHtml = data.cachedImages.map(c=>`<img src="${c.thumbData}" style="width:52px;height:52px;object-fit:cover;border-radius:6px;border:1px solid #ddd">`).join('');
