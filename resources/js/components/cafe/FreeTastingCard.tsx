import React from 'react';
import { Heart } from 'lucide-react';

export const FreeTastingCard: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center select-none group">
            {/* Outer plaque container with vintage arched top shape */}
            <div className="relative bg-gradient-to-b from-[#5C3E26] via-[#3D2616] to-[#26160C] text-[#FAF6EE] px-8 sm:px-10 py-6 sm:py-8 rounded-t-3xl rounded-b-xl border-4 border-[#C5A059] shadow-2xl transition-transform duration-300 group-hover:scale-105">
                
                {/* Decorative inner gold border line */}
                <div className="absolute inset-1.5 rounded-t-2xl rounded-b-lg border border-[#D4AF37]/60 pointer-events-none"></div>

                {/* Top Corner Ornamental Rivets */}
                <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-inner"></div>
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-inner"></div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-inner"></div>
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-inner"></div>

                {/* Content */}
                <div className="flex flex-col items-center text-center relative z-10">
                    {/* Header line */}
                    <p className="text-xs sm:text-sm font-sans font-bold tracking-widest text-[#E6C280] uppercase">
                        THE TASTING
                    </p>

                    {/* Main bold title */}
                    <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] tracking-wide my-1 drop-shadow-md">
                        IS FREE
                    </h2>

                    {/* Vintage Flourish Divider */}
                    <div className="flex items-center justify-center gap-2 my-1 w-full opacity-85">
                        <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
                        <svg className="w-6 h-3 text-[#D4AF37]" viewBox="0 0 40 20" fill="currentColor">
                            <path d="M0 10 Q 10 0 20 10 Q 30 20 40 10 Q 30 0 20 10 Q 10 20 0 10 Z" />
                        </svg>
                        <span className="h-[1px] w-6 bg-[#D4AF37]"></span>
                    </div>

                    {/* Subtext */}
                    <p className="font-handwriting text-xl sm:text-2xl text-[#E6C280] font-medium tracking-wide">
                        For All Drinks
                    </p>

                    {/* Heart accent */}
                    <div className="mt-1">
                        <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
