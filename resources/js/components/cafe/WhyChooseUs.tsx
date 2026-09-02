import React from 'react';
import { Heart, Smile } from 'lucide-react';
import { BenefitItem } from './BenefitItem';

// Custom Coffee Bean SVG icon for Premium Quality
const CoffeeBeanIcon: React.FC<{ className?: string }> = ({
    className = 'w-5 h-5',
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <ellipse cx="12" cy="12" rx="8" ry="10" />
        <path d="M12 2 C15 7, 9 17, 12 22" />
    </svg>
);

// Custom Steaming Cup SVG icon for Freshly Made
const SteamingCupIcon: React.FC<{ className?: string }> = ({
    className = 'w-5 h-5',
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

export const WhyChooseUs: React.FC = () => {
    const benefits = [
        {
            icon: CoffeeBeanIcon,
            title: 'PREMIUM QUALITY',
            description:
                'We use the best coffee beans and high-quality ingredients.',
        },
        {
            icon: SteamingCupIcon,
            title: 'FRESHLY MADE',
            description: 'Every drink is freshly prepared just for you.',
        },
        {
            icon: Heart,
            title: 'MADE WITH LOVE',
            description: 'We put love in every drink we make.',
        },
        {
            icon: Smile,
            title: 'GREAT TASTE',
            description: 'Delicious drinks that make your day better.',
        },
    ];

    return (
        <div className="flex w-full max-w-sm flex-col items-start">
            {/* Dark brush / ribbon header: "Why Choose Us?" */}
            <div className="relative mb-5 sm:mb-6">
                <div className="flex -rotate-1 transform items-center justify-center rounded-full border border-[#F7F0E5] bg-[#B98A35] px-8 py-2 text-[#2B1A16] shadow-sm">
                    <h3 className="font-handwriting text-3xl font-bold tracking-wide text-[#2B1A16] italic sm:text-4xl">
                        Why Choose Us?
                    </h3>
                </div>
            </div>

            {/* Benefit items list */}
            <div className="w-full space-y-4 sm:space-y-5">
                {benefits.map((b, idx) => (
                    <BenefitItem
                        key={idx}
                        icon={b.icon}
                        title={b.title}
                        description={b.description}
                    />
                ))}
            </div>
        </div>
    );
};
