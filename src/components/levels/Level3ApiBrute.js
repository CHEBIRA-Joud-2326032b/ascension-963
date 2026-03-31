/**
 * @fileoverview Niveau 3 — Briser le mur de verre (API Bruteforce)
 *
 * FAILLE EXPLOITÉE : API REST sans rate-limiting, vulnérable au bruteforce.
 *
 * L'interface est volontairement floutée (`blur-lg`) pour simuler un "mur de verre".
 * Le joueur doit :
 *   1. Ouvrir la console DevTools (F12 → Console)
 *   2. Écrire une boucle fetch pour tester tous les PINs (0000 → 9999)
 *   3. Identifier le PIN correct (8321) via la réponse HTTP 200
 *   4. Entrer le PIN dans le champ (via la UI ou programmatiquement)
 *
 * Exemple de script bruteforce :
 * ```js
 * for (let i = 0; i <= 9999; i++) {
 *   const pin = String(i).padStart(4, '0');
 *   fetch('/api/resonance', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ pin })
 *   }).then(r => { if (r.ok) console.log('PIN :', pin); });
 * }
 * ```
 *
 * @param {{ onComplete: () => void }} props — Callback pour passer au niveau suivant
 */

"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function Level3ApiBrute({ onComplete }) {
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  /**
   * Soumet le PIN saisi à l'API /api/resonance.
   * Si le serveur répond 200 (PIN correct = "8321"), on passe au niveau suivant.
   * @param {React.FormEvent} e
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
        onComplete();
      } else {
        setPinError("Fréquence rejetée. Continuez le bruteforce.");
      }
    } catch {
      setPinError("Erreur réseau.");
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="text-center space-y-6 relative">
      {/* Couche de flou simulant le "mur de verre" */}
      <div className="blur-lg select-none pointer-events-none absolute inset-0 rounded-3xl" />

      <Lock
        className="mx-auto text-pink-500 relative z-10"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />

      <div className="relative z-10">
        <p className="text-xs font-mono text-pink-500 uppercase tracking-widest mb-2">
          Épreuve III - 528 Hz
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Le Mur de Verre
        </h2>
        <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
          <p>
            L&apos;Onde approche du seuil de transformation.
            Un verrou harmonique bloque le passage -
            un code à 4 chiffres connu seulement de la machine.
          </p>
          <p>
            La machine répond à{" "}
            <span className="font-mono bg-pink-50 text-pink-600 px-1 rounded text-xs">
              /api/resonance
            </span>.
            Il n&apos;existe pas de pitié. Il n&apos;existe que la force brute.
          </p>
          <p className="text-xs text-gray-400">
            POST &#123; &quot;pin&quot;: &quot;XXXX&quot; &#125;
          </p>
        </div>
      </div>

      {/* Formulaire PIN — fonctionnel malgré le flou environnant */}
      <form onSubmit={handlePinSubmit} className="space-y-3 relative z-10">
        <input
          type="text"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="0000"
          className="w-32 mx-auto block text-center text-2xl font-mono py-3 px-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          disabled={pinLoading || pin.length !== 4}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50 transition-all"
        >
          {pinLoading ? "Vérification..." : "Déverrouiller"}
        </button>
        {pinError && <p className="text-red-400 text-sm">{pinError}</p>}
      </form>

      <p className="text-xs text-gray-400 italic relative z-10">
        0000 à 9999 — la console est ton arme
      </p>
    </div>
  );
}
