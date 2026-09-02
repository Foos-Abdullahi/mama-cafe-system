import React from 'react';

interface DrinkShowcaseProps {
    type?: 'hero-main' | 'hero-dual';
}

export const DrinkShowcase: React.FC<DrinkShowcaseProps> = ({
    type = 'hero-main',
}) => {
    if (type === 'hero-main') {
        return (
            <div className="relative flex flex-col items-center justify-center select-none">
                {/* Handwritten Floating Callout: "Fresh Drinks Good Mood ♥" */}
                <div className="pointer-events-none absolute -top-14 -left-6 z-20 -rotate-6 transform text-left sm:-left-10 lg:-left-8">
                    <p className="font-handwriting text-3xl leading-none font-bold tracking-wide text-[#F7F0E5] drop-shadow-xs sm:text-4xl lg:text-5xl">
                        Fresh Drinks
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 font-handwriting text-3xl leading-none font-bold text-[#F7F0E5] sm:text-4xl lg:text-5xl">
                        Good Mood{' '}
                        <span className="inline-block scale-110 transform text-[#8B261D]">
                            ♥
                        </span>
                    </p>

                    {/* Hand-drawn swirl arrow pointing to the drink */}
                    <div className="-mt-1 ml-12 h-12 w-16 rotate-12 transform text-[#F7F0E5] opacity-85">
                        <svg
                            viewBox="0 0 100 80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 15 C45 20, 75 35, 80 65" />
                            <path d="M60 62 L80 65 L82 45" />
                        </svg>
                    </div>
                </div>

                {/* Main Boba Drink Image (Natural Product Photography - NO Card Frame) */}
                <div className="relative z-10 w-full max-w-[210px] sm:max-w-[250px] lg:max-w-[275px]">
                    <img
                        src="/images/boba_drink.jpg"
                        alt="MaMa Boba Fresh Drink"
                        className="h-auto w-full [mask-image:radial-gradient(ellipse_58%_70%_at_50%_55%,black_62%,transparent_100%)] object-contain mix-blend-multiply brightness-[0.98] contrast-[1.04] transition-transform duration-500 hover:scale-[1.02]"
                    />

                    {/* Scattered Coffee Beans Around the Base */}
                    <div className="pointer-events-none absolute -bottom-4 -left-6 z-20 h-16 w-16 opacity-90">
                        <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full fill-[#2B1A16]"
                        >
                            <g transform="translate(20,25) rotate(30) scale(1.3)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path
                                    d="M 12 4 Q 17 18 12 32"
                                    stroke="#F7F0E5"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </g>
                            <g transform="translate(62,45) rotate(-35) scale(0.95)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path
                                    d="M 12 4 Q 7 18 12 32"
                                    stroke="#F7F0E5"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </g>
                        </svg>
                    </div>

                    <div className="pointer-events-none absolute -right-4 -bottom-3 z-20 h-14 w-14 opacity-85">
                        <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full fill-[#2B1A16]"
                        >
                            <g transform="translate(30,20) rotate(55) scale(1.15)">
                                <ellipse cx="12" cy="18" rx="10" ry="14" />
                                <path
                                    d="M 12 4 Q 16 18 12 32"
                                    stroke="#F7F0E5"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // Secondary dual drinks display (placed under center logo in hero - NO Card Frames or Pill Labels)
    return (
        <div className="relative mt-4 flex w-full items-center justify-center gap-3 select-none sm:gap-5">
            {/* Left Drink: Iced Boba Coffee */}
            <div className="relative max-w-[135px] transform transition-transform duration-300 hover:-translate-y-1.5 sm:max-w-[165px] lg:max-w-[185px]">
                <img
                    src="/images/iced_coffee.jpg"
                    alt="MaMa Boba Coffee"
                    className="h-auto w-full [mask-image:radial-gradient(ellipse_60%_72%_at_50%_55%,black_62%,transparent_100%)] object-contain mix-blend-multiply brightness-[0.98] contrast-[1.04]"
                />
            </div>

            {/* Right Drink: Ice Chocolate */}
            <div className="relative max-w-[135px] transform transition-transform duration-300 hover:-translate-y-1.5 sm:max-w-[165px] lg:max-w-[185px]">
                <img
                    src="/images/ice_chocolate.jpg"
                    alt="MaMa Ice Chocolate"
                    className="h-auto w-full [mask-image:radial-gradient(ellipse_60%_72%_at_50%_55%,black_62%,transparent_100%)] object-contain mix-blend-multiply brightness-[0.98] contrast-[1.04]"
                />
            </div>
        </div>
    );
};
