/**
 * VINTED DRESSING FAV CLEANER - V2.1 FIX
 * Objectif: Retirer UNIQUEMENT les articles de ce dressing qui sont déjà dans tes favoris
 * FIX: détection stricte, plus de faux positifs
 */
(async function() {
  console.log('👕 Vinted Dressing Cleaner V2.1 - Démarrage...');

  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  // 1. Scroll complet
  console.log('⏳ Chargement complet du dressing...');
  let lastHeight=0,noChange=0;
  for(let i=0;i<100 && noChange<5;i++){
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(1300);
    const h=document.body.scrollHeight;
    const c=document.querySelectorAll('[data-testid="grid-item"]').length;
    if(h===lastHeight){noChange++; console.log(`... ${c} articles (${noChange}/5)`);}
    else {noChange=0; console.log(`📦 ${c} articles`);}
    lastHeight=h;
  }

  const allItems=document.querySelectorAll('[data-testid="grid-item"]');
  console.log(`Total dressing: ${allItems.length}`);

  const favItems=[];
  allItems.forEach(item=>{
    // Cherche bouton coeur - Vinted FR utilise plusieurs data-testid selon A/B test
    const favBtn = item.querySelector('button[data-testid="favourite-button"]') ||
                   item.querySelector('button[data-testid="favorite-button"]') ||
                   item.querySelector('button[data-testid="item-favourite-button"]') ||
                   item.querySelector('button[aria-label*="favoris"]') ||
                   item.querySelector('button[aria-label*="favourite"]') ||
                   item.querySelector('button[aria-label*="favorite"]');

    if(!favBtn) return;

    const ariaLabel = (favBtn.getAttribute('aria-label')||'').toLowerCase();
    const pressed = favBtn.getAttribute('aria-pressed');

    // LOGIQUE STRICTE : est fav SEULEMENT si Vinted dit "Retirer"
    // C'est la seule source fiable
    const isFav = ariaLabel.includes('retirer') || ariaLabel.includes('remove') || pressed === 'true';

    // Debug: décommente pour voir pourquoi ça ne détecte pas chez toi
    // console.log({ariaLabel, pressed, isFav, btn: favBtn});

    if(isFav){
      favItems.push({item, favBtn, ariaLabel});
    }
  });

  console.log(`❤️ Trouvés dans tes favs dans ce dressing: ${favItems.length}`);
  
  if(favItems.length===0){
    alert('✅ Aucun article de ce dressing n\'est dans tes favoris (ou Vinted a changé son aria-label).\n\nOuvre la console (F12) et regarde les logs, ou envoie moi une capture du code d\'un coeur rempli.');
    return;
  }

  // 2. UI - uniquement les favs
  favItems.forEach(({item})=>{
    item.style.outline='4px solid #0074de';
    item.style.outlineOffset='2px';
    item.style.borderRadius='12px';
    item.style.position='relative';
    if(!item.querySelector('.fav-badge')){
      const b=document.createElement('div');
      b.className='fav-badge';
      b.textContent='💙 DANS TES FAVS';
      b.style.cssText='position:absolute;top:8px;left:8px;background:#0074de;color:white;padding:5px 10px;border-radius:20px;font-weight:bold;font-size:11px;z-index:50';
      item.appendChild(b);
    }
  });

  // Panneau
  if(document.getElementById('vinted-dressing-panel')) document.getElementById('vinted-dressing-panel').remove();
  const panel=document.createElement('div');
  panel.id='vinted-dressing-panel';
  panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:99999;font-family:sans-serif;width:360px;border:2px solid #0074de';
  panel.innerHTML=`
    <h3 style="margin:0 0 10px;font-size:15px">💔 Retrait favs - ${favItems.length} article(s)</h3>
    <p style="margin:0 0 10px;font-size:12px;color:#aaa">Seuls les articles déjà en favori sont listés. Les autres du dressing sont ignorés.</p>
    <div id="vlist" style="max-height:300px;overflow-y:auto;margin-bottom:10px"></div>
    <div style="display:flex;gap:6px;margin-bottom:10px">
      <button id="vselAll" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px;cursor:pointer">✅ Tout</button>
      <button id="vdesAll" style="flex:1;padding:8px;background:#555;color:white;border:none;border-radius:6px;cursor:pointer">❌ Aucun</button>
    </div>
    <button id="vdel" style="width:100%;padding:12px;background:#0074de;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold">Retirer la sélection de mes favs</button>
    <button id="vclose" style="width:100%;margin-top:8px;padding:6px;background:transparent;color:#888;border:none;cursor:pointer;font-size:11px">Fermer</button>
  `;
  document.body.appendChild(panel);
  
  const vlist=panel.querySelector('#vlist');
  const checks=[];
  favItems.forEach((o,i)=>{
    const title=(o.item.querySelector('[data-testid*="description-title"]')?.textContent||`Article ${i+1}`).slice(0,35);
    const row=document.createElement('label');
    row.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #333;font-size:12px;cursor:pointer';
    row.innerHTML=`<input type="checkbox" checked style="width:16px;height:16px"><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</span>`;
    vlist.appendChild(row);
    checks.push({cb:row.querySelector('input'), favBtn:o.favBtn, item:o.item});
  });

  panel.querySelector('#vselAll').onclick=()=>checks.forEach(c=>c.cb.checked=true);
  panel.querySelector('#vdesAll').onclick=()=>checks.forEach(c=>c.cb.checked=false);
  panel.querySelector('#vclose').onclick=()=>panel.remove();

  panel.querySelector('#vdel').onclick=async()=>{
    const sel=checks.filter(c=>c.cb.checked);
    if(!sel.length) return alert('Sélection vide');
    if(!confirm(`Retirer ${sel.length} article(s) de ce dressing de tes favoris ?`)) return;
    
    for(let i=0;i<sel.length;i++){
      const {favBtn,item}=sel[i];
      console.log(`Retrait ${i+1}/${sel.length}`);
      item.style.opacity='0.3';
      favBtn.click();
      await sleep(700); // laisse le temps à Vinted
    }
    alert(`✅ ${sel.length} retiré(s). Rechargement...`);
    location.reload();
  };
  window.scrollTo(0,0);
})();
