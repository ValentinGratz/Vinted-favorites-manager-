# 🎯 Vinted Favorites Manager

**Gérez facilement vos articles vendus dans Vinted !**

Un outil simple et efficace pour détecter, sélectionner et supprimer rapidement tous vos articles marqués "Vendu" de la liste des favoris Vinted.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Versions disponibles](#-versions-disponibles)
- [FAQ](#-faq)
- [Support](#-support)

---

## ✨ Fonctionnalités

✅ **Détection automatique** - Identifie tous les articles "Vendu"  
✅ **Mise en évidence visuelle** - Les articles vendus s'affichent en rouge  
✅ **Sélection facile** - Cochez/décochez rapidement les articles  
✅ **Suppression en masse** - Retirez plusieurs articles en un seul clic  
✅ **Vérification** - Le script confirme chaque suppression  
✅ **Chargement automatique** - Charge tous vos favoris même avec scroll infini  
✅ **Rafraîchissement** - La page se recharge automatiquement après suppression  
✅ **Multi-langues** - Fonctionne sur tous les domaines Vinted (FR, DE, ES, etc.)

---

## 🚀 Installation

### **Option 1️⃣ : Script Console (Rapide, sans installation)**

**Parfait pour une utilisation ponctuelle**

1. Va sur https://www.vinted.fr/member/items/favourite_list
2. Ouvre le fichier `console-script.js` ou copie son contenu
3. Ouvre la console de ton navigateur :
   - **Windows/Linux** : `Ctrl + Shift + J`
   - **Mac** : `Cmd + Option + J`
4. Colle tout le code dans la console
5. Appuie sur **Entrée**
6. Attends 10-15 secondes (chargement des favoris)
7. Utilise le panneau qui apparaît en bas à droite

---

### **Option 2️⃣ : Extension Chrome (Meilleure expérience)**

**Parfait pour une utilisation régulière**

1. **Télécharge le dossier `extension`**

2. **Active le Mode développeur** dans Chrome :
   - Va sur `chrome://extensions/`
   - Active le **Mode de développeur** (en haut à droite)

3. **Charge l'extension** :
   - Clique sur **Charger l'extension non empaquetée**
   - Sélectionne le dossier `extension`

4. **C'est prêt !**
   - Tu verras l'icône de l'extension en haut à droite
   - Chaque fois que tu iras sur tes favoris Vinted, un bouton apparaîtra

---

## 📖 Utilisation

### **Avec l'extension Chrome**

1. Va sur https://www.vinted.fr/member/items/favourite_list
2. Un **bouton rouge "🎯 Gérer les articles vendus"** apparaît en haut à droite
3. Clique dessus → le panneau de gestion s'affiche
4. Le script charge automatiquement tous tes favoris (scroll infini)
5. Sélectionne les articles à supprimer via les checkboxes
6. Clique sur **"🗑️ Supprimer la sélection"**
7. Confirme la suppression
8. La page se recharge automatiquement

### **Avec le script console**

Même processus, mais tu colles d'abord le code dans la console.

---

## 🎯 Fonctionnement détaillé

### **Étape 1 : Chargement des favoris**
Le script scroll automatiquement jusqu'en bas de ta page pour charger TOUS tes favoris (Vinted charge avec le scroll infini).

### **Étape 2 : Détection**
Tous les articles marqués "Vendu" sont détectés et mis en évidence avec :
- 🎨 Un fond **rose clair** + bordure **rouge**
- 🔴 Un badge "VENDU" visible en haut à gauche

### **Étape 3 : Sélection**
Tu peux :
- ✅ **Tout sélectionner** (bouton vert)
- ❌ **Tout désélectionner** (bouton gris)
- ☑️ Cocher/décocher individuellement

### **Étape 4 : Suppression**
- Clique le bouton rouge **"🗑️ Supprimer la sélection"**
- Une confirmation apparaît
- Le script clique sur le cœur de chaque article (le retira des favoris)
- La page se recharge automatiquement

---

## 📦 Versions disponibles

### **console-script.js**
- ✅ Pas d'installation
- ✅ À utiliser dans la console du navigateur
- ✅ Fonctionne une seule fois
- ✅ Portable (tu peux partager le code)

### **Extension Chrome** (dossier `extension/`)
- ✅ Installation permanente
- ✅ Bouton automatique sur Vinted
- ✅ Interface polished et professionnelle
- ✅ Toujours disponible

---

## ❓ FAQ

### **Q : Est-ce que ça supprime vraiment les articles?**
**R :** Non, ça ne fait que les retirer de ta liste **"Favoris"**. Tes annonces (vendues ou non) ne sont pas affectées.

### **Q : Combien de temps ça prend?**
**R :** 
- Chargement des favoris : 10-15 secondes
- Suppression : quelques secondes

### **Q : Est-ce que c'est dangereux?**
**R :** Non, c'est complètement sûr. Le script ne fait que simuler des clics sur le bouton "favoris" (le cœur).

### **Q : Je ne vois pas le bouton rouge**
**R :** 
- Assure-toi d'être sur https://www.vinted.fr/member/items/favourite_list
- Recharge la page
- Si tu utilises un adblocker, désactive-le temporairement

### **Q : Ça fonctionne sur Vinted.com (UK)?**
**R :** Oui ! L'extension fonctionne sur :
- 🇫🇷 vinted.fr
- 🇬🇧 vinted.com  
- 🇩🇪 vinted.de
- 🇪🇸 vinted.es
- 🇮🇹 vinted.it
- 🇳🇱 vinted.nl
- 🇧🇪 vinted.be
- 🇵🇱 vinted.pl
- 🇸🇪 vinted.se
- 🇩🇰 vinted.dk
- 🇨🇿 vinted.cz
- 🇱🇹 vinted.lt

### **Q : Comment je désinstalle l'extension?**
**R :** Va sur `chrome://extensions/`, cherche "Vinted Favorites Manager" et clique sur le bouton poubelle.

---

## 🛠️ Support & Questions

Problème? Questions?

- 📧 Crée une issue sur GitHub
- 💬 Contacte le développeur
- 🐛 Reporte les bugs avec une description et une capture d'écran

---

## 📄 Licence

Ce projet est libre d'utilisation et de modification.

---

## 🙏 Remerciements

Merci d'utiliser Vinted Favorites Manager!

💡 **Conseil** : Si tu trouves ça utile, partage-le à tes amis qui utilisent Vinted! ⭐

---

## 📊 Statistiques

- **Compatible** : Chrome, Edge, Brave, Opera
- **Langues** : Français (pour la page, mais le script fonctionne partout)
- **Taille** : < 50KB
- **Performance** : Instantanée

---

## 🎨 Captures d'écran

### Avant
La page est pleine d'articles vendus mélangés aux autres.

### Après
Tous les articles vendus en rouge, faciles à supprimer!

---

**Bonne gestion de tes favoris! 🚀**
