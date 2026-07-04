import { Situation } from "@/data/types";
import { situationsParPosition } from "@/data/situations";

// Tire N situations au hasard pour une position, avec filtre de niveau optionnel.
export function tirerSession(
  positionId: string,
  taille: number,
  niveau?: 1 | 2 | 3 | "tous"
): Situation[] {
  let pool = situationsParPosition(positionId);
  if (niveau && niveau !== "tous") {
    pool = pool.filter((s) => s.niveau === niveau);
  }
  // mélange Fisher-Yates
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(taille, a.length));
}

export function compteParNiveau(positionId: string) {
  const pool = situationsParPosition(positionId);
  return {
    total: pool.length,
    n1: pool.filter((s) => s.niveau === 1).length,
    n2: pool.filter((s) => s.niveau === 2).length,
    n3: pool.filter((s) => s.niveau === 3).length,
  };
}
