// ==UserScript==
// @name         4 - Vinted - Session Counter Anti-Doublon
// @namespace    vinted-session-v3
// @version      3.0
// @description  Compteur vues + favs avec objectif perso et mémoire anti-doublon journalière
// @author       Valentin
// @match        https://www.vinted.fr/*
// @match        https://www.vinted.com/*
// @match        https://*.vinted.fr/*
// @match        https://*.vinted.de/*
// @match        https://*.vinted.es/*
// @match        https://*.vinted.it/*
// @match        https://*.vinted.nl/*
// @match        https://*.vinted.pl/*
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://raw.githubusercontent.com/TON_USER/TON_REPO/main/vinted-session-counter.user.js
// @downloadURL  https://raw.githubusercontent.com/TON_USER/TON_REPO/main/vinted-session-counter.user.js
// ==/UserScript==

(function() {
    const today = new Date().toDateString();
    let cfg = GM_getValue("vintedCfgV3", {
        targetViews: 50,
        targetFavs: 50,
        views: 0,
        favs: 0,
        date: today,
        seenIds: [],
        favedIds: []
    });

    if(cfg.date !== today){
        cfg.views = 0; cfg.favs = 0;
        cfg.seenIds = []; cfg.favedIds = [];
        cfg.date = today;
    }

    function save(){ GM_setValue("vintedCfgV3", cfg); updateUI(); }

    function getItemId(url = location.href){
        const m = url.match(/\/items\/(\d+)/);
        return m ? m[1] : null;
    }

    const panel = document.createElement("div");
    panel.innerHTML = `
    <div style="position:fixed;bottom:20px;right:20px;z-index:999999;background:#111;color:#fff;padding:14px;border-radius:14px;width:220px;font-family:Arial;border:1px solid #333">
        <b style="display:block;text-align:center;margin-bottom:8px">VINTED SESSION V3</b>
        <div style="display:flex;gap:6px;margin-bottom:8px">
            <div style="flex:1"><span style="font-size:10px;opacity:0.6">OBJ VUES</span><input id="vV" type="number" value="${cfg.targetViews}" style="width:100%;background:#222;color:#fff;border:1px solid #444;border-radius:6px;padding:5px"></div>
            <div style="flex:1"><span style="font-size:10px;opacity:0.6">OBJ FAVS</span><input id="vF" type="number" value="${cfg.targetFavs}" style="width:100%;background:#222;color:#fff;border:1px solid #444;border-radius:6px;padding:5px"></div>
        </div>
        <div id="vProgress" style="font-size:13px;line-height:1.6"></div>
        <div id="vLast" style="font-size:10px;opacity:0.5;margin-top:6px"></div>
        <button id="vReset" style="width:100%;margin-top:8px;background:#222;color:#999;border:0;padding:6px;border-radius:6px;font-size:11px;cursor:pointer">Reset jour</button>
    </div>`;
    document.body.appendChild(panel);

    function updateUI(){
        const pct = Math.min(100, Math.round((cfg.views / (cfg.targetViews||1))*100));
        document.getElementById("vProgress").innerHTML = `
            👁️ Vues: ${cfg.views} / ${cfg.targetViews} (${pct}%)<br>
            ❤️ Favs: ${cfg.favs} / ${cfg.targetFavs}<br>
            ${cfg.views >= cfg.targetViews && cfg.favs >= cfg.targetFavs ? '<span style="color:#4CAF50;font-weight:bold">✅ Session terminée</span>' : '<span style="opacity:0.6">En cours...</span>'}
        `;
    }

    const currentId = getItemId();
    if(currentId){
        if(!cfg.seenIds.includes(currentId)){
            cfg.seenIds.push(currentId);
            cfg.views++;
            save();
            setTimeout(()=> {
                const el = document.getElementById("vLast");
                if(el) el.textContent = `+1 vue: ${currentId}`;
            }, 100);
        } else {
            setTimeout(()=> {
                const el = document.getElementById("vLast");
                if(el) el.textContent = `Déjà vu aujourd'hui: ${currentId}`;
            }, 100);
        }
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest('[data-testid*="favourite"], [data-testid*="favorite"], button[aria-label*="Favori"], button[aria-label*="Ajouter aux favoris"]');
        if(!btn) return;
        const id = getItemId();
        if(!id) return;
        setTimeout(()=>{
            if(!cfg.favedIds.includes(id)){
                cfg.favedIds.push(id);
                cfg.favs++;
                save();
                const last = document.getElementById("vLast");
                if(last) last.textContent = `+1 fav: ${id}`;
            }
        }, 400);
    });

    panel.querySelector("#vV").addEventListener("change", e=>{ cfg.targetViews = parseInt(e.target.value)||0; save(); });
    panel.querySelector("#vF").addEventListener("change", e=>{ cfg.targetFavs = parseInt(e.target.value)||0; save(); });
    panel.querySelector("#vReset").onclick = ()=>{
        cfg.views=0; cfg.favs=0; cfg.seenIds=[]; cfg.favedIds=[]; save();
        document.getElementById("vLast").textContent = "Compteurs remis à zéro";
    };

    updateUI();
})();
