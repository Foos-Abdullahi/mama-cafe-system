import type React from "react";
import { MapPin, Phone } from "lucide-react";
import MamaCup from "@/images/mama-cup-cutout.png";

export const ContactInfo: React.FC = () => {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
      <div className="min-w-0">
        <h3 className="text-xs font-extrabold tracking-[0.22em] text-cream uppercase">
          Contact us
        </h3>

        <div className="mt-4 space-y-2.5">
          <a
            href="tel:+252613399977"
            className="group flex items-center gap-3 rounded-2xl border border-cream/10 bg-cream/5 px-3.5 py-2.5 shine transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/45"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-espresso">
              <Phone className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-semibold text-cream">
              +252 61 3399977
            </span>
          </a>

          <div className="group flex items-center gap-3 rounded-2xl border border-cream/10 bg-cream/5 px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/45">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold transition-all duration-300 group-hover:scale-110">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-medium text-cream-soft/85">
              Dahablaha Bakaro, Mogadishu
            </span>
          </div>
        </div>

        <p className="mt-4 font-script text-xl font-bold text-cream-soft/90">
          Thank you for supporting us!
        </p>
      </div>

      <img
        src={MamaCup}
        alt="MaMa Café branded takeaway cup"
        width={700}
        height={900}
        loading="lazy"
        className="hidden w-24 shrink-0 drop-shadow-2xl drift-slower transition-transform duration-500 hover:scale-110 sm:block lg:w-32"
      />
    </div>
  );
};
