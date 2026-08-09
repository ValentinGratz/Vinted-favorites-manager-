# Vinted Favorites Manager - by ValentinGratz

### Nettoie, gère et auto-fav tes favoris Vinted en 1 clic.

Tu en as marre d'avoir 2000 favoris dont 800 vendus ? Tu veux retirer tous les favoris d'un vendeur relou ? Ou fav tout un dressing en auto ?

Ce repo fait tout ça, sans extension Chrome à installer (ça ne se supprime plus tout seul).

---

### 📥 Installation en 2 minutes (pour débutants)

#### Étape 1 : Installer Tampermonkey

C'est une extension qui permet de faire tourner des petits scripts. C'est safe, 10M d'utilisateurs.

- **Edge / Chrome :** Va ici -> https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
- Clique sur "Ajouter à Chrome" / "Obtenir"
- Tu dois voir une petite icône noire en haut à droite de ton navigateur.

#### Étape 2 : Installer les 3 scripts

Clique sur un lien ci-dessous, puis clique sur le bouton `Raw`, Tampermonkey va te proposer d'installer tout seul.

**Tu cliques sur "Installer" à chaque fois.**

| # | À quoi ça sert ? | Bouton d'installation |
|---|------------------|----------------------|
| **1** | **Nettoyer les VENDUS** dans tes favoris globaux | [**📥 Installer Script 1 - Scanner Vendus**](https://github.com/ValentinGratz/Vinted-favorites-manager-/raw/main/tampermonkey/1-vinted-vendus.user.js) |
| **2** | **Retirer tous les favs d'UN dressing** (quand tu ne veux plus voir un vendeur) | [**📥 Installer Script 2 - Retrait Dressing**](https://github.com/ValentinGratz/Vinted-favorites-manager-/raw/main/tampermonkey/2-vinted-dressing-retrait.user.js) |
| **3** | **Mettre en fav auto tout un dressing** | [**📥 Installer Script 3 - Auto Fav**](https://github.com/ValentinGratz/Vinted-favorites-manager-/raw/main/tampermonkey/3-vinted-dressing-auto-fav.user.js) |

> **Astuce :** Après avoir cliqué sur Raw, si rien ne se passe, clique sur l'icône Tampermonkey en haut -> Tableau de bord -> tu dois voir tes 3 scripts activés en vert.

---

### 🚀 Comment utiliser (tuto débutant)

#### Script 1 : Supprimer les articles "Vendu" de tes favoris

1. Va sur Vinted : https://www.vinted.fr/member/items/favourite_list
2. Attends que la page charge.
3. En bas à droite, tu as un gros bouton rouge **🔴 Scanner Vendus**
4. Clique dessus. Le script va scroller tout seul jusqu'en bas (normal, il charge tes 2000 favs). Ça prend 20-30 secondes.
5. Une fenêtre apparaît avec la liste des vendus. Tu coches / décoches.
6. Clique sur **Supprimer la sélection**. C'est tout.

#### Script 2 : Retirer tous tes favs d'un vendeur précis

1. Va sur la page d'un vendeur (ex: `vinted.fr/member/123456-nom`)
2. En bas à droite, bouton bleu **💙 Scanner mes favs ici**
3. Il va charger tout son dressing tout seul.
4. Il te montre tous les articles de ce vendeur que TU avais mis en fav.
5. Tu peux tout retirer d'un coup.

#### Script 3 : Mettre en fav automatiquement un dressing

1. Va sur la page d'un vendeur que tu aimes bien.
2. En bas à droite, bouton jaune **⭐ Auto Fav ce dressing**
3. Clique dessus. Confirme.
4. Le script va favre tout seul, 1 article toutes les 2-4 secondes avec une barre de progression.
5. **IMPORTANT :** Par sécurité, il s'arrête tout seul à 40 favs pour ne pas te faire bannir par Vinted. Attends 10 minutes avant de relancer sur un autre vendeur.

---

### ❓ Questions fréquentes

**C'est sans risque ?**
Les scripts 1 et 2 sont à 0 risque, tu ne fais que retirer tes propres favoris. Le script 3 (auto-fav) est en mode humain avec délais aléatoires, mais Vinted n'aime pas l'automatisation. Ne l'abuse pas (pas plus de 40 favs d'affilée).

**Le bouton n'apparaît pas ?**
- Vérifie que Tampermonkey est bien activé (icône noire en haut)
- Actualise la page (F5)
- Attends 3 secondes, il revient tout seul.

**L'ancien dossier `extension/` ?**
Tu peux le supprimer. La version Tampermonkey remplace l'extension, elle ne se désactive plus et n'a pas besoin du mode développeur.

**L'extension me dit "ne provient pas d'une source connue" ?**
Supprime-la. Tu n'en as plus besoin. Passe en Tampermonkey.

---

### 🛠️ Pour les devs

- `tampermonkey/` -> Les 3 scripts au format `.user.js`
- `extension/` -> Ancienne version extension (obsolète)

Made with ❤️ by [ValentinGratz](https://github.com/ValentinGratz)
