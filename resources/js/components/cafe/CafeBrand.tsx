import React from 'react';
import { Coffee, Heart } from 'lucide-react';

export const CafeBrand: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-center select-none animate-fade-up">
            {/* Top Coffee Cup Icon with Steam & Heart */}
            <div className="relative mb-1 flex flex-col items-center">
                {/* Gentle animated steam lines */}
                <div className="flex gap-1 mb-1 opacity-80 animate-float-cup">
                    <span className="w-1 h-3 bg-[#3C2A21] rounded-full transform -rotate-12 animate-pulse"></span>
                    <span className="w-1 h-4 bg-[#3C2A21] rounded-full"></span>
                    <span className="w-1 h-3 bg-[#3C2A21] rounded-full transform rotate-12 animate-pulse"></span>
                </div>
                
                {/* Coffee Cup outline icon with heart */}
                <div className="relative p-2.5 rounded-2xl bg-[#FAF6EE] border-2 border-[#3C2A21] shadow-sm transform hover:scale-110 transition-transform duration-300">
                    <Coffee className="w-7 h-7 text-[#3C2A21]" strokeWidth={2.2} />
                    <Heart className="w-3 h-3 text-[#3C2A21] fill-[#3C2A21] absolute top-4 left-4" />
                </div>
            </div>

            {/* Main Brand Title - MaMa Café */}
            <div className="relative my-0.5">
                <h1 className="font-script text-7xl sm:text-8xl lg:text-9xl text-[#2B1B17] leading-[0.85] tracking-tight drop-shadow-sm font-normal">
                    MaMa
                </h1>
                <div className="flex items-center justify-center gap-1.5 -mt-2 sm:-mt-4">
                    <span className="font-script text-6xl sm:text-7xl lg:text-8xl text-[#2B1B17] leading-[0.85]">
                        Café
                    </span>
                    <Heart className="w-6 h-6 text-[#2B1B17] fill-[#2B1B17] inline-block transform rotate-12 -mt-3" />
                </div>
            </div>

            {/* Dark Roasted Ribbon Banner - COFFEE • BOBA • ICE CHOCOLATE */}
            <div className="relative mt-2 mb-1.5 w-full max-w-sm sm:max-w-md">
                <div className="bg-[#2B1B17] text-[#FAF6EE] px-6 sm:px-8 py-1.5 sm:py-2 rounded-full shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-[#4A3228]/80 flex items-center justify-center gap-2">
                    <p className="text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase font-sans text-center text-[#FAF6EE]">
                        COFFEE • BOBA • ICE CHOCOLATE
                    </p>
                </div>
            </div>

            {/* Subtext - Made with Love with Flourish lines */}
            <div className="mt-1 flex items-center justify-center gap-3">
                <span className="w-10 h-[1.5px] bg-gradient-to-r from-transparent to-[#3C2A21]/50"></span>
                <p className="font-handwriting text-2xl sm:text-3xl lg:text-4xl text-[#3C2A21] font-bold italic tracking-wide">
                    Made with Love
                </p>
                <span className="w-10 h-[1.5px] bg-gradient-to-l from-transparent to-[#3C2A21]/50"></span>
            </div>
        </div>
    );
};

