# 🎯 Vinted Favorites Manager

**Gérez facilement vos favoris Vinted !**

2 outils simples et efficaces pour nettoyer vos favoris : supprimez les articles vendus et faites des sessions de retrait par dressing.

---

## 📋 Table des matières
- [Fonctionnalités](#-fonctionnalités)
- [Les 2 Scripts](#-les-2-scripts)
- [Installation](#-installation)
- [FAQ](#-faq)

---

## ✨ Fonctionnalités

✅ **Détection automatique** - Identifie les vendus OU tes favs dans un dressing  
✅ **Mise en évidence visuelle** - Rouge pour vendu, bleu pour favs dressing  
✅ **Sélection facile** - Cochez/décochez rapidement  
✅ **Suppression en masse** - Retirez plusieurs articles en un seul clic  
✅ **Chargement automatique** - Scroll infini géré automatiquement  
✅ **100% Console** - Pas d'installation, juste copier/coller  
✅ **Multi-langues** - Fonctionne sur tous les domaines Vinted (FR, DE, ES, etc.)

---

## 📦 Les 2 Scripts

### 1️⃣ `1-vinted-console-script.js` - Nettoyage des VENDUS
**Pour ta page favoris globale**

- Va sur https://www.vinted.fr/member/items/favourite_list
- Détecte tous les articles avec le bandeau "Vendu"
- Les supprime de tes favoris en masse

**Quand l'utiliser ?** Une fois par semaine pour garder tes favoris propres.

### 2️⃣ `2-vinted-dressing-fav-cleaner.js` - Session retrait de favs par DRESSING [NOUVEAU]
**Pour la page dressing d'un vendeur**

- Va sur https://www.vinted.fr/member/XXXX/items (le dressing d'une personne)
- Détecte UNIQUEMENT les articles de CE dressing qui sont déjà dans tes favoris
- Te permet de les retirer d'un coup

**Quand l'utiliser ?** Quand tu veux unfollow un vendeur, ou quand un dressing ne t'intéresse plus. Ultra pratique au lieu de cliquer 50 fois sur les coeurs.

> ⚠️ Ce script ne touche JAMAIS aux articles qui ne sont pas dans tes favs. Il ne fait que retirer.

---

## 🚀 Installation - Utilisation (identique pour les 2)

**Aucune installation, 100% console :**

1. Va sur la bonne page :
   - Script 1 -> tes favoris : `/member/items/favourite_list`
   - Script 2 -> un dressing : `/member/NOM-DU-VENDEUR/items`

2. Ouvre la console :
   - **Windows/Linux** : `Ctrl + Shift + J`
   - **Mac** : `Cmd + Option + J`

3. Ouvre le fichier `.js` correspondant sur GitHub et copie tout le code

4. Colle dans la console et appuie sur **Entrée**

5. Attends 15-20 secondes (chargement auto du scroll infini)

6. Utilise le panneau qui apparaît en bas à droite :
   - ✅ Tout / ❌ Aucun
   - Coche ce que tu veux retirer
   - Clique sur Supprimer / Retirer

### Tuto Vidéo
🎥 Démo de l'outil vendus :
[![Démo de l'outil](https://img.youtube.com/vi/rOKLo2hO7Wo/maxresdefault.jpg)](https://youtu.be/rOKLo2hO7Wo)

---

## 🎯 Fonctionnement détaillé

### Étape 1 : Chargement
Le script scroll automatiquement tout en bas pour charger TOUS les articles (Vinted charge en scroll infini).

### Étape 2 : Détection
- **Script 1** : Cherche `[data-testid*="status-text"] = "Vendu"` -> badge rouge
- **Script 2** : Cherche `aria-label="Retirer des favoris"` -> badge bleu "DANS TES FAVS"

### Étape 3 : Sélection & Suppression
Tu sélectionnes et le script simule un clic sur le coeur. Ça ne supprime pas l'annonce, ça la retire juste de tes favoris.

---

## ❓ FAQ

### Q : Est-ce que ça supprime vraiment les articles?
**R :** Non, ça ne fait que les retirer de ta liste **"Favoris"**. Les annonces des vendeurs ne sont pas affectées.

### Q : C'est dangereux pour mon compte?
**R :** Non, c'est complètement sûr. Ça simule juste des clics sur le bouton coeur, comme si tu le faisais à la main. Mais espace les grosses sessions (pas 500 d'un coup).

### Q : Ça fonctionne sur Vinted.com / .de / .es ?
**R :** Oui ! Fonctionne sur :
- 🇫🇷 vinted.fr - 🇬🇧 vinted.com - 🇩🇪 vinted.de - 🇪🇸 vinted.es - 🇮🇹 vinted.it - 🇳🇱 vinted.nl - 🇧🇪 vinted.be - 🇵🇱 vinted.pl et autres.

### Q : Le script 2 me dit 0 favs alors que j'en ai ?
**R :** Vinted change parfois son `aria-label`. Ouvre une issue avec une capture du bouton coeur (clic droit > inspecter).

---

## 🛠️ Support

Problème? Questions? -> Crée une issue sur GitHub

---

## 📄 Licence
Libre d'utilisation et de modification.

## 🙏 Remerciements
Scripts faits avec Claude IA (version gratuite) puis améliorés avec Meta AI.

💡 Si ça t'aide, partage le repo à tes amis Vinted ! ⭐

**Bonne gestion de tes favoris! 🚀**
