import { useEffect, useRef } from "react";

function buildWind(ctx: AudioContext): GainNode {
  // Volume control node — this is what we fade in/out
  const volume = ctx.createGain();
  volume.gain.value = 0; // silent at start, fades in
  volume.connect(ctx.destination);

  // Pre-master with LFO for natural gust variation
  const preMaster = ctx.createGain();
  preMaster.gain.value = 0.9;
  preMaster.connect(volume);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.1; // very slow — one cycle every ~10 s
  const lfoAmp = ctx.createGain();
  lfoAmp.gain.value = 0.08;
  lfo.connect(lfoAmp);
  lfoAmp.connect(preMaster.gain);
  lfo.start();

  // Helper: one band-pass noise layer
  function noiseLayer(freq: number, q: number, gain: number) {
    const seconds = 5;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = freq;
    bpf.Q.value = q;

    const g = ctx.createGain();
    g.gain.value = gain;

    src.connect(bpf);
    bpf.connect(g);
    g.connect(preMaster);
    src.start(0, Math.random() * seconds); // stagger loop start
  }

  noiseLayer(280,  1.0, 0.55); // low whoosh
  noiseLayer(650,  0.7, 0.35); // mid body
  noiseLayer(2200, 1.8, 0.12); // high hiss

  // Slow fade-in so it doesn't startle
  volume.gain.setTargetAtTime(0.14, ctx.currentTime, 2.0);

  return volume;
}

export function useWindSound() {
  const ctxRef    = useRef<AudioContext | null>(null);
  const volumeRef = useRef<GainNode | null>(null);
  const readyRef  = useRef(false);

  useEffect(() => {
    const init = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      volumeRef.current = buildWind(ctx);
    };

    // AudioContext needs a user gesture — start on first pointer event
    window.addEventListener("pointermove", init, { once: true });
    window.addEventListener("pointerdown", init, { once: true });

    return () => {
      window.removeEventListener("pointermove", init);
      window.removeEventListener("pointerdown", init);
      ctxRef.current?.close();
    };
  }, []);

  const fadeOut = () => {
    const v = volumeRef.current;
    const c = ctxRef.current;
    if (!v || !c) return;
    v.gain.cancelScheduledValues(c.currentTime);
    v.gain.setTargetAtTime(0, c.currentTime, 0.18);
  };

  const fadeIn = () => {
    const v = volumeRef.current;
    const c = ctxRef.current;
    if (!v || !c) return;
    v.gain.cancelScheduledValues(c.currentTime);
    v.gain.setTargetAtTime(0.14, c.currentTime, 0.35);
  };

  return { fadeOut, fadeIn };
}
