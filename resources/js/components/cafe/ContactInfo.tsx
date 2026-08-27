import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export const ContactInfo: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 w-full">
            {/* Contact details */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left select-none">
                <h3 className="text-sm sm:text-base font-sans font-extrabold tracking-widest text-[#FAF6EE] uppercase mb-3">
                    CONTACT US
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm text-[#E6C280] font-medium">
                    {/* Phone / WhatsApp */}
                    <a
                        href="tel:+252613399977"
                        className="flex items-center gap-2 hover:text-[#FAF6EE] transition-colors"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#3C2A21] border border-[#A67C52] flex items-center justify-center text-[#E6C280]">
                            <Phone className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm">+252 61 3399977</span>
                    </a>

                    {/* Location */}
                    <div className="flex items-start gap-2 max-w-xs">
                        <div className="w-7 h-7 rounded-full bg-[#3C2A21] border border-[#A67C52] flex items-center justify-center text-[#E6C280] shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Dahablaha Bakaro Mogadishu</span>
                    </div>
                </div>

                {/* Thank you note */}
                <p className="font-handwriting text-xl sm:text-2xl text-[#FAF6EE] italic mt-3 font-semibold tracking-wide">
                    Thank you for supporting us!
                </p>
            </div>

            {/* Takeaway Coffee Cup Illustration - Significantly Enlarged */}
            <div className="relative shrink-0 w-36 sm:w-48 lg:w-56 transform hover:scale-105 transition-transform duration-300">
                <img
                    src="/images/cup.png"
                    alt="MaMa Café Takeaway Cup"
                    className="w-full h-auto object-contain filter drop-shadow-2xl"
                />
            </div>
        </div>
    );
};
