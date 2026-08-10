// ==UserScript==
// @name         1 - Vinted Cleaner - Vendus [ULTRA SCROLL FIX 40]
// @namespace    https://github.com/ValentinGratz/Vinted-favorites-manager-
// @version      1.8.0-ultra-fix
// @description  Fix le bug des 40 premiers - scroll sur le dernier item
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
        const b=document.createElement('div'); b.id='vc-vendus'; b.textContent='🔴 Scanner Vendus (ULTRA)';
        b.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:14px 20px;border-radius:30px;z-index:999999;cursor:pointer;font-weight:bold;border:2px solid #ff4444;box-shadow:0 4px 15px rgba(0,0,0,.4);font-family:sans-serif;';
        b.onclick=start; document.body.appendChild(b);
    }
    async function start(){
        const sleep=m=>new Promise(r=>setTimeout(r,m));
        const btnLauncher = document.getElementById('vc-vendus');
        if(btnLauncher) btnLauncher.style.display='none';

        const bar=document.createElement('div');
        bar.style.cssText='position:fixed;top:0;left:0;width:100%;background:#ff4444;color:white;padding:12px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:15px;font-weight:bold';
        document.body.appendChild(bar);

        let noNew = 0;
        let lastCount = 0;

        // ULTRA SCROLL - on scroll sur le dernier element, pas sur la page
        for(let i=0; i<800; i++){
            const items = document.querySelectorAll('[data-testid="grid-item"]');
            if(items.length > 0){
                // scroll le dernier item en vue = declenche le vrai chargement Vinted
                items[items.length - 1].scrollIntoView({behavior: 'auto', block: 'center'});
                await sleep(300);
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                window.scrollTo(0, document.body.scrollHeight);
            }

            await sleep(900);

            const currentCount = document.querySelectorAll('[data-testid="grid-item"]').length;
            bar.textContent = `⏳ Chargement... ${currentCount} favoris | Scroll ${i+1} | Ne touche à rien, ça va charger tout seul jusqu'au bout`;

            console.log(`[Vinted] Scroll ${i+1} - ${currentCount} items`);

            if(currentCount === lastCount){
                noNew++;
                if(noNew >= 12) { // 12 fois sans nouveau = vraiment fini
                    console.log('✅ Fini, plus de nouveaux items');
                    break;
                }
            } else {
                noNew = 0;
                lastCount = currentCount;
            }

            // anti-boucle infinie pour les tres gros comptes
            if(currentCount > 5000) break;
        }

        window.scrollTo(0,0);
        await sleep(600);
        bar.remove();
        if(btnLauncher) btnLauncher.style.display='block';

        const all=[...document.querySelectorAll('[data-testid="grid-item"]')];
        console.log(`Total items: ${all.length}`);

        const sold = all.filter(el=>{
            const status = el.querySelector('[data-testid*="status-text"]');
            if(status){
                const t = status.textContent.trim().toLowerCase();
                return ['vendu','vendido','sold','venduto','verkauft','verkocht','sprzedane','vândut'].includes(t);
            }
            // fallback: cherche le mot vendu dans l'item
            return el.innerHTML.toLowerCase().includes('>vendu<') || el.innerHTML.toLowerCase().includes('>sold<');
        });

        if(!sold.length){
            alert(`✅ Aucun vendu trouvé sur ${all.length} articles (tout a bien été chargé jusqu'au bout)`);
            return;
        }

        sold.forEach(el=>{ el.style.outline='4px solid #ff4444'; el.style.position='relative'; const badge=document.createElement('div'); badge.textContent='🔴 VENDU'; badge.style.cssText='position:absolute;top:8px;left:8px;background:#ff4444;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:50'; if(!el.querySelector('.vc-badge')) el.appendChild(badge); });

        const panel=document.createElement('div');
        panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:400px;border:2px solid #ff4444;font-family:sans-serif;';
        panel.innerHTML=`<h3 style="margin:0 0 10px">🎯 ${sold.length} vendus / ${all.length} total chargés</h3><div id="vl" style="max-height:350px;overflow-y:auto"></div><div style="display:flex;gap:6px;margin:10px 0"><button id="a" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px">✅ Tout</button><button id="n" style="flex:1;padding:8px;background:#555;color:white;border:none;border-radius:6px">❌ Aucun</button></div><button id="d" style="width:100%;padding:12px;background:#ff4444;color:white;border:none;border-radius:8px;font-weight:bold">Supprimer ${sold.length} vendus</button><button id="c" style="width:100%;margin-top:8px;background:transparent;color:#888;border:none">Fermer</button>`;
        document.body.appendChild(panel);
        const list=panel.querySelector('#vl'); const checks=[];
        sold.forEach((el,i)=>{ const t=(el.querySelector('[data-testid*="description-title"]')?.textContent||`Article ${i+1}`).slice(0,40); const row=document.createElement('label'); row.style.cssText='display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #333;font-size:12px;cursor:pointer'; row.innerHTML=`<input type="checkbox" checked><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t}</span>`; list.appendChild(row); checks.push({cb:row.querySelector('input'),el}); });
        panel.querySelector('#a').onclick=()=>checks.forEach(c=>c.cb.checked=true);
        panel.querySelector('#n').onclick=()=>checks.forEach(c=>c.cb.checked=false);
        panel.querySelector('#c').onclick=()=>panel.remove();
        panel.querySelector('#d').onclick=async()=>{
            const sel=checks.filter(c=>c.cb.checked);
            if(!sel.length) return;
            if(!confirm(`Supprimer ${sel.length} vendus ?`)) return;
            for(const s of sel){ const b=s.el.querySelector('button[data-testid*="favourite"]')||s.el.querySelector('button[data-testid*="favorite"]'); if(b){ b.click(); await sleep(500); s.el.style.opacity='0.2'; } }
            alert(`✅ ${sel.length} supprimés`); location.reload();
        };
    }
    if(document.readyState==='complete') addLauncher(); else window.addEventListener('load',addLauncher);
    setInterval(addLauncher,2500);
    let lastUrl = location.href;
    setInterval(()=>{ if(location.href!==lastUrl){ lastUrl=location.href; setTimeout(addLauncher,1200); } },1000);
})();
