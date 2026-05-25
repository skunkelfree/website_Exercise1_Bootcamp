"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid #e0e0e0" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        color: scrolled ? "#000" : "#fff",
      }}
    >
      <span className="text-xs font-semibold tracking-[0.25em] uppercase">
        Mountain Space
      </span>
    </nav>
  );
}
