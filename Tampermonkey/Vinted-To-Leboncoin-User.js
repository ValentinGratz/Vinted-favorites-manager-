// ==UserScript==
// @name         Vinted → Leboncoin - FIX URL
// @namespace    https://github.com/ValentinGratz/vinted2leboncoin
// @version      2.0.1
// @description  Fix redirection leboncoin
// @author       ValentinGratz
// @match        https://www.vinted.fr/*
// @match        https://www.vinted.com/*
// @match        https://www.leboncoin.fr/deposer-une-annonce*
// @match        https://www.leboncoin.fr/deposer/*
// @match        https://www.leboncoin.fr/cl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function() {
    const KEY = 'vinted_to_lbc_lastImport';
    
    function saveData(d){
        const s = JSON.stringify(d);
        GM_setValue('lastImport', s);
        localStorage.setItem(KEY, s); // fallback cross-domain
    }
    function loadData(){
        try {
            return JSON.parse(GM_getValue('lastImport', null) || localStorage.getItem(KEY) || "null");
        } catch(e){ return null; }
    }

    // VINTED
    if(location.hostname.includes('vinted')){
        function inject(){
            if(document.getElementById('vinted-to-lbc-btn')) return;
            if(!location.pathname.includes('/items/')) return;
            const h1 = document.querySelector('h1'); if(!h1) return;
            const btn = document.createElement('button');
            btn.id='vinted-to-lbc-btn';
            btn.textContent='⚡️ Importer sur Leboncoin';
            btn.style.cssText='background:#ff6e14;color:white;border:none;padding:14px;border-radius:12px;font-weight:900;width:100%;margin:12px 0;cursor:pointer;z-index:9999';
            btn.onclick=()=>{
                const title = document.querySelector('[data-testid="item-title"]')?.innerText || document.querySelector('h1')?.innerText || "";
                const desc = document.querySelector('[data-testid="item-description"]')?.innerText || "";
                const price = (document.querySelector('[data-testid="item-price"]')?.innerText || "").replace(/[^0-9.,]/g,'').replace(',','.');
                const imgs = [...new Set([...document.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('vinted') && s.includes('.jpg')))].slice(0,10);
                const data = {title, description:desc, price, images:imgs, url:location.href};
                saveData(data);
                window.open('https://www.leboncoin.fr/deposer-une-annonce','_blank');
            };
            h1.parentElement.insertBefore(btn, h1.nextSibling);
        }
        setInterval(inject, 2000);
    }

    // LEBONCOIN
    if(location.hostname.includes('leboncoin')){
        function reactSet(el, val){
            const tracker = el._valueTracker; const last = el.value;
            el.value = val; if(tracker) tracker.setValue(last);
            el.dispatchEvent(new Event('input',{bubbles:true}));
            el.dispatchEvent(new Event('change',{bubbles:true}));
        }
        function injectLBC(){
            if(document.getElementById('lbc-helper')) return;
            const data = loadData(); if(!data) return;
            console.log("[V>L] data trouvée", data);
            const div = document.createElement('div');
            div.id='lbc-helper';
            div.innerHTML = `<div style="position:fixed;top:80px;right:20px;z-index:999999;background:white;border:2px solid #ff6e14;border-radius:16px;padding:16px;width:360px">
                <b>${data.title}</b><br>${data.price}€ - ${data.images.length} photos
                <div id="status" style="background:#fff3e0;padding:6px;margin:8px 0;font-size:12px">Prêt</div>
                <button id="fill" style="width:100%;background:#ff6e14;color:white;padding:10px;border:none;border-radius:10px;font-weight:800;cursor:pointer">Remplir le formulaire</button>
                <button id="dl" style="width:100%;background:#111;color:white;padding:10px;border:none;border-radius:10px;margin-top:6px;cursor:pointer">Télécharger photos</button>
            </div>`;
            document.body.appendChild(div);
            document.getElementById('fill').onclick=()=>{
                const subj = document.querySelector('input[name="subject"], [data-qa-id="ad_subject"] input, input[id*="subject"]');
                const body = document.querySelector('textarea[name="body"], [data-qa-id="ad_body"] textarea, textarea');
                const price = document.querySelector('input[name="price"], input[type="number"]');
                if(subj) reactSet(subj, data.title);
                if(body) reactSet(body, data.description + "\n\nVinted: " + data.url);
                if(price && data.price) reactSet(price, data.price);
                document.getElementById('status').innerText='✅ Rempli';
            };
            document.getElementById('dl').onclick=()=> data.images.forEach((u,i)=> GM_download(u, `vinted-import/${i+1}.jpg`));
        }
        // observer obligatoire car LBC redirige
        new MutationObserver(()=> injectLBC()).observe(document.body, {childList:true, subtree:true});
        setTimeout(injectLBC, 2000);
        setInterval(injectLBC, 3000);
    }
})();
