/**
 * @fileoverview Niveau 1 — Le Réveil de l'Onde (Hack HTML)
 *
 * FAILLE EXPLOITÉE : Élément HTML masqué via la classe Tailwind `hidden`.
 *
 * Le bouton "Initier la séquence" est présent dans le DOM mais invisible.
 * Le joueur doit :
 *   1. Ouvrir les DevTools (F12 ou Clic droit → Inspecter)
 *   2. Trouver le <button> dans l'arbre DOM
 *   3. Retirer la classe "hidden" de l'élément
 *   4. Cliquer sur le bouton rendu visible
 *
 * @param {{ onComplete: () => void }} props — Callback pour passer au niveau suivant
 */

"use client";

import { Waves } from "lucide-react";

export default function Level1HtmlHack({ onComplete }) {
  return (
    <div className="text-center space-y-6">
      {/* Icône flottante de niveau */}
      <Waves
        className="mx-auto text-cyan-400"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />

      <div>
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2">
          Épreuve I — 174 Hz
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Le Réveil
        </h2>
        <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
          <p>
            L&apos;Onde sommeille. Elle perçoit la lumière mais ne peut l&apos;atteindre —
            quelque chose la retient dans l&apos;obscurité du code.
          </p>
          <p>
            Son bouton d&apos;éveil existe.{" "}
            <span className="text-pink-500 font-medium">Il est là</span>, caché
            dans la structure même de la réalité numérique.
          </p>
        </div>
      </div>

      {/*
       * ═══════════════════════════════════════════════════════
       * FAILLE HTML : Ce bouton est caché par la classe "hidden".
       * Le joueur doit l'inspecter et retirer "hidden" pour le voir.
       * ═══════════════════════════════════════════════════════
       */}
      <button
        className="hidden px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-cyan-200 hover:scale-105 transition-all duration-200"
        onClick={onComplete}
      >
        Initier la séquence
      </button>

      <p className="text-xs text-gray-400 italic">
        Inspecte le DOM — la vérité se cache dans les éléments
      </p>
    </div>
  );
}
