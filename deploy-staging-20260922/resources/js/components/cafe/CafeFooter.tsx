import React from "react";
import { Facebook, Instagram, MapPin, Phone, Heart } from "lucide-react";
import MamaCup from "@/images/mama-cup-cutout.png";

const GoldLeaf = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 70 35"
    className={`h-8 w-14 shrink-0 text-[#B99A58] ${
      flip ? "-scale-x-100" : ""
    }`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 29C17 24 25 15 28 3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 27C12 18 17 14 25 12C20 19 14 24 8 27Z"
      fill="currentColor"
      opacity=".75"
    />
    <path
      d="M19 19C22 12 28 8 36 7C31 14 25 18 19 19Z"
      fill="currentColor"
      opacity=".55"
    />
    <path
      d="M29 11C33 6 38 3 44 3C41 8 36 11 29 11Z"
      fill="currentColor"
      opacity=".4"
    />
  </svg>
);

const OrnamentalDivider = () => (
  <div className="relative flex items-center justify-center">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B99A58]/60 to-[#B99A58]" />
    <span className="mx-3 h-2 w-2 rotate-45 border border-[#D1B56C] bg-[#321B12]" />
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#B99A58]/60 to-[#B99A58]" />
  </div>
);

const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="font-serif text-[19px] font-bold uppercase tracking-[0.06em] text-[#F2E2BC] sm:text-[21px]">
        LET' BE FRIENDS!
      </h3>

      <div className="mt-4 flex items-center justify-center gap-2">
        <GoldLeaf />

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E6C8] text-[#3A2115] transition-all duration-300 hover:scale-110 hover:bg-[#D5B66B]"
        >
          <Facebook className="h-7 w-7 fill-current stroke-0" />
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E6C8] text-[#3A2115] transition-all duration-300 hover:scale-110 hover:bg-[#D5B66B]"
        >
          <Instagram className="h-7 w-7" />
        </a>

        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          aria-label="TikTok"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E6C8] text-[#3A2115] transition-all duration-300 hover:scale-110 hover:bg-[#D5B66B]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-current"
            aria-hidden="true"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.31 0 .61.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 1 0 13.86 15V8.82a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.14z" />
          </svg>
        </a>

        <GoldLeaf flip />
      </div>

      <p className="mt-3 font-sans text-[17px] font-bold tracking-wide text-[#E2C77D]">
        @MaMacofe
      </p>
    </div>
  );
};

const FreeTastingCard: React.FC = () => {
  return (
    <div className="relative z-20 mx-auto flex h-[205px] w-[210px] flex-col items-center justify-center border-[2px] border-[#B7954E] bg-[#482719] px-5 text-center shadow-[0_5px_20px_rgba(0,0,0,.35)] sm:h-[220px] sm:w-[220px]">
      {/* Inner ornamental frame */}
      <div className="pointer-events-none absolute inset-[7px] border border-[#C9AA61]/60" />
      <div className="pointer-events-none absolute inset-[11px] border border-[#8C6935]/60" />

      {/* Top decorative curve */}
      <svg
        viewBox="0 0 150 30"
        className="absolute top-[22px] h-7 w-32 text-[#D2B66D]"
        fill="none"
      >
        <path
          d="M5 19C28 19 31 5 50 5C65 5 67 20 75 20C83 20 85 5 100 5C119 5 122 19 145 19"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <p className="relative mt-2 font-serif text-[17px] font-medium uppercase tracking-wide text-[#E9D9AE]">
        THE TASTING
      </p>

      <p className="relative -mt-1 font-serif text-[28px] font-black uppercase leading-none text-[#F0DFC0]">
        IS FREE
      </p>

      <div className="my-3 flex items-center gap-2">
        <span className="h-px w-10 bg-[#B99A58]" />
        <span className="h-1.5 w-1.5 rotate-45 border border-[#C9AA61]" />
        <span className="h-px w-10 bg-[#B99A58]" />
      </div>

      <p className="font-serif text-[16px] text-[#E7D9BC]">
        For All Drinks
      </p>

      <Heart className="mt-3 h-5 w-5 fill-[#D5B66B] text-[#D5B66B]" />

      {/* Bottom ornamental curve */}
      <svg
        viewBox="0 0 150 25"
        className="absolute bottom-[17px] h-6 w-28 rotate-180 text-[#B99A58]"
        fill="none"
      >
        <path
          d="M5 19C28 19 31 5 50 5C65 5 67 20 75 20C83 20 85 5 100 5C119 5 122 19 145 19"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  );
};

