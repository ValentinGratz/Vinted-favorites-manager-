// ==UserScript==
// @name         Vinted → Leboncoin - V2.0.2 [FIX owner + URL]
// @namespace    https://github.com/ValentinGratz/vinted2leboncoin
// @version      2.0.2
// @description  Importe TES annonces Vinted vers Leboncoin - Fix bouton sur articles des autres + fix redirection
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
    'use strict';
    console.log("[V>L V2.0.2] loaded", location.href);
    const KEY = 'vinted_to_lbc_lastImport';

    function saveData(d){
        const s = JSON.stringify(d);
        GM_setValue('lastImport', s);
        localStorage.setItem(KEY, s);
    }
    function loadData(){
        try { return JSON.parse(GM_getValue('lastImport', null) || localStorage.getItem(KEY) || "null"); } catch(e){ return null; }
    }

    function isItemPage(){
        return (location.pathname.includes('/items/') || location.pathname.includes('/item/')) 
            && !!document.querySelector('h1')
            && !location.pathname.includes('/member/');
    }

    function isMyItem(){
        // Le plus fiable sur Vinted FR
        const hasEditLink = !!document.querySelector('a[href*="/edit"]');
        const hasEditBtn = !!document.querySelector('[data-testid="edit-item"]');
        const hasBoost = !!document.querySelector('[data-testid="item-bump"], [data-testid="bump-button"]');
        const hasDelete = document.body.innerText.includes("Supprimer l'article") || !!document.querySelector('[data-testid="delete-item"]');
        
        // Si bouton Acheter présent = pas à toi
        const hasBuy = !!document.querySelector('[data-testid="item-buy-button"], [data-testid="buy-button"], [data-testid="checkout-button"]');

        if(hasEditLink || hasEditBtn || hasBoost || hasDelete) return true;
        if(hasBuy) return false;
        return false; // par défaut on n'affiche pas
    }

    function getListing(){
        const title = document.querySelector('[data-testid="item-title"]')?.innerText || document.querySelector('h1')?.innerText || "";
        const desc = document.querySelector('[data-testid="item-description"]')?.innerText || "";
        const price = (document.querySelector('[data-testid="item-price"]')?.innerText || "").replace(/[^0-9.,]/g,'').replace(',','.');
        const imgs = [...new Set([...document.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('vinted') && s.includes('.jpg')))].slice(0,10);
        return {title: title.trim(), description: desc.trim(), price, images: imgs, url: location.href, date: Date.now()};
    }

    function injectVintedButton(){
        if(!isItemPage()){
            document.getElementById('vinted-to-lbc-btn')?.remove();
            return;
        }
        if(!isMyItem()){
            document.getElementById('vinted-to-lbc-btn')?.remove();
            return;
        }
        if(document.getElementById('vinted-to-lbc-btn')) return;

        const h1 = document.querySelector('h1'); if(!h1) return;
        const btn = document.createElement('button');
        btn.id='vinted-to-lbc-btn';
        btn.innerHTML='⚡️ Importer sur Leboncoin';
        btn.style.cssText='background:#ff6e14;color:white;border:none;padding:14px 18px;border-radius:12px;font-weight:900;font-size:14px;cursor:pointer;margin:12px 0;display:block;width:100%;box-shadow:0 4px 12px rgba(255,110,20,.3);z-index:9999';
        btn.onclick=()=>{
            const d = getListing();
            if(!d.title){ alert('Impossible de lire'); return; }
            saveData(d);
            GM_setClipboard(d.title + "\n\n" + d.description);
            window.open('https://www.leboncoin.fr/deposer-une-annonce','_blank');
        };
        h1.parentElement.insertBefore(btn, h1.nextSibling);
        console.log("[V>L] bouton injecté - c'est bien ton article");
    }

    // LEBONCOIN
    function reactSet(el, val){
        const last = el.value; el.value = val;
        if(el._valueTracker) el._valueTracker.setValue(last);
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
    }
    function injectLBC(){
        if(document.getElementById('lbc-helper')) return;
        const data = loadData(); if(!data) return;
        const div = document.createElement('div');
        div.id='lbc-helper';
        div.innerHTML=`<div style="position:fixed;top:80px;right:20px;z-index:999999;background:white;border:2px solid #ff6e14;border-radius:16px;padding:16px;width:360px;box-shadow:0 8px 30px rgba(0,0,0,.2);font-family:sans-serif">
            <div style="font-weight:900">⚡️ Vinted détecté</div>
            <div style="font-size:13px;margin:8px 0"><b>${data.title}</b><br>${data.price}€ - ${data.images.length} photos</div>
            <div id="status" style="background:#fff3e0;padding:6px;border-radius:6px;font-size:12px;margin-bottom:8px">Prêt</div>
            <button id="fill" style="width:100%;background:#ff6e14;color:white;border:none;padding:10px;border-radius:10px;font-weight:800;cursor:pointer">Remplir titre + desc + prix</button>
            <button id="dl" style="width:100%;background:#111;color:white;border:none;padding:10px;border-radius:10px;margin-top:6px;cursor:pointer">Télécharger photos</button>
        </div>`;
        document.body.appendChild(div);
        document.getElementById('fill').onclick=()=>{
            const subj = document.querySelector('input[name="subject"], [data-qa-id="ad_subject"] input, input[id*="subject"]');
            const body = document.querySelector('textarea[name="body"], [data-qa-id="ad_body"] textarea, textarea');
            const price = document.querySelector('input[name="price"], input[type="number"]');
            if(subj) reactSet(subj, data.title);
            if(body) reactSet(body, data.description + "\n\nVinted: " + data.url);
            if(price) reactSet(price, data.price);
            document.getElementById('status').innerText='✅ Rempli';
        };
        document.getElementById('dl').onclick=()=> data.images.forEach((u,i)=> GM_download(u, `vinted-import/${i+1}.jpg`));
    }

    if(location.hostname.includes('vinted')){
        new MutationObserver(injectVintedButton).observe(document.body, {childList:true, subtree:true});
        setTimeout(injectVintedButton, 1500);
        setInterval(injectVintedButton, 2000);
    }
    if(location.hostname.includes('leboncoin')){
        new MutationObserver(injectLBC).observe(document.body, {childList:true, subtree:true});
        setTimeout(injectLBC, 2000);
        setInterval(injectLBC, 3000);
    }
})();
