import React from 'react';
import { CafeBrand } from './CafeBrand';
import { DrinkShowcase } from './DrinkShowcase';
import { WhyChooseUs } from './WhyChooseUs';

export const CafeHero: React.FC = () => {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Outer Decorative Poster Border Frame */}
            <div className="relative bg-[#FAF6EE] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border-4 border-[#3C2A21] overflow-hidden">
                
                {/* Inner Ornamental Double Border */}
                <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-[#3C2A21]/20 pointer-events-none"></div>
                
                {/* Background Subtle Coffee Leaf/Bean Watermark Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3C2A21_1px,transparent_1px)] [background-size:24px_24px]"></div>

                {/* Main Content Layout */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                    
                    {/* LEFT COLUMN: Main Boba Drink Showcase */}
                    <div className="lg:col-span-4 flex justify-center order-2 lg:order-1 pt-6 lg:pt-0">
                        <DrinkShowcase type="hero-main" />
                    </div>

                    {/* CENTER COLUMN: MaMa Café Branding & Dual Drinks */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2 lg:px-4 lg:border-r-2 lg:border-dashed lg:border-[#3C2A21]/25">
                        <CafeBrand />
                        <DrinkShowcase type="hero-dual" />
                    </div>

                    {/* RIGHT COLUMN: Why Choose Us? Benefits */}
                    <div className="lg:col-span-3 flex justify-center lg:justify-end order-3 lg:pl-4">
                        <WhyChooseUs />
                    </div>

                </div>
            </div>
        </section>
    );
};
