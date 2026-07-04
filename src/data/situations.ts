// Générateur de situations — Softball IQ
// Encode la logique RÉELLE du softball et décline chaque archétype de jeu
// à travers l'espace des états de match pour produire ~100 situations par position.

import { Situation, Choix, PositionId } from "./types";
import {
  GameState,
  RunnerCode,
  RUNNER_LABEL,
  bases,
  forces,
  pointEnJeu,
  doubleJeuPossible,
  COMPTES,
  pointageTexte,
} from "./engine";

// ---- Utilitaires de construction ----

let _uid = 0;
function melange<T>(arr: T[], seed: number): T[] {
  // mélange déterministe (pour un ordre stable des choix)
  const a = [...arr];
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ArchInput {
  gs: GameState;
  seed: number;
}

interface ArchOutput {
  titre: string;
  description: string;
  niveau: 1 | 2 | 3;
  bonne: { texte: string; feedback: string };
  mauvais: { texte: string; feedback: string }[];
  principe: string;
}

type Archetype = {
  id: string;
  applies: (gs: GameState) => boolean;
  build: (input: ArchInput) => ArchOutput;
};

function assembler(
  position: PositionId,
  gs: GameState,
  out: ArchOutput,
  seed: number
): Situation {
  const choixBruts: { texte: string; correct: boolean; feedback: string }[] = [
    { texte: out.bonne.texte, correct: true, feedback: out.bonne.feedback },
    ...out.mauvais.map((m) => ({
      texte: m.texte,
      correct: false,
      feedback: m.feedback,
    })),
  ];
  const ordonnes = melange(choixBruts, seed);
  const choix: Choix[] = ordonnes.map((c, i) => ({
    id: String.fromCharCode(97 + i),
    texte: c.texte,
    correct: c.correct,
    feedback: c.feedback,
  }));

  return {
    id: `${position}-${++_uid}`,
    position,
    niveau: out.niveau,
    retraits: gs.outs,
    coureurs: RUNNER_LABEL[gs.runners],
    compte: gs.count,
    pointage: pointageTexte(gs.scoreDiff),
    titre: out.titre,
    description: out.description,
    choix,
    principe: out.principe,
  };
}

// Choix distracteurs génériques réutilisables
const D = {
  resterPassif: {
    texte: "Je reste à ma position et je regarde le jeu se dérouler",
    feedback:
      "Rester passif est presque toujours une erreur au softball : chaque joueur a un rôle sur CHAQUE lancer, même sans la balle (couverture, relais ou backup).",
  },
  lancerAuHasard: {
    texte: "Je lance la balle le plus fort possible vers le marbre",
    feedback:
      "Un long lancer précipité finit souvent haut et imprécis, et laisse les autres coureurs avancer. On vise l'homme-relais ou le jeu le plus sûr.",
  },
  courirBalle: {
    texte: "Je cours vers la balle même si un coéquipier est mieux placé",
    feedback:
      "Deux joueurs sur la même balle = collision et confusion. On respecte les priorités et on communique par des appels forts.",
  },
};

// ---------------------------------------------------------------------------
// ARCHÉTYPES PAR POSITION
// ---------------------------------------------------------------------------

// ===== LANCEUR (P) =====
const ARCH_P: Archetype[] = [
  {
    id: "P-couvre-1er",
    applies: () => true,
    build: ({ gs }) => ({
      niveau: 1,
      titre: "Roulant du côté du premier but",
      description:
        "Un roulant est frappé vers le premier but, qui doit quitter son sac pour attraper la balle. Que fais-tu comme lanceur ?",
      bonne: {
        texte: "Je cours couvrir le premier but pour recevoir le relais",
        feedback:
          "Exact ! Quand le premier but quitte son sac, personne ne couvre le but. Le lanceur se précipite en parallèle de la ligne pour recevoir le relais et retirer le coureur.",
      },
      mauvais: [
        D.resterPassif,
        {
          texte: "Je cours vers le deuxième but",
          feedback:
            "Le jeu se fait au premier but, là où le sac est laissé vacant. Le 2e n'est pas menacé ici.",
        },
      ],
      principe:
        "Le lanceur couvre le premier but dès que le joueur de premier quitte son sac.",
    }),
  },
  {
    id: "P-marbre-passee",
    applies: (gs) => bases(gs.runners).b3,
    build: ({ gs }) => ({
      niveau: 2,
      titre: "Coureur au 3e — balle près du marbre",
      description: `${RUNNER_LABEL[gs.runners]}. Après ton lancer, la balle roule devant le marbre et le receveur doit la ramasser. Quel est ton rôle immédiat ?`,
      bonne: {
        texte: "Je cours couvrir le marbre pour protéger le point",
        feedback:
          "Bravo ! Si le receveur quitte le marbre pour ramasser la balle, le lanceur s'y précipite pour recevoir le relais et bloquer le point. Le point prime.",
      },
      mauvais: [
        {
          texte: "Je retourne au monticule attendre le prochain lancer",
          feedback:
            "Avec un coureur au 3e, le point est en jeu à tout instant. Tu dois anticiper et protéger le marbre laissé vacant.",
        },
        {
          texte: "Je cours couvrir le troisième but",
          feedback:
            "Le danger, c'est le point au marbre — pas le 3e but que le coureur vient de quitter.",
        },
      ],
      principe:
        "Avec un coureur au 3e, le lanceur couvre le marbre si le receveur doit le quitter.",
    }),
  },
  {
    id: "P-comebacker-dp",
    applies: (gs) => doubleJeuPossible(gs),
    build: ({ gs }) => {
      const f = forces(gs.runners);
      const cible = f.deuxieme ? "deuxième" : "premier";
      return {
        niveau: 2,
        titre: "Roulant frappé droit sur le lanceur",
        description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
          gs.outs > 1 ? "s" : ""
        }. Un roulant solide revient directement dans ton gant. Un double-jeu est possible. Quel est le meilleur jeu ?`,
        bonne: {
          texte: `Je me tourne et je lance au ${cible} but pour lancer le double-jeu`,
          feedback:
            "Parfait ! Sur un comebacker avec force au 2e et moins de 2 retraits, le lanceur amorce le double-jeu en lançant au 2e (via l'arrêt-court ou le 2e but qui couvre), puis on relaie au 1er.",
        },
        mauvais: [
          {
            texte: "Je lance immédiatement au premier but sans regarder le coureur avancé",
            feedback:
              "Tu obtiens un seul retrait alors qu'un double-jeu était disponible. Avec un coureur forcé et moins de 2 retraits, cherche d'abord le retrait avancé.",
          },
          {
            texte: "Je garde la balle et je cours vers le coureur",
            feedback:
              "Courir avec la balle laisse le temps aux coureurs de se stabiliser sur leur but. Un lancer rapide et net est toujours plus efficace.",
          },
        ],
        principe:
          "Comebacker + force + moins de 2 retraits = amorcer le double-jeu au but avancé.",
      };
    },
  },
  {
    id: "P-backup",
    applies: (gs) => pointEnJeu(gs.runners),
    build: ({ gs }) => ({
      niveau: 3,
      titre: "Simple au champ — appuyer le bon but",
      description: `${RUNNER_LABEL[gs.runners]}. Un simple est cogné au champ extérieur et un relais s'en vient vers le marbre ou le 3e. Comme lanceur, où vas-tu ?`,
      bonne: {
        texte:
          "Je me place en appui (backup) derrière le but visé, aligné avec le lancer",
        feedback:
          "Excellent ! Le lanceur devient l'assureur : il se place DERRIÈRE le but où arrive le relais, pour bloquer une balle échappée et empêcher les coureurs d'avancer.",
      },
      mauvais: [
        D.resterPassif,
        {
          texte: "Je cours me placer entre les buts pour couper le relais",
          feedback:
            "Couper le relais, c'est le rôle des joueurs d'avant-champ (hommes-relais). Le lanceur, lui, assure en appui derrière le but.",
        },
      ],
      principe:
        "Quand un point est en jeu, le lanceur assure en appui (backup) derrière le but visé.",
    }),
  },
  {
    id: "P-amorti",
    applies: (gs) => bases(gs.runners).b1,
    build: ({ gs }) => {
      const f = forces(gs.runners);
      const peutAvance = f.troisieme || f.deuxieme;
      return {
        niveau: 2,
        titre: "Amorti (bunt) devant le monticule",
        description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
          gs.outs > 1 ? "s" : ""
        }. Le frappeur pose un amorti qui s'arrête entre le monticule et la ligne. Tu es le premier dessus. Que fais-tu ?`,
        bonne: {
          texte: peutAvance
            ? "Je charge, je ramasse à deux mains et je vise le retrait sûr (souvent le 1er) — le but avancé seulement si je l'ai clairement"
            : "Je charge, je ramasse à deux mains et je lance au premier but pour le retrait sûr",
          feedback:
            "Bravo ! Sur un amorti, la priorité est un retrait GARANTI. On charge, on se stabilise et on prend le 1er — sauf si le retrait avancé (2e/3e) est clairement là. La précipitation sur un amorti = tout le monde sauf.",
        },
        mauvais: [
          {
            texte: "Je lance en vitesse au but avancé sans être stabilisé",
            feedback:
              "Un lancer déséquilibré sur un amorti finit souvent dans le champ. Assure-toi d'abord d'un pied solide, puis choisis le retrait le plus sûr.",
          },
          {
            texte: "Je laisse la balle rouler en espérant qu'elle sorte du terrain",
            feedback:
              "Sur un amorti bien placé, attendre = personne n'est retiré. Il faut attaquer la balle et faire un jeu.",
          },
        ],
        principe:
          "Sur un amorti, le lanceur charge, se stabilise et choisit le retrait le plus SÛR.",
      };
    },
  },
  {
    id: "P-2outs-simple",
    applies: (gs) => gs.outs === 2,
    build: ({ gs }) => ({
      niveau: 1,
      titre: "Deux retraits — garder ça simple",
      description: `${RUNNER_LABEL[gs.runners]}, 2 retraits. Un roulant est frappé dans ta direction. Quelle est la bonne mentalité ?`,
      bonne: {
        texte: "Je fais le jeu le plus simple et le plus sûr pour le 3e retrait",
        feedback:
          "Exact ! Avec 2 retraits, n'importe quel retrait termine la manche. Pas besoin de forcer un double-jeu ni un jeu spectaculaire — le jeu le plus sûr suffit.",
      },
      mauvais: [
        {
          texte: "Je tente absolument un double-jeu",
          feedback:
            "Inutile avec 2 retraits : un seul retrait termine la manche. Chercher le double-jeu ajoute du risque pour rien.",
        },
        D.lancerAuHasard,
      ],
      principe:
        "Avec 2 retraits, le jeu le plus simple termine la manche. Ne force jamais.",
    }),
  },
];

