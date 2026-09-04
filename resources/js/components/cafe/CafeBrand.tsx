import type React from "react";
import { Coffee } from "lucide-react";

export const CafeBrand: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center select-none">
      <div
        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/40 bg-cream/5 text-gold shadow-glow rise-in transition-transform duration-500 hover:rotate-12 hover:scale-110"
        style={{ animationDelay: "0.05s" }}
      >
        <Coffee className="h-7 w-7 drift-slow" />
      </div>

      <h1
        className="mt-5 font-display text-6xl leading-[0.9] font-black tracking-tight text-cream rise-in sm:text-7xl lg:text-8xl"
        style={{ animationDelay: "0.15s" }}
      >
        MaMa
        <span
          className="mt-1 block font-script text-6xl font-bold text-gold rise-in sm:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.3s" }}
        >
          Café
        </span>
      </h1>

      <div
        className="mt-5 inline-flex items-center gap-3 rounded-full border border-gold/45 bg-espresso-deep/70 px-5 py-2 rise-in shine"
        style={{ animationDelay: "0.45s" }}
      >
        {["Coffee", "Boba", "Ice Chocolate"].map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
            <span className="text-[0.65rem] font-bold tracking-[0.2em] text-cream uppercase transition-colors duration-300 hover:text-gold sm:text-xs">
              {item}
            </span>
          </span>
        ))}
      </div>

      <p
        className="mt-4 font-script text-2xl font-semibold text-cream-soft/85 rise-in sm:text-3xl"
        style={{ animationDelay: "0.6s" }}
      >
        Made with Love
      </p>
    </div>
  );
};
