import React from 'react';

interface DrinkShowcaseProps {
    type?: 'hero-main' | 'hero-dual';
}

export const DrinkShowcase: React.FC<DrinkShowcaseProps> = ({ type = 'hero-main' }) => {
    if (type === 'hero-main') {
        return (
            <div className="relative flex flex-col items-center justify-center">
                {/* Handwritten Callout - Top Left from poster: "Fresh Drinks Good Mood ♥" */}
                <div className="absolute -top-12 -left-4 sm:-left-8 lg:-left-12 z-20 text-center select-none pointer-events-none transform -rotate-6 animate-fade-up">
                    <p className="font-handwriting text-3xl sm:text-4xl lg:text-5xl text-[#2B1B17] font-bold leading-tight drop-shadow-sm">
                        Fresh Drinks
                    </p>
                    <p className="font-handwriting text-3xl sm:text-4xl lg:text-5xl text-[#2B1B17] font-bold leading-tight -mt-2 flex items-center justify-center gap-1.5">
                        Good Mood <span className="text-[#2B1B17] fill-current">♥</span>
                    </p>
                    {/* Hand-drawn swirl arrow pointing directly to the cup */}
                    <div className="w-16 h-12 ml-auto -mt-1 opacity-85 text-[#2B1B17] transform rotate-12">
                        <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 15 C45 20, 75 35, 80 65" />
                            <path d="M60 62 L80 65 L82 45" />
                        </svg>
                    </div>
                </div>

                {/* Main Signature Boba Cup Showcase */}
                <div className="relative z-10 w-full max-w-[210px] sm:max-w-[250px] lg:max-w-[270px] group select-none">
                    {/* Soft ambient backlight glow */}
                    <div className="absolute inset-0 bg-radial from-[#D4AF37]/20 via-transparent to-transparent rounded-full blur-2xl transform scale-110 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Drink Image with mix-blend-multiply for clean poster blend */}
                    <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                        <img
                            src="/images/boba_drink.jpg"
                            alt="MaMa Café Signature Boba Drink"
                            className="w-full h-auto object-cover mix-blend-multiply contrast-[1.04] brightness-[0.98]"
                        />
                    </div>

                    {/* Illustrated Scattered Coffee Beans Around Base */}
                    <div className="absolute -bottom-4 -left-6 z-20 w-16 h-16 pointer-events-none opacity-95">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#3C2A21] drop-shadow-md">
                            {/* Bean 1 */}
                            <g transform="translate(20,25) rotate(30) scale(1.3)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path d="M 12 4 Q 17 18 12 32" stroke="#FAF6EE" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </g>
                            {/* Bean 2 */}
                            <g transform="translate(62,45) rotate(-35) scale(0.95)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path d="M 12 4 Q 7 18 12 32" stroke="#FAF6EE" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </g>
                        </svg>
                    </div>

                    <div className="absolute -bottom-3 -right-4 z-20 w-14 h-14 pointer-events-none opacity-90">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#2B1B17]">
                            <g transform="translate(30,20) rotate(55) scale(1.15)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path d="M 12 4 Q 16 18 12 32" stroke="#FAF6EE" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // Secondary dual drinks display (placed under center logo in hero)
    return (
        <div className="relative flex items-center justify-center gap-3 sm:gap-5 mt-4 select-none w-full">
            {/* Left Drink: Iced Boba Coffee */}
            <div className="relative max-w-[135px] sm:max-w-[165px] lg:max-w-[185px] group transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative overflow-hidden rounded-2xl shadow-lg border border-[#3C2A21]/15 bg-[#FAF6EE]/50">
                    <img
                        src="/images/iced_coffee.jpg"
                        alt="MaMa Café Iced Boba Coffee"
                        className="w-full h-auto object-contain mix-blend-multiply contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="text-center mt-1.5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#3C2A21] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#3C2A21]/20 shadow-xs">
                        Iced Boba Coffee
                    </span>
                </div>
            </div>

            {/* Right Drink: Ice Chocolate */}
            <div className="relative max-w-[135px] sm:max-w-[165px] lg:max-w-[185px] group transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative overflow-hidden rounded-2xl shadow-lg border border-[#3C2A21]/15 bg-[#FAF6EE]/50">
                    <img
                        src="/images/ice_chocolate.jpg"
                        alt="MaMa Café Signature Ice Chocolate"
                        className="w-full h-auto object-contain mix-blend-multiply contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="text-center mt-1.5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#3C2A21] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#3C2A21]/20 shadow-xs">
                        Ice Chocolate
                    </span>
                </div>
            </div>
        </div>
    );
};

