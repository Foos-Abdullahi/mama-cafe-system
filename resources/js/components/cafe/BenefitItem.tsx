import React from 'react';

interface BenefitItemProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

export const BenefitItem: React.FC<BenefitItemProps> = ({
    icon: Icon,
    title,
    description,
}) => {
    return (
        <div className="group flex items-center gap-3.5 select-none sm:gap-4">
            {/* Simple Circular Icon Outline Container */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#F7F0E5] bg-[#2B1A16] text-[#F7F0E5] shadow-xs transition-all duration-300 group-hover:bg-[#B98A35] group-hover:text-[#2B1A16] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 text-[#F7F0E5] transition-colors group-hover:text-[#2B1A16] sm:h-6 sm:w-6" />
            </div>

            {/* Benefit Titles & Descriptions */}
            <div className="flex flex-col text-left">
                <h4 className="font-sans text-xs leading-tight font-extrabold tracking-wider text-[#F7F0E5] uppercase sm:text-sm">
                    {title}
                </h4>
                <p className="mt-0.5 max-w-[210px] text-[11px] leading-snug font-medium text-[#E8D8C0]/85 sm:max-w-xs sm:text-xs">
                    {description}
                </p>
            </div>
        </div>
    );
};
