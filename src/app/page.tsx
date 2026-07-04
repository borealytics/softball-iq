"use client";

import { useState } from "react";
import Diamant from "@/components/Diamant";
import Quiz from "@/components/Quiz";
import { POSITIONS, getPosition } from "@/data/positions";
import { compteParNiveau } from "@/data/session";
import { PositionId } from "@/data/types";

export default function Home() {
  const [positionActive, setPositionActive] = useState<PositionId | null>(null);
  const [survol, setSurvol] = useState<PositionId | null>(null);

  const position = positionActive ? getPosition(positionActive) : null;

  if (position) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Quiz position={position} onRetour={() => setPositionActive(null)} />
      </main>
    );
  }

  const posSurvol = survol ? getPosition(survol) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 via-green-700 to-slate-800 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Softball <span className="text-amber-400">IQ</span> 🥎
          </h1>
          <p className="mt-2 text-green-100">
            Choisis ta position, vis des situations de match et apprends le bon
            jeu.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 bg-white/10 rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm border border-white/10">
            <span className="text-amber-400">900</span> situations
            <span className="text-green-200">·</span> 9 positions
            <span className="text-green-200">·</span> 3 niveaux
          </div>
        </header>

        <div className="bg-white/5 rounded-3xl p-4 backdrop-blur-sm border border-white/10">
          <Diamant selection={survol} onSelect={(id) => setPositionActive(id)} />
          <p className="text-center text-sm text-green-100 mt-2 min-h-[2.5rem] flex items-center justify-center px-2">
            {posSurvol
              ? posSurvol.role
              : "Touche une position sur le terrain ou choisis dans la liste ci-dessous."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {POSITIONS.map((p) => {
            const c = compteParNiveau(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setPositionActive(p.id)}
                onMouseEnter={() => setSurvol(p.id)}
                onMouseLeave={() => setSurvol(null)}
                className="group bg-white rounded-2xl p-4 text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black shrink-0"
                    style={{ backgroundColor: p.couleur }}
                  >
                    {p.numero}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 leading-tight">
                      {p.nom}
                    </p>
                    <p className="text-xs text-slate-500">{c.total} situations</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <footer className="text-center text-green-200/70 text-xs mt-10">
          <p>Développe ton intelligence de jeu, une situation à la fois.</p>
          <p className="mt-1">Fait pour les jeunes joueurs 🧢</p>
        </footer>
      </div>
    </main>
  );
}
