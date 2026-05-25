"use client";

import Image from "next/image";
import { Model } from "@/lib/models";

const VIOLET_FILTER =
  "grayscale(1) sepia(1) hue-rotate(240deg) saturate(3) brightness(0.75)";

export default function ModelCard({ model }: { model: Model }) {
  return (
    <div className="group relative overflow-hidden bg-[#e8e0f0] cursor-pointer">
      {/* Aspect ratio: 3:4 portrait */}
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        <Image
          src={model.image}
          alt={model.name}
          fill
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ filter: VIOLET_FILTER }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-400 ease-out" />

        {/* Hover info — slides up */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <p className="text-[10px] text-white/60 tracking-[0.25em] uppercase mb-1">
            {model.category}
          </p>
          <p className="text-white font-semibold text-lg tracking-tight">
            {model.name}
          </p>
        </div>
      </div>

      {/* Default name below */}
      <div className="px-1 pt-3 pb-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">
          {model.category}
        </p>
        <p className="text-sm font-medium tracking-wide">{model.name}</p>
      </div>
    </div>
  );
}
