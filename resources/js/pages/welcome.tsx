import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Bean,
    CupSoda,
    Facebook,
    Heart,
    Instagram,
    MapPin,
    Phone,
    Smile,
} from "lucide-react";
import { login } from "@/routes";

import icedCoffeeBoba from "@/images/mama-iced-coffee-boba.png";
import bobaMilkTea from "@/images/mama-boba-milk-tea.png";
import cacaoBliss from "@/images/cacao-bliss.png";
import mamaCup from "@/images/mama-cup-cutout.png";

/*
|--------------------------------------------------------------------------
| Animation
|--------------------------------------------------------------------------
*/

const floatingAnimation = {
    animation: "floatDrink 5s ease-in-out infinite",
};

const floatingAnimationSlow = {
    animation: "floatDrinkSlow 6s ease-in-out infinite",
};

const splashAnimation = {
    animation: "splashFloat 4s ease-in-out infinite",
};

/*
|--------------------------------------------------------------------------
| Why Choose Us
|--------------------------------------------------------------------------
*/

const benefits = [
    {
        icon: Bean,
        title: "PREMIUM QUALITY",
        description:
            "We use the best coffee beans and high-quality ingredients.",
    },
    {
        icon: CupSoda,
        title: "FRESHLY MADE",
        description: "Every drink is freshly prepared just for you.",
    },
    {
        icon: Heart,
        title: "MADE WITH LOVE",
        description: "We put love in every drink we make.",
    },
    {
        icon: Smile,
        title: "GREAT TASTE",
        description: "Delicious drinks that make your day better.",
    },
];

/*
|--------------------------------------------------------------------------
| Decorative Leaf
|--------------------------------------------------------------------------
*/

function LeafDecoration({
    flip = false,
}: {
    flip?: boolean;
}) {
    return (
        <svg
            viewBox="0 0 90 50"
            className={`h-9 w-16 text-[#CBAA68] ${
                flip ? "scale-x-[-1]" : ""
            }`}
            fill="none"
        >
            <path
                d="M4 43C23 36 37 23 42 5"
                stroke="currentColor"
                strokeWidth="1.5"
            />

            <path
                d="M9 37C13 27 21 21 32 19C27 28 19 34 9 37Z"
                fill="currentColor"
                opacity=".7"
            />

            <path
                d="M25 27C29 18 36 12 47 11C42 20 35 25 25 27Z"
                fill="currentColor"
                opacity=".55"
            />

            <path
                d="M39 14C44 8 50 5 58 5C54 11 48 14 39 14Z"
                fill="currentColor"
                opacity=".4"
            />
        </svg>
    );
}

/*
|--------------------------------------------------------------------------
| MaMa Café Brand
|--------------------------------------------------------------------------
*/

