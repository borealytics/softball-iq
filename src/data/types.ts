// Modèle de données — Softball IQ
// Toutes les situations de jeu et positions sont définies ici.

export type PositionId =
  | "P" // Lanceur
  | "C" // Receveur
  | "1B" // Premier but
  | "2B" // Deuxième but
  | "SS" // Arrêt-court
  | "3B" // Troisième but
  | "LF" // Champ gauche
  | "CF" // Champ centre
  | "RF"; // Champ droit

export interface Position {
  id: PositionId;
  nom: string; // Nom complet en français
  numero: number; // Numéro traditionnel de position (score-keeping)
  abbr: string;
  zone: "avant-champ" | "champ-extérieur" | "batterie";
  // Coordonnées sur le losange (en %) pour le schéma SVG
  x: number;
  y: number;
  role: string; // Résumé du rôle
  couleur: string; // couleur de l'accent (tailwind-friendly hex)
}

export interface Choix {
  id: string;
  texte: string;
  correct: boolean;
  // Explication montrée après la réponse
  feedback: string;
}

export interface Situation {
  id: string;
  position: PositionId;
  niveau: 1 | 2 | 3; // 1 = base, 2 = intermédiaire, 3 = avancé
  // Contexte du jeu
  manches?: string;
  retraits: 0 | 1 | 2;
  coureurs: string; // ex: "Coureur au 1er", "Buts remplis", "Aucun"
  compte?: string; // ex: "2-1"
  pointage?: string;
  // La description de la situation
  titre: string;
  description: string;
  choix: Choix[];
  // Le principe pédagogique clé à retenir
  principe: string;
}
