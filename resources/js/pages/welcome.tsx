import { useState, useEffect } from 'react';
import { Head, usePage, Form, Link } from '@inertiajs/react';
import { 
    Coffee, 
    Sparkles, 
    Heart, 
    Smile, 
    ChevronRight, 
    ChevronLeft, 
    User, 
    Lock, 
    ArrowRight,
    MapPin,
    Phone,
    LogIn,
    X,
    Instagram,
    Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordInput from '@/components/password-input';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: any } };
    
    // Screen responsiveness: isMobile (< 768px) vs Tablet/Desktop (>= 768px)
    const [isMobile, setIsMobile] = useState<boolean>(false);
    
    // Mobile Onboarding Slide Index: 0 = Fresh Drinks, 1 = MaMa Cafe Main, 2 = Why Choose Us, 3 = Login Slide Right
    const [mobileSlide, setMobileSlide] = useState<number>(0);
    
    // Tablet/Desktop Login Sheet State (Slide Up from Bottom)
    const [showTabletLogin, setShowTabletLogin] = useState<boolean>(false);

    // Touch gesture tracking for mobile swipe
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Ensure mobile view always starts on Slide 0 (Landing Page)
            if (mobile) {
                setMobileSlide(0);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mobile Swipe Gesture Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return;
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isMobile) return;
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!isMobile || touchStartX === null || touchEndX === null) return;
        const deltaX = touchStartX - touchEndX;
        const minSwipeDistance = 40;

        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && mobileSlide < 3) {
                // Swipe Left -> Next Slide or Login
                setMobileSlide((prev) => prev + 1);
            } else if (deltaX < 0 && mobileSlide > 0) {
                // Swipe Right -> Prev Slide
                setMobileSlide((prev) => prev - 1);
            }
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };

    return (
        <>
            <Head title="MaMa Café - Artisanal Coffee & Boba" />

            <div className="relative min-h-screen w-full bg-[#FAF7F2] text-[#4A3225] font-sans overflow-x-hidden flex flex-col justify-between">
                
                {/* GLOBAL NAVIGATION HEADER */}
                <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-[#E6DCD0] bg-[#FAF7F2]/90 backdrop-blur-md shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-900/15 p-0.5 bg-white shadow-xs">
                            <img src="/images/mama-cafe-logo.jpg" alt="MaMa Café Logo" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg font-bold text-[#5C2C16] leading-none">MaMa Café</h1>
                            <span className="text-[10px] font-semibold text-[#8C6D5B] tracking-widest uppercase">Coffee • Boba • Ice Chocolate</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A3E22] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#612F18] transition-all"
                            >
                                Dashboard <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A3E22] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#612F18] transition-all cursor-pointer"
                            >
                                <LogIn className="w-3.5 h-3.5" /> Sign In to Portal
                            </Link>
                        )}
                    </div>
                </header>

                {/* ========================================================================= */}
                {/* 1. TABLET & DESKTOP VIEW (Full 3-Panel Flyer Layout Displayed Together)    */}
                {/* ========================================================================= */}
                {!isMobile && (
                    <main className="relative flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 flex flex-col justify-center">
                        {/* THE TRI-FOLD LANDING PAGE (3 FULL COLUMNS DISPLAYED TOGETHER AT ONCE) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl bg-[#F5F0E8] border border-[#E6DCD0] p-6 md:p-8 shadow-[0_15px_50px_rgba(122,62,34,0.08)] relative overflow-hidden">
                            
                            {/* COLUMN 1 (LEFT): FRESH DRINKS & GOOD MOOD */}
                            <div className="flex flex-col justify-between items-center text-center p-5 rounded-2xl bg-white/70 border border-[#E6DCD0]/70 shadow-xs relative">
                                <div className="w-full">
                                    <span className="font-serif text-lg font-bold text-[#7A3E22] block mb-2">
                                        Fresh Drinks, Good Mood ♥
                                    </span>
                                    <div className="relative w-44 h-44 mx-auto my-3 rounded-full overflow-hidden shadow-lg border-3 border-white">
                                        <img src="/images/boba-drink.jpg" alt="Fresh Boba Drink" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-[#5C2C16]">Boba Milk Tea</h3>
                                    <p className="text-xs text-[#8C6D5B] mt-1">Rich brown sugar, tapioca pearls & fresh milk.</p>
                                </div>

                                <div className="w-full mt-6 pt-4 border-t border-[#E6DCD0] flex flex-col items-center">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A3E22] mb-1">LET'S BE FRIENDS!</span>
                                    <div className="flex items-center gap-3 text-[#7A3E22] my-1">
                                        <Instagram className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
                                        <Facebook className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-[#8C6D5B]">@MaMacofe</span>
                                </div>
                            </div>

                            {/* COLUMN 2 (CENTER): MAMA CAFE MAIN BRAND & DRINKS */}
                            <div className="flex flex-col justify-between items-center text-center p-6 rounded-2xl bg-white/90 border border-amber-900/10 shadow-sm relative">
                                <div className="w-full flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-amber-900/15 p-0.5 bg-white shadow-xs">
                                        <img src="/images/mama-cafe-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                                    </div>

                                    <h2 className="font-serif text-3xl font-extrabold text-[#5C2C16]">MaMa Café</h2>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#8C6D5B] mt-1 mb-4">
                                        COFFEE • BOBA • ICE CHOCOLATE
                                    </p>
                                    <span className="text-xs italic text-amber-800 font-serif mb-4 block">Made with Love</span>

                                    {/* Feature Drink Splashes */}
                                    <div className="grid grid-cols-2 gap-3 w-full my-2">
                                        <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E6DCD0]">
                                            <img src="/images/boba-drink.jpg" alt="Boba" className="w-full h-20 object-cover rounded-lg mb-1" />
                                            <span className="text-[10px] font-bold text-[#5C2C16] block">Boba Special</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E6DCD0]">
                                            <img src="/images/iced-chocolate.jpg" alt="Iced Chocolate" className="w-full h-20 object-cover rounded-lg mb-1" />
                                            <span className="text-[10px] font-bold text-[#5C2C16] block">Ice Chocolate</span>
                                        </div>
                                    </div>

                                    {/* Free Testing Emblem */}
                                    <div className="w-full mt-4 p-3 rounded-xl bg-amber-100/90 border border-amber-300 text-center shadow-2xs">
                                        <span className="font-serif text-xs font-bold text-[#7A3E22] block uppercase tracking-wider">
                                            ✨ THE TESTING IS FREE ✨
                                        </span>
                                        <span className="text-[10px] text-[#8C6D5B]">For All Drinks</span>
                                    </div>
                                </div>

                                <div className="w-full mt-4 pt-3 border-t border-[#E6DCD0] text-[11px] text-[#8C6D5B] flex flex-col gap-1">
                                    <span className="flex items-center justify-center gap-1 font-semibold"><Phone className="w-3.5 h-3.5 text-[#7A3E22]" /> +252 61 3399977</span>
                                    <span className="flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#7A3E22]" /> Dahablaha Bakaro, Mogadishu</span>
                                </div>
                            </div>

                            {/* COLUMN 3 (RIGHT): WHY CHOOSE US? */}
                            <div className="flex flex-col justify-between items-center text-center p-5 rounded-2xl bg-white/70 border border-[#E6DCD0]/70 shadow-xs relative">
                                <div className="w-full">
                                    <div className="inline-block px-4 py-1 rounded-full bg-[#7A3E22] text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                                        Why Choose Us?
                                    </div>

                                    <div className="flex flex-col gap-3 text-left w-full mt-2">
                                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DCD0]">
                                            <Coffee className="w-4 h-4 text-[#7A3E22] shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-[11px] text-[#5C2C16] uppercase">PREMIUM QUALITY</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">We use the best coffee beans and ingredients.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DCD0]">
                                            <Sparkles className="w-4 h-4 text-[#7A3E22] shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-[11px] text-[#5C2C16] uppercase">FRESHLY MADE</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">Every drink is freshly prepared just for you.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DCD0]">
                                            <Heart className="w-4 h-4 text-[#7A3E22] shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-[11px] text-[#5C2C16] uppercase">MADE WITH LOVE</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">We put love in every drink we make.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DCD0]">
                                            <Smile className="w-4 h-4 text-[#7A3E22] shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-[11px] text-[#5C2C16] uppercase">GREAT TASTE</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">Delicious drinks that make your day better.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowTabletLogin(true)}
                                    className="w-full mt-5 py-2.5 px-4 rounded-xl bg-[#7A3E22] hover:bg-[#612F18] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                                >
                                    Access Portal Sign In ↑
                                </button>
                            </div>

                        </div>
                    </main>
                )}

                {/* TABLET / DESKTOP SLIDE-UP BOTTOM MODAL FOR LOGIN (SLIDES UP FROM BOTTOM WITH COFFEE HERO) */}
                {!isMobile && (
                    <div 
                        className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-500 ${
                            showTabletLogin ? 'bg-black/70 backdrop-blur-xs opacity-100 pointer-events-auto' : 'bg-transparent opacity-0 pointer-events-none'
                        }`}
                        onClick={() => setShowTabletLogin(false)}
                    >
                        <div 
                            className={`w-full max-w-3xl bg-[#F5F0E8] rounded-t-3xl overflow-hidden shadow-2xl border-t border-amber-900/20 transform transition-transform duration-500 ease-out relative ${
                                showTabletLogin ? 'translate-y-0' : 'translate-y-full'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drag Handle Bar */}
                            <div className="w-12 h-1.5 bg-[#D4C5B3] rounded-full mx-auto my-3" />

                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {/* Left Coffee Image Hero inside Modal */}
                                <div className="relative hidden md:flex flex-col justify-between p-8 bg-stone-900 text-white min-h-[380px]">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-90"
                                        style={{ backgroundImage: `url('/images/coffee-bg.jpg')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                                    
                                    <div className="relative z-10">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-200 bg-black/40 px-3 py-1 rounded-full border border-amber-500/20">
                                            MaMa Café Portal
                                        </span>
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="font-serif text-2xl font-bold leading-tight">Elevate the Art of Coffee.</h3>
                                        <p className="text-xs text-amber-100/80 mt-1 font-light">Streamlined operations for the modern coffee house.</p>
                                    </div>
                                </div>

                                {/* Right Login Form inside Modal */}
                                <div className="p-6 md:p-8 flex flex-col justify-between relative bg-[#F5F0E8]">
                                    <button 
                                        onClick={() => setShowTabletLogin(false)} 
                                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-200/50 text-[#7A3E22] transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex flex-col items-center text-center mb-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-900/15 p-0.5 bg-white shadow-xs mb-2">
                                            <img src="/images/mama-cafe-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-[#5C2C16]">MaMa Café Portal</h3>
                                        <p className="text-xs text-[#8C6D5B]">Sign in to access admin panel.</p>
                                    </div>

                                    <InlineLoginForm />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 2. MOBILE ONLY VIEW (3 Onboarding Slides + Slide-Right Login Page)        */}
                {/* ========================================================================= */}
                {isMobile && (
                    <main 
                        className="relative flex-1 w-full overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* HORIZONTAL SWIPE TRACK (4 Panels: Slide 0, 1, 2, and 3=Login with Coffee Hero) */}
                        <div 
                            className="flex h-full w-[400%] transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${mobileSlide * 25}%)` }}
                        >
                            {/* MOBILE SLIDE 0: FRESH DRINKS & GOOD MOOD */}
                            <div className="w-1/4 h-full flex flex-col justify-between p-6 overflow-y-auto">
                                <div className="flex flex-col items-center text-center my-auto">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#7A3E22] mb-2">Fresh Drinks, Good Mood ♥</span>
                                    <div className="relative w-52 h-52 my-3 rounded-full overflow-hidden shadow-xl border-4 border-white">
                                        <img src="/images/boba-drink.jpg" alt="Boba" className="w-full h-full object-cover" />
                                    </div>
                                    <h2 className="font-serif text-2xl font-bold text-[#5C2C16]">Signature Boba Tea</h2>
                                    <p className="text-xs text-[#8C6D5B] mt-2 max-w-xs">Handcrafted boba tea topped with rich brown sugar, tapioca pearls, and fresh milk.</p>
                                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#7A3E22]">
                                        <Instagram className="w-4 h-4" /> @MaMacofe
                                    </div>
                                </div>
                            </div>

                            {/* MOBILE SLIDE 1: MAMA CAFE MAIN BRAND */}
                            <div className="w-1/4 h-full flex flex-col justify-between p-6 overflow-y-auto">
                                <div className="flex flex-col items-center text-center my-auto">
                                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border border-amber-900/15 p-0.5 bg-white shadow-xs">
                                        <img src="/images/mama-cafe-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <h2 className="font-serif text-3xl font-extrabold text-[#5C2C16]">MaMa Café</h2>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[#8C6D5B] mt-1 mb-3">COFFEE • BOBA • ICE CHOCOLATE</p>
                                    
                                    <div className="w-full p-4 rounded-2xl bg-amber-100/90 border border-amber-300 text-center my-3">
                                        <span className="font-serif text-xs font-bold text-[#7A3E22] block uppercase tracking-wider">✨ THE TESTING IS FREE ✨</span>
                                        <span className="text-[11px] text-[#8C6D5B]">For All Drinks at Mogadishu Branch</span>
                                    </div>

                                    <div className="mt-4 text-xs text-[#8C6D5B] flex flex-col gap-1">
                                        <span className="flex items-center justify-center gap-1 font-semibold"><Phone className="w-3.5 h-3.5 text-[#7A3E22]" /> +252 61 3399977</span>
                                        <span className="flex items-center justify-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#7A3E22]" /> Dahablaha Bakaro Mogadishu</span>
                                    </div>
                                </div>
                            </div>

                            {/* MOBILE SLIDE 2: WHY CHOOSE US? */}
                            <div className="w-1/4 h-full flex flex-col justify-between p-6 overflow-y-auto">
                                <div className="flex flex-col items-center text-center my-auto w-full">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#7A3E22] mb-1">Why Choose Us?</span>
                                    <h3 className="font-serif text-2xl font-bold text-[#5C2C16] mb-4">Crafted for Quality</h3>

                                    <div className="flex flex-col gap-2.5 w-full text-left max-w-xs">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E6DCD0]">
                                            <Coffee className="w-4 h-4 text-[#7A3E22] shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-xs text-[#5C2C16]">PREMIUM QUALITY</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">Best coffee beans & ingredients.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E6DCD0]">
                                            <Sparkles className="w-4 h-4 text-[#7A3E22] shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-xs text-[#5C2C16]">FRESHLY MADE</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">Freshly prepared just for you.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E6DCD0]">
                                            <Heart className="w-4 h-4 text-[#7A3E22] shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-xs text-[#5C2C16]">MADE WITH LOVE</h4>
                                                <p className="text-[10px] text-[#8C6D5B]">We put love in every drink.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MOBILE SLIDE 3: LOGIN PAGE (SLIDES IN FROM RIGHT WITH COFFEE HERO HEADER) */}
                            <div className="w-1/4 h-full flex flex-col justify-center items-center p-4 overflow-y-auto bg-[#F9F6F0]">
                                <div className="w-full max-w-[360px] rounded-2xl bg-[#F5F0E8] overflow-hidden shadow-lg border border-[#E6DCD0] flex flex-col items-center">
                                    {/* Top Coffee Image Banner */}
                                    <div className="relative w-full h-24 overflow-hidden bg-stone-900">
                                        <img src="/images/coffee-bg.jpg" alt="Coffee Pour" className="w-full h-full object-cover opacity-85" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8] via-black/40 to-transparent" />
                                    </div>

                                    <div className="p-6 pt-0 w-full -mt-6 relative z-10 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border border-amber-900/15 p-0.5 bg-white shadow-md">
                                            <img src="/images/mama-cafe-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-[#5C2C16] text-center">MaMa Café Portal</h3>
                                        <p className="text-[11px] text-[#8C6D5B] mt-0.5 mb-4 text-center">Sign in to access admin panel.</p>

                                        <InlineLoginForm />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                )}

                {/* MOBILE BOTTOM CONTROLS (PAGINATION DOTS & NEXT BUTTON) */}
                {isMobile && (
                    <footer className="relative z-30 flex items-center justify-between px-6 py-4 border-t border-[#E6DCD0] bg-[#FAF7F2]/90 backdrop-blur-md">
                        <button
                            onClick={() => setMobileSlide((prev) => Math.max(0, prev - 1))}
                            disabled={mobileSlide === 0}
                            className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                                mobileSlide === 0 ? 'opacity-30 text-stone-400' : 'text-[#7A3E22]'
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        {/* Pagination Dots (3 Onboarding Dots + 1 Login Dot) */}
                        <div className="flex items-center gap-2">
                            {[0, 1, 2, 3].map((index) => (
                                <button
                                    key={index}
                                    onClick={() => setMobileSlide(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        mobileSlide === index 
                                            ? 'w-6 h-2 bg-[#7A3E22]' 
                                            : 'w-2 h-2 bg-[#D4C5B3]'
                                    }`}
                                />
                            ))}
                        </div>

                        {mobileSlide < 3 ? (
                            <button
                                onClick={() => setMobileSlide((prev) => prev + 1)}
                                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#7A3E22]"
                            >
                                {mobileSlide === 2 ? 'Sign In →' : 'Next'} <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setMobileSlide(0)}
                                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#7A3E22]"
                            >
                                Replay
                            </button>
                        )}
                    </footer>
                )}

            </div>
        </>
    );
}

// INLINE LOGIN FORM COMPONENT (TypeScript, Inertia.js, Tailwind CSS, Shadcn UI)
function InlineLoginForm() {
    return (
        <Form
            {...store.form()}
            resetOnSuccess={['password']}
            className="flex flex-col gap-3.5 w-full"
        >
            {({ processing, errors }) => (
                <>
                    {/* USERNAME FIELD */}
                    <div className="grid gap-1 text-left w-full">
                        <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B49]">
                            USERNAME
                        </Label>
                        <div className="relative w-full">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7E6E] z-10 pointer-events-none" />
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="Enter your username"
                                className="pl-10 pr-4 py-2 h-10 bg-[#F5F0E8] border border-[#E0D5C5] focus:border-[#7A3E22] focus:ring-1 focus:ring-[#7A3E22] text-[#4A3225] placeholder:text-[#B5A499] rounded-lg text-sm transition-all w-full"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* PASSWORD FIELD */}
                    <div className="grid gap-1 text-left w-full">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-[#7A5B49]">
                                PASSWORD
                            </Label>
                            <a
                                href={request()}
                                className="text-xs font-semibold text-[#7A3E22] hover:text-[#58250F] underline-offset-4 hover:underline"
                            >
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative w-full">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7E6E] z-10 pointer-events-none" />
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="pl-10 pr-10 py-2 h-10 bg-[#F5F0E8] border border-[#E0D5C5] focus:border-[#7A3E22] focus:ring-1 focus:ring-[#7A3E22] text-[#4A3225] placeholder:text-[#B5A499] rounded-lg text-sm transition-all w-full"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* REMEMBER ME OPTION */}
                    <div className="flex items-center space-x-2.5 pt-0.5">
                        <Checkbox
                            id="remember"
                            name="remember"
                            className="border-[#D4C5B3] data-[state=checked]:bg-[#7A3E22] data-[state=checked]:border-[#7A3E22]"
                        />
                        <Label htmlFor="remember" className="text-xs font-medium text-[#7A5B49] cursor-pointer">
                            Remember me
                        </Label>
                    </div>

                    {/* SIGN IN BUTTON */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-1 h-10 bg-[#7A3E22] hover:bg-[#612F18] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] border-none cursor-pointer"
                    >
                        {processing ? (
                            <Spinner className="w-4 h-4 text-white" />
                        ) : (
                            <>
                                SIGN IN <ArrowRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </Button>

                    <div className="relative w-full my-2 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#E6DCD0]" />
                        </div>
                        <span className="relative bg-[#F5F0E8] px-3 text-[10px] font-medium text-[#A38B7C] tracking-wide uppercase">
                            Authorized Personnel Only
                        </span>
                    </div>
                </>
            )}
        </Form>
    );
}
