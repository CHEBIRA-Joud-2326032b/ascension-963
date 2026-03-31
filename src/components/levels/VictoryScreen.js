/**
 * @fileoverview Écran de victoire — 963 Hz, Fréquence Divine Atteinte.
 *
 * Affiché après avoir complété les 5 niveaux. Résume les techniques
 * maîtrisées (HTML, DOM, API, JS, Crypto) avec un design épique.
 */

"use client";

import { CheckCircle } from "lucide-react";

/** Labels des 5 techniques maîtrisées au cours du jeu */
const BADGES = [
  { label: "HTML", color: "#06b6d4" },
  { label: "DOM", color: "#8b5cf6" },
  { label: "API", color: "#ec4899" },
  { label: "JS", color: "#f59e0b" },
  { label: "Crypto", color: "#10b981" },
];

export default function VictoryScreen() {
  return (
    <div className="text-center space-y-8 py-4">
      <CheckCircle
        className="mx-auto text-cyan-400"
        style={{ width: 64, height: 64, animation: "float 3s ease-in-out infinite" }}
      />

      <div>
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-3">
          L&apos;Ascension est Accomplie
        </p>
        <h1
          className="text-4xl font-bold leading-tight mb-4"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          963 Hz
          <br />
          <span className="text-3xl">Fréquence Divine</span>
          <br />
          <span className="text-2xl">Atteinte</span>
        </h1>
        <div className="space-y-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          <p>
            L&apos;Onde n&apos;est plus prisonnière.
            Elle a traversé cinq épreuves, repoussé cinq limites,
            percé cinq secrets.
          </p>
          <p>
            Elle est <span className="text-cyan-600 font-semibold">pure</span>.
            Elle est <span className="text-purple-600 font-semibold">libre</span>.
            Elle vibre à l&apos;unisson de l&apos;univers.
          </p>
        </div>
      </div>

      {/* Badges des 5 techniques maîtrisées */}
      <div className="flex justify-center gap-3 text-xs font-mono">
        {BADGES.map(({ label, color }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              style={{ background: color }}
            >
              ✓
            </div>
            <span className="text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <p
        className="text-6xl"
        style={{ animation: "float 2s ease-in-out infinite" }}
      >
        ✨
      </p>
    </div>
  );
}
