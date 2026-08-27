import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const BenefitItem: React.FC<BenefitItemProps> = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="flex items-start gap-4 group">
            {/* Circular Icon Container */}
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#2B1B17] flex items-center justify-center bg-[#FAF6EE] group-hover:bg-[#2B1B17] group-hover:text-[#FAF6EE] transition-all duration-300 shadow-sm">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B1B17] group-hover:text-[#FAF6EE] transition-colors" />
            </div>

            {/* Text details */}
            <div className="flex flex-col">
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-[#2B1B17] tracking-wider uppercase">
                    {title}
                </h4>
                <p className="text-xs sm:text-sm text-[#4A382D] leading-snug font-medium max-w-xs mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    );
};
