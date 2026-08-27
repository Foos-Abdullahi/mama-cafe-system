import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
import { CafeBrand } from './CafeBrand';
import { DrinkShowcase } from './DrinkShowcase';
import { WhyChooseUs } from './WhyChooseUs';
import { FreeTastingCard } from './FreeTastingCard';
import { ContactInfo } from './ContactInfo';

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
            // Last step -> Trigger Slide Right/Left Exit to Login Page
            navigateToLogin();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Touch Swipe Handlers for smooth mobile swiping
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (diff > 50) {
            // Swiped left -> next
            handleNext();
        } else if (diff < -50) {
            // Swiped right -> prev
            handlePrev();
        }
        setTouchStartX(null);
    };

    return (
        <div 
            className={`flex flex-col justify-between min-h-[calc(100vh-60px)] px-4 py-4 select-none transition-all ${
                isExiting ? 'animate-slide-out-left' : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Top Step Progress Bar & Indicators */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                currentStep === index
                                    ? 'w-8 bg-[#2B1B17]'
                                    : 'w-2 bg-[#2B1B17]/20 hover:bg-[#2B1B17]/40'
                            }`}
                        />
                    ))}
                </div>
                <span className="text-xs font-bold text-[#A67C52] tracking-wider uppercase">
                    Step {currentStep + 1} of {totalSteps}
                </span>
            </div>

            {/* Slide Content Card Frame */}
            <div className="relative flex-grow flex items-center justify-center bg-[#FAF6EE] border-2 border-[#3C2A21] rounded-3xl p-5 shadow-xl overflow-hidden my-2">
                
                {/* Inner Border Accent */}
                <div className="absolute inset-2 rounded-2xl border border-[#3C2A21]/15 pointer-events-none"></div>

                {/* STEP 0: Welcome & Branding */}
                {currentStep === 0 && (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-up w-full py-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2B1B17] text-[#D4AF37] rounded-full text-xs font-bold mb-4 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Welcome to MaMa Café</span>
                        </div>

                        <CafeBrand />

                        <div className="mt-4 w-full">
                            <DrinkShowcase type="hero-dual" />
                        </div>

                        <p className="font-handwriting text-2xl text-[#3C2A21] font-semibold mt-4">
                            Swipe left to explore our menu! 👉
                        </p>
                    </div>
                )}

                {/* STEP 1: Fresh Drinks Showcase */}
                {currentStep === 1 && (
                    <div className="flex flex-col items-center justify-center animate-fade-up w-full py-2">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#2B1B17] text-[#FAF6EE] rounded-full text-xs font-extrabold uppercase tracking-widest mb-6">
                            <span>Freshly Prepared</span>
                        </div>

                        <DrinkShowcase type="hero-main" />

                        <div className="mt-6 text-center max-w-xs">
                            <h3 className="font-serif-title text-2xl font-bold text-[#2B1B17]">
                                Real Boba & Milk Tea
                            </h3>
                            <p className="text-xs text-[#4A382D] mt-1 font-medium leading-relaxed">
                                Handcrafted with rich espresso, premium boba pearls, and pure cocoa goodness.
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

                {/* STEP 3: Free Tasting & Go to Login */}
                {currentStep === 3 && (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-up w-full py-2 space-y-6">
                        <FreeTastingCard />

                        <div className="bg-[#2B1B17] text-[#FAF6EE] p-4 rounded-2xl border border-[#D4AF37] w-full max-w-xs shadow-md">
                            <h4 className="font-serif-title font-bold text-base text-[#E6C280] mb-1">
                                Ready to Order?
                            </h4>
                            <p className="text-xs text-[#FAF6EE]/80 leading-snug">
                                Log in to your account now to claim your free tasting & place your order!
                            </p>
                        </div>

                        <div className="w-full max-w-xs">
                            <ContactInfo />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls / Action Bar */}
            <div className="flex items-center justify-between gap-4 mt-4 pt-2">
                {/* Back Button */}
                {currentStep > 0 ? (
                    <button
                        onClick={handlePrev}
                        className="flex items-center gap-1 text-sm font-bold text-[#3C2A21] px-4 py-2.5 rounded-full border border-[#3C2A21]/30 hover:bg-[#3C2A21]/10 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                ) : (
                    <button
                        onClick={navigateToLogin}
                        className="text-xs font-bold text-[#A67C52] hover:text-[#2B1B17] px-2 py-2 underline"
                    >
                        Skip to Login
                    </button>
                )}

                {/* Next / Login Button */}
                <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2B1B17] hover:bg-[#3C2A21] text-[#FAF6EE] text-sm font-extrabold px-6 py-3 rounded-full shadow-lg border border-[#D4AF37] transition-all duration-300 active:scale-95 cursor-pointer"
                >
                    <span>{currentStep === totalSteps - 1 ? 'Go to Login Now' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
            </div>
        </div>
    );
};
