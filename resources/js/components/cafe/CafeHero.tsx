import type React from "react";
import { Coffee, Leaf, Star, Users } from "lucide-react";
import { CafeBrand } from "./CafeBrand";
import { DualDrinks, HeroDrink } from "./DrinkShowcase";
import { StatCard } from "./StatCard";
import { WhyChooseUs } from "./WhyChooseUs";

const stats = [
  { icon: Coffee, value: "12k+", label: "Cups served" },
  { icon: Users, value: "3.5k", label: "Happy guests" },
  { icon: Star, value: "4.9", label: "Guest rating" },
  { icon: Leaf, value: "100%", label: "Fresh daily" },
];

export const CafeHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden surface-dark grain-overlay">
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl pulse-glow" />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-96 w-96 rounded-full bg-cocoa/25 blur-3xl pulse-glow"
        style={{ animationDelay: "1.8s" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        {/* Three parts: showcase · brand · why choose us */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="order-2 lg:order-1 lg:col-span-3">
            <div
              className="h-full rounded-3xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm rise-in lift-hover"
              style={{ animationDelay: "0.1s" }}
            >
              <HeroDrink />
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="flex h-full flex-col items-center justify-between rounded-3xl border border-gold/25 bg-espresso-deep/50 px-6 py-10 shadow-glow rise-in sm:px-10">
              <CafeBrand />
              <DualDrinks />
            </div>
          </div>

          <div className="order-3 lg:col-span-3">
            <div
              className="h-full rounded-3xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm rise-in lift-hover"
              style={{ animationDelay: "0.2s" }}
            >
              <WhyChooseUs />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
