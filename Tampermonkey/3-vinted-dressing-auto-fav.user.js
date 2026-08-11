// ==UserScript==
// @name         3 - Vinted Dressing Auto Fav [ULTRA SCROLL + QTE SMART]
// @namespace    https://github.com/ValentinGratz/Vinted-favorites-manager-
// @version      2.0.0-smart-qte
// @description  [DRESSING] Auto fav avec detection intelligente du total + champ quantité
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
    const b=document.createElement('div'); 
    b.id='vc-auto-fav'; 
    b.textContent='⭐ Auto Fav ULTRA';
    b.style.cssText='position:fixed;bottom:70px;right:20px;background:#1e1e1e;color:white;padding:14px 20px;border-radius:30px;z-index:999999;cursor:pointer;font-weight:bold;border:2px solid #FFB800;box-shadow:0 4px 15px rgba(0,0,0,.4);font-family:sans-serif;';
    b.onclick=start; 
    document.body.appendChild(b);
}

function getTotalExpected(){
    try {
        const html = document.documentElement.innerHTML;
        // Vinted met le total dans le JSON initial
        let m = html.match(/"item_count"\s*:\s*(\d+)/) 
             || html.match(/"total_items"\s*:\s*(\d+)/) 
             || html.match(/"items_count"\s*:\s*(\d+)/)
             || html.match(/"count"\s*:\s*(\d+)[^}]*"items"/);
        if(m) return parseInt(m[1]);

        // Fallback: cherche "150 articles" dans la page
        const bodyText = document.body.innerText;
        const textMatch = bodyText.match(/(\d+)\s+articles?/i);
        // On prend le premier qui est < 10000 pour éviter de choper un prix
        if(textMatch){
            const val = parseInt(textMatch[1]);
            if(val > 0 && val < 10000) return val;
        }
    } catch(e){}
    return null;
}

