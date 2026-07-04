// Moteur softball — états de match et logique de jeu réelle.
// Sert de base à la génération des situations par position.

export type RunnerCode =
  | "none"
  | "1"
  | "2"
  | "3"
  | "12"
  | "13"
  | "23"
  | "123";

export interface GameState {
  outs: 0 | 1 | 2;
  runners: RunnerCode;
  count?: string; // ex: "2-1"
  scoreDiff?: number; // point de vue défensive: +1 = mène par 1, -1 = tire de l'arrière
  inning?: number;
}

// Libellés français des coureurs
export const RUNNER_LABEL: Record<RunnerCode, string> = {
  none: "Aucun coureur",
  "1": "Coureur au 1er but",
  "2": "Coureur au 2e but",
  "3": "Coureur au 3e but",
  "12": "Coureurs aux 1er et 2e buts",
  "13": "Coureurs aux 1er et 3e buts",
  "23": "Coureurs aux 2e et 3e buts",
  "123": "Buts remplis",
};

// Quels buts sont occupés
export function bases(code: RunnerCode): { b1: boolean; b2: boolean; b3: boolean } {
  return {
    b1: code === "1" || code === "12" || code === "13" || code === "123",
    b2: code === "2" || code === "12" || code === "23" || code === "123",
    b3: code === "3" || code === "13" || code === "23" || code === "123",
  };
}

// Jeu de force disponible à chaque but ?
// Un jeu de force existe à un but si TOUS les buts précédents (marbre inclus) sont occupés.
export function forces(code: RunnerCode): {
  premier: boolean;
  deuxieme: boolean;
  troisieme: boolean;
  marbre: boolean;
} {
  const { b1, b2, b3 } = bases(code);
  return {
    premier: true, // le frappeur court toujours au 1er
    deuxieme: b1, // force au 2e si coureur au 1er
    troisieme: b1 && b2, // force au 3e si 1er ET 2e
    marbre: b1 && b2 && b3, // force au marbre si buts remplis
  };
}

// Y a-t-il un coureur en position de marquer (2e ou 3e) ?
export function pointEnJeu(code: RunnerCode): boolean {
  const { b2, b3 } = bases(code);
  return b2 || b3;
}

// Double-jeu possible ? (coureur forcé au 1er avec moins de 2 retraits)
export function doubleJeuPossible(gs: GameState): boolean {
  return bases(gs.runners).b1 && gs.outs < 2;
}

// Comptes réalistes pour varier
export const COMPTES = ["0-0", "1-0", "0-1", "1-1", "2-1", "3-2", "0-2", "2-2"];

// Descriptions de pointage (point de vue défensif)
export function pointageTexte(diff?: number): string | undefined {
  if (diff === undefined) return undefined;
  if (diff === 0) return "Pointage égal";
  if (diff > 0) return `Votre équipe mène par ${diff}`;
  return `Votre équipe tire de l'arrière par ${Math.abs(diff)}`;
}

// Liste ordonnée des 24 états de base (retraits × coureurs)
export const ETATS_BASE: GameState[] = (() => {
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
  const out: GameState[] = [];
  for (const outs of [0, 1, 2] as const) {
    for (const runners of codes) {
      out.push({ outs, runners });
    }
  }
  return out;
})();