function CafeBrand() {
    return (
        <div className="relative z-30 flex flex-col items-center text-center -translate-x-3 sm:-translate-x-4">
            {/* Cup icon */}
            <div className="mb-[-6px]">
                <svg
                    viewBox="0 0 50 60"
                    className="h-8 w-7 text-[#321B13]"
                    fill="none"
                >
                    <path
                        d="M13 18h25l-2 25c-.5 5-4.5 8-10 8h-1c-5.5 0-9.5-3-10-8l-2-25Z"
                        fill="currentColor"
                    />

                    <path
                        d="M38 24c6-1 8 3 8 7 0 5-3 8-8 8"
                        stroke="currentColor"
                        strokeWidth="3"
                    />

                    <path
                        d="M25 29c2-4 7-3 7 .5 0 3.1-5.5 6.3-7 7.4-1.5-1.1-7-4.3-7-7.4 0-3.5 5-4.5 7-.5Z"
                        fill="#F7EAD4"
                    />

                    <path
                        d="M18 12C15 7 17 4 17 1M26 10C26 5 29 3 30 0M34 12C37 7 37 5 37 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <h1 className="font-sans text-[62px] font-black leading-[0.82] tracking-[-0.04em] text-[#321B13] sm:text-[78px]">
                MaMa
            </h1>

            <div className="relative">
                <h2 className="font-sans text-[50px] font-black leading-none tracking-[-0.04em] text-[#321B13] sm:text-[62px]">
                    Café
                </h2>

                <Heart className="absolute -right-7 top-0 h-6 w-6 rotate-12 fill-[#321B13] text-[#321B13]" />
            </div>

            {/* Ribbon */}
            <div className="relative mt-4">
                <div
                    className="rotate-[-6deg] bg-[#321B13] px-7 py-2 shadow-md"
                    style={{
                        clipPath:
                            "polygon(4% 8%,96% 0,100% 80%,4% 100%,0 50%)",
                    }}
                >
                    <span className="font-sans text-[10px] font-bold tracking-[0.18em] text-[#F7EAD4] sm:text-[12px]">
                        COFFEE • BOBA • ICE CHOCOLATE
                    </span>
                </div>
            </div>

            <p className="mt-2 font-sans text-[18px] italic font-semibold text-[#62402B] sm:text-[20px]">
                Made with Love
            </p>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Main Large Drink
|--------------------------------------------------------------------------
*/

function MainDrink() {
    return (
        <div className="relative flex h-[380px] w-full items-end justify-center mt-4">
            {/* Soft glow */}
            <div className="absolute bottom-8 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-[#C98D45]/20 blur-[55px]" />

            {/* Decorative leaves behind drink */}
            <svg
                className="absolute right-[-10px] top-16 h-48 w-28 opacity-35"
                viewBox="0 0 100 220"
                fill="none"
            >
                <path
                    d="M50 220C51 150 60 90 78 20"
                    stroke="#B8965C"
                    strokeWidth="1.2"
                />

                <path
                    d="M53 158C32 143 25 126 28 110C44 116 53 134 53 158Z"
                    stroke="#B8965C"
                />

                <path
                    d="M60 117C78 103 85 87 83 72C68 76 60 93 60 117Z"
                    stroke="#B8965C"
                />

                <path
                    d="M69 72C56 59 52 45 56 33C67 42 71 55 69 72Z"
                    stroke="#B8965C"
                />
            </svg>

            {/* DRINK */}
            <div
                className="relative z-20 mt-9 w-[220px] sm:w-[255px] lg:w-[280px]"
                style={floatingAnimation}
            >
                <img
                    src={icedCoffeeBoba}
                    alt="MaMa iced coffee boba"
                    className="relative z-10 h-auto w-full object-contain drop-shadow-[0_25px_20px_rgba(45,24,12,.28)]"
                />
            </div>

            {/* Coffee beans */}
            <div className="absolute bottom-3 left-4 z-30">
                <div className="flex gap-2">
                    <span className="h-5 w-9 rotate-[25deg] rounded-[50%] bg-[#4A2818] shadow-sm" />
                    <span className="h-4 w-8 rotate-[-20deg] rounded-[50%] bg-[#61351F]" />
                    <span className="h-4 w-8 rotate-[30deg] rounded-[50%] bg-[#3D2115]" />
                </div>
            </div>

            <div className="absolute bottom-7 right-0 z-30">
                <div className="flex gap-2">
                    <span className="h-4 w-8 rotate-[-20deg] rounded-[50%] bg-[#60351F]" />
                    <span className="h-5 w-9 rotate-[18deg] rounded-[50%] bg-[#482719]" />
                </div>
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Center Two Drinks
|--------------------------------------------------------------------------
*/

function CenterDrinks() {
    return (
        <div className="relative mt-2 sm:mt-4 flex h-[290px] w-full items-end justify-center">
            {/* Glow */}
            <div className="absolute bottom-8 left-1/2 h-24 w-60 -translate-x-1/2 rounded-full bg-[#B97A39]/20 blur-3xl" />

            {/* Milk tea */}
            <div
                className="relative z-20 -mr-10 mt-9 w-[190px] sm:w-[215px]"
                style={floatingAnimationSlow}
            >
                <img
                    src={bobaMilkTea}
                    alt="MaMa boba milk tea"
                    className="w-full object-contain drop-shadow-[0_20px_18px_rgba(45,24,12,.3)]"
                />
            </div>

            {/* Chocolate */}
            <div
                className="relative z-30 mt-9 sm:mt-12 w-[195px] sm:w-[225px]"
                style={{
                    ...floatingAnimation,
                    animationDelay: "1.2s",
                }}
            >
                <img
                    src={cacaoBliss}
                    alt="MaMa chocolate drink"
                    className="w-full object-contain drop-shadow-[0_22px_20px_rgba(45,24,12,.32)]"
                />
            </div>

            {/* Chocolate splash dots */}
            <span
                className="absolute right-8 top-4 h-4 w-4 rotate-12 rounded-full bg-[#63341E]"
                style={splashAnimation}
            />

            <span
                className="absolute right-2 top-12 h-2.5 w-2.5 rounded-full bg-[#63341E]"
                style={{
                    ...splashAnimation,
                    animationDelay: "1s",
                }}
            />

            <span
                className="absolute right-20 top-0 h-3 w-3 rotate-45 rounded-sm bg-[#63341E]"
                style={{
                    ...splashAnimation,
                    animationDelay: "1.5s",
                }}
            />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Why Choose Us
|--------------------------------------------------------------------------
*/

function WhyChooseUs() {
    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div
                className="relative mb-5 inline-flex w-fit self-center px-6 py-2 sm:self-start"
                style={{
                    background:
                        "linear-gradient(165deg,#542718,#6A321D,#492016)",
                    clipPath:
                        "polygon(2% 16%,8% 5%,21% 10%,34% 3%,47% 9%,61% 2%,75% 9%,88% 4%,98% 14%,94% 30%,100% 44%,94% 58%,98% 75%,88% 86%,76% 81%,62% 94%,48% 87%,35% 94%,22% 86%,9% 91%,4% 76%,1% 60%,5% 44%,1% 29%)",
                }}
            >
                <h2 className="font-sans text-[20px] font-bold italic text-[#F4E5C6]">
                    Why Choose Us?
                </h2>
            </div>

            <div className="space-y-4">
                {benefits.map((benefit) => {
                    const Icon = benefit.icon;

                    return (
                        <div
                            key={benefit.title}
                            className="flex items-start gap-3"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#321B13]">
                                <Icon className="h-5 w-5 text-[#321B13]" />
                            </div>

                            <div>
                                <h3 className="font-sans text-[12px] font-extrabold tracking-wide text-[#321B13]">
                                    {benefit.title}
                                </h3>

                                <p className="mt-1 max-w-[210px] font-sans text-[11px] leading-[1.35] text-[#4C382B]">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Social
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Free Tasting
|--------------------------------------------------------------------------
*/

function FreeTasting() {
    return (
        <div className="absolute bottom-[-1px] left-1/2 z-50 flex h-[170px] w-[150px] -translate-x-1/2 items-center justify-center sm:h-[185px] sm:w-[165px]">
            <div
                className="absolute inset-0 border-[3px] border-[#B99A57] bg-[#492719] shadow-[0_7px_18px_rgba(0,0,0,.35)]"
                style={{
                    clipPath:
                        "polygon(15% 0,85% 0,96% 9%,96% 91%,85% 100%,15% 100%,4% 91%,4% 9%)",
                }}
            />

            <div
                className="absolute inset-[7px] border border-[#D3B76D]/70"
                style={{
                    clipPath:
                        "polygon(15% 0,85% 0,97% 10%,97% 90%,85% 100%,15% 100%,3% 90%,3% 10%)",
                }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
                <p className="font-serif text-[13px] uppercase text-[#E9D9B6]">
                    THE TASTING
                </p>

                <p className="font-serif text-[24px] font-bold uppercase leading-none text-[#F2E1C4]">
                    IS FREE
                </p>

                <svg
                    viewBox="0 0 100 30"
                    className="my-2 h-6 w-20 text-[#CBAE68]"
                    fill="none"
                >
                    <path
                        d="M5 16C20 16 21 6 34 6C45 6 45 18 50 18C55 18 55 6 66 6C79 6 80 16 95 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </svg>

                <p className="font-serif text-[13px] text-[#E7D8BA]">
                    For All Drinks
                </p>

                <Heart className="mt-2 h-4 w-4 fill-[#D1B36A] text-[#D1B36A]" />
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Footer
|--------------------------------------------------------------------------
*/

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  cream: "#F7EBDD",
  creamLight: "#FFF7ED",
  brown: "#351B13",
  brownDark: "#24110C",
  gold: "#C69A55",
  goldLight: "#E5C78D",
  muted: "#765B4B",
};

// ============================================================
// LEAF
// ============================================================

const Leaf = ({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 80 50"
      className={`h-10 w-16 ${flip ? "scale-x-[-1]" : ""} ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 44C27 42 50 31 67 7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16 38C11 30 13 22 21 17C25 25 24 32 16 38Z"
        fill="currentColor"
        opacity=".35"
      />
      <path
        d="M28 32C24 23 28 16 37 13C39 22 36 28 28 32Z"
        fill="currentColor"
        opacity=".35"
      />
      <path
        d="M41 24C39 16 44 9 52 7C52 16 49 21 41 24Z"
        fill="currentColor"
        opacity=".35"
      />
    </svg>
  );
};

// ============================================================
// SOCIAL LINKS
// ============================================================

const SocialLinks = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <h3
        className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em]"
        style={{ color: COLORS.cream }}
      >
        LET&apos; BE FRIENDS!
      </h3>

      <div className="flex items-center gap-2.5">
        <Leaf
          className="text-[#A9825C]"
        />

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8EEDD] text-[#351B13] transition hover:scale-110 hover:bg-[#D5AD69]"
        >
          <Facebook className="h-4 w-4 fill-current" />
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8EEDD] text-[#351B13] transition hover:scale-110 hover:bg-[#D5AD69]"
        >
          <Instagram className="h-4 w-4" />
        </a>

        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          aria-label="TikTok"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8EEDD] text-[#351B13] transition hover:scale-110 hover:bg-[#D5AD69]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.31 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 1 0 15.82 15V8.45a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.18Z" />
          </svg>
        </a>

        <Leaf
          flip
          className="text-[#A9825C]"
        />
      </div>

      <p
        className="mt-1 text-[12px] font-bold tracking-wide"
        style={{ color: COLORS.goldLight }}
      >
        @MaMacofe
      </p>
    </div>
  );
};

// ============================================================
// FREE TASTING
// ============================================================

// ============================================================
// FREE TASTING CARD (redesigned)
// ============================================================

const FreeTastingCard = () => {
  return (
    <div className="relative mx-auto flex min-h-[148px] w-full max-w-[240px] items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-60 blur-sm"
        style={{ background: "radial-gradient(ellipse at center, rgba(198,154,85,.45) 0%, transparent 70%)" }}
      />

      {/* Main card */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(145deg, #5c2e1a 0%, #3d1d0e 50%, #2a1208 100%)",
          boxShadow: "0 12px 40px rgba(20,8,3,.5), inset 0 1px 0 rgba(255,255,255,.07), inset 0 -1px 0 rgba(0,0,0,.3)",
          border: "1.5px solid rgba(198,154,85,.6)",
        }}
      />

      {/* Inner border accent */}
      <div
        className="absolute inset-[6px] rounded-xl"
        style={{
          border: "1px solid rgba(229,199,141,.25)",
          background: "rgba(255,255,255,.02)",
        }}
      />

      {/* Corner ornaments */}
      <div className="absolute left-[10px] top-[10px] h-4 w-4 border-l-[1.5px] border-t-[1.5px] rounded-tl-sm" style={{ borderColor: "rgba(198,154,85,.6)" }} />
      <div className="absolute right-[10px] top-[10px] h-4 w-4 border-r-[1.5px] border-t-[1.5px] rounded-tr-sm" style={{ borderColor: "rgba(198,154,85,.6)" }} />
      <div className="absolute bottom-[10px] left-[10px] h-4 w-4 border-b-[1.5px] border-l-[1.5px] rounded-bl-sm" style={{ borderColor: "rgba(198,154,85,.6)" }} />
      <div className="absolute bottom-[10px] right-[10px] h-4 w-4 border-b-[1.5px] border-r-[1.5px] rounded-br-sm" style={{ borderColor: "rgba(198,154,85,.6)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-center px-4 py-4">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: COLORS.goldLight }}>
          ✦ Special Offer ✦
        </p>

        <div className="my-1 flex flex-col items-center gap-0.5">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "rgba(247,235,221,.75)" }}>
            The Tasting
          </p>
          <h3
            className="font-sans text-[32px] font-black leading-none tracking-tight"
            style={{ color: COLORS.cream, textShadow: "0 2px 12px rgba(198,154,85,.4)" }}
          >
            IS FREE
          </h3>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(198,154,85,.6))" }} />
          <Heart className="h-3 w-3 shrink-0" fill={COLORS.gold} style={{ color: COLORS.gold }} />
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(198,154,85,.6), transparent)" }} />
        </div>

        <p className="font-sans text-[11px] font-medium" style={{ color: "rgba(247,235,221,.8)" }}>
          For All Our Drinks
        </p>
      </div>
    </div>
  );
};

// ============================================================
// FOOTER
// ============================================================

const CafeFooter = () => {
  return (
    <footer
      className="relative z-20 overflow-visible"
      style={{
        background: COLORS.brownDark,
        color: COLORS.cream,
      }}
    >
      {/* ── Cup image rising above the footer at the right end ── */}
      <div className="relative">
        {/* Top gold gradient line */}
        <div
          className="h-[3px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C69A55 15%, #E5C78D 50%, #C69A55 85%, transparent)",
          }}
        />

        {/* Cup peeking above at the right end */}
        <div className="mx-auto w-full max-w-[1250px] relative">
          <div className="pointer-events-none absolute right-3 sm:right-8 md:right-12 top-0 z-30 -translate-y-[62%]">
            <img
              src={mamaCup}
              alt="MaMa Café cup"
              className="h-[180px] sm:h-[210px] w-auto object-contain drop-shadow-[0_-10px_25px_rgba(0,0,0,.45)] transition-transform duration-500 hover:-translate-y-2"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1250px] px-5 pt-10 pb-5 sm:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-12">

          {/* SOCIAL — left */}
          <div className="flex md:col-span-3">
            <div className="flex w-full items-center justify-center rounded-xl px-3 py-2">
              <SocialLinks />
            </div>
          </div>

          {/* FREE TASTING — center */}
          <div className="flex md:col-span-4">
            <FreeTastingCard />
          </div>

          {/* CONTACT — right, merged into one card */}
          <div className="flex md:col-span-5">
            <div
              className="flex w-full min-h-[148px] items-center rounded-2xl px-5 py-4 gap-4"
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(198,154,85,.15)",
              }}
            >
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <h3
                    className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
                    style={{ color: COLORS.goldLight }}
                  >
                    Contact Us
                  </h3>
                  <div className="space-y-1.5">
                    <a
                      href="tel:+252613399977"
                      className="flex items-center gap-2 font-sans text-[12px] font-semibold transition hover:opacity-80"
                      style={{ color: COLORS.cream }}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: COLORS.goldLight }} />
                      +252 61 339 9977
                    </a>
                    <div
                      className="flex items-start gap-2 font-sans text-[12px]"
                      style={{ color: "rgba(247,235,221,.8)" }}
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: COLORS.goldLight }} />
                      <span>Dahablaha Bakaro, Mogadishu</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full" style={{ background: "rgba(198,154,85,.2)" }} />

                <p className="font-sans text-[11px] italic" style={{ color: COLORS.goldLight }}>
                  Thank you for supporting us! ♥
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-4 flex flex-col items-center justify-center border-t pt-3 text-center"
          style={{ borderColor: "rgba(247,235,221,.1)" }}
        >
          <p className="font-sans text-[9px]" style={{ color: "rgba(247,235,221,.45)" }}>
            © {new Date().getFullYear()} MaMa Café. Handcrafted with love.
          </p>
        </div>
      </div>
    </footer>
  );
};


/*
|--------------------------------------------------------------------------
| LANDING PAGE
|--------------------------------------------------------------------------
*/

export default function Welcome() {
    return (
        <>
            <Head title="MaMa Café — Fresh Coffee, Real Boba & Ice Chocolate">
                <meta
                    name="description"
                    content="MaMa Café in Mogadishu serves freshly made coffee, real boba and ice chocolate. Tasting is free for all drinks."
                />
            </Head>

            <div className="min-h-screen overflow-x-hidden bg-[#F7EAD4]">
                {/* =====================================================
                    HERO
                ===================================================== */}

                <main>
                    {/* Sign In */}
                    <Link
                        href={login()}
                        className="absolute right-5 top-5 z-[100] rounded-full bg-[#321B13] px-5 py-2 text-sm font-bold text-[#F7EAD4] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#58301E] sm:right-8"
                    >
                        Sign In
                    </Link>

                    <section className="relative overflow-hidden bg-[#F7EAD4]">
                        {/* Paper texture */}
                        <div className="pointer-events-none absolute inset-0 opacity-[0.13]">
                            <div
                                className="h-full w-full"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(#754C2C .6px,transparent .6px)",
                                    backgroundSize: "8px 8px",
                                }}
                            />
                        </div>

                        {/* Decorative circles */}
                        <div className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-[#E7C99B]/20 blur-3xl" />

                        <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#D5AE76]/15 blur-3xl" />

                        <div className="relative mx-auto max-w-[1220px] px-5 pt-2 sm:pt-3 sm:px-8 lg:px-10">
                            <div className="grid min-h-[550px] grid-cols-1 items-start md:grid-cols-3">
                                {/* =================================================
                                    LEFT DRINK
                                ================================================= */}

                                <div className="relative order-2 md:order-1 hidden h-[520px] md:flex md:flex-col justify-between pt-2">
                                    <div className="rotate-[-5deg] mt-16 ml-12">
                                        <p className="font-sans text-[22px] font-bold leading-none text-[#321B13]">
                                            Fresh Drinks
                                        </p>

                                        <p className="mt-1 flex items-center gap-1 font-sans text-[22px] font-bold leading-none text-[#321B13]">
                                            Good Mood
                                            <Heart className="h-4 w-4 fill-[#321B13]" />
                                        </p>
                                    </div>

                                    <div className="mt-6 sm:mt-8">
                                        <MainDrink />
                                    </div>
                                </div>

                                {/* =================================================
                                    CENTER
                                ================================================= */}

                                <div className="relative order-1 md:order-2 flex min-h-[550px] flex-col items-center justify-start pt-0 pr-4 md:pr-8">
                                    <CafeBrand />

                                    <CenterDrinks />
                                </div>

                                {/* =================================================
                                    RIGHT
                                ================================================= */}

                                <div className="order-3 hidden h-[520px] border-l border-dashed border-[#876442]/50 pl-7 pt-[4.5rem] md:block">
                                    <WhyChooseUs />
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            MOBILE
                        ================================================= */}

                        <div className="relative px-5 pb-8 md:hidden">
                            <div className="flex flex-col items-center">
                                <CafeBrand />

                                <div className="mt-3 w-full">
                                    <div className="relative mx-auto h-[410px] max-w-[360px]">
                                        <MainDrink />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <CenterDrinks />
                                </div>

                                <div className="mt-5 w-full max-w-sm">
                                    <WhyChooseUs />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        FOOTER
                    ===================================================== */}

                    <CafeFooter />
                </main>
            </div>

            {/* =========================================================
                ANIMATIONS
            ========================================================= */}

            <style>{`
                @keyframes floatDrink {
                    0% {
                        transform: translateY(0) rotate(0deg);
                    }

                    50% {
                        transform: translateY(-10px) rotate(1deg);
                    }

                    100% {
                        transform: translateY(0) rotate(0deg);
                    }
                }

                @keyframes floatDrinkSlow {
                    0% {
                        transform: translateY(0) rotate(-1deg);
                    }

                    50% {
                        transform: translateY(-14px) rotate(1deg);
                    }

                    100% {
                        transform: translateY(0) rotate(-1deg);
                    }
                }

                @keyframes splashFloat {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: .7;
                    }

                    50% {
                        transform: translateY(-8px) scale(1.15);
                        opacity: 1;
                    }

                    100% {
                        transform: translateY(0) scale(1);
                        opacity: .7;
                    }
                }
            `}</style>
        </>
    );
}