import type React from "react";
import { Bean, CupSoda, Heart, Smile } from "lucide-react";
import { BenefitCard } from "./BenefitCard";

const benefits = [
  {
    icon: Bean,
    title: "Premium Quality",
    description: "We use the best coffee beans and high-quality ingredients.",
  },
  {
    icon: CupSoda,
    title: "Freshly Made",
    description: "Every drink is freshly prepared just for you.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "We put love in every drink we make.",
  },
  {
    icon: Smile,
    title: "Great Taste",
    description: "Delicious drinks that make your day better.",
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-5 inline-flex -rotate-1 items-center self-center rounded-full bg-gold px-5 py-1.5 shadow-soft rise-in transition-transform duration-500 hover:rotate-1 hover:scale-105 lg:self-start">
        <h2 className="whitespace-nowrap font-script text-2xl font-bold text-espresso sm:text-3xl">
          Why Choose Us?
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {benefits.map((b, i) => (
          <BenefitCard key={b.title} {...b} index={i} />
        ))}
      </div>
    </div>
  );
};
