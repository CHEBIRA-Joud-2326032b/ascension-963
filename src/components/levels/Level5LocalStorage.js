/**
 * @fileoverview Niveau 5 — L'Ultime Verrou (Cryptographie Base64 + localStorage)
 *
 * FAILLE EXPLOITÉE : Donnée encodée en Base64 révélant une clé localStorage.
 *
 * Le joueur est bloqué à 962 Hz. Un message chiffré en Base64 apparaît à l'écran.
 * Le joueur doit :
 *   1. Copier le string Base64 affiché à l'écran
 *   2. Le décoder dans la console : atob('Q2xlZiBsb2NhbFN0b3JhZ2U6IHNvdWxfY2xlYXJhbmNlID0gRElWSU5FXzk2M19BQlNPTFVURQ==')
 *   3. Lire le résultat : "Clef localStorage: soul_clearance = DIVINE_963_ABSOLUTE"
 *   4. Ouvrir Application → Local Storage → ajouter la clé soul_clearance = DIVINE_963_ABSOLUTE
 *   5. Le code détecte automatiquement la clé (polling chaque seconde) → Victoire
 *
 * @param {{ onComplete: () => void }} props — Callback pour déclencher la victoire
 */

"use client";

import { useEffect } from "react";
import { Lock } from "lucide-react";

/** Le string Base64 que le joueur doit décoder */
const ENCODED_SECRET = "Q2xlZiBsb2NhbFN0b3JhZ2U6IHNvdWxfY2xlYXJhbmNlID0gRElWSU5FXzk2M19BQlNPTFVURQ==";

/** La clé localStorage attendue */
const LS_KEY = "soul_clearance";

/** La valeur correcte à insérer dans localStorage */
const LS_VALUE = "DIVINE_963_ABSOLUTE";

export default function Level5LocalStorage({ onComplete }) {
  /**
   * Polling localStorage toutes les secondes.
   * Vérifie si le joueur a ajouté la bonne clé/valeur dans le Local Storage.
   * Dès que la valeur est correcte, déclenche la victoire.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const value = localStorage.getItem(LS_KEY);
      if (value === LS_VALUE) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="text-center space-y-6">
      <Lock
        className="mx-auto text-yellow-500"
        style={{ width: 48, height: 48, animation: "float 3s ease-in-out infinite" }}
      />

      <div>
        <p className="text-xs font-mono text-yellow-500 uppercase tracking-widest mb-2">
          Épreuve V - 962 Hz
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          L&apos;Ultime Souffle
        </h2>
        <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
          <p>
            962 Hz. L&apos;Onde frôle la perfection - un dernier Hz
            la sépare de la Résonance Divine.
          </p>
          <p>
            Un message crypté flotte dans l&apos;éther numérique.
            Il contient la clé de la libération finale.
            Déchiffre-le.
          </p>
        </div>
      </div>

      {/*
       * ═══════════════════════════════════════════════════════
       * FAILLE CRYPTO : Ce string est du Base64.
       * Décodé avec atob(), il révèle :
       * "Clef localStorage: soul_clearance = DIVINE_963_ABSOLUTE"
       *
       * Le joueur doit ensuite aller dans Application → Local Storage
       * et créer la clé soul_clearance avec la valeur DIVINE_963_ABSOLUTE.
       * ═══════════════════════════════════════════════════════
       */}
      <div className="bg-black/80 rounded-2xl p-4 mx-2">
        <p className="font-mono text-xs text-green-400 break-all leading-relaxed select-all">
          {ENCODED_SECRET}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400">
          Ce message renferme le nom de l&apos;âme et sa valeur absolue.
        </p>
        <p className="text-xs text-gray-400 italic">
          Décode, inscris, et l&apos;Onde sera libérée
        </p>
      </div>
    </div>
  );
}