// ===== RECEVEUR (C) =====
const ARCH_C: Archetype[] = [
  {
    id: "C-chandelle",
    applies: () => true,
    build: () => ({
      niveau: 1,
      titre: "Ballon-chandelle près du marbre",
      description:
        "Le frappeur envoie un ballon très haut juste au-dessus du marbre. Quelle est ta technique de receveur ?",
      bonne: {
        texte:
          "J'enlève mon masque, je le lance loin, et je me place dos au terrain (la balle revient vers le champ)",
        feedback:
          "Parfait ! On enlève le masque pour voir, mais on le LANCE loin pour ne pas trébucher dessus. Un ballon près du marbre a un effet qui le ramène vers le terrain — dos au champ, la balle revient vers toi.",
      },
      mauvais: [
        {
          texte: "Je garde mon masque et j'attrape face au terrain",
          feedback:
            "Le masque nuit à ta vision et un ballon près du marbre revient VERS le terrain à cause de l'effet — face au champ, tu vas le manquer.",
        },
        {
          texte: "Je laisse le lanceur ou le 3e but s'en occuper",
          feedback:
            "Le receveur a la meilleure vue sur les ballons près du marbre. Appelle-le fort et prends-le.",
        },
      ],
      principe:
        "Ballon près du marbre : masque lancé loin, dos au terrain (la balle revient vers le champ).",
    }),
  },
  {
    id: "C-protege-marbre",
    applies: (gs) => pointEnJeu(gs.runners),
    build: ({ gs }) => ({
      niveau: 2,
      titre: "Un coureur tente de marquer",
      description: `${RUNNER_LABEL[gs.runners]}. Un simple au champ et un coureur fonce vers le marbre. Que fais-tu comme receveur ?`,
      bonne: {
        texte:
          "Je me place au marbre, je reçois le relais et j'applique le touché en tenant bien la balle",
        feedback:
          "Bravo ! Le receveur est le gardien du marbre : bonne position pour recevoir le relais (souvent via l'homme-relais), balle solidement tenue, touché appliqué. La communication avec le relais est clé.",
      },
      mauvais: [
        {
          texte: "Je cours au-devant du coureur sur la ligne pour le bloquer",
          feedback:
            "Bloquer le chemin sans la balle est illégal (obstruction) et dangereux. On protège le marbre en position, la balle d'abord.",
        },
        D.resterPassif,
      ],
      principe:
        "Le receveur garde le marbre : position, recevoir le relais, touché solide.",
    }),
  },
  {
    id: "C-dirige-relais",
    applies: (gs) => pointEnJeu(gs.runners),
    build: ({ gs }) => ({
      niveau: 3,
      titre: "Diriger l'homme-relais",
      description: `${RUNNER_LABEL[gs.runners]}. La balle est frappée dans l'allée. Tu vois tout le jeu devant toi. Quelle est ta responsabilité de receveur AVANT même de recevoir la balle ?`,
      bonne: {
        texte:
          "Je crie à l'homme-relais où lancer (« marbre ! » ou « retiens ! ») — je suis ses yeux",
        feedback:
          "Excellent ! Le receveur voit tout le terrain et DIRIGE le relais à la voix. L'homme-relais, dos au marbre, dépend de tes appels pour savoir où lancer. C'est un jeu d'IQ souvent négligé.",
      },
      mauvais: [
        {
          texte: "Je reste silencieux et j'attends la balle",
          feedback:
            "Sans tes appels, l'homme-relais lance à l'aveugle. Le receveur est la voix qui dirige tout le relais.",
        },
        {
          texte: "Je cours dans le champ pour aller chercher la balle moi-même",
          feedback:
            "Ta place est au marbre. Quitter le marbre l'abandonne complètement — laisse les voltigeurs et relais faire leur travail.",
        },
      ],
      principe:
        "Le receveur voit tout : il DIRIGE l'homme-relais à la voix.",
    }),
  },
  {
    id: "C-force-marbre",
    applies: (gs) => forces(gs.runners).marbre,
    build: ({ gs }) => ({
      niveau: 2,
      titre: "Buts remplis — force au marbre",
      description: `Buts remplis, ${gs.outs} retrait${
        gs.outs > 1 ? "s" : ""
      }. Un roulant est frappé vers l'avant-champ. Comme receveur, que prépares-tu ?`,
      bonne: {
        texte:
          "Je me place sur le marbre pour recevoir le jeu de force, pied sur le sac",
        feedback:
          "Exact ! Buts remplis = jeu de force au marbre. Le receveur devient comme un joueur de but : pied sur le marbre, il reçoit le relais pour le forceur (aucun touché nécessaire). Souvent, on enchaîne au 1er pour le double-jeu.",
      },
      mauvais: [
        {
          texte: "J'attends de courir après un coureur pour le toucher",
          feedback:
            "Avec les buts remplis, le coureur au 3e est FORCÉ : pas besoin de touché, juste toucher le marbre avec la balle. Le jeu de force est plus rapide.",
        },
        D.resterPassif,
      ],
      principe:
        "Buts remplis = force au marbre : pied sur le sac, pas de touché nécessaire.",
    }),
  },
  {
    id: "C-vol-2e",
    applies: (gs) => gs.runners === "1" && gs.outs < 2,
    build: () => ({
      niveau: 3,
      titre: "Tentative de vol du deuxième but",
      description:
        "Coureur au 1er. Il s'élance pour voler le 2e but pendant le lancer. Quel est le bon jeu de receveur ?",
      bonne: {
        texte:
          "Je reçois, je me lève rapidement et je lance une flèche au 2e but (vers l'arrêt-court ou le 2e qui couvre)",
        feedback:
          "Bravo ! Sur un vol, le receveur reçoit propre, transfert rapide, et lance bas et précis au 2e but où l'arrêt-court ou le 2e but couvre pour le touché. La rapidité du transfert compte plus que la force du bras.",
      },
      mauvais: [
        {
          texte: "Je lance au 2e but même si personne ne le couvre encore",
          feedback:
            "Un lancer vers un but non couvert file au champ centre et le coureur avance au 3e. Vérifie/anticipe qui couvre avant de lancer.",
        },
        {
          texte: "Je garde la balle systématiquement sans tenter le jeu",
          feedback:
            "Ne jamais tenter laisse les coureurs voler à volonté. Si tu as reçu proprement et qu'un but est couvert, tente le retrait.",
        },
      ],
      principe:
        "Sur un vol : réception propre, transfert rapide, lancer bas vers le but couvert.",
    }),
  },
  {
    id: "C-3e-prise",
    applies: (gs) => !bases(gs.runners).b1 || gs.outs === 2,
    build: () => ({
      niveau: 2,
      titre: "Troisième prise échappée",
      description:
        "Le frappeur s'élance pour une 3e prise, mais la balle rebondit et t'échappe. Le premier but est libre (ou il y a 2 retraits). Que fais-tu ?",
      bonne: {
        texte:
          "Je récupère vite la balle et je lance au premier but (ou j'applique le touché) — le frappeur n'est pas encore retiré",
        feedback:
          "Exact ! Sur une 3e prise non captée (1er but libre, ou 2 retraits), le frappeur peut courir au 1er. Le receveur doit récupérer et le retirer au 1er, ou le toucher. Beaucoup de jeunes oublient cette règle.",
      },
      mauvais: [
        {
          texte: "Je considère le frappeur automatiquement retiré et je relaxe",
          feedback:
            "Erreur classique ! Si la 3e prise n'est pas captée et que le 1er est libre (ou 2 retraits), le frappeur n'est PAS retiré tant qu'on ne le retire pas activement.",
        },
        {
          texte: "Je lance directement au 3e but",
          feedback:
            "Le frappeur court au 1er, pas au 3e. C'est au 1er (ou par touché) qu'on le retire.",
        },
      ],
      principe:
        "3e prise non captée + 1er libre (ou 2 retraits) : le frappeur peut courir — retire-le au 1er.",
    }),
  },
];

