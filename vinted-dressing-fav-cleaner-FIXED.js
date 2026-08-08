/**
 * VINTED DRESSING FAV CLEANER - UNIVERSAL V2.2
 * Marche sur vinted.fr /.es /.it /.de /.com
 */
(async function() {
  console.log('👕 Dressing Cleaner UNIVERSAL - Démarrage...');
  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  let lastHeight=0,noChange=0;
  for(let i=0;i<100 && noChange<5;i++){
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(1300);
    const h=document.body.scrollHeight;
    if(h===lastHeight){noChange++;} else {noChange=0;}
    lastHeight=h;
  }

  const allItems=document.querySelectorAll('[data-testid="grid-item"]');
  const favItems=[];
  allItems.forEach(item=>{
    const favBtn = item.querySelector('button[data-testid="favourite-button"]') ||
                   item.querySelector('button[data-testid="favorite-button"]') ||
                   item.querySelector('button[data-testid="item-favourite-button"]') ||
                   item.querySelector('button[aria-label*="favoris"]') ||
                   item.querySelector('button[aria-label*="favourite"]') ||
                   item.querySelector('button[aria-label*="favorite"]') ||
                   item.querySelector('button[aria-label*="favoritos"]') ||
                   item.querySelector('button[aria-label*="preferiti"]');
    if(!favBtn) return;
    const ariaLabel = (favBtn.getAttribute('aria-label')||'').toLowerCase();
    const pressed = favBtn.getAttribute('aria-pressed');
    // FR / EN / ES / IT / DE
    const isFav = ariaLabel.includes('retirer') || ariaLabel.includes('remove') || ariaLabel.includes('quitar') || ariaLabel.includes('eliminar') || ariaLabel.includes('rimuovi') || ariaLabel.includes('entfernen') || ariaLabel.includes('usuw') || pressed === 'true';
    if(isFav){ favItems.push({item, favBtn}); }
  });

  console.log(`❤️ Trouvés: ${favItems.length}`);
  if(favItems.length===0){ alert('✅ Aucun fav de ce dressing dans tes favoris'); return; }

  favItems.forEach(({item})=>{
    item.style.outline='4px solid #0074de'; item.style.outlineOffset='2px'; item.style.position='relative';
    const b=document.createElement('div'); b.textContent='💙 DANS TES FAVS'; b.style.cssText='position:absolute;top:8px;left:8px;background:#0074de;color:white;padding:5px 10px;border-radius:20px;font-weight:bold;font-size:11px;z-index:50';
    item.appendChild(b);
  });

  if(document.getElementById('vinted-dressing-panel')) document.getElementById('vinted-dressing-panel').remove();
  const panel=document.createElement('div'); panel.id='vinted-dressing-panel';
  panel.style.cssText='position:fixed;bottom:20px;right:20px;background:#1e1e1e;color:white;padding:18px;border-radius:12px;z-index:99999;width:360px;border:2px solid #0074de;font-family:sans-serif';
  panel.innerHTML=`<h3 style="margin:0 0 10px">💔 ${favItems.length} favs dans ce dressing</h3><div id="vlist" style="max-height:300px;overflow-y:auto;margin-bottom:10px"></div><div style="display:flex;gap:6px;margin-bottom:10px"><button id="vselAll" style="flex:1;padding:8px;background:#4CAF50;color:white;border:none;border-radius:6px">✅ Tout</button><button id="vdesAll" style="flex:1;padding:8px;background:#555;color:white;border:none;border-radius:6px">❌ Aucun</button></div><button id="vdel" style="width:100%;padding:12px;background:#0074de;color:white;border:none;border-radius:8px;font-weight:bold">Retirer la sélection</button><button id="vclose" style="width:100%;margin-top:8px;background:transparent;color:#888;border:none">Fermer</button>`;
  document.body.appendChild(panel);

  const vlist=panel.querySelector('#vlist'); const checks=[];
  favItems.forEach((o,i)=>{
    const title=(o.item.querySelector('[data-testid*="description-title"]')?.textContent||`Article ${i+1}`).slice(0,35);
    const row=document.createElement('label'); row.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #333;font-size:12px;cursor:pointer';
    row.innerHTML=`<input type="checkbox" checked><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</span>`;
    vlist.appendChild(row); checks.push({cb:row.querySelector('input'), favBtn:o.favBtn, item:o.item});
  });
  panel.querySelector('#vselAll').onclick=()=>checks.forEach(c=>c.cb.checked=true);
  panel.querySelector('#vdesAll').onclick=()=>checks.forEach(c=>c.cb.checked=false);
  panel.querySelector('#vclose').onclick=()=>panel.remove();
  panel.querySelector('#vdel').onclick=async()=>{
    const sel=checks.filter(c=>c.cb.checked); if(!sel.length) return alert('Vide'); if(!confirm(`Retirer ${sel.length} favs?`)) return;
    for(let i=0;i<sel.length;i++){ sel[i].item.style.opacity='0.3'; sel[i].favBtn.click(); await sleep(700); }
    alert(`✅ ${sel.length} retirés`); location.reload();
  };
})();