async function start(){
    const sleep=m=>new Promise(r=>setTimeout(r,m));
    const randomDelay=()=> 1200 + Math.random()*2000;
    const btn = document.getElementById('vc-auto-fav');
    if(btn) btn.style.display='none';

    const bar=document.createElement('div');
    bar.style.cssText='position:fixed;top:0;left:0;width:100%;background:#FFB800;color:black;padding:12px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:15px;font-weight:bold';
    document.body.appendChild(bar);

    let noNew=0, lastCount=0;
    let totalExpected = getTotalExpected();

    if(totalExpected){
        bar.textContent=`🎯 Dressing détecté: ${totalExpected} articles - chargement...`;
        await sleep(800);
        // Re-essaye après 1 scroll au cas où le total n'était pas encore chargé
        if(!totalExpected) totalExpected = getTotalExpected();
    }

    for(let i=0;i<800;i++){
        const items = document.querySelectorAll('[data-testid="grid-item"]');
        if(items.length) items[items.length-1].scrollIntoView({behavior:'auto', block:'center'});
        else window.scrollTo(0, document.body.scrollHeight);

        await sleep(800); // un peu plus rapide que 900

        const currentCount = document.querySelectorAll('[data-testid="grid-item"]').length;

        // SMART STOP : si on connait le total
        if(totalExpected && totalExpected > 0){
            bar.textContent=`⏳ ${currentCount} / ${totalExpected} articles | Scroll ${i+1}`;
            if(currentCount >= totalExpected){
                bar.textContent=`✅ Tout chargé: ${currentCount} / ${totalExpected}`;
                await sleep(500);
                break;
            }
            // Si on est à 95% du total, on est plus tolérant
            if(currentCount >= totalExpected * 0.95 && noNew >= 3) break;
        } else {
            bar.textContent=`⏳ Chargement... ${currentCount} articles | Scroll ${i+1}`;
            // Si on a pas le total, on re-tente de le choper en cours de route
            if(i % 5 === 0){
                const retry = getTotalExpected();
                if(retry) totalExpected = retry;
            }
        }

        if(currentCount===lastCount){ 
            noNew++; 
            // Seuil adaptatif: petit dressing = on coupe plus vite
            const seuil = totalExpected ? 4 : (currentCount < 200 ? 4 : currentCount < 600 ? 6 : 10);
            if(noNew>=seuil) break; 
        } else { 
            noNew=0; 
            lastCount=currentCount; 
        }

        if(currentCount>5000) break;
    }

    window.scrollTo(0,0); await sleep(600); bar.remove();
    if(btn) btn.style.display='block';

    const all=[...document.querySelectorAll('[data-testid="grid-item"]')];
    const toFav=[];
    all.forEach(item=>{
        const b=item.querySelector('button[data-testid="favourite-button"]')||item.querySelector('button[data-testid="favorite-button"]')||item.querySelector('button[data-testid="item-favourite-button"]')||item.querySelector('button[aria-label*="favoris"]');
        if(!b) return;
        const label=(b.getAttribute('aria-label')||'').toLowerCase();
        const isNotFav = label.includes('ajouter') || label.includes('add') || label.includes('hinzufügen') || b.getAttribute('aria-pressed')==='false';
        if(isNotFav) toFav.push({item, btn:b});
    });

    if(!toFav.length){ alert(`✅ Tous les ${all.length} articles sont déjà favs !`); return; }

    // PANEL AVEC CHAMP QUANTITE
    const chooser=document.createElement('div');
    chooser.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:20px;border-radius:12px;z-index:99999;width:380px;border:2px solid #FFB800;font-family:sans-serif;box-shadow:0 8px 25px rgba(0,0,0,.6)';
    const infoTotal = totalExpected ? `Dressing de ${totalExpected} - ${toFav.length} à fav` : `${toFav.length} articles non favs sur ${all.length} chargés`;
    chooser.innerHTML=`
        <h3 style="margin:0 0 8px">⭐ Combien tu veux en fav ?</h3>
        <p style="font-size:13px;color:#aaa;margin:0 0 12px">${infoTotal}</p>
        <label style="font-size:12px;color:#ccc">Nombre à fav :</label>
        <input id="vc-qte" type="number" min="1" max="${toFav.length}" value="${Math.min(100, toFav.length)}" style="width:100%;padding:10px;margin:6px 0 12px 0;border-radius:6px;border:1px solid #555;background:#2a2a2a;color:white;font-size:16px;font-weight:bold">
        <div style="display:flex;gap:8px">
            <button id="vc-start-qte" style="flex:1;padding:12px;background:#FFB800;color:black;border:none;border-radius:6px;font-weight:bold;cursor:pointer">🚀 Lancer</button>
            <button id="vc-cancel-qte" style="flex:1;padding:12px;background:#333;color:white;border:none;border-radius:6px;font-weight:bold;cursor:pointer">Annuler</button>
        </div>
        <p style="font-size:11px;color:#888;margin:10px 0 0 0">Conseil: reste sous 100 pour éviter le ban. Délai 1.2-3.2s.</p>
    `;
    document.body.appendChild(chooser);

    chooser.querySelector('#vc-cancel-qte').onclick=()=>chooser.remove();
    chooser.querySelector('#vc-start-qte').onclick=async ()=>{
        const qteInput = chooser.querySelector('#vc-qte');
        let limitDemande = parseInt(qteInput.value);
        if(isNaN(limitDemande) || limitDemande <=0){
            qteInput.style.border='2px solid red';
            return;
        }
        limitDemande = Math.min(toFav.length, limitDemande);
        chooser.remove();

        const panel=document.createElement('div');
        panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:380px;border:2px solid #FFB800;font-family:sans-serif;';
        panel.innerHTML=`<h3 style="margin:0 0 10px">⭐ Auto Fav en cours...</h3><div style="background:#333;height:10px;border-radius:5px;overflow:hidden;margin-bottom:10px"><div id="prog" style="height:100%;width:0%;background:#FFB800;transition:width .3s"></div></div><p id="status" style="font-size:13px;color:#aaa;margin:0">0 / ${limitDemande}</p><button id="stop" style="width:100%;margin-top:12px;padding:10px;background:#ff4444;color:white;border:none;border-radius:6px;font-weight:bold">⏹️ Stop</button>`;
        document.body.appendChild(panel);
        let stopped=false; 
        panel.querySelector('#stop').onclick=()=>{ stopped=true; panel.querySelector('#status').textContent='⏹️ Arrêt demandé...'; };

        let count=0;
        const limit=limitDemande;
        for(let i=0;i<limit;i++){ 
            if(stopped) break; 
            const o=toFav[i]; 
            o.item.scrollIntoView({behavior:'smooth', block:'center'}); 
            await sleep(400); 
            o.item.style.outline='4px solid #FFB800'; 
            o.btn.click(); 
            count++; 
            panel.querySelector('#status').textContent=`${count} / ${limit} - Prochain dans...`; 
            panel.querySelector('#prog').style.width=`${(count/limit)*100}%`; 
            const badge=document.createElement('div'); badge.textContent='⭐ FAV'; 
            badge.style.cssText='position:absolute;top:8px;left:8px;background:#FFB800;color:black;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;z-index:50'; 
            o.item.style.position='relative'; o.item.appendChild(badge); 
            await sleep(randomDelay()); 
        }
        panel.innerHTML=`<h3 style="margin:0 0 10px">✅ Terminé ! ${count} articles favs sur ${all.length} chargés</h3><p style="font-size:13px;color:#aaa">Attends 10min avant de relancer sur un autre dressing pour rester safe.</p><button id="close" style="width:100%;margin-top:12px;padding:10px;background:#4CAF50;color:white;border:none;border-radius:6px;font-weight:bold">Fermer</button>`;
        panel.querySelector('#close').onclick=()=>panel.remove();
    };
}

if(document.readyState==='complete') addLauncher(); else window.addEventListener('load',addLauncher);
setInterval(addLauncher,3000);
let lastUrl = location.href;
setInterval(()=>{ if(location.href!==lastUrl){ lastUrl=location.href; setTimeout(addLauncher,1000); } },1000);
})();
