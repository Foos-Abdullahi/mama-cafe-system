import React from 'react';
import { CafeBrand } from './CafeBrand';
import { DrinkShowcase } from './DrinkShowcase';
import { WhyChooseUs } from './WhyChooseUs';

export const CafeHero: React.FC = () => {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 select-none">
            {/* Outer Decorative Poster Border Frame */}
            <div className="relative bg-[#FAF5EB] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border-[3.5px] border-[#3C2A21] overflow-hidden">
                
                {/* Inner Ornamental Double Border Line */}
                <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#3C2A21]/25 pointer-events-none"></div>

                {/* Subtle Botanical Coffee Leaves & Beans Background Watermark */}
                <div className="absolute top-4 left-6 w-32 h-32 opacity-[0.04] pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#3C2A21]">
                        <path d="M50 10 C30 30, 20 60, 50 90 C80 60, 70 30, 50 10 Z M50 15 L50 85" stroke="#3C2A21" strokeWidth="2" fill="none" />
                    </svg>
                </div>
                <div className="absolute top-8 right-12 w-28 h-28 opacity-[0.04] pointer-events-none transform rotate-45">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#3C2A21]">
                        <path d="M50 10 C30 30, 20 60, 50 90 C80 60, 70 30, 50 10 Z" fill="#3C2A21" />
                    </svg>
                </div>
                <div className="absolute bottom-6 left-1/3 w-36 h-36 opacity-[0.03] pointer-events-none transform -rotate-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#3C2A21]">
                        <ellipse cx="50" cy="50" rx="30" ry="40" />
                    </svg>
                </div>

                {/* Main 3-Column Content Layout */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
                    
                    {/* LEFT COLUMN: Main Boba Drink with Handwritten Callout */}
                    <div className="lg:col-span-4 flex justify-center order-2 lg:order-1 pt-8 lg:pt-0">
                        <DrinkShowcase type="hero-main" />
                    </div>

                    {/* CENTER COLUMN: MaMa Café Branding & Dual Drinks (Iced Coffee + Ice Chocolate) */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 lg:px-4 lg:border-r-2 lg:border-dashed lg:border-[#3C2A21]/30">
                        <CafeBrand />
                        <DrinkShowcase type="hero-dual" />
                    </div>

                    {/* RIGHT COLUMN: Why Choose Us? 4 Core Benefits */}
                    <div className="lg:col-span-3 flex justify-center lg:justify-end order-3 lg:pl-6">
                        <WhyChooseUs />
                    </div>

                </div>
            </div>
        </section>
    );
};

