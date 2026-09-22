import type React from "react";

interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index?: number;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon: Icon,
  title,
  description,
  index = 0,
}) => {
  return (
    <div
      className="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border border-cream/10 bg-cream/5 p-4 backdrop-blur-sm rise-in shine transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-cream/10"
      style={{ animationDelay: `${0.25 + index * 0.12}s` }}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold/40 bg-espresso-deep text-gold transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-gold group-hover:text-espresso">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h3 className="text-[0.8rem] font-extrabold tracking-[0.14em] text-cream uppercase">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-cream-soft/75">
          {description}
        </p>
      </div>
    </div>
  );
};
