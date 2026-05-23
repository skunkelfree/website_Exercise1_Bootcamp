import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Florale, leuchtende Palette — wird zufällig pro Hover gezogen. */
const FLORAL_COLORS = [
  "#ff3ea5", // hibiscus
  "#ff5e7e", // rose
  "#ff7a59", // coral
  "#ffb347", // marigold
  "#ffd166", // saffron
  "#c8ff4d", // chartreuse
  "#7cf08a", // mint
  "#3ee8c8", // jade
  "#5ad7ff", // sky
  "#7c9bff", // periwinkle
  "#b388ff", // lavender
  "#e066ff", // orchid
  "#ff66c4", // pink
  "#ff4d6d", // ruby
  "#a3ff5c", // lime bloom
];

function pickColor(prev?: string) {
  let c = FLORAL_COLORS[Math.floor(Math.random() * FLORAL_COLORS.length)];
  let guard = 0;
  while (c === prev && guard++ < 5) {
    c = FLORAL_COLORS[Math.floor(Math.random() * FLORAL_COLORS.length)];
  }
  return c;
}

type GlowProps = {
  children: ReactNode;
  /** "text" → färbt Text + Glow. "image" → entfärbt monochromes Bild, fügt Glow hinzu. */
  mode?: "text" | "image";
  className?: string;
  as?: "span" | "a" | "div" | "button" | "h1" | "h2" | "h3" | "p" | "li";
  href?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

/**
 * Wrapper, der bei jedem Hover eine NEUE florale Farbe wählt und sie
 * über 0,5 s ein- und beim Verlassen wieder ausblendet.
 */
export function Glow({
  children,
  mode = "text",
  className = "",
  as = "span",
  href,
  onClick,
  style,
}: GlowProps) {
  const [hovered, setHovered] = useState(false);
  const lastColor = useRef<string | undefined>(undefined);
  const [color, setColor] = useState<string>(FLORAL_COLORS[0]);

  const onEnter = useCallback(() => {
    const c = pickColor(lastColor.current);
    lastColor.current = c;
    setColor(c);
    setHovered(true);
  }, []);
  const onLeave = useCallback(() => setHovered(false), []);

  const Tag = as as any;

  const baseStyle: CSSProperties = {
    transition:
      "color 500ms ease, filter 500ms ease, text-shadow 500ms ease, background-color 500ms ease, border-color 500ms ease",
    ...style,
  };

  if (mode === "image") {
    Object.assign(baseStyle, {
      filter: hovered
        ? `grayscale(0) saturate(1.2) drop-shadow(0 0 18px ${color}) drop-shadow(0 0 42px ${color})`
        : "grayscale(1) brightness(0.9)",
    });
  } else {
    Object.assign(baseStyle, {
      color: hovered ? color : undefined,
      textShadow: hovered ? `0 0 16px ${color}99, 0 0 32px ${color}55` : "none",
    });
  }

  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={className}
      style={baseStyle}
    >
      {children}
    </Tag>
  );
}
