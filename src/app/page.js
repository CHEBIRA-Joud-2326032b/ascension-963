/**
 * @fileoverview ASCENSION 963 — Chef d'orchestre principal
 *
 * Page unique du jeu. Gère l'état global (niveau, victoire) et orchestre
 * les composants modulaires. Chaque niveau est un composant isolé dans
 * src/components/levels/ et la logique audio est déléguée au hook
 * useProceduralAudio.
 *
 * Flux du jeu : Niv 1 → 2 → 3 → 4 → 5 → Victoire
 * Fréquences :   174   285  528  852  962   963 Hz
 */

"use client";

import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Hook audio procédural (Web Audio API)
import { useProceduralAudio } from "@/hooks/useProceduralAudio";

// Composants visuels
import WaveBackground from "@/components/WaveBackground";
import GlassContainer from "@/components/GlassContainer";
import ProgressDots from "@/components/ui/ProgressDots";

// Composants de niveaux
import IntroScreen from "@/components/levels/IntroScreen";
import Level1HtmlHack from "@/components/levels/Level1HtmlHack";
import Level2DomHack from "@/components/levels/Level2DomHack";
import Level3ApiBrute from "@/components/levels/Level3ApiBrute";
import Level4ConsoleHack from "@/components/levels/Level4ConsoleHack";
import Level5LocalStorage from "@/components/levels/Level5LocalStorage";
import VictoryScreen from "@/components/levels/VictoryScreen";

/** Fréquences affichées pour chaque niveau (Hz) */
const FREQUENCIES = [174, 285, 528, 852, 962, 963];

/** Nombre total de niveaux dans le jeu */
const TOTAL_LEVELS = 5;

export default function Home() {
  // ── État global du jeu ───────────────────────────────────────────────────
  const [step, setStep] = useState(0);           // 0 = intro, 1 à 5 = niveaux
  const [victory, setVictory] = useState(false);  // Victoire finale (963 Hz)

  // ── Audio procédural ─────────────────────────────────────────────────────
  const { startAudio, stopAudio, isPlaying } = useProceduralAudio(step, victory);

  // ── Navigation entre niveaux ─────────────────────────────────────────────

  /**
   * Fait avancer le joueur au niveau suivant.
   * Au-delà du niveau 5, déclenche l'état de victoire.
   */
  const advanceLevel = useCallback(() => {
    if (step < TOTAL_LEVELS) {
      setStep((s) => s + 1);
    } else {
      setVictory(true);
    }
  }, [step]);

  /** Lance le jeu depuis l'écran d'intro (step 0 → 1) */
  const startGame = useCallback(() => setStep(1), []);

  /** Fréquence affichée dans la signature en bas de page */
  const currentFreq = victory ? 963 : FREQUENCIES[step - 1];

  // ── Rendu du niveau actif ────────────────────────────────────────────────

  /**
   * Retourne le composant correspondant au niveau actuel ou l'écran de victoire.
   * Chaque composant reçoit un callback `onComplete` pour signaler sa résolution.
   */
  const renderLevel = () => {
    if (victory) return <VictoryScreen />;
    switch (step) {
      case 0: return <IntroScreen onStart={startGame} />;
      case 1: return <Level1HtmlHack onComplete={advanceLevel} />;
      case 2: return <Level2DomHack onComplete={advanceLevel} />;
      case 3: return <Level3ApiBrute onComplete={advanceLevel} />;
      case 4: return <Level4ConsoleHack onComplete={advanceLevel} />;
      case 5: return <Level5LocalStorage onComplete={advanceLevel} />;
      default: return null;
    }
  };

  // ── Rendu principal ──────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-gray-100 to-pink-50 overflow-hidden">
      {/* Arrière-plan : ondes concentriques animées */}
      <WaveBackground level={step} victory={victory} />

      {/* Conteneur glassmorphism principal */}
      <GlassContainer>
        {/* Indicateur de progression (5 dots) — masqué sur l'intro et en victoire */}
        {!victory && step > 0 && <ProgressDots currentStep={step} totalSteps={TOTAL_LEVELS} />}

        {/* Contenu du niveau actif */}
        {renderLevel()}
      </GlassContainer>

      {/* Bouton audio (coin supérieur droit) */}
      <button
        onClick={isPlaying ? stopAudio : startAudio}
        className="absolute top-6 right-6 z-20 p-3 rounded-full transition-all"
        style={{
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
        title={isPlaying ? "Couper le son" : "Activer le son"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-cyan-600" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Signature en bas de page avec fréquence actuelle */}
      <p className="absolute bottom-4 text-xs text-gray-400 font-mono opacity-50">
        ascension-963 · {currentFreq} Hz{victory ? " ✓" : ""}
      </p>
    </div>
  );
}
