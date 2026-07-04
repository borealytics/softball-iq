"use client";

import { useMemo, useState } from "react";
import { Position, Situation } from "@/data/types";
import { tirerSession, compteParNiveau } from "@/data/session";

interface QuizProps {
  position: Position;
  onRetour: () => void;
}

type Ecran = "config" | "jeu" | "fin";
type NiveauFiltre = 1 | 2 | 3 | "tous";

const NIVEAU_LABEL: Record<number, string> = {
  1: "Base",
  2: "Intermédiaire",
  3: "Avancé",
};
const NIVEAU_COULEUR: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-800",
  2: "bg-amber-100 text-amber-800",
  3: "bg-rose-100 text-rose-800",
};

export default function Quiz({ position, onRetour }: QuizProps) {
  const compte = useMemo(() => compteParNiveau(position.id), [position.id]);

  const [ecran, setEcran] = useState<Ecran>("config");
  const [niveau, setNiveau] = useState<NiveauFiltre>("tous");
  const [taille, setTaille] = useState(10);
  const [session, setSession] = useState<Situation[]>([]);

  const [index, setIndex] = useState(0);
  const [choixId, setChoixId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [historique, setHistorique] = useState<boolean[]>([]);

  function demarrer() {
    const s = tirerSession(position.id, taille, niveau);
    setSession(s);
    setIndex(0);
    setChoixId(null);
    setScore(0);
    setHistorique([]);
    setEcran("jeu");
  }

  const situation = session[index];
  const choixChoisi = situation?.choix.find((c) => c.id === choixId);
  const aRepondu = choixId !== null;
  const estDernier = index === session.length - 1;

  function repondre(id: string) {
    if (aRepondu) return;
    setChoixId(id);
    const c = situation.choix.find((x) => x.id === id);
    const bon = !!c?.correct;
    if (bon) setScore((s) => s + 1);
    setHistorique((h) => [...h, bon]);
  }

  function suivant() {
    if (estDernier) {
      setEcran("fin");
      return;
    }
    setIndex((i) => i + 1);
    setChoixId(null);
  }

  // ─────────────── ÉCRAN CONFIG ───────────────
  if (ecran === "config") {
    const dispo =
      niveau === "tous"
        ? compte.total
        : niveau === 1
        ? compte.n1
        : niveau === 2
        ? compte.n2
        : compte.n3;
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <button
          onClick={onRetour}
          className="text-slate-500 hover:text-slate-800 font-medium text-sm mb-6"
        >
          ← Toutes les positions
        </button>

        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-3 shadow-lg"
            style={{ backgroundColor: position.couleur }}
          >
            {position.numero}
          </div>
          <h2 className="text-2xl font-black text-slate-800">{position.nom}</h2>
          <p className="text-sm text-slate-500 mt-1 leading-snug">
            {position.role}
          </p>
        </div>

        {/* Niveau */}
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Niveau de difficulté
        </label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {(
            [
              ["tous", `Tous (${compte.total})`],
              [1, `Base (${compte.n1})`],
              [2, `Intermédiaire (${compte.n2})`],
              [3, `Avancé (${compte.n3})`],
            ] as [NiveauFiltre, string][]
          ).map(([val, label]) => (
            <button
              key={String(val)}
              onClick={() => setNiveau(val)}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                niveau === val
                  ? "border-transparent text-white shadow"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              style={
                niveau === val
                  ? { backgroundColor: position.couleur }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Longueur */}
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Longueur de la session
        </label>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {[5, 10, 20].map((n) => (
            <button
              key={n}
              onClick={() => setTaille(n)}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                taille === n
                  ? "border-transparent text-white shadow"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              style={
                taille === n ? { backgroundColor: position.couleur } : undefined
              }
            >
              {n} questions
            </button>
          ))}
        </div>

        <button
          onClick={demarrer}
          disabled={dispo === 0}
          className="w-full py-3.5 rounded-2xl text-white font-black text-lg shadow-lg hover:opacity-90 transition disabled:opacity-40"
          style={{ backgroundColor: position.couleur }}
        >
          🥎 Commencer l&apos;entraînement
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">
          {Math.min(taille, dispo)} situations tirées au hasard parmi {dispo}
        </p>
      </div>
    );
  }

  // ─────────────── ÉCRAN FIN ───────────────
  if (ecran === "fin") {
    const pct = Math.round((score / session.length) * 100);
    const message =
      pct === 100
        ? "Parfait ! Un vrai cerveau de softball ! 🧠🥎"
        : pct >= 70
        ? "Très bien joué ! Ton IQ softball grimpe ! 💪"
        : pct >= 40
        ? "Bon travail ! Relis les principes et réessaie. 📈"
        : "Continue à t'entraîner, chaque erreur t'apprend ! 🔁";
    return (
      <div className="max-w-md mx-auto text-center py-10 px-4">
        <div
          className="w-28 h-28 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl"
          style={{ backgroundColor: position.couleur }}
        >
          {pct}%
        </div>
        <h2 className="text-2xl font-black text-slate-800">{position.nom}</h2>
        <p className="text-slate-600 mt-1">
          {score} / {session.length} bonnes décisions
        </p>

        {/* Ruban de résultats */}
        <div className="flex flex-wrap gap-1.5 justify-center my-5">
          {historique.map((bon, i) => (
            <span
              key={i}
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                bon ? "bg-emerald-500 text-white" : "bg-rose-400 text-white"
              }`}
            >
              {bon ? "✓" : "✗"}
            </span>
          ))}
        </div>

        <p className="text-lg font-semibold text-slate-800 mb-8">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setEcran("config")}
            className="w-full py-3 rounded-2xl text-white font-bold hover:opacity-90 transition"
            style={{ backgroundColor: position.couleur }}
          >
            🔁 Nouvelle session
          </button>
          <button
            onClick={onRetour}
            className="w-full py-3 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
          >
            Changer de position
          </button>
        </div>
      </div>
    );
  }

  // ─────────────── ÉCRAN JEU ───────────────
  if (!situation) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onRetour}
          className="text-slate-500 hover:text-slate-800 font-medium text-sm"
        >
          ← Quitter
        </button>
        <span
          className="px-3 py-1 rounded-full text-white text-sm font-bold"
          style={{ backgroundColor: position.couleur }}
        >
          {position.nom}
        </span>
      </div>

      {/* Progression */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>
            Situation {index + 1} / {session.length}
          </span>
          <span>Score : {score}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((index + 1) / session.length) * 100}%`,
              backgroundColor: position.couleur,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Contexte */}
        <div className="bg-slate-800 text-white px-5 py-3 flex flex-wrap gap-x-4 gap-y-1 text-sm items-center">
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
          {situation.pointage && (
            <p className="text-xs font-semibold text-slate-400 mb-1">
              {situation.pointage}
            </p>
          )}
          <h3 className="text-lg font-black text-slate-800 mb-2">
            {situation.titre}
          </h3>
          <p className="text-slate-600 mb-5 leading-relaxed">
            {situation.description}
          </p>

          <div className="space-y-3">
            {situation.choix.map((c) => {
              let style =
                "border-slate-200 hover:border-slate-400 hover:bg-slate-50";
              if (aRepondu) {
                if (c.correct) style = "border-emerald-500 bg-emerald-50";
                else if (c.id === choixId) style = "border-rose-400 bg-rose-50";
                else style = "border-slate-200 opacity-60";
              }
              return (
                <button
                  key={c.id}
                  onClick={() => repondre(c.id)}
                  disabled={aRepondu}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-slate-700 transition ${style}`}
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

          {aRepondu && choixChoisi && (
            <div
              className={`mt-5 rounded-xl p-4 ${
                choixChoisi.correct
                  ? "bg-emerald-50 border border-emerald-200"
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
