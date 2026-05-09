# 📦 Guide d'installation - Vinted Favorites Manager

Deux options pour utiliser Vinted Favorites Manager. Choisis celle qui te convient!

---

## 🔥 Option 1: Script Console (Rapide et facile)

**Idéal pour:** Une utilisation ponctuelle, sans installer rien  
**Temps:** < 2 minutes  
**Complexité:** Très facile

### Étapes:

1. **Va sur la page des favoris**
   ```
   https://www.vinted.fr/member/items/favourite_list
   ```

2. **Ouvre le fichier `1-vinted-console-script.js`**
   - Double-clique dessus (il s'ouvrira dans ton éditeur de texte)
   - Ou va dans le dossier et copie le lien du fichier

3. **Copie tout le contenu du fichier**
   - Sélectionne tout : `Ctrl+A` (ou `Cmd+A` sur Mac)
   - Copie : `Ctrl+C` (ou `Cmd+C` sur Mac)

4. **Ouvre la console de ton navigateur**
   - **Chrome/Edge/Brave:**
     - Windows/Linux: Appuie sur `Ctrl + Shift + J`
     - Mac: Appuie sur `Cmd + Option + J`
   - **Firefox:**
     - Windows/Linux: Appuie sur `Ctrl + Shift + K`
     - Mac: Appuie sur `Cmd + Option + K`
   - **Safari:**
     - Développer → JavaScript Console (il faut d'abord activer le menu Développer)

5. **Colle le code dans la console**
   - Clique dans la console (tu dois voir une ligne `>`)
   - Colle le code : `Ctrl+V` (ou `Cmd+V` sur Mac)

6. **Appuie sur Entrée**
   - ⏳ Attends 10-15 secondes
   - Le script charge tous tes favoris automatiquement
   - Un panneau **rouge et gris** apparaît en bas à droite

7. **Utilise le panneau**
   - Sélectionne les articles à supprimer
   - Clique le bouton rouge "🗑️ Supprimer la sélection"
   - Confirme quand demandé
   - C'est fait! 🎉

---

## 🚀 Option 2: Extension Chrome (Professionnel et permanent)

**Idéal pour:** Une utilisation régulière  
**Temps:** < 5 minutes  
**Complexité:** Facile

### Avant de commencer

- Tu dois utiliser **Google Chrome, Edge, Brave ou Opera**
- Firefox a besoin d'une autre version (non supportée actuellement)
- Safari n'accepte que les extensions de l'App Store

### Étapes d'installation:

#### Étape 1: Télécharge les fichiers

1. Clique sur le bouton **"Code"** vert (sur GitHub)
2. Sélectionne **"Download ZIP"**
3. Décompresse le ZIP téléchargé
4. Tu vas voir un dossier `extension/`

#### Étape 2: Active le Mode Développeur

1. Ouvre Chrome et va sur `chrome://extensions/`
   - Copie ce texte dans la barre d'adresse et appuie sur Entrée
   - Ou: Menu Chrome → Plus d'outils → Extensions

2. En haut à droite, bascule le **Mode de développeur** ON
   ```
   Mode de développeur [bascule vers ON]
   ```

3. Trois nouveaux boutons apparaissent en haut:
   - "Charger l'extension non empaquetée"
   - "Empaqueter l'extension"
   - "Mettre à jour les extensions"

#### Étape 3: Charge l'extension

1. Clique sur **"Charger l'extension non empaquetée"**

2. Une fenêtre "Ouvrir un fichier" s'affiche

3. Navigue vers le dossier `extension/` que tu as téléchargé
   - Cherche le dossier contenant:
     - `manifest.json`
     - `content-script.js`
     - `popup.html`
     - `images/` (dossier)

4. Sélectionne le dossier `extension/` et clique **"Sélectionner un dossier"**

5. 🎉 L'extension est installée!

#### Étape 4: Vérifie l'installation

1. Tu dois voir l'icône de l'extension en **haut à droite** de Chrome
   - C'est un petit carré rouge avec un cœur blanc

2. Va sur https://www.vinted.fr/member/items/favourite_list

3. Un bouton **rouge "🎯 Gérer les articles vendus"** doit apparaître en haut à droite

4. Clique-le pour tester!

---

## 🆚 Comparaison des deux options

| | Script Console | Extension Chrome |
|---|---|---|
| **Installation** | Zéro installation | 5 min (une seule fois) |
| **Utilisation** | À chaque fois coller le code | Un clic sur le bouton |
| **Disponibilité** | À utiliser manuellement | Toujours disponible |
| **Compatibilité** | Tous les navigateurs | Chrome, Edge, Brave, Opera |
| **Idéal pour** | Utilisation occasionnelle | Utilisation régulière |
| **Facilité** | Très facile | Facile |

---

## ❓ Dépannage

### Je ne vois pas l'icône de l'extension

**Solution 1:** Vérifier le chargement
- Va sur `chrome://extensions/`
- Cherche "Vinted Favorites Manager"
- Assure-toi que le switch est **ON** (bleu)

**Solution 2:** Rendre l'icône visible
- Dans Chrome, en haut à droite, clique l'icône **"Extension"** (puzzle)
- Cherche "Vinted Favorites Manager"
- Clique sur le **point gris** pour l'épingler à la barre

**Solution 3:** Désactiver les adblockers
- Les adblockers peuvent empêcher l'extension de se charger
- Désactive-le temporairement et recharge la page

### Le bouton n'apparaît pas sur Vinted

**Vérifications:**
- Es-tu sur https://www.vinted.fr/member/items/favourite_list ? (exactement cette URL)
- L'extension est activée dans `chrome://extensions/` ?
- Y a-t-il des adblockers actifs?
- As-tu reloadé la page? (F5)

**Solution:** Réinstalle l'extension
1. Va sur `chrome://extensions/`
2. Clique le bouton poubelle pour supprimer "Vinted Favorites Manager"
3. Recharge la page du GitHub
4. Réinstalle l'extension en suivant les étapes ci-dessus

### Le script console n'affiche aucun article

**Causes possibles:**
- Tu n'as aucun article "Vendu" dans tes favoris (c'est bon, tu es clean! ✅)
- Vinted a changé sa structure HTML (contacte le dev)
- Tu n'as pas attendu les 10-15 secondes de chargement

**Solution:**
- Ouvre la console (F12)
- Regarde les messages bleus/rouges
- Si tu vois "Articles marqués Vendu: 0", c'est normal

### L'extension me demande des permissions bizarres

**Normal!** L'extension a besoin de:
- Accéder à Vinted (pour fonctionner)
- Exécuter des scripts (pour détecter les articles)

Cela ne télécharge rien et ne spamme pas.

---

## 📞 Support

Des problèmes? Des questions?

### Par Email
Envoie un email avec:
- Une capture d'écran du problème
- Ton navigateur et sa version
- L'étape exacte où ça bloque

### Par GitHub
Crée une "issue" (problème) sur le repo GitHub avec:
- Titre descriptif
- Description détaillée
- Capture d'écran si possible

### Conseils utiles
- Essaye d'abord avec le Script Console (plus simple à déboguer)
- Désactive les adblockers
- Recharge ta page (`F5`)
- Vide le cache Chrome (`Ctrl+Shift+Delete`)

---

## 🔐 Questions de sécurité

### Le code va-t-il spammer automatiquement?
Non. Le script ne fait que simuler des clics. Il attend ta confirmation avant chaque suppression.

### Mes données sont-elles sécurisées?
Oui. L'extension ne communique avec aucun serveur. Tout se passe localement sur ta page Vinted.

### C'est légal?
Oui. C'est un tool personnel qui simule ce que tu ferais manuellement. Aucun terme d'usage n'est violé.

### Comment Vinted pourrait-il bloquer ça?
Vinted pourrait changer la structure HTML de sa page. Mais l'extension serait mise à jour.

---

## 🎯 Prochaines étapes

Une fois installée:

1. **Va sur tes favoris**: https://www.vinted.fr/member/items/favourite_list

2. **(Extension)** Clique le bouton rouge qui apparaît

3. **(Console)** Colle le code dans la console

4. Attends le chargement (~15 secondes)

5. Sélectionne tes articles vendus

6. Clique "Supprimer"

7. Profite de tes favoris nettoyés! 🎉

---

## 📊 Specifications

- **Navigateurs supportés:** Chrome, Edge, Brave, Opera (+ tous pour le script console)
- **Taille extension:** ~50KB
- **Taille script:** ~15KB
- **Performance:** Très rapide, pas de lag
- **Dépendances:** Aucune

---

**Besoin d'aide? Regarde la section FAQ du README.md principal!**

Bonne gestion de tes favoris! 🚀
