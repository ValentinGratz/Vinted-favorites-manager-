
# 🎯 Vinted Favorites Manager

**Gérez facilement vos favoris Vinted !**

2 outils simples + 1 extension Chrome pour nettoyer vos favoris : supprimez les articles vendus et faites des sessions de retrait par dressing. Même avec 2400+ favoris.

---

## 📋 Table des matières
- [Fonctionnalités](#-fonctionnalités)
- [Les 2 Scripts + Extension](#-les-2-scripts--extension)
- [Installation](#-installation)
- [Extension Chrome - Aperçu](#-extension-chrome---aperçu)
- [FAQ](#-faq)

---

## ✨ Fonctionnalités

✅ **Détection automatique** - Identifie les vendus OU tes favs dans un dressing  
✅ **Mise en évidence visuelle** - Rouge pour vendu, bleu pour favs dressing  
✅ **Sélection facile** - Cochez/décochez rapidement  
✅ **Suppression en masse** - Retirez plusieurs articles en un seul clic  
✅ **Chargement automatique** - Scroll infini géré + mode ULTRA anti-crash écran blanc pour gros comptes 2000+  
✅ **100% Console OU Extension** - Au choix  
✅ **Multi-langues** - Fonctionne sur tous les domaines Vinted (FR, DE, ES, etc.)

---

## 📦 Les 2 Scripts + Extension

### 1⃣ `1-vinted-console-script.js` - Nettoyage des VENDUS
**Pour ta page favoris globale**

- Va sur https://www.vinted.fr/member/items/favourite_list
- Détecte tous les articles avec le bandeau "Vendu"
- Les supprime de tes favoris en masse

### 2⃣ `2-vinted-dressing-fav-cleaner.js` - Session retrait de favs par DRESSING
**Pour la page dressing d'un vendeur**

- Va sur https://www.vinted.fr/member/XXXX/items
- Détecte UNIQUEMENT les articles de CE dressing qui sont déjà dans tes favoris
- Te permet de les retirer d'un coup

### 3⃣ `extension/` - Extension Chrome [RECOMMANDÉ pour 2000+ favs]
- Mode ULTRA 2420 : optimisation RAM, scan jusqu'à 3000 favs sans écran blanc
- 2 boutons en bas à droite directement sur Vinted

---

## 🚀 Installation

### Option A : Extension (recommandée)
1. Télécharge ce repo
2. Va sur `chrome://extensions/` -> Mode développeur ON
3. Charger non empaquetée -> sélectionne le dossier `extension`
4. Va sur tes favoris Vinted

### Option B : Console
1. Va sur `/favourite_list` ou dressing
2. Console : `Ctrl + Shift + J`
3. Copie/colle le .js correspondant

### Tuto Vidéo
🎥 Démo :
[![Démo](https://img.youtube.com/vi/rOKLo2hO7Wo/maxresdefault.jpg)](https://youtu.be/rOKLo2hO7Wo)

---

## 🖼️ Extension Chrome - Aperçu

Une fois activée, tu as ce petit encadré en bas à droite sur Vinted :

![Encadré extension après activation](docs/screenshot-launcher.png)
> 📸 **Espace pour ton image :** fais un screenshot de l'encadré noir avec les 2 boutons `🔴 Vendus 2420` et `💙 Dressing`

---

## ❓ FAQ

### Q : Est-ce que ça supprime vraiment les articles?
**R :** Non, ça ne fait que les retirer de ta liste **"Favoris"**.

### Q : Risque d'être repéré par Vinted ? Vous faites la guerre aux extensions comme Clemz ?
**R : Très bonne question, et tu as raison ils sont devenus paranos depuis Clemz. Pour cette extension : risque = quasi 0**

**Pourquoi :**

1.  **Clemz s'est fait défoncer parce qu'il touche à l'algorithme de visibilité.** Republier = remonter en haut de page = Vinted perd de l'argent (les gens ne paient plus le Boost). C'est pour ça qu'ils le traquent. Ils checkent `POST /items` en masse + même image hash.

2.  **Cette extension ne fait QUE cliquer sur le petit coeur.** C'est exactement la même action que si tu cliquais à la main 2400 fois. Le code fait :
    ```js
    favBtn.click() // clic natif du navigateur
    await sleep(500 + random)
    ```
    Pour Vinted, c'est indétectable d'un humain. Il n'y a pas d'appel API privé.

**Pour rester 100% safe :**
- Batch de 300 auto (géré par l'extension v1.4)
- 1 scan par semaine suffit

### Q : J'ai 2400 favs et écran blanc ?
**R :** C'est Vinted qui crash au delà de ~800 favs. Utilise l'extension v1.4 ULTRA : elle supprime les images anciennes pour libérer la RAM.

### Q : Ça fonctionne sur Vinted.com / .de / .es ?
**R :** Oui ! 🇫🇷 .fr - 🇬🇧 .com - 🇩🇪 .de - 🇪🇸 .es - 🇮🇹 .it - 🇳🇱 .nl etc.

---

## 📄 Licence
MIT - Not affiliated with Vinted.
