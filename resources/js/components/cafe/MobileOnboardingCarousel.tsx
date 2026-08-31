import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeft, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { CafeBrand } from './CafeBrand';
import { DrinkShowcase } from './DrinkShowcase';
import { WhyChooseUs } from './WhyChooseUs';
import { FreeTastingCard } from './FreeTastingCard';
import { ContactInfo } from './ContactInfo';
import { SocialLinks } from './SocialLinks';

interface MobileOnboardingCarouselProps {
    loginUrl: string;
}

export const MobileOnboardingCarousel: React.FC<MobileOnboardingCarouselProps> = ({ loginUrl }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [isExiting, setIsExiting] = useState(false);

    const totalSteps = 4;

    const navigateToLogin = () => {
        setIsExiting(true);
        setTimeout(() => {
            router.visit(loginUrl);
        }, 350);
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            navigateToLogin();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Touch Swipe Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (diff > 50) {
            handleNext();
        } else if (diff < -50) {
            handlePrev();
        }
        setTouchStartX(null);
    };

    return (
        <div 
            className={`flex flex-col justify-between min-h-[calc(100vh-70px)] px-4 py-3 select-none transition-all ${
                isExiting ? 'animate-slide-out-left' : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Top Step Progress Bar & Indicators */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentStep(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentStep === index
                                    ? 'w-8 bg-[#2B1B17]'
                                    : 'w-2.5 bg-[#2B1B17]/25 hover:bg-[#2B1B17]/40'
                            }`}
                            aria-label={`Go to step ${index + 1}`}
                        />
                    ))}
                </div>
                <span className="text-[11px] font-extrabold text-[#A67C52] tracking-wider uppercase">
                    Step {currentStep + 1} of {totalSteps}
                </span>
            </div>

            {/* Slide Content Card Frame */}
            <div className="relative flex-grow flex items-center justify-center bg-[#FAF5EB] border-[3px] border-[#3C2A21] rounded-3xl p-5 shadow-xl overflow-hidden my-1">
                
                {/* Inner Ornamental Border */}
                <div className="absolute inset-2 rounded-2xl border border-[#3C2A21]/20 pointer-events-none"></div>

                {/* STEP 0: Welcome & Branding + Dual Drinks */}
                {currentStep === 0 && (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-up w-full py-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2B1B17] text-[#E6C280] rounded-full text-xs font-bold mb-3 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Welcome to MaMa Café</span>
                        </div>

                        <CafeBrand />

                        <div className="mt-3 w-full">
                            <DrinkShowcase type="hero-dual" />
                        </div>

                        <p className="font-handwriting text-xl text-[#3C2A21] font-bold mt-3">
                            Swipe left to explore our story! 👉
                        </p>
                    </div>
                )}

                {/* STEP 1: Signature Boba Drink Showcase */}
                {currentStep === 1 && (
                    <div className="flex flex-col items-center justify-center animate-fade-up w-full py-2">
                        <DrinkShowcase type="hero-main" />

                        <div className="mt-6 text-center max-w-xs">
                            <h3 className="font-serif-title text-xl font-bold text-[#2B1B17]">
                                Fresh Drinks, Good Mood
                            </h3>
                            <p className="text-xs text-[#3C2A21]/80 mt-1 font-medium leading-relaxed">
                                Handcrafted boba tea, iced chocolate bliss, and rich single-origin espresso drinks.
                            </p>
                        </div>
                    </div>
                )}

                {/* STEP 2: Why Choose Us */}
                {currentStep === 2 && (
                    <div className="flex flex-col items-center justify-center animate-fade-up w-full py-2">
                        <WhyChooseUs />
                    </div>
                )}

                {/* STEP 3: Free Tasting & Contact */}
                {currentStep === 3 && (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-up w-full py-2 space-y-4">
                        <FreeTastingCard />

                        <div className="w-full max-w-xs">
                            <ContactInfo />
                        </div>

                        <div className="pt-1">
                            <SocialLinks />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls / Action Bar */}
            <div className="flex items-center justify-between gap-3 mt-3 pt-1">
                {/* Back Button */}
                {currentStep > 0 ? (
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center gap-1 text-xs font-bold text-[#3C2A21] px-4 py-2.5 rounded-full border border-[#3C2A21]/30 hover:bg-[#3C2A21]/10 transition-colors"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={navigateToLogin}
                        className="text-xs font-bold text-[#A67C52] hover:text-[#2B1B17] px-2 py-2 underline"
                    >
                        Skip to Login
                    </button>
                )}

                {/* Next / Order Button */}
                <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2B1B17] hover:bg-[#3C2A21] text-[#FAF6EE] text-xs sm:text-sm font-extrabold px-5 py-3 rounded-full shadow-lg border border-[#D4AF37] transition-all duration-300 active:scale-95 cursor-pointer"
                >
                    <span>{currentStep === totalSteps - 1 ? 'Order / Sign In' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
            </div>
        </div>
    );
};