const ContactInfo: React.FC = () => {
  return (
    <div className="relative flex w-full items-center justify-between">
      <div className="min-w-0 pr-3 sm:pr-6">
        <h3 className="font-serif text-[19px] font-bold uppercase tracking-wide text-[#F1E1B9] sm:text-[21px]">
          CONTACT US
        </h3>

        <div className="mt-3 space-y-2">
          <a
            href="tel:+252613399977"
            className="flex items-center gap-2.5 text-[#E8DAB9] transition-colors hover:text-[#D6B76B]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Phone className="h-5 w-5 text-[#E2C47B]" />
            </span>

            <span className="text-[14px] font-semibold sm:text-[16px]">
              +252 61 3399977
            </span>
          </a>

          <div className="flex items-start gap-2.5 text-[#E8DAB9]">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <MapPin className="h-5 w-5 text-[#E2C47B]" />
            </span>

            <span className="text-[14px] font-semibold leading-tight sm:text-[16px]">
              Dahablaha Bakaro
              <br />
              Mogadishu
            </span>
          </div>
        </div>

        <p className="mt-3 font-serif text-[15px] italic text-[#E2CBAA] sm:text-[17px]">
          Thank you for supporting us!
        </p>
      </div>

      <img
        src={MamaCup}
        alt="MaMa Café takeaway cup"
        className="hidden h-[170px] w-auto shrink-0 object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,.45)] sm:block md:h-[190px] lg:h-[205px]"
      />
    </div>
  );
};

export const CafeFooter: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#30180F] text-[#F3E6C8]">
      {/* TOP GOLD BORDER */}
      <div className="h-[5px] w-full bg-gradient-to-r from-[#6D4B24] via-[#D0AE5F] to-[#6D4B24]" />

      {/* Decorative upper line */}
      <div className="h-[27px] border-b border-[#A17B3F]/70 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_7px,#745326_8px,#745326_9px,transparent_10px,transparent_17px)] opacity-80" />

      <div className="relative mx-auto max-w-[1220px]">
        {/* MAIN FOOTER */}
        <div className="relative grid min-h-[190px] grid-cols-1 md:grid-cols-[1.05fr_220px_1.65fr]">
          {/* LEFT — SOCIAL */}
          <section className="flex min-h-[190px] items-center justify-center border-b border-[#A27B40]/60 px-5 py-8 md:border-b-0 md:border-r md:px-7">
            <SocialLinks />
          </section>

          {/* CENTER — FREE TASTING */}
          <section className="relative flex items-center justify-center border-b border-[#A27B40]/60 py-7 md:border-b-0">
            <FreeTastingCard />
          </section>

          {/* RIGHT — CONTACT */}
          <section className="flex min-h-[190px] items-center border-t border-[#A27B40]/60 px-5 py-7 md:border-t-0 md:px-7">
            <ContactInfo />
          </section>
        </div>

        {/* Bottom ornamental separator */}
        <div className="px-5 sm:px-8">
          <OrnamentalDivider />
        </div>

        {/* SMALL FOOTER INFO */}
        <div className="flex flex-col items-center justify-center gap-1 px-5 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#BBA477]/70">
            © {new Date().getFullYear()} MaMa Café
          </p>

          <p className="font-serif text-[12px] italic text-[#D2BB8A]/80">
            Fresh Coffee • Real Boba • Ice Chocolate
          </p>
        </div>
      </div>

      {/* BOTTOM GOLD ORNAMENT */}
      <div className="h-[18px] border-t border-[#A17B3F]/60 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_7px,#745326_8px,#745326_9px,transparent_10px,transparent_17px)] opacity-80" />

      <div className="h-[4px] w-full bg-gradient-to-r from-[#6D4B24] via-[#D0AE5F] to-[#6D4B24]" />
    </footer>
  );
};

export default CafeFooter;