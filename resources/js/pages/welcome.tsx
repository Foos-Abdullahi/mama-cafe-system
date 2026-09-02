import { Head, Link } from '@inertiajs/react';
import { CafeHero } from '@/components/cafe/CafeHero';
import { CafeFooter } from '@/components/cafe/CafeFooter';
import { MobileOnboardingCarousel } from '@/components/cafe/MobileOnboardingCarousel';
import { login } from '@/routes';

export default function Welcome() {
    return (
        <>
            <Head title="MaMa Café - Premium Coffee, Boba & Ice Chocolate">
                <meta
                    name="description"
                    content="Experience the finest handcrafted coffee, rich boba teas, and signature ice chocolate at MaMa Café. Made with love for great taste."
                />
            </Head>

            {/* Main Outer Canvas - Full Width Cream Parchment */}
            <div className="relative min-h-screen overflow-x-hidden bg-[#2B1A16] font-sans text-[#2B1A16] antialiased selection:bg-[#B98A35] selection:text-[#2B1A16]">
                {/* MOBILE ONLY VIEW (Swipeable step carousel -> slide-out to left -> login page) */}
                <div className="block flex-grow sm:hidden">
                    <MobileOnboardingCarousel loginUrl={login.url()} />
                </div>

                <Link
                    href={login()}
                    className="absolute top-4 right-4 z-20 hidden rounded-full bg-[#B98A35] px-5 py-2 text-sm font-extrabold text-[#2B1A16] shadow-md transition-colors hover:bg-[#E8D8C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98A35] sm:inline-flex"
                >
                    Sign In
                </Link>

                {/* TABLET & DESKTOP VIEW (Full poster -> slide-out to bottom -> login page) */}
                <div className="hidden flex-col sm:flex">
                    <main className="pt-4 sm:pt-8">
                        <CafeHero />
                    </main>
                    <CafeFooter />
                </div>
            </div>
        </>
    );
}
