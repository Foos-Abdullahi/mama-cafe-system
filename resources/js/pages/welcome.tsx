import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Coffee, ShoppingBag, Sparkles } from 'lucide-react';
import { CafeHero } from '@/components/cafe/CafeHero';
import { CafeFooter } from '@/components/cafe/CafeFooter';
import { MobileOnboardingCarousel } from '@/components/cafe/MobileOnboardingCarousel';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: any } };
    const [isExitingDesktop, setIsExitingDesktop] = useState(false);

    const handleDesktopLoginNavigation = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExitingDesktop(true);
        setTimeout(() => {
            router.visit(login());
        }, 350);
    };

    return (
        <>
            <Head title="MaMa Café - Premium Coffee, Boba & Ice Chocolate">
                <meta
                    name="description"
                    content="Experience the finest handcrafted coffee, rich boba teas, and signature ice chocolate at MaMa Café. Made with love for great taste."
                />
            </Head>

            {/* Main Outer Canvas */}
            <div className="min-h-screen bg-[#FAF6EE] text-[#2B1B17] flex flex-col justify-between selection:bg-[#2B1B17] selection:text-[#FAF6EE] font-sans antialiased overflow-x-hidden">
                
                {/* Top Announcement Bar / Header */}
                <header className="relative z-30 w-full bg-[#2B1B17] text-[#FAF6EE] py-2.5 px-4 sm:px-8 border-b-2 border-[#D4AF37] shadow-sm">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        {/* Left Brand Badge */}
                        <div className="flex items-center gap-2">
                            <Coffee className="w-5 h-5 text-[#D4AF37]" />
                            <span className="font-serif-title font-bold text-sm tracking-wider uppercase text-[#E6C280]">
                                MaMa Café
                            </span>
                            <span className="hidden sm:inline-block text-xs bg-[#4A3228] text-[#FAF6EE] px-2 py-0.5 rounded-full font-handwriting text-base">
                                Handmade & Fresh
                            </span>
                        </div>

                        {/* Center Tagline - Desktop */}
                        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#E6C280]/90">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Taste the Magic of Handmade Boba & Creamy Chocolate</span>
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>

                        {/* Right Auth / Navigation links */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#D4AF37] hover:bg-[#C5A059] text-[#2B1B17] px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm"
                                >
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <a
                                    href={login()}
                                    onClick={handleDesktopLoginNavigation}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold border border-[#D4AF37] text-[#E6C280] hover:bg-[#D4AF37] hover:text-[#2B1B17] px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Order Now</span>
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                {/* MOBILE ONLY VIEW (Swipeable step carousel -> slide-out to left -> login page) */}
                <div className="block sm:hidden flex-grow">
                    <MobileOnboardingCarousel loginUrl={login()} />
                </div>

                {/* TABLET & DESKTOP VIEW (Full poster -> slide-out to bottom -> login page) */}
                <div className={`hidden sm:flex flex-col flex-grow justify-between transition-all ${
                    isExitingDesktop ? 'animate-slide-out-bottom' : ''
                }`}>
                    <main className="flex-grow flex flex-col justify-center py-6 sm:py-10">
                        <CafeHero />
                    </main>
                    <CafeFooter />
                </div>
            </div>
        </>
    );
}
