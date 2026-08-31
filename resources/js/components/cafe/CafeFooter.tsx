import React from 'react';
import { ContactInfo } from './ContactInfo';
 import { FreeTastingCard } from './FreeTastingCard';
 import { SocialLinks } from './SocialLinks';

export const CafeFooter: React.FC = () => {
    return (
        <footer className="relative w-full bg-[#1C100B] text-[#FAF6EE] overflow-hidden mt-6 shadow-2xl">
            {/* Top Vintage Gold Geometric / Damask Pattern Ribbon Border Divider */}
            <div className="w-full h-5 bg-gradient-to-r from-[#A67C52] via-[#E6C280] to-[#A67C52] relative shadow-md">
                {/* Intricate micro damask lace pattern */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2B1B17_1.5px,transparent_1.5px)] [background-size:8px_8px]"></div>
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#3C2A21]/40"></div>
                <div className="absolute inset-x-0 top-0 h-[1px] bg-[#FFFFFF]/30"></div>
            </div>

            {/* Inner Footer Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6 items-center">
                    
                    {/* LEFT COLUMN: Social Links & Brand Handle */}
                    <div className="md:col-span-3 flex justify-center md:justify-start order-2 md:order-1">
                        <SocialLinks />
                    </div>

                    {/* CENTER COLUMN: Raised Free Tasting Arched Plaque */}
                    <div className="md:col-span-4 flex justify-center order-1 md:order-2">
                        <FreeTastingCard />
                    </div>

                    {/* RIGHT COLUMN: Contact Us & Branded Takeaway Cup */}
                    <div className="md:col-span-5 flex justify-center md:justify-end order-3">
                        <ContactInfo />
                    </div>

                </div>

                {/* Bottom Copyright & Brand Signature */}
                <div className="mt-8 pt-5 border-t border-[#3C2A21]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A67C52] font-medium">
                    <p>© {new Date().getFullYear()} MaMa Café. All rights reserved. Handcrafted with love.</p>
                    <p className="font-handwriting text-lg text-[#E6C280] tracking-wider font-bold">
                        Fresh Coffee • Real Boba • Ice Chocolate
                    </p>
                </div>
            </div>
        </footer>
    );
};

