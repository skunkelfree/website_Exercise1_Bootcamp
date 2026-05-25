"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSoundscape } from "@/lib/useSoundscape";
import basePath from "@/lib/basePath";

// ─── Types ───────────────────────────────────────────────────────────────────
type SlotContent =
  | { type: "video" }
  | { type: "image"; src: string; alt: string; kb: string };

const INITIAL_THUMBS: SlotContent[] = [
  { type: "image", src: "/thumb-1.jpeg", alt: "Mountain Space 1", kb: "kb1" },
  { type: "image", src: "/thumb-2.jpeg", alt: "Mountain Space 2", kb: "kb2" },
  { type: "image", src: "/thumb-3.jpeg", alt: "Mountain Space 3", kb: "kb3" },
  { type: "image", src: "/thumb-4.jpeg", alt: "Mountain Space 4", kb: "kb4" },
];

type Phase = "default" | "fading" | "new";
const FADE = "opacity 0.5s ease";

// ─── Auto-fit font size ───────────────────────────────────────────────────────
function useFitFontSize(ready: boolean) {
  const [size, setSize] = useState("10vw");
  useEffect(() => {
    if (!ready) return;
    const compute = () => {
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;white-space:nowrap;" +
        "font-size:100px;font-weight:700;font-family:inherit;visibility:hidden;";
      probe.textContent = "Mountain";
      document.body.appendChild(probe);
      const w = probe.offsetWidth;
      document.body.removeChild(probe);
      if (w === 0) return;
      setSize(`${Math.floor((window.innerWidth / w) * 100 * 0.99)}px`);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [ready]);
  return size;
}

// ─── Slow random drift within ±100 px ────────────────────────────────────────
function useDrift() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const move = () => {
      setPos({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
      });
      id = setTimeout(move, 40000 + Math.random() * 40000);
    };
    id = setTimeout(move, 1500);
    return () => clearTimeout(id);
  }, []);
  return pos;
}

// ─── Media renderers ─────────────────────────────────────────────────────────
function HeroMedia({ content }: { content: SlotContent }) {
  if (content.type === "video")
    return (
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={`${basePath}/hero.mov`} type="video/mp4" />
      </video>
    );
  return <Image src={content.src} alt={content.alt} fill className="object-cover" sizes="100vw" />;
}

function ThumbMedia({ content }: { content: SlotContent }) {
  if (content.type === "video")
    return (
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-500">
        <source src={`${basePath}/hero.mov`} type="video/mp4" />
      </video>
    );
  return (
    <Image src={content.src} alt={content.alt} fill
      className={`object-cover grayscale hover:grayscale-0 transition-[filter] duration-500 ${content.kb}`}
      sizes="25vw" />
  );
}

