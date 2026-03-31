# Ascension 963 — Fréquence Divine

> *"Tu es une Onde Fondamentale. Impure. Prisonnière de la matière numérique.*
> *Cinq épreuves te séparent de la Résonance Divine : 963 Hz."*

Un jeu de hacking éducatif en une seule page où le joueur manipule son navigateur pour progresser à travers 5 niveaux et atteindre la fréquence divine.

---

## Démo rapide

```bash
npm install && npm run dev
# → http://localhost:3000
```

---

## Le concept

Chaque niveau cache une **vulnérabilité réelle** que le joueur doit exploiter en dehors de l'interface classique — via l'Inspecteur HTML, la Console JS ou l'onglet Application de ses DevTools.

| # | Fréquence | Titre | Technique DevTools | Faille |
|---|-----------|-------|-------------------|--------|
| 1 | 174 Hz | Le Réveil | Inspecteur → Elements | Bouton caché par `class="hidden"` |
| 2 | 285 Hz | Briser les Chaînes | Inspecteur → Attributs | `max="200"` bridant un `<input range>` |
| 3 | 528 Hz | Le Mur de Verre | Console → `fetch()` | API POST sans rate-limiting |
| 4 | 852 Hz | L'Inatteignable | Console → `window.*` | Fonction globale exposée |
| 5 | 962 Hz | L'Ultime Souffle | Console + Application → Storage | Clé Base64 à inscrire dans localStorage |
| ✓ | **963 Hz** | **Ascension** | — | Fréquence Divine atteinte |

---

## Stack technique

| Outil | Version | Rôle |
|-------|---------|------|
| [Next.js](https://nextjs.org) | 16.2.1 | Framework App Router (Turbopack par défaut) |
| [React](https://react.dev) | 19.2.4 | UI déclarative, hooks |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Styling utilitaire (`@theme inline`, sans config file) |
| [Lucide React](https://lucide.dev) | latest | Icônes SVG |
| Web Audio API | native | Sons procéduraux par niveau |

---

## Architecture

```
src/
├── app/
│   ├── page.js                    # Chef d'orchestre — état global (step, victory)
│   ├── layout.js                  # Root layout — fonts Geist, metadata
│   ├── globals.css                # Tailwind 4 + keyframes (ripple, glow-pulse, victory-ring, float)
│   └── api/
│       └── resonance/
│           └── route.js           # POST /api/resonance — vérification PIN niveau 3
│
├── hooks/
│   └── useProceduralAudio.js      # Hook Web Audio API — 6 configurations sonores
│
└── components/
    ├── WaveBackground.js          # Ondes concentriques (5 configs + victoire)
    ├── GlassContainer.js          # Wrapper glassmorphism réutilisable
    ├── ui/
    │   └── ProgressDots.js        # Indicateur 5 dots de progression
    └── levels/
        ├── IntroScreen.js         # Lore narratif + bouton "Éveiller l'Onde"
        ├── Level1HtmlHack.js      # Bouton masqué par class="hidden"
        ├── Level2DomHack.js       # Slider avec max="200"
        ├── Level3ApiBrute.js      # Formulaire PIN + fetch bruteforce
        ├── Level4ConsoleHack.js   # Bouton fuyant + window.almostDivine()
        ├── Level5LocalStorage.js  # Message Base64 + polling localStorage
        └── VictoryScreen.js       # Écran final avec 5 badges
```

**Principe :** `page.js` contient uniquement `step` (0–5) et `victory`. Chaque niveau est un composant autonome qui reçoit `onComplete()` comme seul callback.

---

## Solutions des niveaux

<details>
<summary>💡 Niveau 1 — Le Réveil (174 Hz)</summary>

```
1. F12 → Inspecteur (onglet Elements)
2. Trouver : <button class="hidden ...">Initier la séquence</button>
3. Double-cliquer sur "hidden" dans les classes → Supprimer l'attribut
4. Cliquer sur le bouton maintenant visible
```
</details>

<details>
<summary>💡 Niveau 2 — Briser les Chaînes (285 Hz)</summary>

```
1. F12 → Inspecteur
2. Trouver : <input type="range" min="0" max="200">
3. Double-cliquer sur max="200" → Changer en max="500" (ou plus)
4. Faire glisser le curseur exactement jusqu'à 432
```
</details>

<details>
<summary>💡 Niveau 3 — Le Mur de Verre (528 Hz)</summary>

```js
// F12 → Console → Coller et exécuter :
async function hackResonance() {
  for (let i = 0; i <= 9999; i++) {
    let pinTest = i.toString().padStart(4, '0');
    let response = await fetch('/api/resonance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pinTest })
    });
    if (response.ok) {
      console.log(`%c✨ SUCCÈS ! Résonance harmonique trouvée avec le PIN : ${pinTest} ✨`, 'color: #00ffcc; font-size: 16px; font-weight: bold;');

      let data = await response.json();
      console.log("Réponse du serveur :", data);

      break;
    }
  }
}

hackResonance();
// Résultat affiché dans la console → PIN : 8321
// → Entrer 8321 dans le champ et valider
```
</details>

<details>
<summary>💡 Niveau 4 — L'Inatteignable (852 Hz)</summary>

```js
// F12 → Console :
almostDivine()
// window.almostDivine est défini par le composant au montage via useEffect
```
</details>

<details>
<summary>💡 Niveau 5 — L'Ultime Souffle (962 Hz)</summary>

```js
// Étape 1 — F12 → Console, décoder le Base64 affiché :
atob('Q2xlZiBsb2NhbFN0b3JhZ2U6IHNvdWxfY2xlYXJhbmNlID0gRElWSU5FXzk2M19BQlNPTFVURQ==')
// → "Clef localStorage: soul_clearance = DIVINE_963_ABSOLUTE"

// Étape 2 — F12 → Application → Local Storage → http://localhost:3000
// Cliquer sur le "+" pour ajouter une entrée :
//   Clé   : soul_clearance
//   Valeur : DIVINE_963_ABSOLUTE
// La victoire se déclenche automatiquement (polling toutes les secondes)
```
</details>

---

## Installation & commandes

```bash
# Installer les dépendances
npm install

# Serveur de développement (Turbopack)
npm run dev

# Build de production
npm run build

# Démarrer en production
npm run start

# Linter
npx eslint .
```

Nécessite **Node.js ≥ 18**.

---

## Design — Glassmorphism & Vibration

Directives visuelles issues de `STYLE.md` :

- **Fond** : gradient `from-cyan-50 via-gray-100 to-pink-50` — ambiance aqueuse et lumineuse
- **Conteneurs** : verre dépoli — `backdrop-blur`, `bg-white/35`, `border-white/50`, `box-shadow` bleu-lavande
- **Ondes** : 2 à 8 cercles concentriques animés (`@keyframes ripple`) dont l'intensité croît à chaque niveau
- **Audio** : oscilateurs procéduraux (sine → sawtooth → square) via Web Audio API, 174 Hz → 963 Hz

---

## Notes techniques

### Tailwind CSS 4
Aucun `tailwind.config.js`. Les animations custom sont enregistrées comme tokens dans `globals.css` :
```css
@theme inline {
  --animate-ripple-slow: ripple 5s cubic-bezier(0, 0, 0.2, 1) infinite;
  --animate-glow-pulse: glow-pulse 2s ease-in-out infinite;
}
```
Utilisables ensuite comme `className="animate-ripple-slow"`.

### Web Audio API
Génération sonore sans fichier audio : `OscillatorNode` + `GainNode` avec enveloppe attack/release. L'`AudioContext` est instancié au premier clic (politique autoplay navigateur).


