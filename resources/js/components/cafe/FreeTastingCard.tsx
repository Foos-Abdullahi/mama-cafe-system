import type React from "react";
import { Heart } from "lucide-react";

export const FreeTastingCard: React.FC = () => {
  return (
    <div className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-gold/45 bg-espresso/60 p-7 text-center shadow-glow rise-in shine transition-transform duration-500 hover:-translate-y-1.5 hover:scale-[1.02]">
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/20 transition-all duration-500 group-hover:inset-2 group-hover:border-gold/45" />
      <p className="relative text-[0.65rem] font-bold tracking-[0.28em] text-gold uppercase">
        The Tasting
      </p>
      <h2 className="relative mt-1 font-display text-4xl font-black tracking-wide text-cream transition-transform duration-500 group-hover:scale-105 sm:text-5xl">
        IS FREE
      </h2>
      <div className="relative mx-auto mt-3 h-px w-24 gold-rule opacity-70 transition-all duration-500 group-hover:w-36 group-hover:opacity-100" />
      <p className="relative mt-3 text-sm font-medium text-cream-soft/80">
        For all drinks
      </p>
      <Heart className="relative mx-auto mt-3 h-4 w-4 fill-gold text-gold heart-beat" />
    </div>
  );
};