// ─── Sound controls ───────────────────────────────────────────────────────────
function SoundControls({
  mode, toggle, volume, setVolume,
}: {
  mode: "monks" | "birds";
  toggle: () => void;
  volume: number;
  setVolume: (v: number) => void;
}) {
  return (
    // .sound-color drives the cycling colour; all children inherit via currentColor
    <div className="sound-color fixed top-5 right-7 z-50 flex items-center gap-4">
      {/* Volume icon + slider */}
      <div className="flex items-center gap-2">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.8 }}>
          <path d="M1 5.5h3l4-3.5v12l-4-3.5H1V5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M12 4a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          type="range" min={0} max={100} value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="sound-slider"
          aria-label="Volume"
        />
      </div>

      {/* Divider */}
      <span className="w-px h-4" style={{ background: "currentColor", opacity: 0.25 }} />

      {/* Toggle: monks ↔ birds — pill & dot use stable white so they never blink */}
      <button
        onClick={toggle}
        className="flex items-center gap-2"
        aria-label={`Switch to ${mode === "monks" ? "birds" : "monks"}`}
      >
        <span className="text-[9px] tracking-[0.18em] uppercase w-9 text-right" style={{ opacity: 0.7 }}>
          {mode === "monks" ? "Monks" : "Birds"}
        </span>
        {/* pill track — fixed white outline, not currentColor */}
        <div
          className="relative w-9 h-5 rounded-full flex-shrink-0"
          style={{ border: "1px solid rgba(255,255,255,0.5)" }}
        >
          <span
            className="absolute top-0.5 w-3.5 h-3.5 rounded-full"
            style={{
              left: mode === "monks" ? "2px" : "calc(100% - 16px)",
              border: "1.5px solid rgba(255,255,255,0.8)",
              transition: "left 0.45s ease-in-out",
            }}
          />
        </div>
        <span className="text-[9px] tracking-[0.18em] uppercase w-9 text-left" style={{ opacity: 0.5 }}>
          {mode === "monks" ? "Birds" : "Monks"}
        </span>
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Hero() {
  const [mounted, setMounted]           = useState(false);
  const [phase, setPhase]               = useState<Phase>("default");
  const [hero, setHero]                 = useState<SlotContent>({ type: "video" });
  const [thumbs, setThumbs]             = useState<SlotContent[]>(INITIAL_THUMBS);
  const [heroFading, setHeroFading]     = useState(false);
  const [fadingIdx, setFadingIdx]       = useState<number | null>(null);
  const phaseTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mode, toggle, duck, volume, setVolume } = useSoundscape();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const mainSize = useFitFontSize(mounted);
  const subSize  = mounted ? `${Math.round(parseInt(mainSize) / 10)}px` : "2vw";
  const drift    = useDrift();

  // Headline hover (for phase change only — not sound)
  const handleEnter = () => {
    if (phase === "new") return;
    setPhase("fading");
    phaseTimer.current = setTimeout(() => setPhase("new"), 2000);
  };
  const handleLeave = () => {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    setPhase("default");
  };

  // Thumbnail swap
  const handleThumbClick = (i: number) => {
    if (fadingIdx !== null) return;
    duck();
    setHeroFading(true);
    setFadingIdx(i);
    setTimeout(() => {
      const incoming = thumbs[i];
      setThumbs(prev => { const n = [...prev]; n[i] = hero; return n; });
      setHero(incoming);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setHeroFading(false);
        setFadingIdx(null);
      }));
    }, 550);
  };

  const mainOpacity =
    phase === "default" ? (mounted ? 1 : 0) :
    phase === "fading"  ? 0 : 0;

  return (
    <>
      <SoundControls mode={mode} toggle={toggle} volume={volume} setVolume={setVolume} />

      {/* ── Hero section ── */}
      <section className="relative h-svh w-full overflow-hidden">
        {/* Media layer */}
        <div className="absolute inset-0" style={{ opacity: heroFading ? 0 : 1, transition: FADE }}>
          <HeroMedia content={hero} />
        </div>

        {/* Gradient */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.45) 100%)" }} />

        {/* ── Main headline — drifts, clickable only on text ── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center select-none"
          style={{
            opacity: mainOpacity,
            transition: phase === "fading" ? "opacity 2s ease" : phase === "default" ? "opacity 0.8s ease" : "none",
            pointerEvents: "none",
          }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <h1
            className="font-bold leading-[0.88] tracking-tight text-center"
            style={{
              fontSize: mainSize,
              color: "rgba(255,255,255,0.7)",
              transform: `translate(${drift.x}px, ${drift.y}px)`,
              transition: "transform 70s cubic-bezier(0.37, 0, 0.63, 1)",
              cursor: "pointer",
              pointerEvents: "auto",  // only the text is clickable
            }}
            onClick={toggle}
          >
            Mountain<br />Space
          </h1>
        </div>

        {/* Sub headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
          style={{ opacity: phase === "new" ? 1 : 0, transition: "opacity 1.6s ease" }}>
          <h2 className="font-bold leading-[1.15] tracking-tight text-center"
            style={{ fontSize: subSize, color: "rgba(255,255,255,0.7)" }}>
            Your space is the top<br />of every mountain
          </h2>
        </div>

        {/* Sound mode label */}
        <div className="absolute bottom-8 left-8 flex items-center gap-2 pointer-events-none select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">
            {mode === "birds" ? "Birds" : "Monks"}
          </span>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-10 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <span className="inline-block animate-bounce text-white/30">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </section>

      {/* ── Thumbnail strip ── */}
      <div className="flex w-full">
        {thumbs.map((content, i) => (
          <div key={i}
            className="relative flex-1 overflow-hidden cursor-pointer"
            style={{ aspectRatio: "1 / 1", opacity: fadingIdx === i ? 0 : 1, transition: FADE }}
            onClick={() => handleThumbClick(i)}>
            <ThumbMedia content={content} />
          </div>
        ))}
      </div>
    </>
  );
}
