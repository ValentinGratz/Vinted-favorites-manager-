# 🚀 Commence ici - Vinted Favorites Manager

Bienvenue! Ce projet contient deux façons de gérer tes articles vendus sur Vinted.

---

## ⚡ Démarrage rapide (< 2 minutes)

### Méthode 1️⃣ : Script Console (Pas d'installation)

**Meilleure option pour:** Test rapide, utilisation occasionnelle

```
1. Va sur https://www.vinted.fr/member/items/favourite_list
2. Ouvre le fichier: 1-vinted-console-script.js
3. Copie tout le contenu
4. Ouvre la console: Ctrl+Shift+J (Chrome) ou Cmd+Option+J (Mac)
5. Colle le code et appuie sur Entrée
6. Attends ~15 secondes
7. Un panneau rouge apparaît en bas à droite ➡️ Utilise-le!
```

✅ **Avantages:** Zéro installation, marche partout  
❌ **Inconvénients:** À faire à chaque fois

---

### Méthode 2️⃣ : Extension Chrome (Installation 5 min)

**Meilleure option pour:** Utilisation régulière, praticité

```
1. Va sur chrome://extensions/
2. Active le "Mode de développeur" (en haut à droite)
3. Clique "Charger l'extension non empaquetée"
4. Sélectionne le dossier: extension/
5. C'est prêt! 🎉
```

✅ **Avantages:** Bouton automatique, plus professionnel  
❌ **Inconvénients:** Installation requise, Chrome seulement

---

## 📖 Fichiers importants

```
📦 Dossier du projet
├── 1-vinted-console-script.js    👈 Utilise ça pour le Script Console
├── extension/                     👈 Utilise ça pour l'Extension Chrome
│   ├── manifest.json
│   ├── content-script.js
│   ├── popup.html
│   └── images/
├── README.md                      📚 Guide complet
├── INSTALL.md                     📚 Détails d'installation
└── QUICKSTART.md                  📚 Ce fichier
```

---

## 🤔 Quelle méthode choisir?

| Je veux... | Utilise... |
|-----------|-----------|
| Tester rapidement | **Script Console** |
| L'utiliser tous les jours | **Extension Chrome** |
| Pas d'installation | **Script Console** |
| Un bouton automatique | **Extension Chrome** |
| Marcher sur Firefox | **Script Console** |
| Meilleure UI/UX | **Extension Chrome** |

---

## 🎯 Ce que ça fait exactement

1. ✅ **Détecte** tous les articles "Vendu" dans tes favoris
2. 🎨 **Les met en évidence** en rouge (très visible)
3. ☑️ **Tu sélectionnes** ceux à supprimer (avec checkboxes)
4. 🗑️ **Tu supprimes** tous en un seul clic
5. 🔄 **Confirmation** avant suppression (tu restes maitre)
6. ✅ **Vérification** que c'est bien supprimé
7. 🔄 **Page reloadée** automatiquement

---

## ⚠️ Points importants

### ❌ Ce que ça NE fait PAS
- Ne supprime PAS tes annonces
- Ne supprime que des favoris
- N'envoie pas de données ailleurs
- N'est pas une menace pour ton compte

### ✅ Ce que ça FAIT
- Simule des clics sur le bouton "coeur"
- Charge automatiquement tous tes favoris
- Vous demande confirmation avant de supprimer
- Fonctionne 100% localement (pas de serveur)

### 🔐 Sécurité
- Aucune donnée n'est envoyée
- Pas de suivi
- Pas de publicités
- Code open-source (tu peux vérifier)

---

## 📞 Besoin d'aide?

### Première étape
1. Lis le **README.md** pour plus de détails
2. Lis le **INSTALL.md** pour l'installation

### Erreurs/Problèmes
- Va sur **README.md → FAQ**
- Va sur **INSTALL.md → Dépannage**

### Toujours pas réglé?
- Crée une issue sur GitHub
- Contacte le développeur
- Décris le problème au maximum

---

## 🎨 Personnalisation (optionnel)

Si tu veux changer les couleurs/textes:

### Pour le Script Console
- Ouvre `1-vinted-console-script.js`
- Cherche `#ff4444` (couleur rouge)
- Remplace par ta couleur préférée

### Pour l'Extension
- Ouvre `extension/content-script.js`
- Modifie les variables `style.cssText`

---

## ✨ Bonnes pratiques

1. **Avant de supprimer:**
   - Assure-toi d'avoir bien sélectionné les articles
   - La suppression est irréversible
   - Mais tu peux les re-favoriser après

2. **Après suppression:**
   - La page se recharge (c'est normal)
   - Les articles vendus disparaissent
   - Tu peux relancer dès que tu veux

3. **Maintenance:**
   - Recharge occasionnellement pour avoir les derniers updates
   - Brique des icônes? Mets à jour l'extension

---

## 🚀 Prêt?

### Je veux tester rapidement
👉 **Utilise le Script Console** (1 minute)

### Je l'utilise souvent
👉 **Installe l'Extension** (5 minutes)

---

## 📊 Informations techniques

- **Version:** 1.0.0
- **Langage:** JavaScript
- **Navigateurs:** Chrome, Edge, Brave, Opera (+ tous pour le script)
- **Taille:** ~50KB
- **Dépendances:** Aucune

---

## 🎉 Commençons!

Choisis ta méthode ci-dessus et vas-y! 

**Des questions?** Lis les fichiers README ou INSTALL!

**C'est au top!** Partage ce project si tu l'aimes ⭐

---

**Bonne gestion de tes favoris!** 🚀
