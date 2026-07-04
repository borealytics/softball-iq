"use client";

import { POSITIONS } from "@/data/positions";
import { PositionId } from "@/data/types";

interface DiamantProps {
  selection?: PositionId | null;
  onSelect?: (id: PositionId) => void;
  compact?: boolean;
}

// Schéma du terrain de softball avec les 9 positions cliquables.
export default function Diamant({ selection, onSelect, compact }: DiamantProps) {
  return (
    <div className={compact ? "w-full max-w-xs mx-auto" : "w-full max-w-lg mx-auto"}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-auto drop-shadow-lg"
        role="img"
        aria-label="Terrain de softball avec les positions"
      >
        {/* Gazon extérieur */}
        <circle cx="50" cy="55" r="52" fill="#15803d" />
        {/* Arc du champ extérieur */}
        <path d="M 8 55 A 42 42 0 0 1 92 55 Z" fill="#16a34a" />
        {/* Terre de l'avant-champ (cercle) */}
        <circle cx="50" cy="62" r="30" fill="#b45309" />
        {/* Gazon intérieur du losange */}
        <polygon points="50,40 72,62 50,84 28,62" fill="#16a34a" />

        {/* Lignes de jeu */}
        <line x1="50" y1="84" x2="14" y2="48" stroke="#fef3c7" strokeWidth="0.8" />
        <line x1="50" y1="84" x2="86" y2="48" stroke="#fef3c7" strokeWidth="0.8" />

        {/* Buts (losanges blancs) */}
        {/* 2e but */}
        <rect x="48" y="38" width="4" height="4" fill="white" transform="rotate(45 50 40)" />
        {/* 1er but */}
        <rect x="70" y="60" width="4" height="4" fill="white" transform="rotate(45 72 62)" />
        {/* 3e but */}
        <rect x="26" y="60" width="4" height="4" fill="white" transform="rotate(45 28 62)" />
        {/* Marbre */}
        <polygon points="50,83 48,85 48,87 52,87 52,85" fill="white" />
        {/* Monticule */}
        <circle cx="50" cy="62" r="3.2" fill="#d97706" />

        {/* Positions */}
        {POSITIONS.map((p) => {
          const actif = selection === p.id;
          return (
            <g
              key={p.id}
              onClick={() => onSelect?.(p.id)}
              className={onSelect ? "cursor-pointer" : ""}
              role={onSelect ? "button" : undefined}
              aria-label={p.nom}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={actif ? 6 : 5}
                fill={actif ? p.couleur : "#1e293b"}
                stroke={actif ? "white" : p.couleur}
                strokeWidth={actif ? 1.2 : 1}
                className="transition-all"
              />
              <text
                x={p.x}
                y={p.y + 1.6}
                textAnchor="middle"
                fontSize="3.4"
                fontWeight="bold"
                fill="white"
                className="pointer-events-none select-none"
              >
                {p.numero}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
