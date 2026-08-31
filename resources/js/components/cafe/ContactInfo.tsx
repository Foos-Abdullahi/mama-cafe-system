import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export const ContactInfo: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 w-full select-none">
            {/* Contact details */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <h3 className="text-xs sm:text-sm font-sans font-extrabold tracking-[0.2em] text-[#FAF6EE] uppercase mb-2.5">
                    CONTACT US
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-[#E6C280] font-medium">
                    {/* Phone / WhatsApp */}
                    <a
                        href="tel:+252613399977"
                        className="flex items-center justify-center sm:justify-start gap-2.5 hover:text-[#FAF6EE] transition-colors group"
                    >
                        <div className="w-6 h-6 rounded-full bg-[#3C2A21] border border-[#A67C52] flex items-center justify-center text-[#E6C280] group-hover:scale-110 transition-transform">
                            <Phone className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-[#FAF6EE] tracking-wide">
                            +252 61 3399977
                        </span>
                    </a>

                    {/* Location */}
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 max-w-xs">
                        <div className="w-6 h-6 rounded-full bg-[#3C2A21] border border-[#A67C52] flex items-center justify-center text-[#E6C280] shrink-0">
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm text-[#E6C280]/90">
                            Dahablaha Bakaro Mogadishu
                        </span>
                    </div>
                </div>

                {/* Thank you note */}
                <p className="font-handwriting text-xl sm:text-2xl text-[#FAF6EE] italic mt-2.5 font-bold tracking-wide">
                    Thank you for supporting us!
                </p>
            </div>

            {/* Takeaway Coffee Cup Artwork with Leaf Accent */}
            <div className="relative shrink-0 w-28 sm:w-36 lg:w-44 transform hover:scale-105 transition-transform duration-300">
                <img
                    src="/images/cup.png"
                    alt="MaMa Café Branded Takeaway Cup"
                    className="w-full h-auto object-contain filter drop-shadow-2xl"
                />
            </div>
        </div>
    );
};

