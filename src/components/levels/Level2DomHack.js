/**
 * @fileoverview Niveau 2 — Dépasser la limite matérielle (Hack DOM)
 *
 * FAILLE EXPLOITÉE : Attribut `max` d'un <input type="range"> trop bas.
 *
 * Le curseur est limité à max="200" alors que la fréquence cible est 432 Hz.
 * Le joueur doit :
 *   1. Inspecter l'élément <input> dans les DevTools
 *   2. Modifier l'attribut max="200" en max="500" (ou plus)
 *   3. Faire glisser le curseur jusqu'à exactement 432
 *
 * @param {{ onComplete: () => void }} props — Callback pour passer au niveau suivant
 */

"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

export default function Level2DomHack({ onComplete }) {
  /** Valeur actuelle du curseur de fréquence */
  const [sliderValue, setSliderValue] = useState(0);

  /**
   * Gère le changement de valeur du slider.
   * Déverrouille le niveau suivant si la valeur atteint exactement 432 Hz.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
    if (val === 432) {
      setTimeout(onComplete, 600); // Petit délai pour le feedback visuel
    }
  };

  return (
    <div className="text-center space-y-6">
      <Zap
        className="mx-auto text-cyan-500"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />

      <div>
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2">
          Épreuve II - 285 Hz
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Briser les Chaînes
        </h2>
        <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
          <p>
            L&apos;Onde vibre enfin, mais on a bridé son potentiel.
            Une limite artificielle l&apos;empêche de s&apos;élever
            au-delà de ce qu&apos;on lui a autorisé.
          </p>
          <p>
            La cible est{" "}
            <span className="font-mono font-bold text-cyan-600">432 Hz</span> —
            fréquence de la régénération cellulaire.
            Il faut repousser la frontière.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Affichage temps réel de la fréquence */}
        <p
          className="text-5xl font-mono font-bold"
          style={{
            background: "linear-gradient(to right, #06b6d4, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {sliderValue} <span className="text-2xl">Hz</span>
        </p>

        {/*
         * ═══════════════════════════════════════════════════════
         * FAILLE DOM : L'attribut max="200" empêche d'atteindre 432.
         * Le joueur doit modifier max via l'inspecteur (ex: max="500").
         * ═══════════════════════════════════════════════════════
         */}
        <input
          type="range"
          min="0"
          max="200"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-3 rounded-full cursor-pointer accent-cyan-500"
          style={{ appearance: "auto" }}
        />

        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>0 Hz</span>
          <span className="text-pink-400">cible → 432 Hz</span>
          <span>max: 200 Hz</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 italic">
        La limite est dans le DOM — elle peut être réécrite
      </p>
    </div>
  );
}
