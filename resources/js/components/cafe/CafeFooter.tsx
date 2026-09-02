import React from 'react';
import { ContactInfo } from './ContactInfo';
import { FreeTastingCard } from './FreeTastingCard';
import { SocialLinks } from './SocialLinks';

export const CafeFooter: React.FC = () => {
    return (
        <footer className="relative mx-auto w-full max-w-8xl overflow-hidden bg-[#2B1A16] text-[#F7F0E5]">
            {/* Top Vintage Gold Pattern Border Divider */}
            <div className="relative h-2 w-full bg-gradient-to-r from-[#8C6827] via-[#B98A35] to-[#8C6827] shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#2B1A16_1px,transparent_1px)] [background-size:6px_6px] opacity-30"></div>
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#3A211A]/60"></div>
                <div className="absolute inset-x-0 top-0 h-[1px] bg-[#FAF6EE]/20"></div>
            </div>

            {/* Inner Footer Content Container */}
            <div className="mx-auto max-w-8xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 lg:gap-4">
                    {/* LEFT COLUMN: Social Links & Brand Handle */}
                    <div className="order-2 flex justify-center md:order-1 md:col-span-3 md:justify-start">
                        <SocialLinks />
                    </div>

                    {/* CENTER COLUMN: Raised Free Tasting Arched Plaque */}
                    <div className="order-1 flex justify-center md:order-2 md:col-span-4">
                        <FreeTastingCard />
                    </div>

                    {/* RIGHT COLUMN: Contact Us & Branded Takeaway Cup */}
                    <div className="order-3 flex justify-center md:col-span-5 md:justify-end">
                        <ContactInfo />
                    </div>
                </div>

                {/* Bottom Copyright & Brand Signature */}
                <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-[#3A211A] pt-3 text-xs font-medium text-[#E8D8C0]/70 sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} MaMa Café. All rights
                        reserved. Handcrafted with love.
                    </p>
                    <p className="font-handwriting text-lg font-bold tracking-wider text-[#E8D8C0]">
                        Fresh Coffee • Real Boba • Ice Chocolate
                    </p>
                </div>
            </div>
        </footer>
    );
};
