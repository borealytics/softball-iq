"use client";

import { useMemo, useState } from "react";
import { Position, Situation } from "@/data/types";
import { situationsParPosition } from "@/data/situations";

interface QuizProps {
  position: Position;
  onRetour: () => void;
}

const NIVEAU_LABEL: Record<number, string> = {
  1: "Base",
  2: "Intermédiaire",
  3: "Avancé",
};

const NIVEAU_COULEUR: Record<number, string> = {
  1: "bg-green-100 text-green-800",
  2: "bg-amber-100 text-amber-800",
  3: "bg-red-100 text-red-800",
};

export default function Quiz({ position, onRetour }: QuizProps) {
  const situations = useMemo(
    () => situationsParPosition(position.id),
    [position.id]
  );

  const [index, setIndex] = useState(0);
  const [choixId, setChoixId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [reussies, setReussies] = useState<Set<string>>(new Set());
  const [termine, setTermine] = useState(false);

  const situation: Situation | undefined = situations[index];

  if (!situation) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Aucune situation pour cette position pour l&apos;instant.
        </p>
        <button
          onClick={onRetour}
          className="mt-4 px-5 py-2 rounded-lg bg-slate-800 text-white font-semibold"
        >
          ← Retour
        </button>
      </div>
    );
  }

  const choixChoisi = situation.choix.find((c) => c.id === choixId);
  const aRepondu = choixId !== null;
  const estDernier = index === situations.length - 1;

  function repondre(id: string) {
    if (aRepondu) return; // verrouille après la réponse
    setChoixId(id);
    const c = situation!.choix.find((x) => x.id === id);
    if (c?.correct && !reussies.has(situation!.id)) {
      setScore((s) => s + 1);
      setReussies((r) => new Set(r).add(situation!.id));
    }
  }

  function suivant() {
    if (estDernier) {
      setTermine(true);
      return;
    }
    setIndex((i) => i + 1);
    setChoixId(null);
  }

  function recommencer() {
    setIndex(0);
    setChoixId(null);
    setScore(0);
    setReussies(new Set());
    setTermine(false);
  }

  // ─── Écran de fin ───
  if (termine) {
    const pct = Math.round((score / situations.length) * 100);
    const message =
      pct === 100
        ? "Parfait ! Un vrai cerveau de softball ! 🧠🥎"
        : pct >= 70
        ? "Très bien joué ! Ton IQ softball grimpe ! 💪"
        : pct >= 40
        ? "Bon début ! Relis les principes et réessaie. 📈"
        : "Continue à t'entraîner, chaque erreur t'apprend ! 🔁";
    return (
      <div className="text-center py-10 px-4">
        <div
          className="w-28 h-28 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-black mb-4"
          style={{ backgroundColor: position.couleur }}
        >
          {pct}%
        </div>
        <h2 className="text-2xl font-black text-slate-800">
          {position.nom}
        </h2>
        <p className="text-slate-600 mt-1">
          {score} / {situations.length} bonnes décisions
        </p>
        <p className="text-lg font-semibold text-slate-800 mt-4">{message}</p>
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={recommencer}
            className="px-5 py-2.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition"
          >
            🔁 Recommencer
          </button>
          <button
            onClick={onRetour}
            className="px-5 py-2.5 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            Changer de position
          </button>
        </div>
      </div>
    );
  }

  // ─── Écran de situation ───
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onRetour}
          className="text-slate-500 hover:text-slate-800 font-medium text-sm"
        >
          ← Positions
        </button>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-white text-sm font-bold"
            style={{ backgroundColor: position.couleur }}
          >
            {position.nom}
          </span>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>
            Situation {index + 1} / {situations.length}
          </span>
          <span>Score : {score}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((index + 1) / situations.length) * 100}%`,
              backgroundColor: position.couleur,
            }}
          />
        </div>
      </div>

      {/* Carte situation */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Contexte du jeu */}
        <div className="bg-slate-800 text-white px-5 py-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span>
            <span className="text-slate-400">Retraits :</span>{" "}
            <b>{situation.retraits}</b>
          </span>
          <span>
            <span className="text-slate-400">Coureurs :</span>{" "}
            <b>{situation.coureurs}</b>
          </span>
          {situation.compte && (
            <span>
              <span className="text-slate-400">Compte :</span>{" "}
              <b>{situation.compte}</b>
            </span>
          )}
          <span
            className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${
              NIVEAU_COULEUR[situation.niveau]
            }`}
          >
            {NIVEAU_LABEL[situation.niveau]}
          </span>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-black text-slate-800 mb-2">
            {situation.titre}
          </h3>
          <p className="text-slate-600 mb-5 leading-relaxed">
            {situation.description}
          </p>

          {/* Choix */}
          <div className="space-y-3">
            {situation.choix.map((c) => {
              let style =
                "border-slate-200 hover:border-slate-400 hover:bg-slate-50";
              if (aRepondu) {
                if (c.correct) {
                  style = "border-green-500 bg-green-50";
                } else if (c.id === choixId) {
                  style = "border-red-400 bg-red-50";
                } else {
                  style = "border-slate-200 opacity-60";
                }
              }
              return (
                <button
                  key={c.id}
                  onClick={() => repondre(c.id)}
                  disabled={aRepondu}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-slate-700 transition ${style} ${
                    !aRepondu ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span className="flex items-start gap-2">
                    {aRepondu && c.correct && <span>✅</span>}
                    {aRepondu && !c.correct && c.id === choixId && (
                      <span>❌</span>
                    )}
                    <span>{c.texte}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {aRepondu && choixChoisi && (
            <div
              className={`mt-5 rounded-xl p-4 ${
                choixChoisi.correct
                  ? "bg-green-50 border border-green-200"
                  : "bg-amber-50 border border-amber-200"
              }`}
            >
              <p className="text-sm text-slate-700 leading-relaxed">
                {choixChoisi.feedback}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200/70">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  🎯 Principe à retenir
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {situation.principe}
                </p>
              </div>
            </div>
          )}

          {/* Bouton suivant */}
          {aRepondu && (
            <button
              onClick={suivant}
              className="mt-5 w-full py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90"
              style={{ backgroundColor: position.couleur }}
            >
              {estDernier ? "Voir mon résultat 🏆" : "Situation suivante →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
