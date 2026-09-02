import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export const ContactInfo: React.FC = () => {
    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 select-none sm:flex-row sm:items-center">
            {/* Contact details */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <h3 className="mb-1.5 font-sans text-xs font-extrabold tracking-[0.2em] text-[#FAF6EE] uppercase sm:text-sm">
                    CONTACT US
                </h3>

                <div className="space-y-1 text-xs font-medium text-[#E6C280] sm:text-sm">
                    {/* Phone / WhatsApp */}
                    <a
                        href="tel:+252613399977"
                        className="group flex items-center justify-center gap-2.5 transition-colors hover:text-[#FAF6EE] sm:justify-start"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#A67C52] bg-[#3C2A21] text-[#E6C280] transition-transform group-hover:scale-110">
                            <Phone className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-semibold tracking-wide text-[#FAF6EE] sm:text-sm">
                            +252 61 3399977
                        </span>
                    </a>

                    {/* Location */}
                    <div className="flex max-w-xs items-center justify-center gap-2.5 sm:justify-start">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#A67C52] bg-[#3C2A21] text-[#E6C280]">
                            <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-medium text-[#E6C280]/90 sm:text-sm">
                            Dahablaha Bakaro Mogadishu
                        </span>
                    </div>
                </div>

                {/* Thank you note */}
                <p className="mt-1.5 font-handwriting text-lg font-bold tracking-wide text-[#FAF6EE] italic sm:text-xl">
                    Thank you for supporting us!
                </p>
            </div>

            {/* Takeaway Coffee Cup Artwork with Leaf Accent */}
            <div className="relative w-20 shrink-0 transform transition-transform duration-300 hover:scale-105 sm:w-28 lg:w-36">
                <img
                    src="/images/cup.png"
                    alt="MaMa Café Branded Takeaway Cup"
                    className="h-auto w-full object-contain drop-shadow-2xl filter"
                />
            </div>
        </div>
    );
};
