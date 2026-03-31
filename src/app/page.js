"use client";

/**
 * ASCENSION 963 — Page principale
 *
 * Machine à états simple : step 1 → 2 → 3 → 4 → victory
 * Chaque niveau requiert une manipulation via les DevTools du navigateur.
 *
 * Niveau 1 : Retirer la classe "hidden" d'un bouton dans l'inspecteur HTML
 * Niveau 2 : Modifier l'attribut max="200" en max="500" sur un input range
 * Niveau 3 : Bruteforcer l'API /api/resonance depuis la console JS
 * Niveau 4 : Appeler window.ascendToDivine() depuis la console JS
 */

import { useState, useEffect } from "react";
import { Waves, Zap, Lock, Terminal, CheckCircle } from "lucide-react";

export default function Home() {
  // ── État du jeu ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);         // Niveau actuel (1 à 4)
  const [victory, setVictory] = useState(false); // Victoire finale

  // Niveau 2 : valeur du curseur de fréquence
  const [sliderValue, setSliderValue] = useState(0);

  // Niveau 3 : saisie du PIN et message d'erreur
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  // Niveau 4 : position du bouton fuyant (en pourcentage)
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 50 });

  // ── Effets ───────────────────────────────────────────────────────────────

  /**
   * Niveau 4 — Expose window.ascendToDivine() sur le scope global.
   * Le joueur doit appeler cette fonction depuis la console DevTools.
   * Elle déclenche l'écran de victoire.
   */
  useEffect(() => {
    if (step === 4) {
      window.ascendToDivine = () => {
        setVictory(true);
      };
    }
    // Nettoyage si on quitte le niveau 4
    return () => {
      delete window.ascendToDivine;
    };
  }, [step]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Niveau 4 — Fait fuir le bouton en lui assignant une position aléatoire.
   * Déclenché par onMouseEnter : le bouton est impossible à cliquer.
   */
  const fleeButton = () => {
    setButtonPos({
      x: Math.random() * 65 + 10, // entre 10% et 75%
      y: Math.random() * 60 + 10, // entre 10% et 70%
    });
  };

  /**
   * Niveau 3 — Soumet le PIN à l'API /api/resonance.
   * En cas de succès (HTTP 200), passe au niveau 4.
   */
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setPinError("");
    setPinLoading(true);
    try {
      const res = await fetch("/api/resonance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(4);
      } else {
        setPinError("Fréquence rejetée. Continuez le bruteforce.");
      }
    } catch {
      setPinError("Erreur réseau.");
    } finally {
      setPinLoading(false);
    }
  };


  /**
   * Génère les cercles concentriques animés en arrière-plan.
   * Plus on monte dans les niveaux, plus les ondes sont nombreuses et intenses.
   */
  const getRippleConfig = () => {
    if (victory) {
      // Victoire : explosion d'ondes colorées
      return [
        { size: 120, color: "border-cyan-400", anim: "animate-victory-ring", delay: "0s", opacity: "opacity-90" },
        { size: 200, color: "border-purple-400", anim: "animate-victory-ring", delay: "0.4s", opacity: "opacity-80" },
        { size: 300, color: "border-pink-400", anim: "animate-victory-ring", delay: "0.8s", opacity: "opacity-70" },
        { size: 400, color: "border-cyan-300", anim: "animate-victory-ring", delay: "1.2s", opacity: "opacity-60" },
        { size: 500, color: "border-purple-300", anim: "animate-victory-ring", delay: "1.6s", opacity: "opacity-50" },
        { size: 600, color: "border-pink-300", anim: "animate-victory-ring", delay: "2s", opacity: "opacity-40" },
        { size: 700, color: "border-cyan-200", anim: "animate-victory-ring", delay: "2.4s", opacity: "opacity-30" },
        { size: 800, color: "border-purple-200", anim: "animate-victory-ring", delay: "2.8s", opacity: "opacity-20" },
      ];
    }
    // Niveaux 1-4 : intensité croissante
    const configs = [
      // Niveau 1 : 2 ondes fines et douces
      [
        { size: 200, color: "border-cyan-300", anim: "animate-ripple-slow", delay: "0s", opacity: "opacity-30" },
        { size: 350, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-20" },
      ],
      // Niveau 2 : 3 ondes cyan plus visibles
      [
        { size: 180, color: "border-cyan-400", anim: "animate-ripple-med", delay: "0s", opacity: "opacity-40" },
        { size: 320, color: "border-cyan-300", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-30" },
        { size: 460, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-20" },
      ],
      // Niveau 3 : 5 ondes cyan + rose, tension
      [
        { size: 160, color: "border-cyan-500", anim: "animate-ripple-fast", delay: "0s", opacity: "opacity-50" },
        { size: 280, color: "border-pink-400", anim: "animate-ripple-med", delay: "0.5s", opacity: "opacity-40" },
        { size: 400, color: "border-cyan-400", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-30" },
        { size: 520, color: "border-pink-300", anim: "animate-ripple-slow", delay: "1.5s", opacity: "opacity-20" },
        { size: 640, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-15" },
      ],
      // Niveau 4 : 6 ondes violettes + cyan, vibration maximale
      [
        { size: 140, color: "border-purple-500", anim: "animate-ripple-fast", delay: "0s", opacity: "opacity-60" },
        { size: 260, color: "border-cyan-500", anim: "animate-ripple-fast", delay: "0.3s", opacity: "opacity-50" },
        { size: 380, color: "border-purple-400", anim: "animate-ripple-med", delay: "0.7s", opacity: "opacity-40" },
        { size: 500, color: "border-pink-400", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-30" },
        { size: 620, color: "border-purple-300", anim: "animate-ripple-slow", delay: "1.5s", opacity: "opacity-20" },
        { size: 740, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-10" },
      ],
    ];
    return configs[step - 1] || configs[0];
  };

  // ── Rendu des niveaux ────────────────────────────────────────────────────

  /**
   * NIVEAU 1 — Hack HTML
   * Le bouton "Initier" est masqué par la classe Tailwind "hidden".
   * Le joueur doit ouvrir l'inspecteur, trouver le bouton et retirer la classe.
   */
  const renderLevel1 = () => (
    <div className="text-center space-y-6">
      <Waves
        className="mx-auto text-cyan-400"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />
      <div>
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2">
          Niveau 1 — Hack HTML
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Onde dormante
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Bouton d&apos;initialisation <span className="font-mono text-pink-500">masqué</span> par le système.
          <br />
          Inspectez le DOM pour le révéler.
        </p>
      </div>

      {/*
       * CE BOUTON EST LA CLÉ DU NIVEAU 1.
       * Il possède la classe "hidden" qui le rend invisible.
       * Solution : Ouvrir les DevTools → Inspecteur → trouver ce bouton
       * → sélectionner "hidden" dans ses classes → le supprimer → cliquer.
       */}
      <button
        className="hidden px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-cyan-200 hover:scale-105 transition-all duration-200"
        onClick={() => setStep(2)}
      >
        ⚡ Initier la séquence
      </button>

      <p className="text-xs text-gray-400 italic">
        // Astuce : Clic droit → Inspecter l&apos;élément
      </p>
    </div>
  );

  /**
   * NIVEAU 2 — Hack DOM
   * Le curseur est limité à max="200" alors que la cible est 432 Hz.
   * Le joueur doit modifier l'attribut max via l'inspecteur (ex: max="500").
   */
  const renderLevel2 = () => (
    <div className="text-center space-y-6">
      <Zap
        className="mx-auto text-cyan-500"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />
      <div>
        <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2">
          Niveau 2 — Hack DOM
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Calibration fréquentielle
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Réglez le curseur sur <span className="font-mono font-bold text-cyan-600">432 Hz</span> pour synchroniser l&apos;onde.
        </p>
      </div>

      <div className="space-y-4">
        {/* Affichage de la fréquence actuelle */}
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
         * CET INPUT EST LA CLÉ DU NIVEAU 2.
         * L'attribut max="200" empêche d'atteindre 432.
         * Solution : DevTools → Inspecteur → cet input → double-cliquer sur
         * max="200" → changer en max="500" → glisser le curseur à 432.
         */}
        <input
          type="range"
          min="0"
          max="200"
          value={sliderValue}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setSliderValue(val);
            // Déverrouillage automatique une fois 432 Hz atteint
            if (val === 432) {
              setTimeout(() => setStep(3), 600);
            }
          }}
          className="w-full h-3 rounded-full cursor-pointer accent-cyan-500"
          style={{ appearance: "auto" }}
        />

        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>0 Hz</span>
          <span className="text-pink-400">432 Hz ← cible</span>
          <span>200 Hz</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 italic">
        // Astuce : Inspectez l&apos;attribut <span className="font-mono">max</span> du curseur
      </p>
    </div>
  );


  // ── Rendu principal ──────────────────────────────────────────────────────

  const ripples = getRippleConfig();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-gray-100 to-pink-50 overflow-hidden">

      {/* ── Arrière-plan : ondes concentriques ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {ripples.map((r, i) => (
          <div
            key={i}
            className={`absolute rounded-full border-2 ${r.color} ${r.anim} ${r.opacity}`}
            style={{
              width: r.size,
              height: r.size,
              animationDelay: r.delay,
            }}
          />
        ))}
      </div>

      {/* ── Conteneur glassmorphism ── */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl"
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
        }}
      >
        {/* ── Indicateur de progression (4 points) ── */}
        {!victory && (
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-2.5 w-2.5 rounded-full transition-all duration-500"
                style={{
                  background: step >= n
                    ? "linear-gradient(135deg, #06b6d4, #8b5cf6)"
                    : "rgba(209, 213, 219, 0.8)",
                  transform: step === n ? "scale(1.4)" : "scale(1)",
                  boxShadow: step === n ? "0 0 8px rgba(6,182,212,0.6)" : "none",
                }}
              />
            ))}
          </div>
        )}

        {/* ── Contenu actif ── */}
        {victory
          ? renderVictory()
          : step === 1
          ? renderLevel1()
          : step === 2
          ? renderLevel2()
          : step === 3
          ? renderLevel3()
          : renderLevel4()}
      </div>

      {/* ── Signature discrète ── */}
      <p className="absolute bottom-4 text-xs text-gray-400 font-mono opacity-50">
        ascension-963 · {victory ? "963 Hz ✓" : `${[174, 285, 528, 963][step - 1]} Hz`}
      </p>
    </div>
  );
}