// ===== Fonctions génériques d'avant-champ =====

// Couverture de but sur double-jeu selon où la balle est frappée
function archInfield(position: PositionId): Archetype[] {
  const estSS = position === "SS";
  const est_2B = position === "2B";
  const est_1B = position === "1B";
  const est_3B = position === "3B";

  const list: Archetype[] = [];

  // Double-jeu : le pivot dépend de la position
  if (estSS || est_2B) {
    list.push({
      id: `${position}-dp-pivot`,
      applies: (gs) => doubleJeuPossible(gs),
      build: ({ gs }) => {
        const cote = estSS ? "vers le deuxième but" : "vers l'arrêt-court";
        return {
          niveau: 2,
          titre: "Double-jeu — être le pivot au 2e but",
          description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
            gs.outs > 1 ? "s" : ""
          }. Un roulant est frappé ${cote}. C'est un double-jeu potentiel. Quel est ton rôle ?`,
          bonne: {
            texte:
              "Je couvre le 2e but, je reçois le relais, je touche le sac puis je relaie au 1er",
            feedback: `Parfait ! Sur une balle frappée ${cote}, c'est ${
              estSS ? "l'arrêt-court" : "le 2e but"
            } qui couvre le sac et devient le pivot : recevoir, toucher le 2e (forceur), pivoter et relayer au 1er.`,
          },
          mauvais: [
            D.courirBalle,
            {
              texte: "Je couvre le premier but",
              feedback:
                "Le 1er but reste responsable de son sac (ou le lanceur le couvre). Toi, tu es le pivot au 2e sur cette balle.",
            },
          ],
          principe: `Balle ${cote} = ${
            estSS ? "l'arrêt-court" : "le 2e but"
          } couvre le 2e et devient le pivot du double-jeu.`,
        };
      },
    });
  }

  // Homme-relais (SS/2B sur balles au champ)
  if (estSS || est_2B) {
    list.push({
      id: `${position}-relais`,
      applies: (gs) => pointEnJeu(gs.runners),
      build: ({ gs }) => {
        const cote = estSS ? "gauche ou au centre" : "droit";
        return {
          niveau: 3,
          titre: "Devenir l'homme-relais",
          description: `${RUNNER_LABEL[gs.runners]}. Une balle file au champ ${cote} et un point se joue. Comme ${
            estSS ? "arrêt-court" : "deuxième but"
          }, que fais-tu ?`,
          bonne: {
            texte:
              "Je sors vers le champ extérieur, mains en l'air comme cible, et j'écoute le receveur pour relayer au bon but",
            feedback: `Bravo ! Sur une balle au champ ${cote}, ${
              estSS ? "l'arrêt-court" : "le 2e but"
            } sert d'homme-relais : il raccourcit la distance du lancer et redirige selon les appels du receveur.`,
          },
          mauvais: [
            {
              texte: "Je reste sur mon but pour attendre un touché",
              feedback:
                "Sans homme-relais, le lancer du voltigeur est trop long et imprécis. Un coéquipier peut couvrir le sac pendant que tu vas au relais.",
            },
            D.courirBalle,
          ],
          principe: `Sur une balle au champ ${cote}, ${
            estSS ? "l'arrêt-court" : "le 2e but"
          } devient l'homme-relais et écoute le receveur.`,
        };
      },
    });
  }

  // Couverture de sac (1B) et étirement
  if (est_1B) {
    list.push({
      id: "1B-etire",
      applies: () => true,
      build: ({ gs }) => ({
        niveau: 1,
        titre: "Recevoir le relais au premier but",
        description: `${RUNNER_LABEL[gs.runners]}. Un roulant est frappé à l'avant-champ, un coéquipier va relayer vers toi au premier. Quelle est ta technique ?`,
        bonne: {
          texte:
            "Je vais au sac, j'ancre un pied dessus et j'étire vers la balle pour la recevoir plus tôt",
          feedback:
            "Exact ! On trouve le coin du sac avec le pied, puis on ÉTIRE vers le lanceur du relais. Étirer gagne une fraction de seconde décisive pour le retrait.",
        },
        mauvais: [
          {
            texte: "Je m'élance vers la balle pour aider le releveur",
            feedback:
              "Si tu quittes le sac, personne ne couvre le premier but et il n'y a plus de retrait possible.",
          },
          {
            texte: "J'attends la balle près du sac sans ancrer mon pied",
            feedback:
              "Sans pied ancré, tu n'as pas de point de repère pour le retrait et tu perds l'avantage de l'étirement.",
          },
        ],
        principe:
          "Le 1er but ancre son pied au sac et étire vers le relais pour gagner du temps.",
      }),
    });
    list.push({
      id: "1B-scoop",
      applies: (gs) => bases(gs.runners).b1,
      build: ({ gs }) => ({
        niveau: 2,
        titre: "Relais bas dans la terre",
        description: `${RUNNER_LABEL[gs.runners]}. Le relais vers le premier arrive bas et rebondit devant le sac. Que fais-tu ?`,
        bonne: {
          texte:
            "Je fais un scoop souple (gant au sol) en gardant mon pied sur le sac",
          feedback:
            "Bravo ! Sur un relais bas, gant au sol souple et pied ancré : le scoop récupère la balle tout en gardant le contact avec le sac. Ça sauve des retraits et donne confiance à tes coéquipiers.",
        },
        mauvais: [
          {
            texte: "Je quitte le sac pour attraper la balle proprement",
            feedback:
              "Attraper hors du sac laisse le coureur sauf. Il faut récupérer ET garder contact avec le sac.",
          },
          {
            texte: "Je laisse passer et je cours après la balle",
            feedback:
              "Laisser passer annule le retrait et laisse les coureurs avancer. Un bon scoop est la bonne réponse.",
          },
        ],
        principe: "Relais bas : scoop souple, gant au sol, pied ancré au sac.",
      }),
    });
  }

  // 3e but : coin chaud, amorti, force au 3e
  if (est_3B) {
    list.push({
      id: "3B-amorti",
      applies: (gs) => bases(gs.runners).b1,
      build: ({ gs }) => ({
        niveau: 2,
        titre: "Amorti attendu au troisième but",
        description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
          gs.outs > 1 ? "s" : ""
        }. Le frappeur montre l'amorti. Comme troisième but, comment réagis-tu ?`,
        bonne: {
          texte:
            "Je charge agressivement dès l'amorti, je ramasse et je vise le retrait le plus sûr",
          feedback:
            "Parfait ! Sur amorti annoncé, le 3e but charge fort, ramasse à deux mains, se stabilise et fait le jeu sûr (souvent au 1er). Charger tôt est la clé.",
        },
        mauvais: [
          {
            texte: "Je recule pour me protéger d'une frappe forte",
            feedback:
              "Si l'amorti est montré, reculer laisse la balle mourir dans l'herbe : tout le monde sauf. Il faut charger.",
          },
          D.resterPassif,
        ],
        principe:
          "Amorti annoncé : le 3e but charge et choisit le retrait le plus sûr.",
      }),
    });
  }

  // Force au but le plus proche (tous les coins) quand buts remplis / forces multiples
  list.push({
    id: `${position}-force-proche`,
    applies: (gs) => {
      const f = forces(gs.runners);
      return f.troisieme || f.marbre; // situations à forces multiples
    },
    build: ({ gs }) => {
      const f = forces(gs.runners);
      // choisir la meilleure force selon la position
      let cible: string;
      if (gs.outs === 2) {
        cible = "le but de force le plus proche de moi";
      } else if (f.marbre) {
        cible = "le marbre puis le premier pour le double-jeu";
      } else {
        cible = "le but avancé forcé, puis le premier si possible";
      }
      return {
        niveau: gs.outs === 2 ? 1 : 3,
        titre:
          gs.outs === 2 ? "Deux retraits — force la plus simple" : "Forces multiples — bien choisir",
        description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
          gs.outs > 1 ? "s" : ""
        }. Un roulant vient sur toi. Où fais-tu le jeu ?`,
        bonne: {
          texte:
            gs.outs === 2
              ? "Je touche mon propre sac ou je lance au but de force le plus proche pour le 3e retrait"
              : "Je vise le retrait avancé forcé, puis j'enchaîne pour le double-jeu si le temps le permet",
          feedback:
            gs.outs === 2
              ? "Exact ! Avec 2 retraits et des forces partout, le retrait le plus proche et le plus sûr termine la manche. Simple = sûr."
              : `Bravo ! Avec des forces multiples et moins de 2 retraits, on cherche le retrait avancé (${cible}) pour couper l'attaque, en enchaînant le double-jeu si possible.`,
        },
        mauvais: [
          {
            texte: "Je lance systématiquement au premier but",
            feedback:
              gs.outs === 2
                ? "Un long relais au 1er quand un forceur est plus proche ajoute du risque inutile. Prends le plus court."
                : "Aller au 1er laisse avancer les coureurs forcés. Avec moins de 2 retraits, coupe l'attaque au but avancé.",
          },
          D.lancerAuHasard,
        ],
        principe:
          gs.outs === 2
            ? "2 retraits : la force la plus proche termine la manche."
            : "Forces multiples : retirer le coureur avancé coupe l'attaque.",
      };
    },
  });

  // Roulant de routine — mécanique de base (toutes positions d'avant-champ)
  list.push({
    id: `${position}-routine`,
    applies: () => true,
    build: ({ gs }) => ({
      niveau: 1,
      titre: "Roulant de routine",
      description: `${RUNNER_LABEL[gs.runners]}. Un roulant sans pression arrive droit sur toi. Quelle est la bonne mécanique ?`,
      bonne: {
        texte:
          "Je me mets devant la balle, corps bas, je la prends à deux mains puis je lance en position",
        feedback:
          "Exact ! On se place DEVANT la balle (pas de côté), corps bas, deux mains, on gagne l'équilibre puis on fait un lancer précis. La base d'un avant-champ fiable.",
      },
      mauvais: [
        {
          texte: "Je prends la balle d'une main sur le côté pour aller plus vite",
          feedback:
            "Prendre de côté à une main multiplie les erreurs. La routine à deux mains, corps devant la balle, est plus rapide au final car plus sûre.",
        },
        {
          texte: "J'attends que la balle arrive à moi sans bouger les pieds",
          feedback:
            "Rester planté te fait prendre de mauvais bonds. On utilise ses pieds pour trouver le bon angle et un bon bond.",
        },
      ],
      principe:
        "Roulant de routine : corps devant la balle, bas, deux mains, puis lancer en équilibre.",
    }),
  });

  return list;
}

