import React from 'react';
import { Heart } from 'lucide-react';

export const FreeTastingCard: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center select-none group">
            {/* Outer plaque container with vintage arched top shape & gold bevel */}
            <div className="relative bg-gradient-to-b from-[#4A3222] via-[#321E12] to-[#1E110A] text-[#FAF6EE] px-8 sm:px-11 py-6 sm:py-7 rounded-t-3xl rounded-b-xl border-[3.5px] border-[#D4AF37] shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                
                {/* Decorative inner gold border line */}
                <div className="absolute inset-1.5 rounded-t-2xl rounded-b-lg border border-[#D4AF37]/50 pointer-events-none"></div>

                {/* Corner Ornamental Rivets */}
                <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>
                <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>
                <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>

                {/* Content */}
                <div className="flex flex-col items-center text-center relative z-10">
                    {/* Header line: "THE TESTING" */}
                    <p className="text-xs sm:text-sm font-sans font-bold tracking-[0.25em] text-[#E6C280] uppercase">
                        THE TESTING
                    </p>

                    {/* Main bold title: "IS FREE" */}
                    <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#FAF6EE] tracking-wider my-1 drop-shadow-md">
                        IS FREE
                    </h2>

                    {/* Vintage Flourish Divider */}
                    <div className="flex items-center justify-center gap-2 my-1.5 w-full opacity-90">
                        <span className="h-[1.5px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
                        <svg className="w-8 h-4 text-[#D4AF37]" viewBox="0 0 40 20" fill="currentColor">
                            <path d="M0 10 Q 10 0 20 10 Q 30 20 40 10 Q 30 0 20 10 Q 10 20 0 10 Z" />
                        </svg>
                        <span className="h-[1.5px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
                    </div>

                    {/* Subtext: "For All Drinks" */}
                    <p className="font-handwriting text-2xl sm:text-3xl text-[#E6C280] font-semibold tracking-wide">
                        For All Drinks
                    </p>

                    {/* Golden Heart Accent */}
                    <div className="mt-1 transform group-hover:scale-125 transition-transform duration-300">
                        <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

