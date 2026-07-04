# Softball IQ 🥎

Application web pour développer l'**intelligence de jeu** (softball IQ) des jeunes joueurs.
Le jeune choisit sa position, vit des situations de match réalistes, et apprend
**le bon jeu à faire** avec une explication pédagogique à chaque réponse.

## ✨ Fonctionnalités

- **9 positions** cliquables sur un schéma de terrain interactif (SVG)
- **21 situations de jeu** réparties par position (niveaux Base / Intermédiaire / Avancé)
- **Feedback pédagogique** après chaque choix : pourquoi c'est le bon ou le mauvais jeu
- **Principe à retenir** mis en évidence pour chaque situation
- **Score et progression** par position, avec écran de résultat motivant
- 100 % en **français**, pensé pour les jeunes (U11–U13)
- Responsive mobile — jouable sur téléphone au terrain

## 🚀 Déploiement sur Vercel

### Option A — via l'interface web (le plus simple)
1. Pousse ce dossier sur un dépôt GitHub (voir plus bas).
2. Va sur [vercel.com/new](https://vercel.com/new), connecte ton compte GitHub.
3. Importe le dépôt `softball-iq`. Vercel détecte Next.js automatiquement.
4. Clique **Deploy**. En ~1 minute, ton app est en ligne avec une URL publique.

### Option B — via la ligne de commande
```bash
npm i -g vercel      # installe le CLI Vercel
cd softball-iq
vercel               # suis les questions ; « vercel --prod » pour la version finale
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx          # Page d'accueil : terrain + choix de position
│   └── layout.tsx        # Métadonnées, langue FR
├── components/
│   ├── Diamant.tsx       # Schéma SVG interactif du terrain
│   └── Quiz.tsx          # Moteur de quiz (situations, score, feedback)
└── data/
    ├── types.ts          # Types TypeScript
    ├── positions.ts      # Les 9 positions et leurs rôles
    └── situations.ts     # ★ TOUT le contenu pédagogique (à enrichir ici)
```

## ➕ Ajouter ou modifier des situations

Tout le contenu vit dans **`src/data/situations.ts`**. Chaque situation suit ce modèle :

```ts
{
  id: "SS-3",              // identifiant unique (position-numéro)
  position: "SS",          // P, C, 1B, 2B, SS, 3B, LF, CF, RF
  niveau: 2,               // 1=Base, 2=Intermédiaire, 3=Avancé
  retraits: 1,             // 0, 1 ou 2
  coureurs: "Coureur au 2e but",
  titre: "...",
  description: "La situation racontée au jeune",
  choix: [
    { id: "a", texte: "...", correct: true,  feedback: "Pourquoi c'est bon" },
    { id: "b", texte: "...", correct: false, feedback: "Pourquoi c'est mauvais" },
  ],
  principe: "La leçon clé à retenir",
}
```

Ajoute simplement de nouveaux objets au tableau `SITUATIONS` — ils apparaissent
automatiquement sous la bonne position, et le décompte se met à jour tout seul.

## 🛠️ Développement local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
```

## 📝 Notes

- Basé sur les principes fondamentaux du softball/baseball (couverture de but,
  hommes-relais, priorités de ballons, jeux de force, amortis).
- Le contenu peut être adapté au **Cahier des Brasseurs U13** — envoie-moi les
  situations spécifiques de ton cahier et je les intègre.

---
Fait avec ❤️ pour les jeunes joueurs.
