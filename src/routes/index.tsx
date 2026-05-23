import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MurmurationCanvas } from "@/components/MurmurationCanvas";
import { Glow } from "@/components/Glow";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sven — Designer" },
      {
        name: "description",
        content:
          "Sven — Designer. Ich gestalte digitale Produkte: analytisch, empathisch, werteschaffend.",
      },
      { property: "og:title", content: "Sven — Designer" },
      {
        property: "og:description",
        content: "Persönliche Website von Sven, Designer im Vibe-Coding-Bootcamp.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
});

type Lang = "de" | "en";

const COPY = {
  de: {
    nav: ["Arbeit", "Werte", "Chat"],
    cta: "Kontakt",
    eyebrow: "[ Designer · Vibe-Coding Bootcamp ]",
    heroLine1: "DEIN DIGITALER",
    heroLine2: "ZWILLING.",
    sub: "Sven gestaltet digitale Produkte — analytisch, empathisch, werteschaffend.",
    cards: [
      {
        tag: "Methode",
        title: "ANALYSE\nZUERST",
        body: "Probleme sezieren, bevor das erste Pixel gesetzt wird.",
      },
      {
        tag: "Haltung",
        title: "EMPATHIE\nIM CODE",
        body: "Hinter jedem Klick steht ein Mensch — kein User-Flow.",
      },
      {
        tag: "Ergebnis",
        title: "WERTE\nSCHAFFEN",
        body: "Design, das sich für Nutzer und Geschäft auszahlt.",
      },
    ],
    footer: "© Sven · Bootcamp 2025",
  },
  en: {
    nav: ["Work", "Values", "Chat"],
    cta: "Contact",
    eyebrow: "[ Designer · Vibe-Coding Bootcamp ]",
    heroLine1: "YOUR DIGITAL",
    heroLine2: "TWIN.",
    sub: "Sven designs digital products — analytical, empathetic, value-creating.",
    cards: [
      {
        tag: "Method",
        title: "ANALYSIS\nFIRST",
        body: "Dissect problems before the first pixel is placed.",
      },
      {
        tag: "Stance",
        title: "EMPATHY\nIN CODE",
        body: "Behind every click is a person — not a user flow.",
      },
      {
        tag: "Outcome",
        title: "CREATE\nVALUE",
        body: "Design that pays off for users and business alike.",
      },
    ],
    footer: "© Sven · Bootcamp 2025",
  },
} as const;

function Index() {
  const [lang, setLang] = useState<Lang>("de");
  const t = COPY[lang];

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <MurmurationCanvas />

      {/* dotted backdrop — like the screenshot */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10">
        {/* TOP NAV */}
        <nav className="px-6 lg:px-10 pt-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6 rounded-2xl bg-black/40 backdrop-blur ring-1 ring-white/10 px-5 py-3">
            <Glow as="span" className="font-mono text-sm tracking-wider font-semibold">
              ⚡ SVEN
            </Glow>

            <ul className="hidden md:flex items-center gap-8">
              {t.nav.map((n) => (
                <li key={n}>
                  <Glow
                    as="a"
                    href="#"
                    className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-300 cursor-pointer"
                  >
                    {n}
                  </Glow>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                <button
                  onClick={() => setLang("de")}
                  className={`px-2 py-1 rounded ${lang === "de" ? "text-white" : "hover:text-zinc-300"}`}
                >
                  DE
                </button>
                <span>/</span>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 rounded ${lang === "en" ? "text-white" : "hover:text-zinc-300"}`}
                >
                  EN
                </button>
              </div>
              <Glow
                as="a"
                href="mailto:hallo@sven.design"
                className="inline-flex items-center px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ transition: "all 500ms ease" }}
              >
                {t.cta}
              </Glow>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="px-6 lg:px-10 pt-10">
          <div className="max-w-[1400px] mx-auto rounded-3xl bg-black ring-1 ring-white/10 overflow-hidden">
            <div className="relative px-8 md:px-16 py-24 md:py-36 text-center">
              <Glow
                as="span"
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 block mb-8"
              >
                {t.eyebrow}
              </Glow>

              <h1 className="font-sans font-extrabold leading-[0.88] tracking-tight text-white text-[14vw] md:text-[8.5rem]">
                <Glow as="span" className="block">
                  {t.heroLine1}
                </Glow>
                <Glow as="span" className="block">
                  {t.heroLine2}
                </Glow>
              </h1>

              <Glow
                as="p"
                className="mt-10 max-w-2xl mx-auto text-zinc-400 text-base md:text-lg"
              >
                {t.sub}
              </Glow>
            </div>
          </div>
        </section>

        {/* FEATURE CARDS */}
        <section className="px-6 lg:px-10 mt-6 pb-20">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-6">
            {t.cards.map((c, i) => (
              <article
                key={c.tag}
                className="group relative rounded-3xl bg-gradient-to-b from-zinc-900 to-black ring-1 ring-white/10 overflow-hidden p-8 min-h-[460px] flex flex-col justify-between"
              >
                {/* monochrome illustration */}
                <div className="flex items-start justify-between">
                  <Glow
                    as="span"
                    className="inline-block px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
                  >
                    {c.tag}
                  </Glow>
                </div>

                <div className="flex-1 flex items-center justify-center py-6">
                  <Glow mode="image" as="div" className="w-40 h-40">
                    <CardArt index={i} />
                  </Glow>
                </div>

                <div className="space-y-3">
                  <Glow
                    as="h3"
                    className="font-sans font-extrabold text-3xl leading-[0.95] tracking-tight whitespace-pre-line"
                  >
                    {c.title}
                  </Glow>
                  <Glow as="p" className="text-zinc-400 text-sm leading-relaxed">
                    {c.body}
                  </Glow>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 lg:px-10 pb-10">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            <Glow as="span">{t.footer}</Glow>
            <Glow as="a" href="#" className="cursor-pointer">
              ↑ TOP
            </Glow>
          </div>
        </footer>
      </div>
    </div>
  );
}

/** Monochrome SVG-Illustrationen — werden bei Hover floral eingefärbt. */
function CardArt({ index }: { index: number }) {
  const stroke = "rgba(255,255,255,0.85)";
  const fill = "rgba(255,255,255,0.08)";

  if (index === 0) {
    // Schlüssel / Analyse — geometrisches Lupen-Symbol
    return (
      <svg viewBox="0 0 160 160" className="w-full h-full">
        <circle cx="68" cy="68" r="42" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="68" cy="68" r="22" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="100" y1="100" x2="140" y2="140" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="68" r="4" fill={stroke} />
      </svg>
    );
  }
  if (index === 1) {
    // Globus — Empathie / Verbindung
    return (
      <svg viewBox="0 0 160 160" className="w-full h-full">
        <circle cx="80" cy="80" r="56" fill={fill} stroke={stroke} strokeWidth="2" />
        <ellipse cx="80" cy="80" rx="56" ry="22" fill="none" stroke={stroke} strokeWidth="1" />
        <ellipse cx="80" cy="80" rx="22" ry="56" fill="none" stroke={stroke} strokeWidth="1" />
        <line x1="24" y1="80" x2="136" y2="80" stroke={stroke} strokeWidth="1" />
        <circle cx="80" cy="80" r="3" fill={stroke} />
      </svg>
    );
  }
  // Blüte — Werte / Floral
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="80"
          cy="50"
          rx="16"
          ry="30"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
          transform={`rotate(${deg} 80 80)`}
        />
      ))}
      <circle cx="80" cy="80" r="10" fill={stroke} />
    </svg>
  );
}
