import React from 'react';
import { Heart } from 'lucide-react';

export const FreeTastingCard: React.FC = () => {
    return (
        <div className="group relative flex flex-col items-center justify-center select-none">
            {/* Outer plaque container with vintage arched top shape & gold bevel */}
            <div className="relative rounded-t-3xl rounded-b-xl border-[3.5px] border-[#D4AF37] bg-gradient-to-b from-[#4A3222] via-[#321E12] to-[#1E110A] px-6 py-3 text-[#FAF6EE] shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] sm:px-8 sm:py-4">
                {/* Decorative inner gold border line */}
                <div className="pointer-events-none absolute inset-1.5 rounded-t-2xl rounded-b-lg border border-[#D4AF37]/50"></div>

                {/* Corner Ornamental Rivets */}
                <div className="absolute top-2.5 left-2.5 h-1.5 w-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>
                <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>
                <div className="absolute bottom-2.5 left-2.5 h-1.5 w-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>
                <div className="absolute right-2.5 bottom-2.5 h-1.5 w-1.5 rounded-full bg-[#E6C280] shadow-xs"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Header line: "THE TESTING" */}
                    <p className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#E6C280] uppercase sm:text-xs">
                        THE TESTING
                    </p>

                    {/* Main bold title: "IS FREE" */}
                    <h2 className="font-serif-title my-1 text-2xl font-extrabold tracking-wider text-[#FAF6EE] drop-shadow-md sm:text-3xl">
                        IS FREE
                    </h2>

                    {/* Vintage Flourish Divider */}
                    <div className="my-1 flex w-full items-center justify-center gap-2 opacity-90">
                        <span className="h-[1.5px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
                        <svg
                            className="h-4 w-8 text-[#D4AF37]"
                            viewBox="0 0 40 20"
                            fill="currentColor"
                        >
                            <path d="M0 10 Q 10 0 20 10 Q 30 20 40 10 Q 30 0 20 10 Q 10 20 0 10 Z" />
                        </svg>
                        <span className="h-[1.5px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
                    </div>

                    {/* Subtext: "For All Drinks" */}
                    <p className="font-handwriting text-xl font-semibold tracking-wide text-[#E6C280] sm:text-2xl">
                        For All Drinks
                    </p>

                    {/* Golden Heart Accent */}
                    <div className="mt-1 transform transition-transform duration-300 group-hover:scale-125">
                        <Heart className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
