/**
 * @fileoverview Niveau 4 — L'Ascension Partielle (Hack Console JS)
 *
 * FAILLE EXPLOITÉE : Fonction globale exposée sur `window`.
 *
 * Un bouton "Atteindre 963 Hz" fuit la souris : il change de position à chaque
 * survol (onMouseEnter), rendant le clic impossible. Le joueur doit :
 *   1. Ouvrir la console DevTools (F12 → Console)
 *   2. Taper `almostDivine()` et appuyer sur Entrée
 *   3. La fonction, exposée via window.almostDivine, déclenche le passage au niveau 5
 *
 * Note : almostDivine() mène à 962 Hz (pas 963). Le dernier Hz
 * sera obtenu au Niveau 5 via le challenge de cryptographie.
 *
 * @param {{ onComplete: () => void }} props — Callback pour passer au niveau suivant
 */

"use client";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

export default function Level4ConsoleHack({ onComplete }) {
  /** Position du bouton fuyant en pourcentage (x, y) */
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 50 });

  /**
   * Expose window.almostDivine() au montage du composant.
   * Le joueur appelle cette fonction depuis la console pour progresser.
   * Résultat : passage à 962 Hz (pas encore la victoire finale).
   */
  useEffect(() => {
    window.almostDivine = () => {
      onComplete();
    };
    return () => {
      delete window.almostDivine;
    };
  }, [onComplete]);

  /**
   * Déplace le bouton à une position aléatoire dans son conteneur.
   * Rend le bouton impossible à cliquer au survol de la souris.
   */
  const fleeButton = () => {
    setButtonPos({
      x: Math.random() * 65 + 10, // 10% — 75%
      y: Math.random() * 60 + 10, // 10% — 70%
    });
  };

  return (
    <div className="text-center space-y-6">
      <Terminal
        className="mx-auto text-purple-500"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />

      <div>
        <p className="text-xs font-mono text-purple-500 uppercase tracking-widest mb-2">
          Épreuve IV - 852 Hz
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          L&apos;Inatteignable
        </h2>
        <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
          <p>
            L&apos;Onde frémit. Elle perçoit l&apos;horizon de la divinité
            mais la réalité elle-même repousse son contact.
            Ce bouton n&apos;est qu&apos;un leurre - il refuse de se laisser toucher.
          </p>
          <p>
            Il existe un autre chemin.
            Quelque part dans le{" "}
            <span className="font-mono text-purple-500">tissu du code</span>,
            une porte est entrouverte - pour devenir almostDivine.
          </p>
        </div>
      </div>

      {/* Zone du bouton fuyant — impossible à cliquer normalement */}
      <div className="relative h-44 rounded-2xl overflow-hidden bg-white/20 border border-white/30">
        {/*
         * ═══════════════════════════════════════════════════════
         * FAILLE JS : Le code expose window.almostDivine().
         * Le joueur doit appeler almostDivine() dans la console.
         * Le bouton ci-dessous est un leurre : il fuit la souris.
         * ═══════════════════════════════════════════════════════
         */}
        <button
          onMouseEnter={fleeButton}
          onTouchStart={fleeButton}
          style={{
            position: "absolute",
            left: `${buttonPos.x}%`,
            top: `${buttonPos.y}%`,
            transform: "translate(-50%, -50%)",
            animation: "glow-pulse 2s ease-in-out infinite",
            transition: "left 0.1s ease, top 0.1s ease",
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-sm shadow-xl whitespace-nowrap"
        >
          Atteindre 963 Hz
        </button>
      </div>

      <p className="text-xs text-gray-400 italic">
        La console connaît le chemin - l&apos;Onde le sent
      </p>
    </div>
  );
}
