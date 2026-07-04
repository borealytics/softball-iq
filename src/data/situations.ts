import { Situation } from "./types";

// Situations de jeu — Softball IQ (niveau U13)
// Chaque situation enseigne le "bon jeu" à faire selon la position.
// Le feedback explique POURQUOI, pour développer l'intelligence de jeu.

export const SITUATIONS: Situation[] = [
  // ─────────────────────────────── LANCEUR (P) ───────────────────────────────
  {
    id: "P-1",
    position: "P",
    niveau: 1,
    retraits: 1,
    coureurs: "Coureur au 1er but",
    titre: "Roulant frappé vers le premier but",
    description:
      "Un roulant est frappé du côté du premier but, à ta droite. Le joueur de premier but quitte le sac pour attraper la balle. Que fais-tu comme lanceur ?",
    choix: [
      {
        id: "a",
        texte: "Je cours couvrir le premier but pour recevoir le relais",
        correct: true,
        feedback:
          "Exact ! Quand le premier but quitte son sac, personne ne couvre le but. Le lanceur DOIT courir vers le premier but pour recevoir la balle et retirer le coureur. C'est un des jeux les plus importants du lanceur.",
      },
      {
        id: "b",
        texte: "Je reste sur le monticule et je regarde le jeu",
        correct: false,
        feedback:
          "Non — si tu restes sur place, personne ne couvre le premier but et le frappeur sera sauf. Le lanceur doit toujours réagir et couvrir le but laissé vacant.",
      },
      {
        id: "c",
        texte: "Je cours vers le deuxième but",
        correct: false,
        feedback:
          "Pas ici. Le jeu se fait au premier but. C'est le sac laissé libre par le joueur de premier qui a besoin de toi.",
      },
    ],
    principe:
      "Le lanceur couvre toujours le premier but quand le joueur de premier doit quitter son sac.",
  },
  {
    id: "P-2",
    position: "P",
    niveau: 2,
    retraits: 0,
    coureurs: "Coureur au 3e but",
    pointage: "Match serré",
    titre: "Balle passée / amorti-suicide possible",
    description:
      "Un coureur rapide est au troisième but avec aucun retrait. Après ton lancer, la balle roule un peu devant le marbre. Le receveur la récupère. Quel est ton rôle immédiat ?",
    choix: [
      {
        id: "a",
        texte: "Je cours couvrir le marbre pour empêcher le point",
        correct: true,
        feedback:
          "Bravo ! Avec un coureur au 3e, si la balle échappe au receveur ou s'il doit la ramasser, le marbre peut être laissé vacant. Le lanceur se précipite au marbre pour recevoir le relais et protéger le point.",
      },
      {
        id: "b",
        texte: "Je retourne au monticule attendre la prochaine balle",
        correct: false,
        feedback:
          "Non — avec un coureur au 3e, le point est en jeu à tout moment. Tu dois anticiper et protéger le marbre.",
      },
      {
        id: "c",
        texte: "Je cours vers le troisième but",
        correct: false,
        feedback:
          "Le danger est au marbre, pas au 3e. Le coureur cherche à marquer, alors c'est le marbre qu'il faut protéger.",
      },
    ],
    principe:
      "Avec un coureur au 3e, le lanceur couvre le marbre si le receveur doit quitter sa position.",
  },
  {
    id: "P-3",
    position: "P",
    niveau: 2,
    retraits: 2,
    coureurs: "Buts remplis",
    compte: "3-2",
    titre: "Compte plein, buts remplis",
    description:
      "Deux retraits, buts remplis, compte de 3-2. Tout part au lancer. Quelle est la meilleure mentalité et le meilleur jeu à faire ?",
    choix: [
      {
        id: "a",
        texte: "Lancer un bon strike et être prêt à fielder ma position — le jeu le plus simple retire le côté",
        correct: true,
        feedback:
          "Parfait ! Avec 2 retraits, n'importe quel retrait termine la manche. Tu lances un strike de qualité, puis tu redeviens un joueur de champ prêt à réagir. Le jeu le plus simple (souvent au 1er, ou le forceur le plus proche) fait le travail.",
      },
      {
        id: "b",
        texte: "Essayer de lancer trop fort pour un retrait sur des prises",
        correct: false,
        feedback:
          "Attention — vouloir trop en faire mène souvent à un mauvais lancer ou un but-sur-balles qui force un point. Reste calme et lance ta meilleure balle dans la zone.",
      },
      {
        id: "c",
        texte: "Toujours viser un double-jeu",
        correct: false,
        feedback:
          "Avec 2 retraits, tu n'as pas besoin d'un double-jeu ! Un seul retrait termine la manche. Le jeu le plus sûr est le meilleur.",
      },
    ],
    principe:
      "Avec 2 retraits, le jeu le plus SIMPLE termine la manche. Pas besoin de forcer.",
  },

  // ─────────────────────────────── RECEVEUR (C) ───────────────────────────────
  {
    id: "C-1",
    position: "C",
    niveau: 1,
    retraits: 0,
    coureurs: "Aucun coureur",
    titre: "Ballon-chandelle près du marbre",
    description:
      "Le frappeur frappe un ballon très haut juste au-dessus du marbre. Comme receveur, quelle est ta technique ?",
    choix: [
      {
        id: "a",
        texte: "J'enlève mon masque, je le lance loin, je trouve la balle et je la couvre dos au terrain",
        correct: true,
        feedback:
          "Excellent ! On enlève le masque pour voir, mais on le LANCE loin pour ne pas trébucher dessus. Les ballons près du marbre reculent vers le terrain à cause de la rotation — tu dois te placer dos au champ pour que la balle revienne vers toi.",
      },
      {
        id: "b",
        texte: "Je garde mon masque et j'attrape la balle face au terrain",
        correct: false,
        feedback:
          "Deux erreurs : le masque nuit à ta vision et à tes mouvements, et un ballon frappé près du marbre a un effet qui le ramène VERS le terrain — face au champ tu vas le manquer.",
      },
      {
        id: "c",
        texte: "Je laisse le lanceur s'en occuper",
        correct: false,
        feedback:
          "Le receveur a la meilleure position sur les ballons près du marbre. C'est ta balle — communique et prends-la.",
      },
    ],
    principe:
      "Sur un ballon près du marbre : masque lancé loin, dos au terrain (la balle revient vers le champ).",
  },
  {
    id: "C-2",
    position: "C",
    niveau: 2,
    retraits: 1,
    coureurs: "Coureur au 2e but",
    titre: "Simple au champ, coureur essaie de marquer",
    description:
      "Coureur au 2e but. Le frappeur cogne un simple au champ centre. Le coureur contourne le 3e et fonce vers le marbre. Comme receveur, que fais-tu ?",
    choix: [
      {
        id: "a",
        texte: "Je me place au marbre, je bloque l'angle, je reçois le relais et j'applique le touché",
        correct: true,
        feedback:
          "Parfait ! Le receveur protège le marbre. Tu te places pour recevoir le relais du champ (souvent via l'arrêt-court en relais), tu tiens bien la balle et tu appliques le touché. La communication avec les relais est clé.",
      },
      {
        id: "b",
        texte: "Je cours vers le monticule pour aider le lanceur",
        correct: false,
        feedback:
          "Non — ta place est au marbre. C'est là que le point se joue et personne d'autre ne peut le protéger.",
      },
      {
        id: "c",
        texte: "J'attends la balle debout devant le marbre sans me placer",
        correct: false,
        feedback:
          "Il faut te positionner intelligemment : recevoir le relais tôt et être prêt au touché. Rester passif te fera perdre la course.",
      },
    ],
    principe:
      "Le receveur est le gardien du marbre : bonne position, recevoir le relais, touché solide.",
  },

  // ─────────────────────────────── PREMIER BUT (1B) ───────────────────────────────
  {
    id: "1B-1",
    position: "1B",
    niveau: 1,
    retraits: 0,
    coureurs: "Aucun coureur",
    titre: "Roulant à l'arrêt-court",
    description:
      "Un roulant est frappé vers l'arrêt-court. Comme premier but, quelle est ta responsabilité ?",
    choix: [
      {
        id: "a",
        texte: "Je vais au sac, je pose mon pied et j'étire vers la balle pour recevoir le relais tôt",
        correct: true,
        feedback:
          "Exactement ! Tu cours au sac, tu trouves le coin avec ton pied, puis tu ÉTIRES vers le lanceur du relais. Étirer gagne une fraction de seconde qui retire le coureur de justesse.",
      },
      {
        id: "b",
        texte: "Je cours vers la balle pour aider l'arrêt-court",
        correct: false,
        feedback:
          "Non — c'est le jeu de l'arrêt-court. Si tu quittes le sac, personne ne couvre le premier but pour le retrait.",
      },
      {
        id: "c",
        texte: "J'attends près du sac sans poser mon pied",
        correct: false,
        feedback:
          "Il faut ancrer ton pied sur le sac ET étirer. Sinon le relais arrive et tu n'as pas de point d'appui pour le retrait.",
      },
    ],
    principe:
      "Le premier but va au sac, ancre son pied et étire vers le relais pour gagner du temps.",
  },
  {
    id: "1B-2",
    position: "1B",
    niveau: 2,
    retraits: 1,
    coureurs: "Coureur au 1er but",
    titre: "Tenir le coureur / relais bas",
    description:
      "Coureur au 1er but. Un roulant est frappé vers le 2e but qui lance vers le 2e pour le forceur, puis on relaie vers toi au 1er pour le double-jeu. Le relais arrive bas dans la terre. Que fais-tu ?",
    choix: [
      {
        id: "a",
        texte: "Je fais une prise courte (scoop) en gardant mon pied sur le sac",
        correct: true,
        feedback:
          "Bravo ! Sur un relais bas, le premier but doit faire un 'scoop' : gant au sol, souple, tout en gardant le pied sur le sac. Bien récupérer les mauvais relais sauve des retraits et donne confiance à tes coéquipiers.",
      },
      {
        id: "b",
        texte: "Je quitte le sac pour attraper la balle proprement",
        correct: false,
        feedback:
          "Si tu quittes le sac, même en attrapant la balle, le coureur est sauf. Il faut garder contact avec le sac ET récupérer la balle.",
      },
      {
        id: "c",
        texte: "Je laisse rouler et je cours après",
        correct: false,
        feedback:
          "Laisser passer le relais annule le retrait et peut laisser le coureur avancer. Un bon scoop est la bonne réponse.",
      },
    ],
    principe:
      "Sur un relais bas : scoop souple, gant au sol, pied ancré au sac.",
  },

  // ─────────────────────────────── DEUXIÈME BUT (2B) ───────────────────────────────
  {
    id: "2B-1",
    position: "2B",
    niveau: 2,
    retraits: 0,
    coureurs: "Coureur au 1er but",
    titre: "Roulant à l'arrêt-court : le pivot du double-jeu",
    description:
      "Coureur au 1er, aucun retrait. Roulant frappé à l'arrêt-court. C'est un double-jeu potentiel. Quel est ton rôle au deuxième but ?",
    choix: [
      {
        id: "a",
        texte: "Je couvre le 2e but, je reçois le relais de l'arrêt-court, je touche le sac et je relaie au 1er",
        correct: true,
        feedback:
          "Parfait ! Sur une balle à l'arrêt-court, c'est le 2e but qui couvre le sac pour le pivot. Tu reçois, tu touches le 2e (forceur), puis tu tournes et relaies au 1er pour compléter le double-jeu. Le footwork au sac est essentiel.",
      },
      {
        id: "b",
        texte: "Je cours vers la balle pour aider l'arrêt-court",
        correct: false,
        feedback:
          "Non — l'arrêt-court a la balle. Si tu y vas aussi, personne ne couvre le 2e but et le double-jeu est impossible.",
      },
      {
        id: "c",
        texte: "Je couvre le premier but",
        correct: false,
        feedback:
          "Le premier but reste responsable de son sac. Toi, tu es le pivot au 2e sur une balle frappée du côté de l'arrêt-court.",
      },
    ],
    principe:
      "Balle à l'arrêt-court = le 2e but couvre le sac et devient le pivot du double-jeu.",
  },
  {
    id: "2B-2",
    position: "2B",
    niveau: 1,
    retraits: 2,
    coureurs: "Coureur au 2e but",
    titre: "Simple frappé au champ droit",
    description:
      "Deux retraits, coureur au 2e. Simple frappé au champ droit. Le champ droit ramasse et veut relayer vers le marbre. Où te places-tu comme deuxième but ?",
    choix: [
      {
        id: "a",
        texte: "Je deviens l'homme-relais entre le champ droit et le marbre",
        correct: true,
        feedback:
          "Excellent ! Sur une balle au champ droit avec un jeu au marbre, le 2e but sort dans le champ extérieur pour servir de relais (coupe). Tu alignes ton corps entre le champ droit et le marbre, prêt à recevoir et relayer.",
      },
      {
        id: "b",
        texte: "Je reste au 2e but",
        correct: false,
        feedback:
          "Le jeu se passe entre le champ droit et le marbre. Rester au 2e te met hors du jeu. Tu dois aller couper le relais.",
      },
      {
        id: "c",
        texte: "Je cours au marbre",
        correct: false,
        feedback:
          "Le marbre, c'est le receveur. Toi, tu es l'homme-relais qui raccourcit la distance du lancer du champ droit.",
      },
    ],
    principe:
      "Sur une balle au champ droit avec jeu au marbre, le 2e but sert souvent d'homme-relais.",
  },

  // ─────────────────────────────── ARRÊT-COURT (SS) ───────────────────────────────
  {
    id: "SS-1",
    position: "SS",
    niveau: 2,
    retraits: 0,
    coureurs: "Coureur au 1er but",
    titre: "Roulant au deuxième but : le pivot",
    description:
      "Coureur au 1er, aucun retrait. Roulant frappé vers le deuxième but. Double-jeu possible. Quel est ton rôle comme arrêt-court ?",
    choix: [
      {
        id: "a",
        texte: "Je couvre le 2e but, je reçois le relais du 2e but, je touche et je relaie au 1er",
        correct: true,
        feedback:
          "Exact ! Quand la balle est frappée vers le 2e but, c'est l'arrêt-court qui couvre le sac. Tu es le pivot : recevoir, toucher le 2e, éviter le coureur qui glisse et relayer fort au 1er.",
      },
      {
        id: "b",
        texte: "Je reste à ma position et je regarde",
        correct: false,
        feedback:
          "Non — sur une balle au 2e but, personne d'autre ne couvre le sac. L'arrêt-court doit s'y rendre pour le pivot.",
      },
      {
        id: "c",
        texte: "Je cours vers le 3e but",
        correct: false,
        feedback:
          "Le double-jeu se fait 2e→1er. Le 3e n'est pas en jeu ici. Ta responsabilité est de couvrir le 2e but.",
      },
    ],
    principe:
      "Balle au 2e but = l'arrêt-court couvre le sac et devient le pivot du double-jeu.",
  },
  {
    id: "SS-2",
    position: "SS",
    niveau: 3,
    retraits: 1,
    coureurs: "Coureur au 2e but",
    titre: "Le relais de l'avant-champ (cut-off)",
    description:
      "Coureur au 2e. Double frappé au champ gauche-centre. Le coureur va marquer et le frappeur vise le 2e. Comme arrêt-court, quel est ton positionnement ?",
    choix: [
      {
        id: "a",
        texte: "Je sors vers le champ pour être l'homme-relais, en écoutant le receveur qui me dirige",
        correct: true,
        feedback:
          "Bravo ! L'arrêt-court est souvent l'homme-relais sur les balles au champ gauche/centre. Tu sors les mains en l'air comme cible, et le receveur te crie où relayer (marbre ou 2e). L'IQ, c'est écouter et prendre la bonne décision de relais.",
      },
      {
        id: "b",
        texte: "Je reste au 2e but pour le touché",
        correct: false,
        feedback:
          "Sans homme-relais, le lancer du champ extérieur perd du temps et de la précision. Le 2e but peut couvrir le sac pendant que TOI tu vas au relais.",
      },
      {
        id: "c",
        texte: "Je cours dans le champ extérieur chercher la balle",
        correct: false,
        feedback:
          "Laisse le voltigeur ramasser la balle. Ton rôle est d'être le relais bien positionné entre lui et le but visé.",
      },
    ],
    principe:
      "L'arrêt-court est l'homme-relais sur les balles au champ gauche/centre — il écoute le receveur.",
  },

  // ─────────────────────────────── TROISIÈME BUT (3B) ───────────────────────────────
  {
    id: "3B-1",
    position: "3B",
    niveau: 2,
    retraits: 1,
    coureurs: "Coureur au 1er but",
    titre: "Amorti (bunt) attendu",
    description:
      "Coureur au 1er, le frappeur montre l'amorti. Comme troisième but, comment réagis-tu ?",
    choix: [
      {
        id: "a",
        texte: "Je charge vers l'avant dès l'amorti, je ramasse et je vise le sac où j'ai le meilleur retrait (souvent le 1er)",
        correct: true,
        feedback:
          "Parfait ! Sur un amorti attendu, le 3e but charge agressivement. Tu ramasses la balle à deux mains si possible, tu te stabilises et tu vises le retrait le plus sûr — souvent le 1er but. Si tu peux avoir le coureur avancé au 2e sans risque, encore mieux.",
      },
      {
        id: "b",
        texte: "Je recule pour me protéger d'une frappe forte",
        correct: false,
        feedback:
          "Si l'amorti est clairement montré, reculer laisse la balle mourir dans l'herbe et tout le monde est sauf. Il faut charger et attaquer l'amorti.",
      },
      {
        id: "c",
        texte: "Je reste immobile à ma position",
        correct: false,
        feedback:
          "L'amorti est conçu pour t'immobiliser. Il faut réagir vite, charger et faire le jeu.",
      },
    ],
    principe:
      "Sur un amorti attendu, le 3e but charge et choisit le retrait le plus sûr.",
  },
  {
    id: "3B-2",
    position: "3B",
    niveau: 1,
    retraits: 2,
    coureurs: "Buts remplis",
    titre: "Roulant frappé droit sur toi",
    description:
      "Deux retraits, buts remplis. Un roulant est frappé directement sur toi au troisième but. Quel est le jeu le plus simple et le plus sûr ?",
    choix: [
      {
        id: "a",
        texte: "Je touche le 3e but (forceur) — le sac est juste à côté de moi",
        correct: true,
        feedback:
          "Excellent ! Avec les buts remplis, il y a un jeu de force à CHAQUE but. Le retrait le plus proche et le plus sûr est de toucher ton propre sac (le 3e) pour le forceur. Simple = sûr, et ça termine la manche.",
      },
      {
        id: "b",
        texte: "Je lance au marbre puis on relaie au 1er pour un double-jeu",
        correct: false,
        feedback:
          "Trop risqué avec 2 retraits. Le jeu le plus simple termine la manche. Toucher le 3e sac juste à côté de toi est bien plus sûr qu'un long relais.",
      },
      {
        id: "c",
        texte: "Je lance au premier but",
        correct: false,
        feedback:
          "Possible, mais pourquoi faire un long relais quand le forceur au 3e est à un pas de toi ? Le jeu le plus court et sûr est de toucher ton sac.",
      },
    ],
    principe:
      "Buts remplis = jeu de force partout. Choisis le retrait le plus proche et le plus sûr.",
  },

  // ─────────────────────────────── CHAMP GAUCHE (LF) ───────────────────────────────
  {
    id: "LF-1",
    position: "LF",
    niveau: 1,
    retraits: 1,
    coureurs: "Coureur au 2e but",
    titre: "Simple devant toi, coureur fonce au marbre",
    description:
      "Coureur au 2e. Simple frappé devant toi au champ gauche. Le coureur contourne le 3e vers le marbre. Que fais-tu ?",
    choix: [
      {
        id: "a",
        texte: "Je charge la balle, je la prends du bon côté et je lance vers l'homme-relais (arrêt-court)",
        correct: true,
        feedback:
          "Bravo ! Tu charges pour réduire la distance, tu attrapes en te positionnant pour lancer, puis tu vises l'homme-relais (l'arrêt-court) — PAS directement le marbre par-dessus tout le monde. Un lancer bas et précis vers le relais est plus efficace qu'une longue balle en cloche.",
      },
      {
        id: "b",
        texte: "Je lance le plus fort possible directement au marbre",
        correct: false,
        feedback:
          "Un lancer trop long finit souvent haut, imprécis, et laisse les autres coureurs avancer. Vise l'homme-relais : c'est plus rapide et il peut ajuster le jeu.",
      },
      {
        id: "c",
        texte: "J'attends que la balle vienne à moi avant de la ramasser",
        correct: false,
        feedback:
          "Attendre laisse le coureur gagner du terrain. Il faut charger la balle pour gagner de précieuses secondes.",
      },
    ],
    principe:
      "Le voltigeur charge la balle et lance vers l'homme-relais, pas en cloche vers le but.",
  },
  {
    id: "LF-2",
    position: "LF",
    niveau: 2,
    retraits: 0,
    coureurs: "Coureur au 1er but",
    titre: "Ballon partagé avec le champ centre",
    description:
      "Un ballon est frappé entre toi (champ gauche) et le champ centre. Vous foncez tous les deux. Quelle est la bonne règle de priorité ?",
    choix: [
      {
        id: "a",
        texte: "Le champ centre a priorité — je m'écarte s'il appelle la balle, prêt à l'appuyer",
        correct: true,
        feedback:
          "Exact ! Le champ centre est le patron du champ extérieur : il a priorité sur les ballons partagés. Tu écoutes son appel, tu t'écartes, mais tu restes prêt à le couvrir (backup) au cas où il l'échappe.",
      },
      {
        id: "b",
        texte: "Je continue et j'attrape peu importe l'appel",
        correct: false,
        feedback:
          "Danger de collision ! Sans règle de priorité claire, deux joueurs peuvent se blesser et échapper la balle. Le champ centre commande.",
      },
      {
        id: "c",
        texte: "Je m'arrête complètement et je regarde",
        correct: false,
        feedback:
          "Ne t'arrête pas passivement : écarte-toi si le centre appelle, mais reste actif pour l'appuyer en cas d'erreur.",
      },
    ],
    principe:
      "Le champ centre a priorité sur les ballons partagés. Communiquez avec des appels forts.",
  },

  // ─────────────────────────────── CHAMP CENTRE (CF) ───────────────────────────────
  {
    id: "CF-1",
    position: "CF",
    niveau: 2,
    retraits: 1,
    coureurs: "Aucun coureur",
    titre: "Le patron du champ extérieur",
    description:
      "Un ballon est frappé peu profond, entre l'avant-champ et le champ extérieur. Le 2e but recule, toi tu avances. Qui devrait prendre la balle ?",
    choix: [
      {
        id: "a",
        texte: "J'appelle fort et je prends la balle — je vois le jeu devant moi et j'ai l'élan vers l'avant",
        correct: true,
        feedback:
          "Bravo ! Un voltigeur qui avance sur un ballon a un bien meilleur angle qu'un joueur d'avant-champ qui recule à l'aveugle. Le champ centre, patron du champ, appelle fort et prend la balle quand il peut y arriver.",
      },
      {
        id: "b",
        texte: "Je laisse le 2e but reculer et attraper",
        correct: false,
        feedback:
          "Reculer pour attraper est un des jeux les plus difficiles. Si tu peux y arriver en avançant, c'est TON ballon — appelle-le pour éviter la confusion.",
      },
      {
        id: "c",
        texte: "Je reste loin et j'attends une éventuelle roulade",
        correct: false,
        feedback:
          "Sois agressif sur les ballons à ta portée. Le champ centre couvre beaucoup de terrain et commande les ballons partagés.",
      },
    ],
    principe:
      "Le champ centre commande le champ extérieur. Avancer sur un ballon > reculer à l'aveugle.",
  },
  {
    id: "CF-2",
    position: "CF",
    niveau: 3,
    retraits: 2,
    coureurs: "Coureur au 1er but",
    titre: "Balle dans l'allée, penser au relais",
    description:
      "Deux retraits, coureur au 1er. Balle frappée dans l'allée du champ centre-droit. Le coureur va tenter de marquer du 1er. Quel est ton meilleur jeu ?",
    choix: [
      {
        id: "a",
        texte: "Je coupe la balle vite, je me tourne et je lance à l'homme-relais qui décidera pour le marbre",
        correct: true,
        feedback:
          "Parfait ! Sur une balle profonde, la clé est de récupérer vite et de relayer par l'homme-relais (arrêt-court ou 2e). Le système de relais permet un lancer plus précis vers le marbre. Ton travail : balle propre, relais rapide, bonne cible.",
      },
      {
        id: "b",
        texte: "Je tente de lancer la balle jusqu'au marbre d'un seul coup",
        correct: false,
        feedback:
          "Du champ profond, un seul lancer jusqu'au marbre est trop long et imprécis, et laisse le frappeur avancer. Utilise l'homme-relais.",
      },
      {
        id: "c",
        texte: "Je garde la balle et je cours vers l'avant-champ",
        correct: false,
        feedback:
          "Courir avec la balle perd un temps précieux. Un lancer rapide vers le relais est toujours plus efficace.",
      },
    ],
    principe:
      "Sur les balles profondes, le voltigeur relaie par l'homme-relais — jamais un lancer solo trop long.",
  },

  // ─────────────────────────────── CHAMP DROIT (RF) ───────────────────────────────
  {
    id: "RF-1",
    position: "RF",
    niveau: 2,
    retraits: 0,
    coureurs: "Aucun coureur",
    titre: "Le champ droit appuie le premier but",
    description:
      "Un roulant est frappé vers l'arrêt-court, qui relaie au premier but. Comme champ droit, que fais-tu pendant ce jeu d'avant-champ ?",
    choix: [
      {
        id: "a",
        texte: "Je cours appuyer (backup) le premier but au cas où le relais serait échappé",
        correct: true,
        feedback:
          "Excellent ! Un bon champ droit ne reste jamais spectateur. Sur un relais vers le premier, tu cours derrière le sac pour récupérer une balle échappée — ça empêche le coureur d'avancer. C'est un jeu d'IQ que peu de jeunes pensent à faire.",
      },
      {
        id: "b",
        texte: "Je reste à ma position, ce n'est pas mon jeu",
        correct: false,
        feedback:
          "Au contraire ! Le champ droit est parfaitement placé pour appuyer le premier but. Une balle échappée sans backup = un coureur qui avance.",
      },
      {
        id: "c",
        texte: "Je cours vers le deuxième but",
        correct: false,
        feedback:
          "Le jeu se fait au premier. Ton angle naturel depuis le champ droit te place idéalement pour appuyer le 1er but.",
      },
    ],
    principe:
      "Le champ droit appuie (backup) le premier but sur les relais de l'avant-champ.",
  },
  {
    id: "RF-2",
    position: "RF",
    niveau: 1,
    retraits: 2,
    coureurs: "Coureur au 2e but",
    titre: "Simple à ta portée, ne pas laisser passer",
    description:
      "Deux retraits, coureur au 2e. Simple frappé nettement devant toi au champ droit. Quelle est ta priorité numéro un ?",
    choix: [
      {
        id: "a",
        texte: "Bloquer la balle proprement d'abord, puis viser l'homme-relais",
        correct: true,
        feedback:
          "Bravo ! La règle d'or du voltigeur : ne JAMAIS laisser passer la balle derrière toi. Une balle échappée transforme un simple en triple ou en point. Bloque d'abord (mets un genou au sol si besoin), puis fais un bon relais.",
      },
      {
        id: "b",
        texte: "Attaquer la balle très agressivement quitte à risquer qu'elle passe",
        correct: false,
        feedback:
          "Avec un coureur en position de marquer, une balle qui passe derrière toi est un désastre. La sécurité d'abord : bloque, puis relaie.",
      },
      {
        id: "c",
        texte: "Lancer immédiatement au marbre sans contrôler la balle",
        correct: false,
        feedback:
          "Contrôle la balle avant tout. Un lancer précipité sur une balle mal contrôlée finit souvent au champ, pas dans le gant du relais.",
      },
    ],
    principe:
      "Priorité du voltigeur : bloquer la balle d'abord (rien ne passe), le relais ensuite.",
  },
];

// Regroupe les situations par position
export function situationsParPosition(positionId: string): Situation[] {
  return SITUATIONS.filter((s) => s.position === positionId);
}
