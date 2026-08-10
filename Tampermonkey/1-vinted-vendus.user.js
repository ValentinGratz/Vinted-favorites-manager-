// ==UserScript==
// @name         1 - Vinted Cleaner - Vendus
// @namespace    https://github.com/ValentinGratz/Vinted-favorites-manager-
// @version      1.6.3-fixed
// @description  [FAVORIS] Détecte les articles "Vendu" dans tes favoris et les supprime en masse.
// @author       ValentinGratz
// @match        https://www.vinted.fr/*
// @include      https://www.vinted.fr/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function() {
    'use strict';
    function addLauncher(){
        if(document.getElementById('vc-vendus')) return;
        if(!location.href.includes('favourite') && !location.href.includes('favorite')) return;
        const b=document.createElement('div'); b.id='vc-vendus'; b.textContent='🔴 Scanner Vendus';
        b.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:14px 20px;border-radius:30px;z-index:999999;cursor:pointer;font-weight:bold;border:2px solid #ff4444;box-shadow:0 4px 15px rgba(0,0,0,.4);font-family:sans-serif;';
        b.onclick=start; document.body.appendChild(b);
    }
    async function start(){
        const sleep=m=>new Promise(r=>setTimeout(r,m));
        console.log('🚀 Scan vendus...');
        let last=0,no=0;
        for(let i=0;i<100&&no<5;i++){ window.scrollTo(0,document.body.scrollHeight); await sleep(1200); const h=document.body.scrollHeight; if(h===last) no++; else no=0; last=h; }
        const all=[...document.querySelectorAll('[data-testid="grid-item"]')];
        const sold=all.filter(el=>{
            const t = el.textContent.toLowerCase();
            const status = el.querySelector('[data-testid*="status"]');
            return (status && status.textContent.trim().toLowerCase().includes('vendu')) || t.includes('vendu') && el.querySelector('[data-testid*="overlay"]');
        });
        // fallback plus robuste
        const sold2 = sold.length ? sold : all.filter(el=>el.innerHTML.toLowerCase().includes('vendu'));
        const finalSold = sold.length ? sold : sold2;
        if(!finalSold.length){ alert('✅ Aucun vendu trouvé sur '+all.length+' articles'); return; }
        finalSold.forEach(el=>{ el.style.outline='4px solid #ff4444'; el.style.position='relative'; const badge=document.createElement('div'); badge.textContent='🔴 VENDU'; badge.style.cssText='position:absolute;top:8px;left:8px;background:#ff4444;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:50'; el.appendChild(badge); });
        const panel=document.createElement('div');
        panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:360px;border:2px solid #ff4444;font-family:sans-serif;';
        panel.innerHTML=`<h3 style="margin:0 0 10px">🎯 ${finalSold.length} vendus</h3><div id="vl" style="max-height:300px;overflow-y:auto"></div><div style="display:flex;gap:6px;margin:10px 0"><button id="a" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px">✅ Tout</button><button id="n" style="flex:1;padding:8px;background:#555;color:white;border:none;border-radius:6px">❌ Aucun</button></div><button id="d" style="width:100%;padding:12px;background:#ff4444;color:white;border:none;border-radius:8px;font-weight:bold">Supprimer sélection</button><button id="c" style="width:100%;margin-top:8px;background:transparent;color:#888;border:none">Fermer</button>`;
        document.body.appendChild(panel);
        const list=panel.querySelector('#vl'); const checks=[];
        finalSold.forEach((el,i)=>{ const t=(el.querySelector('[data-testid*="description-title"]')?.textContent||`Article ${i+1}`).slice(0,35); const row=document.createElement('label'); row.style.cssText='display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #333;font-size:12px;cursor:pointer'; row.innerHTML=`<input type="checkbox" checked><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t}</span>`; list.appendChild(row); checks.push({cb:row.querySelector('input'),el}); });
        panel.querySelector('#a').onclick=()=>checks.forEach(c=>c.cb.checked=true);
        panel.querySelector('#n').onclick=()=>checks.forEach(c=>c.cb.checked=false);
        panel.querySelector('#c').onclick=()=>panel.remove();
        panel.querySelector('#d').onclick=async()=>{ const sel=checks.filter(c=>c.cb.checked); if(!sel.length) return; if(!confirm(`Supprimer ${sel.length} vendus ?`)) return; for(const s of sel){ const b=s.el.querySelector('button[data-testid*="favourite"]')||s.el.querySelector('button[data-testid*="favorite"]'); if(b){ b.click(); await sleep(600+Math.random()*400); s.el.style.opacity='0.3'; } } alert(`✅ ${sel.length} retirés`); location.reload(); };
    }
    if(document.readyState==='complete') addLauncher(); else window.addEventListener('load',addLauncher);
    setInterval(addLauncher,3000);
    // fix SPA
    let lastUrl = location.href;
    setInterval(()=>{ if(location.href!==lastUrl){ lastUrl=location.href; setTimeout(addLauncher,1000); } },1000);
})();
