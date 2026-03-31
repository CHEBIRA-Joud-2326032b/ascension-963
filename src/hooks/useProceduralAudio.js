/**
 * @fileoverview Hook custom pour la génération audio procédurale via Web Audio API.
 *
 * Chaque niveau du jeu produit une fréquence sonore différente :
 * - Niveau 1 : 174 Hz — pulse doux, intervalle 2s
 * - Niveau 2 : 285 Hz — pulse moyen, intervalle 1.5s
 * - Niveau 3 : 528 Hz — pulse tendu, intervalle 1s
 * - Niveau 4 : 852 Hz — pulse rapide, intervalle 0.5s
 * - Niveau 5 : 900 Hz — clignotement strident, intervalle 0.25s
 * - Victoire  : 963 Hz — gong profond, sustain long, intervalle 4s
 *
 * L'AudioContext est créé au premier appel de startAudio() (user gesture policy).
 */

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Configuration audio par niveau : fréquence (Hz), durée du pulse (s), intervalle entre pulses (ms).
 * @type {Record<string, { freq: number, duration: number, interval: number, type: OscillatorType, gain: number }>}
 */
const AUDIO_CONFIG = {
  1: { freq: 174, duration: 0.8, interval: 2000, type: "sine", gain: 0.15 },
  2: { freq: 285, duration: 0.6, interval: 1500, type: "sine", gain: 0.18 },
  3: { freq: 528, duration: 0.4, interval: 1000, type: "triangle", gain: 0.2 },
  4: { freq: 852, duration: 0.25, interval: 500, type: "sawtooth", gain: 0.12 },
  5: { freq: 900, duration: 0.15, interval: 250, type: "square", gain: 0.1 },
  victory: { freq: 963, duration: 2.5, interval: 4000, type: "sine", gain: 0.25 },
};

/**
 * Hook de génération audio procédurale.
 * Produit des pulses sonores dont la fréquence et le rythme évoluent avec le niveau.
 *
 * @param {number} level — Niveau actuel du jeu (1 à 5)
 * @param {boolean} victory — Si true, joue le gong de victoire à 963 Hz
 * @returns {{ startAudio: () => void, stopAudio: () => void, isPlaying: boolean }}
 */
export function useProceduralAudio(level, victory) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef(null);       // AudioContext persistant
  const intervalRef = useRef(null);   // ID du setInterval pour les pulses

  /**
   * Joue un pulse sonore unique via OscillatorNode + GainNode.
   * L'enveloppe ADSR simplifiée (attack/release) évite les clics audio.
   * @param {AudioContext} ctx — Contexte audio actif
   * @param {{ freq: number, duration: number, type: OscillatorType, gain: number }} config
   */
  const playPulse = useCallback((ctx, config) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = config.type;
    osc.frequency.setValueAtTime(config.freq, ctx.currentTime);

    // Enveloppe : attack rapide → sustain → release doux
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + config.duration);
  }, []);

  /**
   * Démarre la boucle audio. Crée l'AudioContext si nécessaire.
   * Doit être appelé depuis un événement utilisateur (click) pour respecter
   * la politique autoplay des navigateurs.
   */
  const startAudio = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    setIsPlaying(true);
  }, []);

  /** Arrête la boucle audio et nettoie l'intervalle. */
  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Effet principal : lance/relance la boucle de pulses quand le niveau ou
   * l'état playing change. Le premier pulse est joué immédiatement.
   */
  useEffect(() => {
    if (!isPlaying || !ctxRef.current) return;

    const config = victory ? AUDIO_CONFIG.victory : AUDIO_CONFIG[level];
    if (!config) return;

    // Nettoyage de l'intervalle précédent (changement de niveau)
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Pulse immédiat + boucle
    playPulse(ctxRef.current, config);
    intervalRef.current = setInterval(() => {
      if (ctxRef.current) playPulse(ctxRef.current, config);
    }, config.interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [level, victory, isPlaying, playPulse]);

  /** Nettoyage global à la destruction du composant. */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);

  return { startAudio, stopAudio, isPlaying };
}
