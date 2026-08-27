import React from 'react';

interface DrinkShowcaseProps {
    type?: 'hero-main' | 'hero-dual';
}

export const DrinkShowcase: React.FC<DrinkShowcaseProps> = ({ type = 'hero-main' }) => {
    if (type === 'hero-main') {
        return (
            <div className="relative flex flex-col items-center justify-center">
                {/* Handwritten Callout - Top Left */}
                <div className="absolute -top-10 -left-6 sm:-left-10 z-20 text-center select-none pointer-events-none transform -rotate-6">
                    <p className="font-handwriting text-2xl sm:text-3xl lg:text-4xl text-[#2B1B17] font-bold leading-tight drop-shadow-sm">
                        Fresh Drinks
                    </p>
                    <p className="font-handwriting text-2xl sm:text-3xl lg:text-4xl text-[#2B1B17] font-bold leading-tight -mt-1 flex items-center justify-center gap-1">
                        Good Mood <span className="text-[#8B261D]">♥</span>
                    </p>
                    {/* Hand-drawn swirl arrow indicator */}
                    <svg className="w-10 h-10 text-[#2B1B17] ml-auto -mt-2 opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="M 20 20 Q 60 40 80 80 M 80 80 L 60 75 M 80 80 L 75 60" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Main Boba Drink Image Container - Resized & Seamless Blend (No Rectangle Borders) */}
                <div className="relative z-10 w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[260px] group">
                    {/* Drink Image with mix-blend-multiply to remove rectangular photo edges */}
                    <div className="relative overflow-hidden rounded-2xl">
                        <img
                            src="/images/boba_drink.jpg"
                            alt="MaMa Boba Fresh Drink"
                            className="w-full h-auto object-contain mix-blend-multiply contrast-[1.03] transform transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Floating Coffee Beans Overlay */}
                    <div className="absolute -bottom-3 -left-5 z-20 w-16 h-16 pointer-events-none opacity-90 animate-float-cup">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#3C2A21] drop-shadow-md">
                            <g transform="translate(20,30) rotate(25) scale(1.2)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path d="M 12 4 Q 16 18 12 32" stroke="#FAF6EE" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </g>
                            <g transform="translate(60,50) rotate(-40) scale(0.9)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path d="M 12 4 Q 8 18 12 32" stroke="#FAF6EE" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </g>
                        </svg>
                    </div>

                    <div className="absolute -bottom-2 -right-3 z-20 w-14 h-14 pointer-events-none opacity-85">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#2B1B17]">
                            <g transform="translate(30,20) rotate(60) scale(1.1)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path d="M 12 4 Q 15 18 12 32" stroke="#FAF6EE" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // Secondary dual drinks display (placed under center logo in hero)
    return (
        <div className="relative flex items-center justify-center gap-3 sm:gap-4 mt-3 select-none">
            {/* Left Drink: Iced Boba Coffee */}
            <div className="relative max-w-[130px] sm:max-w-[160px] lg:max-w-[180px] overflow-hidden rounded-2xl transform hover:-translate-y-1 transition-transform duration-300">
                <img
                    src="/images/iced_coffee.jpg"
                    alt="MaMa Boba Coffee"
                    className="w-full h-auto object-contain mix-blend-multiply contrast-[1.03]"
                />
            </div>

            {/* Right Drink: Ice Chocolate */}
            <div className="relative max-w-[130px] sm:max-w-[160px] lg:max-w-[180px] overflow-hidden rounded-2xl transform hover:-translate-y-1 transition-transform duration-300">
                <img
                    src="/images/ice_chocolate.jpg"
                    alt="MaMa Ice Chocolate"
                    className="w-full h-auto object-contain mix-blend-multiply contrast-[1.03]"
                />
            </div>
        </div>
    );
};
