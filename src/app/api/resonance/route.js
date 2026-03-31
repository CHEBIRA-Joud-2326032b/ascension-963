/**
 * NIVEAU 3 — API Bruteforce
 * Route : POST /api/resonance
 *
 * Le joueur doit forcer cette API depuis sa console
 * en testant tous les PINs à 4 chiffres (0000 → 9999).
 * Le PIN correct est "8321".
 *
 * Exemple de script de bruteforce à taper dans la console :
 *
 *   for (let i = 0; i <= 9999; i++) {
 *     const pin = String(i).padStart(4, '0');
 *     fetch('/api/resonance', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ pin })
 *     }).then(r => { if (r.ok) console.log('✅ PIN trouvé :', pin); });
 *   }
 */

export async function POST(request) {
  try {
    const { pin } = await request.json();

    // PIN correct : résonance harmonique atteinte
    if (pin === "8321") {
      return Response.json(
        { success: true, message: "Résonance harmonique atteinte. Accès accordé." },
        { status: 200 }
      );
    }

    // PIN incorrect : fréquence rejetée
    return Response.json(
      { success: false, message: "Fréquence rejetée." },
      { status: 403 }
    );
  } catch {
    // Corps JSON invalide
    return Response.json(
      { success: false, message: "Requête invalide." },
      { status: 400 }
    );
  }
}
