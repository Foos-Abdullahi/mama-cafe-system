import type React from "react";
import { Facebook, Instagram, Music2 } from "lucide-react";

const socials = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Music2, href: "https://tiktok.com", label: "TikTok" },
];

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left">
      <h3 className="text-xs font-extrabold tracking-[0.22em] text-cream uppercase">
        Let&apos;s be friends!
      </h3>

      <div className="mt-4 flex items-center gap-3">
        {socials.map(({ icon: Icon, href, label }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cream/15 bg-cream/5 text-cream rise-in transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:scale-110 hover:border-gold hover:bg-gold hover:text-espresso"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <p className="mt-4 font-script text-2xl font-bold text-gold">@MaMacofe</p>
    </div>
  );
};
