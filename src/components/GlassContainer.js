/**
 * @fileoverview Conteneur Glassmorphism réutilisable.
 *
 * Applique l'effet verre dépoli (backdrop-blur, fond semi-transparent,
 * bordure translucide et ombre douce) décrit dans STYLE.md.
 *
 * @param {{ children: React.ReactNode, className?: string }} props
 */

"use client";

export default function GlassContainer({ children, className = "" }) {
  return (
    <div
      className={`relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
      }}
    >
      {children}
    </div>
  );
}
