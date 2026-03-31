/**
 * @fileoverview Composant d'arrière-plan avec ondes concentriques animées.
 *
 * Les cercles s'étendent depuis le centre de l'écran avec des animations Tailwind
 * personnalisées (ripple, victory-ring). Leur nombre, vitesse et couleur s'intensifient
 * à mesure que le joueur progresse dans les niveaux.
 *
 * @param {{ level: number, victory: boolean }} props
 */

"use client";

/**
 * Configuration des ondes par niveau.
 * Chaque entrée décrit : taille (px), couleur Tailwind, animation, délai, opacité.
 */
const RIPPLE_CONFIGS = {
  // Niveau 1 : 2 ondes fines et douces — ambiance calme
  1: [
    { size: 200, color: "border-cyan-300", anim: "animate-ripple-slow", delay: "0s", opacity: "opacity-30" },
    { size: 350, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-20" },
  ],
  // Niveau 2 : 3 ondes cyan — montée en puissance
  2: [
    { size: 180, color: "border-cyan-400", anim: "animate-ripple-med", delay: "0s", opacity: "opacity-40" },
    { size: 320, color: "border-cyan-300", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-30" },
    { size: 460, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-20" },
  ],
  // Niveau 3 : 5 ondes cyan + rose — tension
  3: [
    { size: 160, color: "border-cyan-500", anim: "animate-ripple-fast", delay: "0s", opacity: "opacity-50" },
    { size: 280, color: "border-pink-400", anim: "animate-ripple-med", delay: "0.5s", opacity: "opacity-40" },
    { size: 400, color: "border-cyan-400", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-30" },
    { size: 520, color: "border-pink-300", anim: "animate-ripple-slow", delay: "1.5s", opacity: "opacity-20" },
    { size: 640, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-15" },
  ],
  // Niveau 4 : 6 ondes violettes + cyan — vibration maximale
  4: [
    { size: 140, color: "border-purple-500", anim: "animate-ripple-fast", delay: "0s", opacity: "opacity-60" },
    { size: 260, color: "border-cyan-500", anim: "animate-ripple-fast", delay: "0.3s", opacity: "opacity-50" },
    { size: 380, color: "border-purple-400", anim: "animate-ripple-med", delay: "0.7s", opacity: "opacity-40" },
    { size: 500, color: "border-pink-400", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-30" },
    { size: 620, color: "border-purple-300", anim: "animate-ripple-slow", delay: "1.5s", opacity: "opacity-20" },
    { size: 740, color: "border-cyan-200", anim: "animate-ripple-slow", delay: "2s", opacity: "opacity-10" },
  ],
  // Niveau 5 : 7 ondes rapides cyan/violet/or — clignotement cryptique
  5: [
    { size: 120, color: "border-yellow-400", anim: "animate-ripple-fast", delay: "0s", opacity: "opacity-60" },
    { size: 220, color: "border-purple-500", anim: "animate-ripple-fast", delay: "0.2s", opacity: "opacity-55" },
    { size: 340, color: "border-cyan-400", anim: "animate-ripple-fast", delay: "0.4s", opacity: "opacity-45" },
    { size: 440, color: "border-yellow-300", anim: "animate-ripple-med", delay: "0.7s", opacity: "opacity-35" },
    { size: 540, color: "border-purple-400", anim: "animate-ripple-med", delay: "1s", opacity: "opacity-25" },
    { size: 640, color: "border-cyan-300", anim: "animate-ripple-slow", delay: "1.4s", opacity: "opacity-20" },
    { size: 740, color: "border-yellow-200", anim: "animate-ripple-slow", delay: "1.8s", opacity: "opacity-10" },
  ],
};

/** Ondes de victoire : explosion colorée multi-spectre */
const VICTORY_RIPPLES = [
  { size: 120, color: "border-cyan-400", anim: "animate-victory-ring", delay: "0s", opacity: "opacity-90" },
  { size: 200, color: "border-purple-400", anim: "animate-victory-ring", delay: "0.4s", opacity: "opacity-80" },
  { size: 300, color: "border-pink-400", anim: "animate-victory-ring", delay: "0.8s", opacity: "opacity-70" },
  { size: 400, color: "border-cyan-300", anim: "animate-victory-ring", delay: "1.2s", opacity: "opacity-60" },
  { size: 500, color: "border-purple-300", anim: "animate-victory-ring", delay: "1.6s", opacity: "opacity-50" },
  { size: 600, color: "border-pink-300", anim: "animate-victory-ring", delay: "2s", opacity: "opacity-40" },
  { size: 700, color: "border-cyan-200", anim: "animate-victory-ring", delay: "2.4s", opacity: "opacity-30" },
  { size: 800, color: "border-purple-200", anim: "animate-victory-ring", delay: "2.8s", opacity: "opacity-20" },
];

export default function WaveBackground({ level, victory }) {
  const ripples = victory ? VICTORY_RIPPLES : (RIPPLE_CONFIGS[level] || RIPPLE_CONFIGS[1]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {ripples.map((r, i) => (
        <div
          key={`${victory ? "v" : "l"}-${i}`}
          className={`absolute rounded-full border-2 ${r.color} ${r.anim} ${r.opacity}`}
          style={{
            width: r.size,
            height: r.size,
            animationDelay: r.delay,
          }}
        />
      ))}
    </div>
  );
}
