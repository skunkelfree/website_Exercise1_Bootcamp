import { useCallback, useEffect, useRef, useState } from "react";

export type SoundMode = "monks" | "birds";

const DEFAULT_VOL = 0.18;

// ─── Bird chirp engine ───────────────────────────────────────────────────────
function startBirds(ctx: AudioContext, dest: GainNode): () => void {
  let alive = true;
  function chirp() {
    if (!alive) return;
    const t = ctx.currentTime;
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const dt = Math.random() * 0.35;
      const f0 = 1900 + Math.random() * 4600;
      const dur = 0.04 + Math.random() * 0.22;
      const osc = ctx.createOscillator();
      osc.type = Math.random() > 0.55 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f0, t + dt);
      osc.frequency.exponentialRampToValueAtTime(f0 * (0.76 + Math.random() * 0.56), t + dt + dur);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t + dt);
      env.gain.linearRampToValueAtTime(0.055, t + dt + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dt + dur);
      osc.connect(env); env.connect(dest);
      osc.start(t + dt); osc.stop(t + dt + dur + 0.1);
    }
    setTimeout(chirp, (0.45 + Math.random() * 2.0) * 1000);
  }
  chirp();
  return () => { alive = false; };
}

// ─── Wind burst (fires every 6 s) ───────────────────────────────────────────
function startWind(ctx: AudioContext, dest: GainNode): () => void {
  let timerId: ReturnType<typeof setTimeout>;
  function blow() {
    const t = ctx.currentTime;
    const size = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, size, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lpf = ctx.createBiquadFilter(); lpf.type = "lowpass";  lpf.frequency.value = 700;
    const hpf = ctx.createBiquadFilter(); hpf.type = "highpass"; hpf.frequency.value = 160;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.07, t + 1.4);
    env.gain.setTargetAtTime(0, t + 1.6, 0.7);
    src.connect(lpf); lpf.connect(hpf); hpf.connect(env); env.connect(dest);
    src.start(t); src.stop(t + 5);
    timerId = setTimeout(blow, 6000);
  }
  timerId = setTimeout(blow, 6000); // first gust after 6 s
  return () => clearTimeout(timerId);
}

