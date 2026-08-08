# 📦 Guide d'installation - Vinted Favorites Manager

Deux scripts console pour nettoyer tes favoris Vinted. 100% sans installation, juste copier/coller.

---

## 🔥 Script 1 : Nettoyage des articles VENDUS (page favoris)

**Idéal pour :** Nettoyer tes favoris globaux des articles déjà vendus  
**Page :** https://www.vinted.fr/member/items/favourite_list  
**Fichier :** `1-vinted-console-script.js`

### Étapes :

1. **Va sur la page des favoris** : https://www.vinted.fr/member/items/favourite_list
2. **Ouvre le fichier `1-vinted-console-script.js` sur GitHub**
   - Clique sur le fichier puis sur "Copy raw content" / copie tout le code

3. **Copie tout le contenu**
   - `Ctrl+A` puis `Ctrl+C` (ou `Cmd+A` / `Cmd+C` sur Mac)

4. **Ouvre la console de ton navigateur**
   - **Chrome/Edge/Brave:** `Ctrl + Shift + J` (Windows) / `Cmd + Option + J` (Mac)
   - **Firefox:** `Ctrl + Shift + K` / `Cmd + Option + K`

5. **Colle le code dans la console et appuie sur Entrée**
   - ⏳ Attends 15-20 secondes, le script scroll tout seul pour tout charger
   - Un panneau **rouge** apparaît en bas à droite

6. **Utilise le panneau**
   - Les articles vendus sont entourés en rouge avec badge "VENDU"
   - Coche / décoche, puis "🗑️ Supprimer la sélection"

---

## 💙 Script 2 : Session retrait de favs par DRESSING [NOUVEAU]

**Idéal pour :** Retirer d'un coup tous tes favs qui viennent d'un même vendeur  
**Page :** https://www.vinted.fr/member/XXXX/items (n'importe quel dressing)  
**Fichier :** `2-vinted-dressing-fav-cleaner.js` ou `vinted-dressing-fav-cleaner-FIXED.js`

**Ce que ça fait :** Il ne touche PAS à tout le dressing. Il détecte uniquement les articles DE CE dressing qui sont DÉJÀ dans tes favoris et te propose de les retirer.

### Étapes :

1. **Va sur le dressing de la personne**
Exemple: https://www.vinted.fr/member/12345678-lucie/items

2. **Ouvre le fichier `2-vinted-dressing-fav-cleaner.js` sur GitHub**

3. **Copie tout le contenu**

4. **Ouvre la console** (même raccourci que ci-dessus)

5. **Colle le code et Entrée**
   - ⏳ Attends 15-20 secondes de chargement complet
   - Un panneau **bleu** apparaît en bas à droite
   - Seuls tes favs de ce dressing sont listés et entourés en bleu "💙 DANS TES FAVS"

6. **Utilise le panneau**
   - Sélectionne ceux que tu veux retirer
   - Clique "Retirer la sélection de mes favs"
   - Confirme

> Astuce : Parfait pour unfollow un vendeur en 2 clics au lieu de 50 coeurs.

---

## 🆚 Quel script choisir ?

| | Script 1 - Vendus | Script 2 - Dressing |
|---|---|---|
| **Page** | `/member/items/favourite_list` | `/member/NOM/items` |
| **Détecte** | Articles marqués "Vendu" | Tes favs présents dans ce dressing |
| **Badge** | 🔴 VENDU / fond rouge | 💙 DANS TES FAVS / contour bleu |
| **Quand l'utiliser** | Nettoyage hebdo | Quand un vendeur ne t'intéresse plus |

Tu peux utiliser les deux, ils sont complémentaires !

---

## ❓ Dépannage

### Je ne vois aucun article détecté

**Script 1 :**
- Tu n'as peut-être aucun vendu dans tes favs, c'est clean ! ✅
- Attends bien les 15-20s de scroll, Vinted charge en infini

**Script 2 :**
- Tu n'as aucun fav dans ce dressing spécifique
- Vérifie que tu es bien sur `/member/.../items` et pas sur son profil
- Ouvre la console (F12) : si tu vois "0 dans tes favs", c'est normal pour ce dressing

### Le panneau n'apparaît pas

- Tu as bien collé TOUT le fichier ?
- Tu es sur la bonne URL ?
- Recharge la page (F5) et recommence
- Désactive ton adblocker 2 min (uBlock parfois bloque le panneau)

### Le code va-t-il spammer ?
Non. Il simule juste des clics sur le coeur après TA confirmation. Il attend 600-700ms entre chaque clic pour ne pas trigger l'anti-bot Vinted.

---

## 🔐 Sécurité

- Aucune donnée envoyée nulle part, tout se passe localement dans ta console
- Ça ne supprime pas les annonces des vendeurs, juste de ta liste favoris
- 100% réversible : tu peux re-fav un article à tout moment

---

## 📊 Specs

- **Navigateurs :** Tous (Chrome, Edge, Brave, Opera, Firefox)
- **Taille :** ~15KB par script
- **Installation :** Aucune
- **Dépendances :** Aucune

**Besoin d'aide ? Regarde la FAQ du README.md principal !**

Bonne gestion de tes favoris! 🚀