// ===== Fonctions génériques de champ extérieur =====
function archOutfield(position: PositionId): Archetype[] {
  const nom =
    position === "LF"
      ? "champ gauche"
      : position === "CF"
      ? "champ centre"
      : "champ droit";
  const estCF = position === "CF";

  const list: Archetype[] = [];

  // Charger + relais à l'homme-relais
  list.push({
    id: `${position}-charge-relais`,
    applies: (gs) => pointEnJeu(gs.runners),
    build: ({ gs }) => ({
      niveau: 1,
      titre: "Simple devant toi, un coureur fonce",
      description: `${RUNNER_LABEL[gs.runners]}. Un simple tombe devant toi au ${nom} et un coureur tente de marquer. Que fais-tu ?`,
      bonne: {
        texte:
          "Je charge la balle, je m'aligne pour lancer et je vise l'homme-relais",
        feedback:
          "Bravo ! On charge pour réduire la distance, on attrape en position de lancer, puis on vise l'homme-relais (bas et précis) plutôt qu'un long lancer en cloche par-dessus tout le monde.",
      },
      mauvais: [
        D.lancerAuHasard,
        {
          texte: "J'attends que la balle vienne à moi avant de la prendre",
          feedback:
            "Attendre laisse le coureur gagner du terrain. Charge la balle pour gagner de précieuses secondes.",
        },
      ],
      principe:
        "Le voltigeur charge la balle et lance vers l'homme-relais, jamais en cloche.",
    }),
  });

  // Priorité de ballon partagé
  list.push({
    id: `${position}-priorite`,
    applies: () => true,
    build: () => ({
      niveau: 2,
      titre: "Ballon partagé au champ extérieur",
      description: estCF
        ? "Un ballon tombe entre toi (champ centre) et un voltigeur voisin. Vous convergez tous les deux. Quelle est la règle ?"
        : `Un ballon tombe entre toi (${nom}) et le champ centre. Vous foncez tous les deux. Quelle est la règle de priorité ?`,
      bonne: {
        texte: estCF
          ? "J'ai la priorité comme champ centre : j'appelle fort et je prends la balle"
          : "Le champ centre a priorité : je m'écarte s'il appelle, prêt à l'appuyer en backup",
        feedback: estCF
          ? "Exact ! Le champ centre est le patron du champ extérieur : priorité sur tous les ballons partagés. Appelle fort et tôt pour éviter les collisions."
          : "Bravo ! Le champ centre commande. Tu t'écartes sur son appel mais restes prêt à le couvrir (backup) s'il l'échappe.",
      },
      mauvais: [
        D.courirBalle,
        {
          texte: "Je m'arrête complètement et je regarde",
          feedback:
            "Ne te fige pas : écarte-toi si besoin mais reste actif pour appuyer. Un ballon partagé mal géré tombe entre deux joueurs.",
        },
      ],
      principe:
        "Le champ centre a priorité sur les ballons partagés. Communiquez par des appels forts.",
    }),
  });

  // Backup (assurance)
  list.push({
    id: `${position}-backup`,
    applies: () => true,
    build: ({ gs }) => {
      const cible =
        position === "RF"
          ? "le premier but sur les relais d'avant-champ"
          : position === "LF"
          ? "le troisième but et l'arrêt-court"
          : "le deuxième but et les jeux au centre du losange";
      return {
        niveau: 2,
        titre: "Assurer un but en appui (backup)",
        description: `${RUNNER_LABEL[gs.runners]}. Un jeu d'avant-champ se développe loin de la balle. Comme ${nom}, quel est ton réflexe d'IQ ?`,
        bonne: {
          texte: `Je cours appuyer ${cible} au cas où le relais serait échappé`,
          feedback: `Excellent ! Un bon voltigeur n'est jamais spectateur : il assure en appui derrière ${cible}. Une balle échappée sans backup = un coureur qui avance gratuitement.`,
        },
        mauvais: [
          D.resterPassif,
          {
            texte: "Je m'approche du losange pour bavarder avec les coéquipiers",
            feedback:
              "Ta valeur est dans le backup discipliné. Place-toi derrière le but menacé, aligné avec le lancer.",
          },
        ],
        principe: `Le ${nom} assure toujours en appui (backup) ${cible}.`,
      };
    },
  });

  // Bloquer d'abord (rien ne passe) — 2 retraits / point en jeu
  list.push({
    id: `${position}-bloquer`,
    applies: (gs) => pointEnJeu(gs.runners),
    build: ({ gs }) => ({
      niveau: 2,
      titre: "Ne rien laisser passer",
      description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
        gs.outs > 1 ? "s" : ""
      }. Un simple dur roule vers toi au ${nom} avec un coureur en position de marquer. Quelle est ta priorité #1 ?`,
      bonne: {
        texte:
          "Je bloque la balle proprement d'abord (genou au sol si besoin), puis je relaie",
        feedback:
          "Bravo ! Règle d'or du voltigeur : rien ne passe derrière toi. Une balle échappée transforme un simple en triple ou en point. Bloque d'abord, relais ensuite.",
      },
      mauvais: [
        {
          texte: "J'attaque très agressivement quitte à ce qu'elle passe",
          feedback:
            "Avec un coureur prêt à marquer, une balle qui file derrière toi est un désastre. Sécurité d'abord.",
        },
        {
          texte: "Je lance avant même d'avoir contrôlé la balle",
          feedback:
            "Un lancer sur balle non contrôlée finit dans le champ. Contrôle, puis relais précis.",
        },
      ],
      principe:
        "Priorité du voltigeur : bloquer la balle (rien ne passe), le relais ensuite.",
    }),
  });

  // Où lancer selon retraits (décision d'IQ avancée)
  list.push({
    id: `${position}-ou-lancer`,
    applies: (gs) => pointEnJeu(gs.runners),
    build: ({ gs }) => {
      const deuxRetraits = gs.outs === 2;
      return {
        niveau: 3,
        titre: "Où lancer après la prise ?",
        description: `${RUNNER_LABEL[gs.runners]}, ${gs.outs} retrait${
          gs.outs > 1 ? "s" : ""
        }. Tu captes un ballon assez profond au ${nom}. Un coureur va vouloir avancer. Quelle est la meilleure décision ?`,
        bonne: {
          texte: deuxRetraits
            ? "Je vise l'homme-relais / le but devant le coureur meneur — mais sans risquer un lancer fou"
            : "Je lance devant le coureur meneur (au but qu'il vise) via l'homme-relais, en gardant les autres coureurs en échec",
          feedback:
            "Excellent ! On lance TOUJOURS devant le coureur le plus avancé qui menace, via l'homme-relais, sans jamais offrir un but « gratuit » aux coureurs en retrait par un lancer imprudent.",
        },
        mauvais: [
          {
            texte: "Je renvoie toujours la balle au lanceur peu importe le jeu",
            feedback:
              "Rendre au lanceur par réflexe laisse filer des avancées. Lis le jeu : où est le coureur le plus menaçant ?",
          },
          {
            texte: "Je vise le coureur le plus lent, peu importe où il est",
            feedback:
              "On joue le coureur le plus AVANCÉ qui menace de marquer/avancer, pas le plus lent. La menace prime.",
          },
        ],
        principe:
          "Le voltigeur lance devant le coureur meneur, via l'homme-relais, sans cadeau aux autres.",
      };
    },
  });

  // Ballon-mouche de routine
  list.push({
    id: `${position}-mouche`,
    applies: () => true,
    build: ({ gs }) => ({
      niveau: 1,
      titre: "Ballon-mouche de routine",
      description: `${RUNNER_LABEL[gs.runners]}. Un ballon est frappé dans les airs vers toi au ${nom}. Quelle est la bonne technique ?`,
      bonne: {
        texte:
          "Je me place sous la balle, je l'attrape à deux mains au-dessus de mon épaule, prêt à relayer",
        feedback:
          "Exact ! On se déplace tôt sous la balle, prise à deux mains au-dessus de l'épaule côté lanceur, corps en mouvement vers l'avant pour enchaîner un relais si un coureur avance.",
      },
      mauvais: [
        {
          texte: "Je l'attrape d'une main à hauteur de la taille, immobile",
          feedback:
            "La prise basket à la taille et immobile augmente les erreurs et empêche un relais rapide. Deux mains, au-dessus de l'épaule.",
        },
        {
          texte: "Je recule au dernier moment en espérant bien juger",
          feedback:
            "Juge la trajectoire TÔT et place-toi dessous d'avance. Attendre le dernier moment mène aux ballons mal jugés.",
        },
      ],
      principe:
        "Ballon-mouche : sous la balle tôt, deux mains au-dessus de l'épaule, prêt à relayer.",
    }),
  });

  return list;
}

