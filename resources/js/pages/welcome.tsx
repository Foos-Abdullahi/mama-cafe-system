import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Coffee, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';
import { CafeHero } from '@/components/cafe/CafeHero';
import { CafeFooter } from '@/components/cafe/CafeFooter';
import { MobileOnboardingCarousel } from '@/components/cafe/MobileOnboardingCarousel';
import { MenuModal } from '@/components/cafe/MenuModal';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: any } };
    const [isExitingDesktop, setIsExitingDesktop] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="min-h-screen bg-[#FAF5EB] text-[#2B1B17] flex flex-col justify-between selection:bg-[#2B1B17] selection:text-[#FAF6EE] font-sans antialiased overflow-x-hidden">
                
                {/* Top Luxury Announcement / Navigation Bar */}
                <header className="sticky top-0 z-40 w-full bg-[#1C100B]/95 backdrop-blur-md text-[#FAF6EE] py-3 px-4 sm:px-8 border-b-2 border-[#D4AF37] shadow-lg transition-all">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        {/* Left Brand Badge */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#3C2A21] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                                <Coffee className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif-title font-bold text-sm tracking-wider uppercase text-[#E6C280] leading-tight">
                                    MaMa Café
                                </span>
                                <span className="text-[10px] text-[#FAF6EE]/70 font-medium -mt-0.5">
                                    Coffee • Boba • Ice Chocolate
                                </span>
                            </div>
                        </div>

                        {/* Center Tagline / Menu Trigger - Desktop */}
                        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#E6C280]">
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3C2A21] hover:bg-[#4A3228] border border-[#D4AF37]/50 text-[#FAF6EE] transition-all hover:scale-105 cursor-pointer shadow-xs"
                            >
                                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Explore Menu & Prices</span>
                            </button>

                            <div className="flex items-center gap-1.5 text-xs font-medium text-[#E6C280]/90">
                                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>The Testing Is Free For All Drinks</span>
                            </div>
                        </div>

                        {/* Right Auth / Navigation links */}
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(true)}
                                className="md:hidden inline-flex items-center gap-1 text-xs font-bold bg-[#3C2A21] text-[#E6C280] px-3 py-1.5 rounded-full border border-[#D4AF37]/40"
                            >
                                <BookOpen className="w-3 h-3" />
                                <span>Menu</span>
                            </button>

                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold bg-[#D4AF37] hover:bg-[#C5A059] text-[#2B1B17] px-4 sm:px-5 py-1.5 rounded-full transition-all duration-300 shadow-md transform hover:scale-105"
                                >
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <a
                                    href={login()}
                                    onClick={handleDesktopLoginNavigation}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold bg-[#D4AF37] hover:bg-[#C5A059] text-[#2B1B17] px-4 sm:px-5 py-1.5 rounded-full transition-all duration-300 shadow-md transform hover:scale-105 cursor-pointer"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>Order / Sign In</span>
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
                    <main className="flex-grow flex flex-col justify-center py-4 sm:py-8">
                        <CafeHero />
                    </main>
                    <CafeFooter />
                </div>

                {/* Interactive Menu Modal */}
                <MenuModal
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onOrderClick={() => router.visit(login())}
                />
            </div>
        </>
    );
}

