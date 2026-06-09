/**
 * ============================================
 * VINTED FAVORIS MANAGER - VERSION CONSOLE (Améliorée)
 * ============================================
 * 
 * 📌 DESCRIPTION:
 * Script à coller dans la console du navigateur pour gérer et supprimer
 * facilement les articles marqués "Vendu" de ta liste de favoris Vinted.
 * 
 * 🚀 MODE D'EMPLOI:
 * 1. Va sur: https://www.vinted.fr/member/items/favourite_list
 * 2. Ouvre la console: Ctrl+Shift+J (Windows/Linux) ou Cmd+Option+J (Mac)
 * 3. Copie tout ce code et colle-le dans la console
 * 4. Appuie sur Entrée
 * 5. Attends 10-15 secondes (chargement automatique de tous les favoris)
 * 6. Utilise le panneau qui apparaît en bas à droite
 * 
 * ✨ FONCTIONNALITÉS:
 * ✅ Charge TOUS les favoris automatiquement
 * ✅ Détecte tous les articles "Vendu"
 * ✅ Les met en évidence visuellement en rouge
 * ✅ Interface de sélection avec checkboxes
 * ✅ Suppression en masse des articles
 * ✅ Vérification que la suppression a fonctionné
 * ✅ Rafraîchissement automatique après suppression
 * ✅ Modales custom (pas d'alert/confirm bloqués)
 * 
 * ⚠️ IMPORTANT:
 * - La page se recharge automatiquement après suppression
 * - Supprimer des articles est IRRÉVERSIBLE
 * - Tu peux les re-favoriser à tout moment
 */