// ---------------------------------------------------------------------------
// GÉNÉRATION
// ---------------------------------------------------------------------------

function archetypesPour(position: PositionId): Archetype[] {
  switch (position) {
    case "P":
      return ARCH_P;
    case "C":
      return ARCH_C;
    case "1B":
    case "2B":
    case "SS":
    case "3B":
      return archInfield(position);
    case "LF":
    case "CF":
    case "RF":
      return archOutfield(position);
  }
}

// États enrichis (retraits × coureurs × compte × pointage) pour la variété
function etatsEnrichis(): GameState[] {
  const codes: RunnerCode[] = [
    "none",
    "1",
    "2",
    "3",
    "12",
    "13",
    "23",
    "123",
  ];
  const scoreDiffs = [undefined, 0, 1, -1, 2, -2];
  const out: GameState[] = [];
  let i = 0;
  for (const outs of [0, 1, 2] as const) {
    for (const runners of codes) {
      for (const count of COMPTES) {
        const scoreDiff = scoreDiffs[i % scoreDiffs.length];
        out.push({ outs, runners, count, scoreDiff });
        i++;
      }
    }
  }
  return out;
}

const CIBLE_PAR_POSITION = 100;

function genererPourPosition(position: PositionId): Situation[] {
  _uid = 0;
  const archs = archetypesPour(position);
  const etats = etatsEnrichis();
  const situations: Situation[] = [];
  const vus = new Set<string>();

  let seed = position.charCodeAt(0) * 31;

  // Tour 1 : parcourir états × archétypes applicables
  for (const gs of etats) {
    for (const arch of archs) {
      if (situations.length >= CIBLE_PAR_POSITION) break;
      if (!arch.applies(gs)) continue;
      seed++;
      const out = arch.build({ gs, seed });
      // éviter les doublons titre+coureurs+retraits
      const key = `${arch.id}|${gs.outs}|${gs.runners}`;
      if (vus.has(key)) continue;
      vus.add(key);
      situations.push(assembler(position, gs, out, seed));
    }
    if (situations.length >= CIBLE_PAR_POSITION) break;
  }

  // Tour 2 : compléter si <100 en réutilisant des combinaisons compte/score distinctes
  let garde = 0;
  while (situations.length < CIBLE_PAR_POSITION && garde < 5000) {
    garde++;
    const gs = etats[garde % etats.length];
    const arch = archs[garde % archs.length];
    if (!arch.applies(gs)) continue;
    seed++;
    const key = `${arch.id}|${gs.outs}|${gs.runners}|${gs.count}|${gs.scoreDiff}`;
    if (vus.has(key)) continue;
    vus.add(key);
    const out = arch.build({ gs, seed });
    situations.push(assembler(position, gs, out, seed));
  }

  return situations.slice(0, CIBLE_PAR_POSITION);
}

// Cache généré une seule fois
let _cache: Record<string, Situation[]> | null = null;

export function toutesLesSituations(): Record<string, Situation[]> {
  if (_cache) return _cache;
  const positions: PositionId[] = [
    "P",
    "C",
    "1B",
    "2B",
    "SS",
    "3B",
    "LF",
    "CF",
    "RF",
  ];
  _cache = {};
  for (const p of positions) {
    _cache[p] = genererPourPosition(p);
  }
  return _cache;
}

export function situationsParPosition(positionId: string): Situation[] {
  return toutesLesSituations()[positionId] ?? [];
}
