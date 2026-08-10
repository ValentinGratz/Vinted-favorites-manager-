// ==UserScript==
// @name         3 - Vinted Dressing Auto Fav
// @namespace    https://github.com/ValentinGratz/Vinted-favorites-manager-
// @version      1.6.4-fixed-edge
// @description  [DRESSING] Met en favori automatiquement les articles d'un dressing (mode humain avec délais aléatoires anti-détection).
// @author       ValentinGratz
// @match        https://www.vinted.fr/*
// @include      https://www.vinted.fr/*
// @match        https://www.vinted.com/*
// @include      https://www.vinted.com/*
// @match        https://*.vinted.de/*
// @match        https://*.vinted.es/*
// @match        https://*.vinted.it/*
// @exclude      *favourite_list*
// @exclude      *favorite_list*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function() {
    'use strict';
    function addLauncher(){
        if(document.getElementById('vc-auto-fav')) return;
        if(location.href.includes('favourite')||location.href.includes('favorite')) return;
        if(!document.querySelector('[data-testid="grid-item"]')) return;
        const b=document.createElement('div'); b.id='vc-auto-fav'; b.textContent='⭐ Auto Fav ce dressing';
        b.style.cssText='position:fixed;bottom:70px;right:20px;background:#1e1e1e;color:white;padding:14px 20px;border-radius:30px;z-index:999999;cursor:pointer;font-weight:bold;border:2px solid #FFB800;box-shadow:0 4px 15px rgba(0,0,0,.4);font-family:sans-serif;';
        b.onclick=start; document.body.appendChild(b);
    }
    async function start(){
        const sleep=m=>new Promise(r=>setTimeout(r,m));
        const randomDelay=()=> 1500 + Math.random()*2500;
        const bar=document.createElement('div');
        bar.style.cssText='position:fixed;top:0;left:0;width:100%;background:#FFB800;color:black;padding:8px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:13px;font-weight:bold';
        bar.textContent='⏳ Chargement complet du dressing avant auto-fav...'; document.body.appendChild(bar);
        let last=0,no=0; for(let i=0;i<150&&no<6;i++){ window.scrollTo(0,document.body.scrollHeight); await sleep(1000); const h=document.body.scrollHeight; if(h===last) no++; else no=0; last=h; bar.textContent=`⏳ Chargement... ${i+1} scrolls - ${document.querySelectorAll('[data-testid="grid-item"]').length} articles`; }
        window.scrollTo(0,0); await sleep(800); bar.remove();
        const all=[...document.querySelectorAll('[data-testid="grid-item"]')];
        const toFav=[];
        all.forEach(item=>{
            const btn=item.querySelector('button[data-testid="favourite-button"]')||item.querySelector('button[data-testid="favorite-button"]')||item.querySelector('button[data-testid="item-favourite-button"]')||item.querySelector('button[aria-label*="favoris"]');
            if(!btn) return;
            const label=(btn.getAttribute('aria-label')||'').toLowerCase();
            const isNotFav = label.includes('ajouter') || label.includes('add') || label.includes('hinzufügen');
            if(isNotFav) toFav.push({item, btn});
        });
        if(!toFav.length){ alert(`✅ Tous les ${all.length} articles sont déjà favs !`); return; }
        if(!confirm(`⭐ Tu vas fav ${toFav.length} articles (limité à 40 par sécurité anti-ban).\n\nDélai aléatoire 1.5-4s entre chaque fav pour rester indétectable.\n\nContinuer ?`)) return;
        const panel=document.createElement('div');
        panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:380px;border:2px solid #FFB800;font-family:sans-serif;';
        panel.innerHTML=`<h3 style="margin:0 0 10px">⭐ Auto Fav en cours...</h3><div style="background:#333;height:10px;border-radius:5px;overflow:hidden;margin-bottom:10px"><div id="prog" style="height:100%;width:0%;background:#FFB800;transition:width .3s"></div></div><p id="status" style="font-size:13px;color:#aaa;margin:0">0 / ${Math.min(toFav.length,40)}</p><button id="stop" style="width:100%;margin-top:12px;padding:10px;background:#ff4444;color:white;border:none;border-radius:6px;font-weight:bold">⏹️ Stop</button>`;
        document.body.appendChild(panel);
        let stopped=false; panel.querySelector('#stop').onclick=()=>{ stopped=true; panel.querySelector('#status').textContent='⏹️ Arrêt demandé...'; };
        let count=0;
        const limit=Math.min(toFav.length, 40);
        for(let i=0;i<limit;i++){ if(stopped) break; const o=toFav[i]; o.item.scrollIntoView({behavior:'smooth', block:'center'}); await sleep(400); o.item.style.outline='4px solid #FFB800'; o.btn.click(); count++; panel.querySelector('#status').textContent=`${count} / ${limit} - Prochain dans...`; panel.querySelector('#prog').style.width=`${(count/limit)*100}%`; const badge=document.createElement('div'); badge.textContent='⭐ FAV'; badge.style.cssText='position:absolute;top:8px;left:8px;background:#FFB800;color:black;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:50'; o.item.style.position='relative'; o.item.appendChild(badge); await sleep(randomDelay()); }
        panel.innerHTML=`<h3 style="margin:0 0 10px">✅ Terminé ! ${count} articles favs</h3><p style="font-size:13px;color:#aaa">Pour rester safe, attends 10min avant de relancer sur un autre dressing.</p><button id="close" style="width:100%;margin-top:12px;padding:10px;background:#4CAF50;color:white;border:none;border-radius:6px;font-weight:bold">Fermer</button>`;
        panel.querySelector('#close').onclick=()=>panel.remove();
    }
    if(document.readyState==='complete') addLauncher(); else window.addEventListener('load',addLauncher);
    setInterval(addLauncher,3000);
    let lastUrl = location.href;
    setInterval(()=>{ if(location.href!==lastUrl){ lastUrl=location.href; setTimeout(addLauncher,1000); } },1000);
})();
