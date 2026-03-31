/**
 * @fileoverview Indicateur de progression sous forme de points.
 *
 * Affiche N points horizontaux. Les niveaux complétés sont remplis
 * avec un gradient cyan→violet. Le niveau actif pulse doucement.
 *
 * @param {{ currentStep: number, totalSteps: number }} props
 */

"use client";

export default function ProgressDots({ currentStep, totalSteps }) {
  return (
    <div className="flex justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className="h-2.5 w-2.5 rounded-full transition-all duration-500"
          style={{
            background:
              currentStep >= n
                ? "linear-gradient(135deg, #06b6d4, #8b5cf6)"
                : "rgba(209, 213, 219, 0.8)",
            transform: currentStep === n ? "scale(1.4)" : "scale(1)",
            boxShadow:
              currentStep === n
                ? "0 0 8px rgba(6,182,212,0.6)"
                : "none",
          }}
        />
      ))}
    </div>
  );
}