(async function() {
  console.log('🚀 Vinted Favorites Sorter - Démarrage...');
  
  // ========== FONCTIONS DE MODALES CUSTOM ==========
  // Remplacent alert() et confirm() qui peuvent être bloqués
  
  function showModal(message, type = 'info') {
    return new Promise(resolve => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 25px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 400px;
        border-left: 4px solid ${type === 'error' ? '#ff4444' : type === 'success' ? '#4CAF50' : '#6496ff'};
      `;
      
      const text = document.createElement('p');
      text.textContent = message;
      text.style.cssText = 'margin: 0 0 20px 0; font-size: 14px; color: #333; line-height: 1.5;';
      
      const btn = document.createElement('button');
      btn.textContent = 'OK';
      btn.style.cssText = `
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#4CAF50' : '#6496ff'};
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        width: 100%;
        transition: background 0.2s;
      `;
      btn.onmouseover = () => btn.style.opacity = '0.9';
      btn.onmouseout = () => btn.style.opacity = '1';
      btn.onclick = () => {
        modal.remove();
        resolve();
      };
      
      modal.appendChild(text);
      modal.appendChild(btn);
      document.body.appendChild(modal);
    });
  }
  
  function showConfirm(message) {
    return new Promise(resolve => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 25px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 450px;
        border-left: 4px solid #ff4444;
      `;
      
      const text = document.createElement('p');
      text.textContent = message;
      text.style.cssText = 'margin: 0 0 20px 0; font-size: 14px; color: #333; line-height: 1.6;';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 10px;';
      
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = '✅ Oui, supprimer';
      confirmBtn.style.cssText = `
        flex: 1;
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
      `;
      confirmBtn.onmouseover = () => confirmBtn.style.background = '#cc0000';
      confirmBtn.onmouseout = () => confirmBtn.style.background = '#ff4444';
      confirmBtn.onclick = () => {
        modal.remove();
        resolve(true);
      };
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '❌ Annuler';
      cancelBtn.style.cssText = `
        flex: 1;
        background: #ccc;
        color: #333;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
      `;
      cancelBtn.onmouseover = () => cancelBtn.style.background = '#aaa';
      cancelBtn.onmouseout = () => cancelBtn.style.background = '#ccc';
      cancelBtn.onclick = () => {
        modal.remove();
        resolve(false);
      };
      
      buttonContainer.appendChild(confirmBtn);
      buttonContainer.appendChild(cancelBtn);
      modal.appendChild(text);
      modal.appendChild(buttonContainer);
      document.body.appendChild(modal);
    });
  }
  
  // ========== ÉTAPE 1 : CHARGER TOUS LES FAVORIS ==========
  console.log('⏳ Chargement de tous les favoris (scroll infini)...');
  
  let lastHeight = document.body.scrollHeight;
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newHeight = document.body.scrollHeight;
    if (newHeight === lastHeight) {
      console.log('✅ Tous les favoris sont chargés');
      break;
    }
    lastHeight = newHeight;
    attempts++;
  }

  // ========== ÉTAPE 2 : TROUVER TOUS LES ARTICLES VENDUS ==========
  const allItems = document.querySelectorAll('[data-testid="grid-item"]');
  console.log(`📊 Total d'articles: ${allItems.length}`);
  
  const soldItems = [];
  allItems.forEach(gridItem => {
    const statusText = gridItem.querySelector('[data-testid*="status-text"]');
    if (statusText && statusText.textContent.trim() === 'Vendu') {
      soldItems.push(gridItem);
    }
  });

  console.log(`📦 Articles marqués "Vendu": ${soldItems.length}`);

  if (soldItems.length === 0) {
    await showModal('✅ Aucun article vendu dans les favoris !', 'success');
    return;
  }

  // ========== ÉTAPE 3 : METTRE EN ÉVIDENCE LES ARTICLES VENDUS ==========
  soldItems.forEach((item, index) => {
    item.style.backgroundColor = '#ffe6e6';
    item.style.border = '4px solid #ff4444';
    item.style.borderRadius = '12px';
    item.style.padding = '8px';
    item.style.boxSizing = 'border-box';
    item.style.transition = 'all 0.3s ease';
    
    const badge = document.createElement('div');
    badge.textContent = '🔴 VENDU';
    badge.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: #ff4444;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 12px;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
    `;
    item.style.position = 'relative';
    item.appendChild(badge);
  });

  // ========== ÉTAPE 4 : CRÉER LE PANNEAU DE CONTRÔLE ==========
  const controlPanel = document.createElement('div');
  controlPanel.id = 'vinted-control-panel';
  controlPanel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 380px;
    border: 2px solid #ff4444;
  `;

  const title = document.createElement('h3');
  title.textContent = '🎯 Gestion des articles vendus';
  title.style.cssText = 'margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #ff4444; padding-bottom: 10px; color: #fff;';
  controlPanel.appendChild(title);

  const countText = document.createElement('p');
  countText.textContent = `📊 ${soldItems.length} article(s) trouvé(s)`;
  countText.style.cssText = 'margin: 0 0 15px 0; font-size: 13px; color: #aaa;';
  controlPanel.appendChild(countText);

  // ========== ÉTAPE 5 : AJOUTER LES CHECKBOXES ==========
  const checkboxContainer = document.createElement('div');
  checkboxContainer.style.cssText = 'max-height: 350px; overflow-y: auto; margin-bottom: 15px; padding-right: 8px;';

  const checkboxes = [];
  soldItems.forEach((item, index) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `sold-item-${index}`;
    checkbox.checked = true;
    checkbox.style.cssText = 'margin-right: 8px; cursor: pointer; width: 16px; height: 16px;';
    checkboxes.push({ checkbox, item });

    const itemTitle = item.querySelector('[data-testid*="description-title"]');
    const title = itemTitle ? itemTitle.textContent.trim().substring(0, 30) : `Article ${index + 1}`;

    const label = document.createElement('label');
    label.style.cssText = 'cursor: pointer; display: flex; align-items: center; padding: 8px 0; font-size: 13px; border-bottom: 1px solid #444;';
    
    const checkboxWrapper = document.createElement('span');
    checkboxWrapper.appendChild(checkbox);
    label.appendChild(checkboxWrapper);
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;
    titleSpan.style.cssText = 'flex: 1; margin-left: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
    label.appendChild(titleSpan);

    checkboxContainer.appendChild(label);
  });

  controlPanel.appendChild(checkboxContainer);

  // ========== ÉTAPE 6 : BOUTONS D'ACTION ==========
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px;';

  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = '✅ Tout';
  selectAllBtn.style.cssText = `
    flex: 1;
    padding: 10px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 12px;
    transition: background 0.2s;
  `;
  selectAllBtn.onmouseover = () => selectAllBtn.style.background = '#45a049';
  selectAllBtn.onmouseout = () => selectAllBtn.style.background = '#4CAF50';
  selectAllBtn.onclick = () => checkboxes.forEach(({ checkbox }) => checkbox.checked = true);
  buttonContainer.appendChild(selectAllBtn);

  const deselectAllBtn = document.createElement('button');
  deselectAllBtn.textContent = '❌ Aucun';
  deselectAllBtn.style.cssText = `
    flex: 1;
    padding: 10px;
    background: #777;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 12px;
    transition: background 0.2s;
  `;
  deselectAllBtn.onmouseover = () => deselectAllBtn.style.background = '#555';
  deselectAllBtn.onmouseout = () => deselectAllBtn.style.background = '#777';
  deselectAllBtn.onclick = () => checkboxes.forEach(({ checkbox }) => checkbox.checked = false);
  buttonContainer.appendChild(deselectAllBtn);

  controlPanel.appendChild(buttonContainer);

  // ========== ÉTAPE 7 : BOUTON SUPPRIMER ==========
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️ Supprimer la sélection';
  deleteBtn.style.cssText = `
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.3s;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
  `;
  deleteBtn.onmouseover = () => {
    deleteBtn.style.background = 'linear-gradient(135deg, #ff6666 0%, #dd1111 100%)';
    deleteBtn.style.transform = 'translateY(-2px)';
  };
  deleteBtn.onmouseout = () => {
    deleteBtn.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
    deleteBtn.style.transform = 'translateY(0)';
  };
  
  deleteBtn.onclick = async () => {
    const selectedItems = checkboxes
      .filter(({ checkbox }) => checkbox.checked)
      .map(({ item }) => item);

    if (selectedItems.length === 0) {
      await showModal('⚠️ Aucun article sélectionné', 'info');
      return;
    }

    const confirmed = await showConfirm(
      `⚠️ Vous allez supprimer ${selectedItems.length} article(s) des favoris.\n\nÊtes-vous sûr ?`
    );
    if (!confirmed) return;

    deleteBtn.disabled = true;
    deleteBtn.textContent = '⏳ Suppression en cours...';
    deleteBtn.style.opacity = '0.6';

    console.log(`🗑️ Suppression de ${selectedItems.length} article(s)...`);
    
    let successCount = 0;
    for (const item of selectedItems) {
      try {
        const favoriteBtn = item.querySelector('button[data-testid*="favourite"]');
        
        if (favoriteBtn) {
          const beforeState = favoriteBtn.getAttribute('aria-pressed');
          favoriteBtn.click();
          await new Promise(resolve => setTimeout(resolve, 400));
          
          const afterState = favoriteBtn.getAttribute('aria-pressed');
          if (beforeState !== afterState) {
            successCount++;
            console.log(`✅ Article supprimé (${successCount}/${selectedItems.length})`);
          }
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
      }
    }

    await showModal(`✅ ${successCount}/${selectedItems.length} article(s) supprimé(s)\n\n⏳ La page va se recharger...`, 'success');
    
    setTimeout(() => {
      location.reload();
    }, 1500);
  };

  controlPanel.appendChild(deleteBtn);

  // ========== ÉTAPE 8 : NOTES ==========
  const note = document.createElement('p');
  note.innerHTML = '💡 Les articles rouges = VENDUS<br>🔄 Rafraîchis après suppression';
  note.style.cssText = 'margin: 0; font-size: 12px; color: #999; border-top: 1px solid #555; padding-top: 12px; line-height: 1.5;';
  controlPanel.appendChild(note);

  // ========== ÉTAPE 9 : BOUTON FERMER ==========
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 68, 68, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    font-weight: bold;
    padding: 0;
    transition: all 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = '#ff4444';
  closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 68, 68, 0.8)';
  closeBtn.onclick = () => controlPanel.remove();
  controlPanel.appendChild(closeBtn);

  // ========== ÉTAPE 10 : AJOUTER LE PANNEAU ==========
  document.body.appendChild(controlPanel);

  console.log('✅ Panneau créé !');
  console.log('📌 Articles vendus en ROUGE');
  console.log('🎯 Cochez ceux à supprimer et cliquez sur Supprimer');
  console.log(`📊 Total à gérer: ${soldItems.length}`);
})();
