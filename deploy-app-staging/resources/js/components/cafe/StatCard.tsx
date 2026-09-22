import type React from "react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  index = 0,
}) => {
  return (
    <div
      className="group rounded-2xl border border-cream/10 bg-cream/5 px-4 py-4 text-center rise-in lift-hover shine hover:border-gold/40"
      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
    >
      <Icon className="mx-auto h-5 w-5 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-125" />
      <p className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">
        {value}
      </p>
      <p className="mt-0.5 text-[0.68rem] font-semibold tracking-[0.16em] text-cream-soft/60 uppercase">
        {label}
      </p>
    </div>
  );
};
