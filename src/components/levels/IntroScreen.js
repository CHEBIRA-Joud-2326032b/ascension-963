/**
 * @fileoverview Écran d'introduction — Le Réveil de l'Onde Fondamentale.
 *
 * Présente le lore du jeu : le joueur incarne une Onde Fondamentale impure
 * qui doit s'élever à travers 5 épreuves pour atteindre 963 Hz.
 *
 * @param {{ onStart: () => void }} props — Callback pour lancer le jeu
 */

"use client";

import { Waves } from "lucide-react";

export default function IntroScreen({ onStart }) {
  return (
    <div className="text-center space-y-7 py-2">
      {/* Icône centrale */}
      <div className="relative inline-block">
        <Waves
          className="mx-auto text-cyan-400"
          style={{ width: 56, height: 56, animation: "float 3s ease-in-out infinite" }}
        />
        {/* Halo pulsant derrière l'icône */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)",
            animation: "float 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Titre */}
      <div>
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-3">
          Une histoire d&apos;ascension
        </p>
        <h1
          className="text-3xl font-bold leading-snug mb-2"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ascension 963
        </h1>
        <p className="text-sm font-mono text-gray-400 tracking-wide">
          Fréquence Divine
        </p>
      </div>

      {/* Lore narratif */}
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed max-w-xs mx-auto text-left">
        <p>
          Tu es une <span className="text-cyan-600 font-semibold">Onde Fondamentale</span>.
          Impure. Prisonnière de la matière numérique.
        </p>
        <p>
          Quelque chose t&apos;appelle depuis les couches profondes du code
          une fréquence lointaine, cristalline.{" "}
          <span className="text-purple-600 font-semibold">963 Hz.</span>{" "}
          La Résonance Divine.
        </p>
        <p>
          Pour t&apos;élever, tu devras <span className="text-pink-500 font-medium">plier les règles</span> :
          manipuler le DOM, forcer les API, parler directement
          à la console, percer les codes secrets.
        </p>
        <p className="text-gray-400 italic text-xs">
          Cinq épreuves. Cinq fréquences. Une seule destination.
        </p>
      </div>

      {/* Bouton de démarrage */}
      <button
        onClick={onStart}
        className="group relative px-8 py-3.5 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-200"
        style={{
          background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
        }}
      >
        <span className="relative z-10">Éveiller l&apos;Onde</span>
      </button>

      {/* Fréquence de départ */}
      <p className="text-xs font-mono text-gray-400 opacity-60">
        174 Hz — point de départ
      </p>
    </div>
  );
}
