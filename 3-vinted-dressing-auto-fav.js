// 3-vinted-dressing-AUTO-FAV.js - Clemz-like
// Usage: Va sur un dressing Vinted (vinted.fr/member/XXXX/items) -> Console (Ctrl+Shift+J) -> colle ce script
// Il va auto-fav N articles de ce dressing

(async () => {
  const N = parseInt(prompt('Combien de favs veux-tu mettre sur ce dressing ? (ex: 30)', '30')) || '30');
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  if (!location.href.includes('/member/') && !location.href.includes('/membre/')) {
    alert('⚠️ Va sur la page dressing d\'une personne ! Ex: vinted.fr/member/12345/items');
    return;
  }

  console.log(`❤️ AUTO-FAV START -> Objectif ${N} articles`);
  let favDone = 0;
  let scannedIdx = 0;
  let lastTotal = 0;
  let noNewStreak = 0;

  // UI mini barre
  let bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#111;color:white;padding:12px;text-align:center;z-index:9999999;font-family:sans-serif;font-size:14px;border-bottom:3px solid #ff2e63';
  bar.innerHTML = `<div>❤️ AUTO-FAV: <span id="af-c">0</span> / ${N} | Dressing en cours...</div><div style="height:4px;background:#333;margin-top:6px"><div id="af-b" style="height:100%;width:0%;background:#ff2e63;transition:width 0.3s"></div></div>`;
  document.body.appendChild(bar);
  const countEl = document.getElementById('af-c');
  const barEl = document.getElementById('af-b');

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

  while (favDone < N) {
    const allItems = document.querySelectorAll('[data-testid="grid-item"]');

    if (allItems.length === lastTotal) noNewStreak++;
    else { noNewStreak = 0; lastTotal = allItems.length; }

    if (scannedIdx >= allItems.length) {
      if (noNewStreak > 8) {
        console.log('Fin du dressing atteinte');
        break;
      }
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(1200 + Math.random() * 600);
      continue;
    }

    const item = allItems[scannedIdx];
    scannedIdx++;

    try {
      // skip vendu / réservé
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
      if (needFav === false) continue; // déjà fav
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

      // Délai humain
      await sleep(700 + Math.random() * 700);
      if (favDone % 12 === 0) await sleep(1500 + Math.random() * 1000);

      if (document.body.textContent.includes('Trop de requêtes')) {
        console.log('Rate-limit, pause 6s');
        await sleep(6000);
      }

    } catch (e) { await sleep(500); }
  }

  bar.innerHTML = `✅ Terminé: ${favDone} / ${N} favs faits sur ce dressing ❤️`;
  setTimeout(() => bar.remove(), 5000);
  alert(`✅ Fini ! ${favDone} favs ajoutés sur ce dressing`);
})();
