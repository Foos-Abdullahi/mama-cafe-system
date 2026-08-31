import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BenefitItemProps {
    icon: LucideIcon | React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

export const BenefitItem: React.FC<BenefitItemProps> = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="flex items-center gap-3.5 sm:gap-4 group select-none">
            {/* Circular Icon Outline Badge */}
            <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#2B1B17] flex items-center justify-center bg-[#FAF6EE] group-hover:bg-[#2B1B17] group-hover:text-[#FAF6EE] transition-all duration-300 shadow-sm group-hover:scale-105">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B1B17] group-hover:text-[#FAF6EE] transition-colors" />
            </div>

            {/* Benefit Titles & Descriptions */}
            <div className="flex flex-col text-left">
                <h4 className="font-sans font-extrabold text-xs sm:text-sm text-[#2B1B17] tracking-wider uppercase leading-tight">
                    {title}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#3C2A21]/85 leading-snug font-medium max-w-[210px] sm:max-w-xs mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    );
};

