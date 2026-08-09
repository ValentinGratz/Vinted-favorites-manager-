// ==UserScript==
// @name         2 - Vinted Cleaner - Dressing Retrait Fav
// @namespace    https://github.com/ValentinGratz/Vinted-favorites-manager-
// @version      1.6.2
// @description  [DRESSING] Sur la page d'un vendeur, détecte les articles de ce dressing déjà dans tes favoris pour les retirer en masse.
// @author       ValentinGratz
// @match        https://www.vinted.fr/member/*
// @match        https://www.vinted.com/member/*
// @match        https://www.vinted.de/member/*
// @match        https://www.vinted.es/member/*
// @match        https://www.vinted.it/member/*
// @match        https://www.vinted.nl/member/*
// @match        https://www.vinted.pl/member/*
// @exclude      *favourite_list*
// @exclude      *favorite_list*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function() {
    'use strict';
    function addLauncher(){
        if(document.getElementById('vc-dressing-retrait')) return;
        if(location.href.includes('favourite')||location.href.includes('favorite')) return;
        if(!document.querySelector('[data-testid="grid-item"]')) return;
        const b=document.createElement('div'); b.id='vc-dressing-retrait'; b.textContent='💙 Scanner mes favs ici';
        b.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:14px 20px;border-radius:30px;z-index:999999;cursor:pointer;font-weight:bold;border:2px solid #0074de;box-shadow:0 4px 15px rgba(0,0,0,.4);font-family:sans-serif;';
        b.onclick=start; document.body.appendChild(b);
    }
    async function start(){
        const sleep=m=>new Promise(r=>setTimeout(r,m));
        const bar=document.createElement('div'); bar.style.cssText='position:fixed;top:0;left:0;width:100%;background:#0074de;color:white;padding:8px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:13px'; bar.textContent='⏳ Chargement complet du dressing...'; document.body.appendChild(bar);
        let last=0,no=0; for(let i=0;i<150&&no<6;i++){ window.scrollTo(0,document.body.scrollHeight); await sleep(1000); window.scrollTo(0,document.body.scrollHeight-800); await sleep(200); window.scrollTo(0,document.body.scrollHeight); await sleep(400); const h=document.body.scrollHeight; if(h===last) no++; else no=0; last=h; bar.textContent=`⏳ Chargement... ${i+1} scrolls`; }
        window.scrollTo(0,0); await sleep(800); bar.remove();
        const all=[...document.querySelectorAll('[data-testid="grid-item"]')];
        const favs=[];
        all.forEach(item=>{
            const btn=item.querySelector('button[data-testid="favourite-button"]')||item.querySelector('button[data-testid="favorite-button"]')||item.querySelector('button[data-testid="item-favourite-button"]')||item.querySelector('button[aria-label*="favoris"]');
            if(!btn) return;
            const label=(btn.getAttribute('aria-label')||'').toLowerCase(); const pressed=btn.getAttribute('aria-pressed');
            const isFav=label.includes('retirer')||label.includes('remove')||pressed==='true';
            if(isFav) favs.push({item,btn});
        });
        if(!favs.length){ alert(`✅ Aucun fav dans ce dressing sur ${all.length} articles scannés`); return; }
        favs.forEach(o=>{ o.item.style.outline='4px solid #0074de'; o.item.style.position='relative'; const b=document.createElement('div'); b.textContent='💙 DANS TES FAVS'; b.style.cssText='position:absolute;top:8px;left:8px;background:#0074de;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:50'; o.item.appendChild(b); });
        const panel=document.createElement('div'); panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:360px;border:2px solid #0074de;font-family:sans-serif;';
        panel.innerHTML=`<h3 style="margin:0 0 10px">💔 ${favs.length} favs ici <small style="color:#aaa;font-weight:normal">/ ${all.length} scannés</small></h3><div id="vl" style="max-height:300px;overflow-y:auto"></div><div style="display:flex;gap:6px;margin:10px 0"><button id="a" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px">✅ Tout</button><button id="n" style="flex:1;padding:8px;background:#555;color:white;border:none;border-radius:6px">❌ Aucun</button></div><button id="d" style="width:100%;padding:12px;background:#0074de;color:white;border:none;border-radius:8px;font-weight:bold">Retirer sélection</button><button id="c" style="width:100%;margin-top:8px;background:transparent;color:#888;border:none">Fermer</button>`;
        document.body.appendChild(panel);
        const list=panel.querySelector('#vl'); const checks=[];
        favs.forEach((o,i)=>{ const t=(o.item.querySelector('[data-testid*="description-title"]')?.textContent||`Article ${i+1}`).slice(0,35); const row=document.createElement('label'); row.style.cssText='display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #333;font-size:12px;cursor:pointer'; row.innerHTML=`<input type="checkbox" checked><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t}</span>`; list.appendChild(row); checks.push({cb:row.querySelector('input'),btn:o.btn,item:o.item}); });
        panel.querySelector('#a').onclick=()=>checks.forEach(c=>c.cb.checked=true);
        panel.querySelector('#n').onclick=()=>checks.forEach(c=>c.cb.checked=false);
        panel.querySelector('#c').onclick=()=>panel.remove();
        panel.querySelector('#d').onclick=async()=>{ const sel=checks.filter(c=>c.cb.checked); if(!sel.length) return; if(!confirm(`Retirer ${sel.length} favs ?`)) return; for(const s of sel){ s.item.style.opacity='0.3'; s.btn.click(); await sleep(700); } alert(`✅ ${sel.length} retirés`); location.reload(); };
    }
    if(document.readyState==='complete') addLauncher(); else window.addEventListener('load',addLauncher); setInterval(addLauncher,3000);
})();
