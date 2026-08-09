// 3-vinted-dressing-AUTO-FAV-V1.5.2 - Fix Issue #1 + #2
// Fix #1: Pre-scroll + scroll robuste / Fix #2: Message fin si pas assez d'articles

(async () => {
  const input = prompt('Combien de favs veux-tu mettre sur ce dressing ? (ex: 30)', '30');
  const N = parseInt(input) || 30;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  if (!location.href.includes('/member/') && !location.href.includes('/membre/')) {
    alert('⚠️ Va sur la page dressing d\'une personne ! Ex: vinted.fr/member/12345/items');
    return;
  }

  console.log(`❤️ AUTO-FAV V1.5.2 START -> Objectif ${N} articles`);
  let favDone = 0;
  let scannedIdx = 0;
  let lastTotal = 0;
  let noNewStreak = 0;

  // UI mini barre
  let bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#111;color:white;padding:12px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:14px;border-bottom:3px solid #ff2e63';
  bar.innerHTML = `<div>❤️ AUTO-FAV: <span id="af-c">0</span> / ${N} | <span id="af-status">Chargement initial...</span></div><div style="height:4px;background:#333;margin-top:6px"><div id="af-b" style="height:100%;width:0%;background:#ff2e63;transition:width 0.3s"></div></div>`;
  document.body.appendChild(bar);
  const countEl = document.getElementById('af-c');
  const barEl = document.getElementById('af-b');
  const statusEl = document.getElementById('af-status');

  // --- FIX ISSUE #1 : Pre-scroll complet pour forcer le chargement Vinted ---
  if(statusEl) statusEl.textContent = 'Chargement complet du dressing...';
  console.log('⬇️ Pre-scroll complet pour charger tout le dressing');
  let lastH = 0, stable = 0;
  for(let i=0; i<40; i++){
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(900);
    const h = document.body.scrollHeight;
    if(h === lastH) stable++; else stable = 0;
    lastH = h;
    if(statusEl) statusEl.textContent = `Chargement... ${document.querySelectorAll('[data-testid="grid-item"]').length} articles chargés`;
    if(stable > 4) break; // on a tout chargé
  }
  window.scrollTo(0, 0);
  await sleep(700);
  console.log(`✅ Pre-load fini: ${document.querySelectorAll('[data-testid="grid-item"]').length} articles`);

  const isNotFav = (btn) => {
    if (!btn) return null;
    const pressed = btn.getAttribute('aria-pressed');
    const label = (btn.getAttribute('aria-label') || '').toLowerCase();
    if (pressed === 'false') return true;
    if (pressed === 'true') return false;
    if (label.includes('ajouter') || label.includes('add')) return true;
    if (label.includes('retirer') || label.includes('remove')) return false;
    return null;
  };

  if(statusEl) statusEl.textContent = 'Dressing en cours...';

  while (favDone < N) {
    const allItems = document.querySelectorAll('[data-testid="grid-item"]');

    if (allItems.length === lastTotal) noNewStreak++;
    else { noNewStreak = 0; lastTotal = allItems.length; }

    if (scannedIdx >= allItems.length) {
      if (noNewStreak > 8) {
        console.log('Fin du dressing atteinte, plus d\'articles à charger');
        break; // -> va déclencher le message de l'Issue #2
      }
      if(statusEl) statusEl.textContent = `Scroll... ${allItems.length} chargés`;
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(1200 + Math.random() * 600);
      continue;
    }

    const item = allItems[scannedIdx];
    scannedIdx++;

    try {
      const statusText = item.querySelector('[data-testid*="status-text"]');
      if (statusText) {
        const txt = statusText.textContent.trim().toLowerCase();
        if (['vendu', 'vendido', 'sold', 'venduto', 'verkauft', 'reservé', 'reserved'].some(k => txt.includes(k))) continue;
      }

      let favBtn = item.querySelector('button[data-testid="favourite-button"]')
        || item.querySelector('button[data-testid="favorite-button"]')
        || item.querySelector('button[data-testid*="favourite"]')
        || item.querySelector('button[data-testid="item-favourite-button"]')
        || item.querySelector('button[aria-label*="favoris"]');

      if (!favBtn) continue;

      const needFav = isNotFav(favBtn);
      if (needFav === false) continue;
      if (needFav === null) {
        const hasActive = item.querySelector('[data-testid="favourite-icon--active"]');
        if (hasActive) continue;
      }

      favBtn.click();
      favDone++;
      if (countEl) countEl.textContent = favDone;
      if (barEl) barEl.style.width = `${(favDone / N) * 100}%`;
      try { item.style.outline = '3px solid #ff2e63'; } catch (e) {}

      console.log(`✅ ${favDone}/${N} fav - #${scannedIdx}`);

      await sleep(700 + Math.random() * 700);
      if (favDone % 12 === 0) await sleep(1500 + Math.random() * 1000);

      if (document.body.textContent.includes('Trop de requêtes')) {
        console.log('Rate-limit, pause 6s');
        await sleep(6000);
      }

    } catch (e) { await sleep(500); }
  }

  // --- FIX ISSUE #2 : Message de fin intelligent ---
  window.scrollTo(0, 0);
  if (favDone === 0) {
    bar.style.background = '#ff9800';
    bar.innerHTML = `⚠️ Terminé: 0 / ${N} favs - Aucun article disponible à liker (déjà likés ou dressing vide)`;
    alert(`⚠️ Fini ! 0 fav sur ${N} demandés.\n\nRaison : dressing vide, tout déjà liké, ou articles vendus.\nEssaie un autre dressing.`);
  } else if (favDone < N) {
    bar.style.background = '#ff9800';
    bar.innerHTML = `ℹ️ Terminé: seulement ${favDone} / ${N} favs - Plus d'articles dispo dans ce dressing`;
    setTimeout(() => bar.remove(), 8000);
    alert(`ℹ️ Session terminée : seulement ${favDone} favs posés sur ${N} demandés.\n\nRaison : le dressing n'a que ${favDone} articles likables (ou le reste est déjà liké/vendu).\n\nC'est normal, tu peux passer à un autre dressing ! ❤️`);
  } else {
    bar.style.background = '#4CAF50';
    bar.innerHTML = `✅ Terminé: ${favDone} / ${N} favs faits sur ce dressing ❤️`;
    setTimeout(() => bar.remove(), 5000);
    alert(`✅ Fini ! ${favDone} favs ajoutés sur ce dressing`);
  }
})();
