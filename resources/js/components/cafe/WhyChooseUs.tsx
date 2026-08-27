import React from 'react';
import { Coffee, CupSoda, Heart, Smile } from 'lucide-react';
import { BenefitItem } from './BenefitItem';

export const WhyChooseUs: React.FC = () => {
    const benefits = [
        {
            icon: Coffee,
            title: 'PREMIUM QUALITY',
            description: 'We use the best coffee beans and high-quality ingredients.',
        },
        {
            icon: CupSoda,
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
        <div className="flex flex-col items-start w-full max-w-sm">
            {/* Ribbon / Brush pill Header */}
            <div className="relative mb-6">
                <div className="bg-[#2B1B17] text-[#FAF6EE] px-7 py-2 rounded-full shadow-md transform -rotate-1 border border-[#4A3228]">
                    <h3 className="font-handwriting text-2xl sm:text-3xl font-bold tracking-wide italic">
                        Why Choose Us?
                    </h3>
                </div>
            </div>

            {/* Benefit items list */}
            <div className="space-y-5 sm:space-y-6 w-full">
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
