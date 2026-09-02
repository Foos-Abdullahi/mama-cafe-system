import React from 'react';
import { CafeBrand } from './CafeBrand';
import { DrinkShowcase } from './DrinkShowcase';
import { WhyChooseUs } from './WhyChooseUs';

export const CafeHero: React.FC = () => {
    return (
        <section className="relative mx-auto w-full max-w-8xl bg-[#2B1A16] px-4 pt-6 select-none sm:px-6 sm:pt-10 lg:px-8">
            {/* Background Decorative Botanical & Coffee Watermarks directly on canvas */}
            <div className="pointer-events-none absolute top-2 left-8 h-36 w-36 opacity-[0.05]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full fill-[#B98A35]"
                >
                    <path d="M50 10 C30 30, 20 60, 50 90 C80 60, 70 30, 50 10 Z" />
                </svg>
            </div>
            <div className="pointer-events-none absolute top-6 right-16 h-32 w-32 rotate-45 transform opacity-[0.04]">
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full fill-[#B98A35]"
                >
                    <path d="M50 10 C30 30, 20 60, 50 90 C80 60, 70 30, 50 10 Z" />
                </svg>
            </div>

            {/* Main 3-Column Composition (Poster Layout - NO Outer Card Box) */}
            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-2">
                {/* LEFT: Main Boba Drink + Handwritten "Fresh Drinks / Good Mood" */}
                <div className="order-2 flex justify-center pt-6 lg:order-1 lg:col-span-4 lg:translate-y-8 lg:justify-start lg:pt-0">
                    <DrinkShowcase type="hero-main" />
                </div>

                {/* CENTER: Coffee Cup Icon, MaMa Café Branding & Dual Drinks */}
                <div className="order-1 flex flex-col items-center justify-center lg:order-2 lg:col-span-5 lg:border-r lg:border-dashed lg:border-[#F7F0E5]/25 lg:px-6">
                    <CafeBrand />
                    <DrinkShowcase type="hero-dual" />
                </div>

                {/* RIGHT: Why Choose Us? Benefits */}
                <div className="order-3 flex justify-center lg:col-span-3 lg:justify-end lg:pl-6">
                    <WhyChooseUs />
                </div>
            </div>
        </section>
    );
};
