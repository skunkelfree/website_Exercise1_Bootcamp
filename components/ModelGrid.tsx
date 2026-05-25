"use client";

import { useEffect, useRef, useState } from "react";
import { models, Gender } from "@/lib/models";
import ModelCard from "./ModelCard";

type Filter = "all" | Gender;

export default function ModelGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Listen for nav filter events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Filter;
      setFilter(detail);
    };
    window.addEventListener("filter", handler);
    return () => window.removeEventListener("filter", handler);
  }, []);

  // Scroll-triggered section reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = filter === "all" ? models : models.filter((m) => m.gender === filter);
  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Women", value: "female" },
    { label: "Men", value: "male" },
  ];

  return (
    <section
      id="models"
      ref={sectionRef}
      className="px-8 py-20 transition-all duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)" }}
    >
      {/* Section header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-2">02 / Talent</p>
          <h2 className="text-[clamp(2rem,3.5vw,4rem)] font-bold tracking-tight leading-none">
            Our Models
          </h2>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="px-4 py-2 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-200 border"
              style={{
                backgroundColor: filter === value ? "#000" : "transparent",
                color: filter === value ? "#fff" : "#000",
                borderColor: filter === value ? "#000" : "#e0e0e0",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((model, i) => (
          <div
            key={model.id}
            className="transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            <ModelCard model={model} />
          </div>
        ))}
      </div>

      {/* Count */}
      <p className="mt-10 text-xs text-[#888] tracking-[0.15em] uppercase">
        {filtered.length} model{filtered.length !== 1 ? "s" : ""}
      </p>
    </section>
  );
}
