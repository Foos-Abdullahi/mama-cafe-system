import React from 'react';
import { Coffee, Heart } from 'lucide-react';

export const CafeBrand: React.FC = () => {
    return (
        <div className="animate-fade-up flex flex-col items-center text-center select-none">
            {/* Top Coffee Cup Icon with Steam & Heart */}
            <div className="relative mb-1 flex flex-col items-center">
                {/* Gentle animated steam lines */}
                <div className="animate-float-cup mb-1 flex gap-1 opacity-80">
                    <span className="h-3 w-1 -rotate-12 transform animate-pulse rounded-full bg-[#F7F0E5]"></span>
                    <span className="h-4 w-1 rounded-full bg-[#F7F0E5]"></span>
                    <span className="h-3 w-1 rotate-12 transform animate-pulse rounded-full bg-[#F7F0E5]"></span>
                </div>

                {/* Coffee Cup outline icon with heart */}
                <div className="relative transform rounded-2xl border-2 border-[#F7F0E5] bg-[#B98A35] p-2.5 shadow-xs transition-transform duration-300 hover:scale-105">
                    <Coffee
                        className="h-7 w-7 text-[#2B1A16]"
                        strokeWidth={2.2}
                    />
                    <Heart className="absolute top-4 left-4 h-3 w-3 fill-[#2B1A16] text-[#2B1A16]" />
                </div>
            </div>

            {/* Main Brand Title - MaMa Café */}
            <div className="relative my-0.5">
                <h1 className="font-script text-7xl leading-[0.85] font-normal tracking-tight text-[#F7F0E5] drop-shadow-xs sm:text-8xl lg:text-9xl">
                    MaMa
                </h1>
                <div className="-mt-2 flex items-center justify-center gap-1.5 sm:-mt-4">
                    <span className="font-script text-6xl leading-[0.85] text-[#F7F0E5] sm:text-7xl lg:text-8xl">
                        Café
                    </span>
                    <Heart className="-mt-3 inline-block h-6 w-6 rotate-12 transform fill-[#F7F0E5] text-[#F7F0E5]" />
                </div>
            </div>

            {/* Dark Roasted Ribbon Banner - COFFEE • BOBA • ICE CHOCOLATE */}
            <div className="relative mt-2 mb-1.5 w-full max-w-sm sm:max-w-md">
                <div className="flex -rotate-1 transform items-center justify-center gap-2 rounded-full border border-[#F7F0E5] bg-[#B98A35] px-6 py-1.5 text-[#2B1A16] shadow-md transition-transform duration-300 hover:rotate-0 sm:px-8 sm:py-2">
                    <p className="text-center font-sans text-xs font-extrabold tracking-[0.2em] text-[#2B1A16] uppercase sm:text-sm">
                        COFFEE • BOBA • ICE CHOCOLATE
                    </p>
                </div>
            </div>

            {/* Subtext - Made with Love with Flourish lines */}
            <div className="mt-1 flex items-center justify-center gap-3">
                <span className="h-[1.5px] w-10 bg-gradient-to-r from-transparent to-[#F7F0E5]/50"></span>
                <p className="font-handwriting text-2xl font-bold tracking-wide text-[#F7F0E5] italic sm:text-3xl lg:text-4xl">
                    Made with Love
                </p>
                <span className="h-[1.5px] w-10 bg-gradient-to-l from-transparent to-[#F7F0E5]/50"></span>
            </div>
        </div>
    );
};
