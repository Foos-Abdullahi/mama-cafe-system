import React from 'react';
import { Coffee, Heart } from 'lucide-react';

export const CafeBrand: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-center select-none animate-fade-up">
            {/* Top Coffee Cup Icon with Steam */}
            <div className="relative mb-1 flex flex-col items-center">
                {/* Steam lines */}
                <div className="flex gap-1 mb-0.5 opacity-80 animate-float-cup">
                    <span className="w-1 h-2 bg-[#3C2A21] rounded-full transform -rotate-12"></span>
                    <span className="w-1 h-3 bg-[#3C2A21] rounded-full"></span>
                    <span className="w-1 h-2 bg-[#3C2A21] rounded-full transform rotate-12"></span>
                </div>
                {/* Coffee Cup outline icon */}
                <div className="relative p-2 rounded-xl bg-[#FAF6EE] border-2 border-[#3C2A21] shadow-sm">
                    <Coffee className="w-6 h-6 text-[#3C2A21]" />
                    <Heart className="w-2.5 h-2.5 text-[#3C2A21] fill-[#3C2A21] absolute top-3.5 left-3.5" />
                </div>
            </div>

            {/* Main Title - MaMa Café */}
            <div className="relative my-1">
                <h1 className="font-script text-6xl sm:text-7xl lg:text-8xl text-[#2B1B17] leading-none tracking-tight drop-shadow-sm">
                    MaMa
                </h1>
                <div className="flex items-center justify-center gap-1 -mt-2 sm:-mt-4">
                    <span className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#2B1B17] leading-none">
                        Café
                    </span>
                    <Heart className="w-5 h-5 text-[#2B1B17] fill-[#2B1B17] inline-block transform rotate-12 -mt-2" />
                </div>
            </div>

            {/* Banner Ribbon - COFFEE • BOBA • ICE CHOCOLATE */}
            <div className="relative mt-2 mb-1 w-full max-w-md">
                <div className="bg-[#2B1B17] text-[#FAF6EE] px-6 py-1.5 rounded-full shadow-md transform -skew-x-3 hover:skew-x-0 transition-transform duration-300 border border-[#4A3228]">
                    <p className="text-xs sm:text-sm font-extrabold tracking-widest uppercase font-sans">
                        COFFEE • BOBA • ICE CHOCOLATE
                    </p>
                </div>
            </div>

            {/* Subtext - Made with Love */}
            <div className="mt-1 flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-[#3C2A21]/40"></span>
                <p className="font-handwriting text-2xl sm:text-3xl text-[#3C2A21] font-semibold italic">
                    Made with Love
                </p>
                <span className="w-8 h-[1px] bg-[#3C2A21]/40"></span>
            </div>
        </div>
    );
};
