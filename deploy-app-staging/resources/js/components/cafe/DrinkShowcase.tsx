import type React from "react";
import icedCoffeeBoba from "@/images/mama-iced-coffee-boba.png";
import bobaMilkTea from "@/images/mama-boba-milk-tea.png";
import cacaoBliss from "@/images/cacao-bliss.png";


export const HeroDrink: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between select-none">
      <div
        className="w-full -rotate-2 text-center rise-in lg:text-left"
        style={{ animationDelay: "0.15s" }}
      >
        <p className="font-script text-4xl leading-none font-bold text-cream sm:text-5xl">
          Fresh Drinks
        </p>
        <p className="mt-1 flex items-center justify-center gap-2 font-script text-4xl leading-none font-bold text-cream sm:text-5xl lg:justify-start">
          Good Mood <span className="text-gold heart-beat inline-block">♥</span>
        </p>
      </div>

      <div
        className="relative mt-6 w-full max-w-[240px] drift-slow"
      >
        <div className="absolute inset-x-6 bottom-2 h-32 rounded-full bg-gold/20 blur-3xl pulse-glow" />
        <img
          src={icedCoffeeBoba}
          alt="MaMa iced coffee boba with chocolate splash"
          width={900}
          height={1200}
          className="relative w-full rounded-3xl border border-gold/25 object-cover shadow-glow tilt-hover"
        />
      </div>

      <p
        className="mt-6 text-center text-[0.68rem] font-semibold tracking-[0.2em] text-cream-soft/60 uppercase rise-in"
        style={{ animationDelay: "0.45s" }}
      >
        Signature Iced Coffee Boba
      </p>
    </div>
  );
};

export const DualDrinks: React.FC = () => {
  return (
    <div className="relative mt-8 grid w-full max-w-md grid-cols-2 gap-4 select-none">
      <div className="absolute inset-x-10 bottom-4 h-28 rounded-full bg-gold/15 blur-3xl pulse-glow" />
      <img
        src={bobaMilkTea}
        alt="MaMa Café boba milk tea"
        width={900}
        height={1200}
        loading="lazy"
        className="relative aspect-[3/4] w-full rounded-3xl border border-cream/15 object-cover shadow-lift drift-slow tilt-hover"
      />
      <img
        src={cacaoBliss}
        alt="Cacao Bliss dark chocolate ice with whipped cream"
        width={900}
        height={1200}
        loading="lazy"
        className="relative mt-8 aspect-[3/4] w-full rounded-3xl border border-cream/15 object-cover shadow-lift drift-slower tilt-hover"
        style={{ animationDelay: "1.2s" }}
      />
    </div>
  );
};
