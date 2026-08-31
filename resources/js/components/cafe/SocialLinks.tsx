import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

export const SocialLinks: React.FC = () => {
    return (
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left select-none">
            {/* Header: LET' BE FRIENDS! */}
            <h3 className="text-xs sm:text-sm font-sans font-extrabold tracking-[0.2em] text-[#FAF6EE] uppercase mb-2.5">
                LET' BE FRIENDS!
            </h3>

            {/* Social Icons row with leaf graphics */}
            <div className="flex items-center gap-3 my-1">
                {/* Left Leaf Ornament */}
                <svg className="w-6 h-6 text-[#A67C52] opacity-80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5,16 3,21C8,20 15,17 17,8M12,14C11.5,12 13,9 16,8C14,10 13.5,12.5 12,14Z" />
                </svg>

                {/* Facebook */}
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#2B1B17] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#FAF6EE] transition-all duration-300 shadow-md transform hover:scale-110"
                    aria-label="Facebook"
                >
                    <Facebook className="w-4 h-4 fill-current stroke-none" />
                </a>

                {/* Instagram */}
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#2B1B17] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#FAF6EE] transition-all duration-300 shadow-md transform hover:scale-110"
                    aria-label="Instagram"
                >
                    <Instagram className="w-4 h-4" />
                </a>

                {/* TikTok */}
                <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#2B1B17] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#FAF6EE] transition-all duration-300 shadow-md transform hover:scale-110"
                    aria-label="TikTok"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.14z" />
                    </svg>
                </a>

                {/* Right Leaf Ornament */}
                <svg className="w-6 h-6 text-[#A67C52] opacity-80 transform scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5,16 3,21C8,20 15,17 17,8M12,14C11.5,12 13,9 16,8C14,10 13.5,12.5 12,14Z" />
                </svg>
            </div>

            {/* Handle matching poster: @MaMacofe */}
            <p className="font-sans font-bold text-xs sm:text-sm text-[#E6C280] tracking-wider mt-1.5">
                @MaMacofe
            </p>
        </div>
    );
};

