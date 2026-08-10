// ==UserScript==
// @name         1 - Vinted Cleaner - Vendus [FULL AUTO SCROLL]
// @namespace    https://github.com/ValentinGratz/Vinted-favorites-manager-
// @version      1.7.0-edge-full
// @description  [FAVORIS] Détecte les articles "Vendu" dans tes favoris et les supprime en masse. Mode FULL AUTO pour 2000+ favs.
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
        const b=document.createElement('div'); b.id='vc-vendus'; b.textContent='🔴 Scanner Vendus (FULL)';
        b.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:14px 20px;border-radius:30px;z-index:999999;cursor:pointer;font-weight:bold;border:2px solid #ff4444;box-shadow:0 4px 15px rgba(0,0,0,.4);font-family:sans-serif;';
        b.onclick=start; document.body.appendChild(b);
    }
    async function start(){
        const sleep=m=>new Promise(r=>setTimeout(r,m));
        const btnLauncher = document.getElementById('vc-vendus');
        if(btnLauncher) btnLauncher.style.display='none';

        const bar=document.createElement('div');
        bar.style.cssText='position:fixed;top:0;left:0;width:100%;background:#ff4444;color:white;padding:10px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:14px;font-weight:bold';
        document.body.appendChild(bar);

        let noNewCount = 0;
        let lastItemCount = 0;
        // Scroll jusqu'au bout - on compte les articles, pas la hauteur
        for(let i=0; i<500; i++){
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(800);
            window.scrollTo(0, document.body.scrollHeight - 500);
            await sleep(200);
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(600);

            const currentCount = document.querySelectorAll('[data-testid="grid-item"]').length;
            bar.textContent=`⏳ Chargement complet... ${currentCount} favoris chargés (scroll ${i+1}) - Ne touche à rien`;

            if(currentCount === lastItemCount){
                noNewCount++;
                if(noNewCount >= 8) break; // 8 fois de suite sans nouveau = on est au bout
            } else {
                noNewCount = 0;
                lastItemCount = currentCount;
            }
        }

        window.scrollTo(0,0);
        await sleep(500);
        bar.remove();
        if(btnLauncher) btnLauncher.style.display='block';

        const all=[...document.querySelectorAll('[data-testid="grid-item"]')];
        // detection plus large
        const sold = all.filter(el=>{
            const html = el.innerHTML.toLowerCase();
            return html.includes('vendu') || html.includes('sold') || html.includes('verkauft') || el.querySelector('[data-testid*="status"]');
        }).filter(el=>{
            // evite les faux positifs "Vendu par..." dans la description
            const txt = (el.textContent || '').toLowerCase();
            // si il y a un overlay ou le mot vendu dans un badge status, c'est bon
            return txt.includes('vendu') || el.innerHTML.toLowerCase().includes('overlay');
        });

        // Si la detection ci-dessus est trop stricte, on retombe sur la simple
        let finalSold = sold;
        if(finalSold.length === 0){
            finalSold = all.filter(el=> el.textContent.toLowerCase().includes('vendu') && el.querySelector('img'));
        }

        if(!finalSold.length){ alert(`✅ Aucun vendu trouvé sur ${all.length} articles scannés jusqu'au bout !`); return; }

        finalSold.forEach(el=>{ el.style.outline='4px solid #ff4444'; el.style.position='relative'; if(!el.querySelector('.vc-badge')){ const badge=document.createElement('div'); badge.className='vc-badge'; badge.textContent='🔴 VENDU'; badge.style.cssText='position:absolute;top:8px;left:8px;background:#ff4444;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:50'; el.appendChild(badge); } });

        const panel=document.createElement('div');
        panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:380px;border:2px solid #ff4444;font-family:sans-serif;';
        panel.innerHTML=`<h3 style="margin:0 0 10px">🎯 ${finalSold.length} vendus trouvés sur ${all.length} favs</h3><div id="vl" style="max-height:320px;overflow-y:auto"></div><div style="display:flex;gap:6px;margin:10px 0"><button id="a" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px">✅ Tout</button><button id="n" style="flex:1;padding:8px;background:#555;color:white;border:none;border-radius:6px">❌ Aucun</button></div><button id="d" style="width:100%;padding:12px;background:#ff4444;color:white;border:none;border-radius:8px;font-weight:bold">Supprimer sélection (${finalSold.length})</button><button id="c" style="width:100%;margin-top:8px;background:transparent;color:#888;border:none">Fermer</button>`;
        document.body.appendChild(panel);
        const list=panel.querySelector('#vl'); const checks=[];
        finalSold.forEach((el,i)=>{ const t=(el.querySelector('[data-testid*="description-title"]')?.textContent||`Article ${i+1}`).slice(0,40); const row=document.createElement('label'); row.style.cssText='display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #333;font-size:12px;cursor:pointer'; row.innerHTML=`<input type="checkbox" checked><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t}</span>`; list.appendChild(row); checks.push({cb:row.querySelector('input'),el}); });
        panel.querySelector('#a').onclick=()=>checks.forEach(c=>c.cb.checked=true);
        panel.querySelector('#n').onclick=()=>checks.forEach(c=>c.cb.checked=false);
        panel.querySelector('#c').onclick=()=>panel.remove();
        panel.querySelector('#d').onclick=async()=>{
            const sel=checks.filter(c=>c.cb.checked);
            if(!sel.length) return;
            if(!confirm(`Supprimer ${sel.length} vendus d'un coup ? Ça va prendre ${Math.round(sel.length*0.8)} secondes.`)) return;
            panel.querySelector('#d').textContent='⏳ Suppression en cours...';
            panel.querySelector('#d').disabled=true;
            for(const s of sel){
                const b=s.el.querySelector('button[data-testid*="favourite"]')||s.el.querySelector('button[data-testid*="favorite"]')||s.el.querySelector('button[aria-label*="favoris"]');
                if(b){ b.click(); await sleep(500+Math.random()*300); s.el.style.opacity='0.2'; s.el.style.outline='none'; }
            }
            alert(`✅ ${sel.length} vendus retirés ! La page va se recharger.`);
            location.reload();
        };
    }
    if(document.readyState==='complete') addLauncher(); else window.addEventListener('load',addLauncher);
    setInterval(addLauncher,2500);
    let lastUrl = location.href;
    setInterval(()=>{ if(location.href!==lastUrl){ lastUrl=location.href; setTimeout(addLauncher,1200); } },1000);
})();