// ─── Monk chant engine ───────────────────────────────────────────────────────
function startMonks(ctx: AudioContext, dest: GainNode): () => void {
  const mix = ctx.createGain();
  mix.gain.value = 0.85;
  mix.connect(dest);

  // Primary breath swell (slow)
  const breathLFO = ctx.createOscillator();
  breathLFO.frequency.value = 0.09;
  const breathAmt = ctx.createGain(); breathAmt.gain.value = 0.14;
  breathLFO.connect(breathAmt); breathAmt.connect(mix.gain);
  breathLFO.start();

  // Secondary interference LFO (slightly faster, aperiodic beating effect)
  const interLFO = ctx.createOscillator();
  interLFO.frequency.value = 0.23;
  const interAmt = ctx.createGain(); interAmt.gain.value = 0.07;
  interLFO.connect(interAmt); interAmt.connect(mix.gain);
  interLFO.start();

  const allOscs: AudioScheduledSourceNode[] = [breathLFO, interLFO];

  const base   = 98;
  const spread = [-13, -5, 0, 4, 9, 15];
  const partials: Array<[number, number]> = [
    [1,   0.064], [2,  0.026], [3,  0.011], [4.5, 0.004],
  ];

  spread.forEach(dc => {
    const f = base * Math.pow(2, dc / 1200);
    partials.forEach(([mult, amp]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f * mult;
      const vib = ctx.createOscillator();
      vib.frequency.value = 0.06 + Math.random() * 0.09;
      const vibAmt = ctx.createGain(); vibAmt.gain.value = 0.25 + Math.random() * 0.2;
      vib.connect(vibAmt); vibAmt.connect(osc.frequency);
      const g = ctx.createGain(); g.gain.value = amp;
      osc.connect(g); g.connect(mix);
      osc.start(); vib.start();
      allOscs.push(osc, vib);
    });
  });

  const stopWind = startWind(ctx, mix); // wind mixed into monk bus

  return () => {
    allOscs.forEach(n => { try { n.stop(); } catch { /* gone */ } });
    stopWind();
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useSoundscape() {
  const [mode, setMode]     = useState<SoundMode>("monks");
  const [volume, setVolPct] = useState(70); // 0–100 for UI

  const ctxRef       = useRef<AudioContext | null>(null);
  const masterRef    = useRef<GainNode | null>(null);
  const monksVolRef  = useRef<GainNode | null>(null);
  const birdsVolRef  = useRef<GainNode | null>(null);
  const targetVolRef = useRef(DEFAULT_VOL);
  const readyRef     = useRef(false);

  const buildGraph = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    const monksVol = ctx.createGain(); monksVol.gain.value = 1; // monks active by default
    monksVol.connect(master); monksVolRef.current = monksVol;

    const birdsVol = ctx.createGain(); birdsVol.gain.value = 0;
    birdsVol.connect(master); birdsVolRef.current = birdsVol;

    startMonks(ctx, monksVol);
    startBirds(ctx, birdsVol);

    // Fade in slowly
    master.gain.setTargetAtTime(targetVolRef.current, ctx.currentTime, 2.5);
  }, []);

  useEffect(() => {
    // Build the audio graph immediately — no user gesture required for the graph itself
    buildGraph();

    const resume = () => ctxRef.current?.resume();

    // Attempt 1: try right away (works in Firefox and when browser allows autoplay)
    resume();

    // Attempt 2: retry every 300 ms for the first 20 s so it starts the moment
    // the browser's autoplay gate lifts (e.g. first passive scroll or focus event)
    const retryId = setInterval(() => {
      if (ctxRef.current?.state === "running") {
        clearInterval(retryId);
      } else {
        resume();
      }
    }, 300);
    setTimeout(() => clearInterval(retryId), 20_000);

    // Attempt 3: catch every possible user-gesture event so sound starts on the
    // very first interaction regardless of type
    const EVENTS = [
      "click", "mousedown", "pointerdown", "pointermove",
      "touchstart", "touchmove", "keydown", "scroll", "wheel",
    ] as const;
    const onInteract = () => resume();
    EVENTS.forEach(e => window.addEventListener(e, onInteract, { passive: true, once: false }));

    return () => {
      clearInterval(retryId);
      EVENTS.forEach(e => window.removeEventListener(e, onInteract));
      ctxRef.current?.close();
    };
  }, [buildGraph]);

  const toggle = useCallback(() => {
    const ctx = ctxRef.current;
    const bv  = birdsVolRef.current;
    const mv  = monksVolRef.current;
    if (!ctx || !bv || !mv) return;
    const t = ctx.currentTime; const TC = 0.55;
    setMode(prev => {
      bv.gain.cancelScheduledValues(t); mv.gain.cancelScheduledValues(t);
      if (prev === "monks") {
        mv.gain.setTargetAtTime(0, t, TC); bv.gain.setTargetAtTime(1, t, TC);
        return "birds";
      } else {
        bv.gain.setTargetAtTime(0, t, TC); mv.gain.setTargetAtTime(1, t, TC);
        return "monks";
      }
    });
  }, []);

  const duck = useCallback(() => {
    const ctx = ctxRef.current; const master = masterRef.current;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(0, t, 0.16);
    setTimeout(() => {
      if (!ctxRef.current || !masterRef.current) return;
      const t2 = ctxRef.current.currentTime;
      masterRef.current.gain.cancelScheduledValues(t2);
      masterRef.current.gain.setTargetAtTime(targetVolRef.current, t2, 0.38);
    }, 620);
  }, []);

  const setVolume = useCallback((pct: number) => {
    setVolPct(pct);
    targetVolRef.current = (pct / 100) * 0.28;
    const ctx = ctxRef.current; const master = masterRef.current;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(targetVolRef.current, ctx.currentTime, 0.06);
  }, []);

  return { mode, toggle, duck, volume, setVolume };
}
