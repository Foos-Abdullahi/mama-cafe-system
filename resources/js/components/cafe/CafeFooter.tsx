import React from 'react';
import { ContactInfo } from './ContactInfo';
import { FreeTastingCard } from './FreeTastingCard';
import { SocialLinks } from './SocialLinks';

export const CafeFooter: React.FC = () => {
    return (
        <footer className="relative w-full bg-[#2B1B17] text-[#FAF6EE] overflow-hidden mt-8">
            {/* Top Vintage Gold Pattern Border Divider */}
            <div className="w-full h-4 bg-gradient-to-r from-[#A67C52] via-[#D4AF37] to-[#A67C52] relative shadow-inner">
                {/* Micro pattern overlay */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2B1B17_1px,transparent_1px)] [background-size:6px_6px]"></div>
            </div>

            {/* Inner Footer Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6 items-center">
                    
                    {/* LEFT: Social Section */}
                    <div className="md:col-span-3 flex justify-center md:justify-start order-2 md:order-1">
                        <SocialLinks />
                    </div>

                    {/* CENTER: Free Tasting Card Plaque */}
                    <div className="md:col-span-4 flex justify-center order-1 md:order-2">
                        <FreeTastingCard />
                    </div>

                    {/* RIGHT: Contact Us & Takeaway Cup */}
                    <div className="md:col-span-5 flex justify-center md:justify-end order-3">
                        <ContactInfo />
                    </div>

                </div>

                {/* Bottom Copyright bar */}
                <div className="mt-10 pt-6 border-t border-[#4A3228] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A67C52] font-medium">
                    <p>© {new Date().getFullYear()} MaMa Café. Made with love for coffee & boba lovers.</p>
                    <p className="font-handwriting text-base text-[#E6C280]">Fresh Coffee • Boba • Ice Chocolate</p>
                </div>
            </div>
        </footer>
    );
};
