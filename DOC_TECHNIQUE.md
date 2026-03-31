# Documentation Technique — Ascension 963

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Flux de données](#2-flux-de-données)
3. [API Reference — Composants](#3-api-reference--composants)
4. [API Reference — Hook useProceduralAudio](#4-api-reference--hook-useproceduraludio)
5. [API Reference — Route /api/resonance](#5-api-reference--route-apiresonance)
6. [Mécanique des niveaux](#6-mécanique-des-niveaux)
7. [Système de design](#7-système-de-design)
8. [Animations CSS](#8-animations-css)
9. [Décisions d'architecture](#9-décisions-darchitecture)

---

## 1. Vue d'ensemble

Ascension 963 est une **Single Page Application** Next.js (App Router). Tout le jeu vit sur une seule route `/`. L'état global est géré par deux variables `useState` dans `page.js` qui orchestre le rendu conditionnel des composants de niveau.

```
Utilisateur
    │
    ▼
page.js (step: 0→5, victory: bool)
    │
    ├── WaveBackground    (visuel — ne lit pas l'état, reçoit level/victory en props)
    ├── GlassContainer    (layout — wrapper pur, pas d'état)
    ├── ProgressDots      (visuel — lit currentStep/totalSteps)
    └── Level[N] / IntroScreen / VictoryScreen
              │
              └── onComplete() → setStep(n+1) ou setVictory(true)
```

---

## 2. Flux de données

### Machine à états du jeu

```
     ┌──────────────────────────────────────────────────────┐
     │                      page.js                         │
     │                                                      │
     │  step: 0          ──onStart()──▶  step: 1            │
     │  (IntroScreen)                   (Level1HtmlHack)    │
     │                                                      │
     │  step: 1  ──onComplete()──▶  step: 2                 │
     │  step: 2  ──onComplete()──▶  step: 3                 │
     │  step: 3  ──onComplete()──▶  step: 4                 │
     │  step: 4  ──onComplete()──▶  step: 5                 │
     │  step: 5  ──onComplete()──▶  victory: true           │
     │                              (VictoryScreen)         │
     └──────────────────────────────────────────────────────┘
```

### Props drilling (intentionnellement minimal)

```
page.js
  ├── <IntroScreen onStart={startGame} />
  ├── <Level1HtmlHack onComplete={advanceLevel} />
  ├── <Level2DomHack onComplete={advanceLevel} />
  ├── <Level3ApiBrute onComplete={advanceLevel} />
  ├── <Level4ConsoleHack onComplete={advanceLevel} />
  ├── <Level5LocalStorage onComplete={advanceLevel} />
  └── <VictoryScreen />                            ← pas de props
```

Chaque composant de niveau **ne connaît pas son numéro**. Il reçoit uniquement `onComplete` et gère son propre état local si nécessaire.

---

## 3. API Reference — Composants

### `<IntroScreen>`

**Fichier :** `src/components/levels/IntroScreen.js`

| Prop | Type | Description |
|------|------|-------------|
| `onStart` | `() => void` | Appelé au clic sur "Éveiller l'Onde" |

Affiche le lore narratif d'introduction. Aucun état interne.

---

### `<Level1HtmlHack>`

**Fichier :** `src/components/levels/Level1HtmlHack.js`

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Appelé quand le bouton caché est cliqué |

**État interne :** aucun.

**Mécanique :** Rend un `<button className="hidden">`. Le joueur doit retirer la classe via l'inspecteur pour rendre le bouton cliquable.

---

### `<Level2DomHack>`

**Fichier :** `src/components/levels/Level2DomHack.js`

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Appelé 600 ms après que le slider atteint 432 |

**État interne :**

| Variable | Type | Valeur initiale | Description |
|----------|------|-----------------|-------------|
| `sliderValue` | `number` | `0` | Valeur courante du curseur |

**Mécanique :** `<input type="range" min="0" max="200">`. Le `onChange` appelle `onComplete()` via `setTimeout(600)` si `value === 432`. Le délai permet un retour visuel avant la transition.

---

### `<Level3ApiBrute>`

**Fichier :** `src/components/levels/Level3ApiBrute.js`

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Appelé si l'API répond `{ success: true }` |

**État interne :**

| Variable | Type | Valeur initiale | Description |
|----------|------|-----------------|-------------|
| `pin` | `string` | `""` | Saisie du joueur (4 chiffres max) |
| `pinError` | `string` | `""` | Message d'erreur affiché sous le formulaire |
| `pinLoading` | `boolean` | `false` | Désactive le bouton pendant la requête |

**Requête HTTP :**
```
POST /api/resonance
Content-Type: application/json

{ "pin": "XXXX" }

→ 200  { "success": true,  "message": "..." }
→ 403  { "success": false, "message": "..." }
```

**Mécanique de blur :** Une `<div className="blur-lg">` en `position: absolute` couvre le conteneur, rendant le texte illisible sans retirer le flou via l'inspecteur.

---

### `<Level4ConsoleHack>`

**Fichier :** `src/components/levels/Level4ConsoleHack.js`

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Appelé par `window.almostDivine()` |

**État interne :**

| Variable | Type | Valeur initiale | Description |
|----------|------|-----------------|-------------|
| `buttonPos` | `{ x: number, y: number }` | `{ x: 50, y: 50 }` | Position du bouton en `%` |

**Effet de montage :**
```js
useEffect(() => {
  window.almostDivine = () => onComplete();
  return () => { delete window.almostDivine; }; // nettoyage
}, [onComplete]);
```

**Fuite du bouton :** `onMouseEnter` → `setButtonPos({ x: random(10–75), y: random(10–70) })`. La transition CSS `0.1s ease` évite les sauts brusques.

---

### `<Level5LocalStorage>`

**Fichier :** `src/components/levels/Level5LocalStorage.js`

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `() => void` | Appelé dès que le polling détecte la bonne valeur |

**Constantes :**

| Constante | Valeur |
|-----------|--------|
| `ENCODED_SECRET` | `"Q2xlZiBsb2NhbFN0b3JhZ2U6..."` (Base64) |
| `LS_KEY` | `"soul_clearance"` |
| `LS_VALUE` | `"DIVINE_963_ABSOLUTE"` |

**Décodage du secret :**
```
atob(ENCODED_SECRET) → "Clef localStorage: soul_clearance = DIVINE_963_ABSOLUTE"
```

**Polling :**
```js
useEffect(() => {
  const interval = setInterval(() => {
    if (localStorage.getItem("soul_clearance") === "DIVINE_963_ABSOLUTE") {
      clearInterval(interval);
      onComplete();
    }
  }, 1000);
  return () => clearInterval(interval); // nettoyage au démontage
}, [onComplete]);
```

---

### `<VictoryScreen>`

**Fichier :** `src/components/levels/VictoryScreen.js`

Aucune prop. Composant purement présentatiel. Affiche 5 badges (HTML, DOM, API, JS, Crypto) et le texte narratif de conclusion.

---

### `<WaveBackground>`

**Fichier :** `src/components/WaveBackground.js`

| Prop | Type | Description |
|------|------|-------------|
| `level` | `number` | Niveau actuel (1–5), détermine le nombre et la couleur des ondes |
| `victory` | `boolean` | Si `true`, active les ondes de victoire multicolores |

Rend N `<div>` `position: absolute`, `border-radius: 50%`, animées. Chaque configuration est définie dans `RIPPLE_CONFIGS[level]` :

```js
// Structure d'une configuration d'onde
{ size: number, color: string, anim: string, delay: string, opacity: string }
```

---

### `<GlassContainer>`

**Fichier :** `src/components/GlassContainer.js`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Contenu à afficher |
| `className` | `string` | Classes Tailwind additionnelles (optionnel) |

Applique le style glassmorphism via `style` inline (nécessaire car `backdrop-filter` n'est pas toujours correctement purgé par Tailwind) :

```js
{
  background: "rgba(255, 255, 255, 0.35)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
}
```

---

### `<ProgressDots>`

**Fichier :** `src/components/ui/ProgressDots.js`

| Prop | Type | Description |
|------|------|-------------|
| `currentStep` | `number` | Étape active (1–5) |
| `totalSteps` | `number` | Nombre total de points à afficher |

Rendu : `totalSteps` divs circulaires. Dot actif : `scale(1.4)` + `box-shadow` cyan. Dots complétés : gradient `#06b6d4 → #8b5cf6`.

---

## 4. API Reference — Hook `useProceduralAudio`

**Fichier :** `src/hooks/useProceduralAudio.js`

### Signature

```js
const { startAudio, stopAudio, isPlaying } = useProceduralAudio(level, victory)
```

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `level` | `number` | Niveau actuel (1–5), détermine la fréquence et le rythme |
| `victory` | `boolean` | Si `true`, active la configuration "gong divin" (963 Hz) |

### Retour

| Valeur | Type | Description |
|--------|------|-------------|
| `startAudio` | `() => void` | Crée l'AudioContext et démarre la boucle de pulses |
| `stopAudio` | `() => void` | Stoppe la boucle et met `isPlaying` à `false` |
| `isPlaying` | `boolean` | État courant de la lecture audio |

### Configurations sonores

| Config | Fréquence | Durée pulse | Intervalle | Oscillateur | Gain |
|--------|-----------|-------------|------------|-------------|------|
| Niveau 1 | 174 Hz | 0.8 s | 2000 ms | `sine` | 0.15 |
| Niveau 2 | 285 Hz | 0.6 s | 1500 ms | `sine` | 0.18 |
| Niveau 3 | 528 Hz | 0.4 s | 1000 ms | `triangle` | 0.20 |
| Niveau 4 | 852 Hz | 0.25 s | 500 ms | `sawtooth` | 0.12 |
| Niveau 5 | 900 Hz | 0.15 s | 250 ms | `square` | 0.10 |
| Victoire | 963 Hz | 2.5 s | 4000 ms | `sine` | 0.25 |

### Graphe de signal (par pulse)

```
OscillatorNode  →  GainNode (enveloppe ADSR simplifiée)  →  AudioContext.destination
 type, freq          attack: +0.05s
                     release: exponentialRamp → 0.001
```

### Notes d'implémentation

- L'`AudioContext` est créé **lazily** au premier appel de `startAudio()` pour respecter la politique autoplay des navigateurs (user gesture required).
- Deux `useRef` sont utilisés : `ctxRef` (AudioContext persistant entre renders) et `intervalRef` (ID setInterval).
- Le `useEffect` principal dépend de `[level, victory, isPlaying]` : tout changement de niveau relance la boucle avec la nouvelle configuration.
- Le return du `useEffect` nettoie l'intervalle précédent avant d'en lancer un nouveau.

---

## 5. API Reference — Route `/api/resonance`

**Fichier :** `src/app/api/resonance/route.js`

**Méthode :** `POST`

### Requête

```
POST /api/resonance
Content-Type: application/json

{
  "pin": string   // PIN à 4 chiffres (ex: "8321")
}
```

### Réponses

| Status | Condition | Corps |
|--------|-----------|-------|
| `200 OK` | `pin === "8321"` | `{ "success": true, "message": "Résonance harmonique atteinte. Accès accordé." }` |
| `403 Forbidden` | PIN incorrect | `{ "success": false, "message": "Fréquence rejetée." }` |
| `400 Bad Request` | JSON invalide | `{ "success": false, "message": "Requête invalide." }` |

### Implémentation

```js
export async function POST(request) {
  try {
    const { pin } = await request.json(); // Next.js 16 : request.json() est async
    if (pin === "8321") return Response.json({ success: true, ... });
    return Response.json({ success: false, ... }, { status: 403 });
  } catch {
    return Response.json({ success: false, ... }, { status: 400 });
  }
}
```

**Aucun rate-limiting intentionnel** — la vulnérabilité au bruteforce est le sujet du niveau 3.

---

## 6. Mécanique des niveaux

### Niveau 1 — Hack HTML

```
DOM avant  : <button class="hidden px-8 ...">Initier la séquence</button>
DOM après  : <button class="px-8 ...">Initier la séquence</button>
             ↑ joueur retire "hidden" via l'inspecteur
Déclencheur: onClick → onComplete()
```

### Niveau 2 — Hack DOM

```
DOM avant  : <input type="range" min="0" max="200" value="0">
DOM après  : <input type="range" min="0" max="500" value="432">
             ↑ joueur modifie max via l'inspecteur

Déclencheur: onChange → val === 432 → setTimeout(onComplete, 600)
```

### Niveau 3 — API Bruteforce

```
Script console → 10 000 requêtes POST (0000→9999)
                         ↓
              /api/resonance répond 200 pour "8321"
                         ↓
              Joueur entre 8321 dans l'input → fetch → onComplete()
```

Complexité temporelle : O(n) avec n ≤ 10 000. En pratique ~3–8 secondes avec des requêtes parallèles non ordonnées.

### Niveau 4 — Console JS

```
Montage composant → window.almostDivine = () => onComplete()
                              ↓
Joueur tape almostDivine() dans la console
                              ↓
                        onComplete()
                              ↓
Démontage composant → delete window.almostDivine
```

### Niveau 5 — Base64 + localStorage

```
Base64 affiché → atob() dans console → clé/valeur révélée
                                              ↓
                          Joueur ajoute soul_clearance = DIVINE_963_ABSOLUTE
                          dans Application → Local Storage
                                              ↓
setInterval(1000) → localStorage.getItem("soul_clearance") === "DIVINE_963_ABSOLUTE"
                                              ↓
                                        clearInterval + onComplete()
```

---

## 7. Système de design

### Palette

| Rôle | Valeur | Usage |
|------|--------|-------|
| Primaire | `#06b6d4` (cyan-500) | Niveau 1–2, accents actifs |
| Secondaire | `#8b5cf6` (violet-500) | Niveau 4, gradients |
| Accent | `#ec4899` (pink-500) | Niveau 3, erreurs |
| Or | `#f59e0b` (amber-500) | Niveau 5 |
| Émeraude | `#10b981` | Badge Crypto (victoire) |
| Fond | `from-cyan-50 via-gray-100 to-pink-50` | Background page |

### Glassmorphism — valeurs exactes

```css
background: rgba(255, 255, 255, 0.35);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
border-radius: 1.5rem; /* rounded-3xl */
```

### Typographie

| Famille | Variable CSS | Source |
|---------|-------------|--------|
| `Geist Sans` | `--font-geist-sans` | `next/font/google` |
| `Geist Mono` | `--font-geist-mono` | `next/font/google` |

Le monospace (`font-mono`) est utilisé pour les codes, PINs, fréquences Hz et labels techniques.

---

## 8. Animations CSS

Toutes définies dans `src/app/globals.css` et exposées via `@theme inline` (Tailwind 4).

### `ripple` — ondes de fond

```css
@keyframes ripple {
  0%   { transform: scale(0.7); opacity: 0.7; }
  100% { transform: scale(2.8); opacity: 0;   }
}
```

| Classe Tailwind | Durée | Usage |
|-----------------|-------|-------|
| `animate-ripple-slow` | 5 s | Niveaux 1–2 |
| `animate-ripple-med` | 3.5 s | Niveaux 2–4 |
| `animate-ripple-fast` | 2 s | Niveaux 3–5 |

### `glow-pulse` — halo du bouton fuyant

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(147,51,234,0.4), 0 0 40px rgba(147,51,234,0.2); }
  50%       { box-shadow: 0 0 40px rgba(147,51,234,0.8), 0 0 80px rgba(147,51,234,0.4); }
}
```

Classe : `animate-glow-pulse` (2 s, ease-in-out).

### `victory-ring` — ondes de victoire

```css
@keyframes victory-ring {
  0%   { transform: scale(0.5); opacity: 0.9; border-color: rgba(6,182,212,0.8);  }
  33%  { border-color: rgba(168,85,247,0.6); }
  66%  { border-color: rgba(236,72,153,0.4); }
  100% { transform: scale(4.5); opacity: 0;  border-color: rgba(236,72,153,0); }
}
```

Classe : `animate-victory-ring` (3 s, ease-out). Utilisée sur les 8 cercles de l'écran de victoire avec des `animation-delay` de 0.4 s en escalier.

### `float` — flottement des icônes

```css
@keyframes float {
  0%, 100% { transform: translateY(0px);  }
  50%       { transform: translateY(-8px); }
}
```

Classe : `animate-float` (3 s, ease-in-out). Appliqué via `style={{ animation: "float 3s ease-in-out infinite" }}` sur les icônes Lucide.

---

## 9. Décisions d'architecture

### Pourquoi un seul fichier `page.js` comme chef d'orchestre ?

Le jeu n'a pas de routing complexe. Centraliser `step` et `victory` dans un seul composant parent évite le prop drilling profond et rend l'état du jeu immédiatement lisible. Avec seulement 2 variables d'état global, Redux ou un Context serait over-engineering.

### Pourquoi pas de Context API ?

Chaque composant de niveau ne dépend que de `onComplete`. Passer un contexte pour une seule prop serait plus complexe à tracer pendant une soutenance qu'un simple callback.


### Pourquoi pas de fichiers audio (.mp3 / .ogg) ?

Génération procédurale via Web Audio API :
- Zéro asset à charger → pas de latence réseau
- Fréquences précises en Hz (174, 285, 528, 852, 963)
- Transition fluide entre niveaux sans coupure


Seul le point `await request.json()` nous impacte (route `/api/resonance`).
