import { useState, useEffect, useRef } from 'react';
import { Head, usePage, Form, Link } from '@inertiajs/react';
import { 
    Coffee, 
    Sparkles, 
    Heart, 
    Smile, 
    CheckCircle2, 
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
    Facebook,
    Share2,
    ShieldCheck
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
import { dashboard } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: any } };
    
    // State for slide index: 0 = Brand, 1 = Fresh Drinks, 2 = Why Choose Us, 3 = Login
    const [currentSlide, setCurrentSlide] = useState(0);
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
    
    // Touch gesture state
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [touchEndY, setTouchEndY] = useState<number | null>(null);

    // Detect device type / breakpoint
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setDeviceType('mobile');
            } else if (width >= 768 && width < 1024) {
                setDeviceType('tablet');
            } else {
                setDeviceType('desktop');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle touch gestures for swiping
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
        setTouchStartY(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
        setTouchEndY(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;
        const deltaX = touchStartX - touchEndX;
        const deltaY = (touchStartY ?? 0) - (touchEndY ?? 0);

        const minSwipeDistance = 40;

        // Horizontal Swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe Left -> Next Slide
                nextSlide();
            } else {
                // Swipe Right -> Prev Slide
                prevSlide();
            }
        } 
        // Vertical Swipe (Tablet bottom sheet control)
        else if (deviceType === 'tablet' && Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0 && currentSlide === 2) {
                // Swipe Up on last slide -> Open Login
                setCurrentSlide(3);
            } else if (deltaY < 0 && currentSlide === 3) {
                // Swipe Down on Login -> Close Login
                setCurrentSlide(2);
            }
        }

        setTouchStartX(null);
        setTouchStartY(null);
        setTouchEndX(null);
        setTouchEndY(null);
    };

    const nextSlide = () => {
        if (currentSlide < 3) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Determine max onboarding slides count based on layout mode
    const totalSlides = 4; // 0, 1, 2 (Onboarding) + 3 (Login)

    return (
        <>
            <Head title="Welcome to MaMa Café" />

            <div 
                className="relative min-h-screen h-screen w-full overflow-hidden bg-[#F9F6F0] text-[#4A3225] font-sans select-none flex flex-col justify-between"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* TOP HEADER / BAR */}
                <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-[#E6DCD0]/60 bg-[#F9F6F0]/80 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-900/10 shadow-sm bg-white p-0.5">
                            <img src="/images/mama-cafe-logo.jpg" alt="MaMa Café" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg font-bold text-[#5C2C16] leading-none">MaMa Café</h1>
                            <span className="text-[10px] font-semibold text-[#8C6D5B] tracking-wider uppercase">Artisanal Coffee & Boba</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7A3E22] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#612F18] transition-all"
                            >
                                Dashboard <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <button
                                onClick={() => setCurrentSlide(currentSlide === 3 ? 0 : 3)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#7A3E22]/30 bg-white/80 text-[#7A3E22] text-xs font-bold uppercase tracking-wider hover:bg-[#7A3E22] hover:text-white transition-all shadow-xs"
                            >
                                {currentSlide === 3 ? (
                                    <>Browse Menu</>
                                ) : (
                                    <><LogIn className="w-3.5 h-3.5" /> Sign In</>
                                )}
                            </button>
                        )}
                    </div>
                </header>

                {/* MAIN CAROUSEL / SLIDE CONTAINER */}
                <main className="relative flex-1 w-full overflow-hidden">
                    {/* MOBILE & DESKTOP SLIDE CAROUSEL (Horizontal Track) */}
                    <div 
                        className="flex h-full w-full transition-transform duration-500 ease-out"
                        style={{
                            transform: deviceType === 'tablet' 
                                ? `translateX(-${Math.min(currentSlide, 2) * 100}%)` 
                                : `translateX(-${currentSlide * 100}%)`
                        }}
                    >
                        {/* SLIDE 1: WELCOME & BRAND HERO */}
                        <div className="min-w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
                            <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center my-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-[#7A3E22] text-xs font-bold tracking-wider uppercase mb-6 animate-pulse">
                                    <Sparkles className="w-4 h-4 text-amber-600" /> Made with Love
                                </div>

                                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#5C2C16] tracking-tight leading-tight mb-4">
                                    MaMa Café
                                </h2>
                                
                                <p className="text-sm sm:text-base font-semibold text-[#8C6D5B] uppercase tracking-widest mb-6">
                                    COFFEE • BOBA • ICE CHOCOLATE
                                </p>

                                {/* Feature Image Showcase */}
                                <div className="relative my-4 w-48 sm:w-64 h-48 sm:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                                    <img src="/images/coffee-bg.jpg" alt="Coffee Pour" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold text-white tracking-widest uppercase">
                                        Fresh Drinks • Good Mood
                                    </span>
                                </div>

                                {/* Banner Badge */}
                                <div className="mt-6 p-4 rounded-2xl bg-[#F5F0E8] border border-[#E6DCD0] shadow-sm max-w-md w-full">
                                    <span className="block font-serif text-base font-bold text-[#7A3E22]">
                                        ✨ THE TESTING IS FREE ✨
                                    </span>
                                    <span className="text-xs text-[#8C6D5B] font-medium">For All Drinks at Our Mogadishu Branch</span>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 2: FRESH DRINKS & GOOD MOOD */}
                        <div className="min-w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
                            <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center my-auto">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#7A3E22] mb-2 flex items-center gap-1.5">
                                    <Heart className="w-4 h-4 fill-amber-600 text-amber-600" /> Fresh Drinks, Good Mood
                                </span>
                                
                                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C2C16] mb-4">
                                    Artisanal Boba & Iced Chocolate
                                </h3>

                                <div className="grid grid-cols-2 gap-4 my-4 max-w-md w-full">
                                    <div className="flex flex-col items-center p-3 rounded-2xl bg-white shadow-md border border-amber-900/10">
                                        <img src="/images/boba-drink.jpg" alt="Boba Tea" className="w-28 h-28 object-cover rounded-xl mb-2" />
                                        <span className="font-bold text-xs text-[#5C2C16]">Boba Milk Tea</span>
                                        <span className="text-[10px] text-[#8C6D5B]">Brown Sugar & Pearls</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 rounded-2xl bg-white shadow-md border border-amber-900/10">
                                        <img src="/images/iced-chocolate.jpg" alt="Iced Chocolate" className="w-28 h-28 object-cover rounded-xl mb-2" />
                                        <span className="font-bold text-xs text-[#5C2C16]">Iced Chocolate</span>
                                        <span className="text-[10px] text-[#8C6D5B]">Whipped Cream & Mallows</span>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-[#8C6D5B] max-w-md leading-relaxed my-2">
                                    Every single cup is crafted with premium coffee beans, fresh milk, and handcrafted toppings for the perfect taste.
                                </p>

                                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-[#7A3E22]">
                                    <Instagram className="w-4 h-4" /> @MaMacofe — LET'S BE FRIENDS!
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 3: WHY CHOOSE US? */}
                        <div className="min-w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
                            <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center my-auto w-full">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#7A3E22] mb-1">Why Choose Us?</span>
                                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C2C16] mb-6">Built for Excellence</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg w-full text-left">
                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-[#E6DCD0] shadow-2xs">
                                        <div className="p-2 rounded-lg bg-amber-100 text-[#7A3E22] shrink-0">
                                            <Coffee className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-[#5C2C16] uppercase">PREMIUM QUALITY</h4>
                                            <p className="text-[11px] text-[#8C6D5B]">We use the best coffee beans and high-quality ingredients.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-[#E6DCD0] shadow-2xs">
                                        <div className="p-2 rounded-lg bg-amber-100 text-[#7A3E22] shrink-0">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-[#5C2C16] uppercase">FRESHLY MADE</h4>
                                            <p className="text-[11px] text-[#8C6D5B]">Every drink is freshly prepared just for you.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-[#E6DCD0] shadow-2xs">
                                        <div className="p-2 rounded-lg bg-amber-100 text-[#7A3E22] shrink-0">
                                            <Heart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-[#5C2C16] uppercase">MADE WITH LOVE</h4>
                                            <p className="text-[11px] text-[#8C6D5B]">We put love in every drink we make.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-[#E6DCD0] shadow-2xs">
                                        <div className="p-2 rounded-lg bg-amber-100 text-[#7A3E22] shrink-0">
                                            <Smile className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-[#5C2C16] uppercase">GREAT TASTE</h4>
                                            <p className="text-[11px] text-[#8C6D5B]">Delicious drinks that make your day better.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Footer Line */}
                                <div className="mt-6 pt-4 border-t border-[#E6DCD0] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#8C6D5B] font-medium">
                                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#7A3E22]" /> +252 61 3399977</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#7A3E22]" /> Dahablaha Bakaro, Mogadishu</span>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 4: MOBILE HORIZONTAL LOGIN SLIDE (Seamless Slide from Right to Left) */}
                        {deviceType !== 'tablet' && (
                            <div className="min-w-full h-full flex flex-col justify-center items-center p-4 sm:p-8 overflow-y-auto bg-[#F9F6F0]">
                                <div className="w-full max-w-[420px] rounded-2xl bg-[#F5F0E8] p-6 sm:p-8 shadow-[0_12px_40px_rgba(122,62,34,0.08)] border border-[#E6DCD0] flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 shadow-sm border border-amber-900/10 p-0.5 bg-white flex items-center justify-center">
                                        <img src="/images/mama-cafe-logo.jpg" alt="MaMa Café Logo" className="w-full h-full object-cover rounded-full" />
                                    </div>

                                    <h2 className="font-serif text-2xl font-bold text-[#5C2C16] text-center">MaMa Café Portal</h2>
                                    <p className="text-xs text-[#8C6D5B] mt-1 mb-6 text-center">Please sign in to access the admin panel.</p>

                                    {/* Inline Login Form */}
                                    <InlineLoginForm />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TABLET SLIDE-UP BOTTOM SHEET FOR LOGIN */}
                    {deviceType === 'tablet' && (
                        <div 
                            className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-500 ${
                                currentSlide === 3 ? 'bg-black/60 backdrop-blur-xs opacity-100 pointer-events-auto' : 'bg-transparent opacity-0 pointer-events-none'
                            }`}
                        >
                            <div 
                                className={`w-full max-w-md bg-[#F5F0E8] rounded-t-3xl p-8 shadow-2xl border-t border-amber-900/20 transform transition-transform duration-500 ease-out ${
                                    currentSlide === 3 ? 'translate-y-0' : 'translate-y-full'
                                }`}
                            >
                                {/* Sheet Drag Handle */}
                                <div className="w-12 h-1.5 bg-[#D4C5B3] rounded-full mx-auto mb-6" />

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-900/10 p-0.5 bg-white">
                                            <img src="/images/mama-cafe-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-[#5C2C16]">MaMa Café Portal</h3>
                                            <p className="text-xs text-[#8C6D5B]">Admin Sign In</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setCurrentSlide(2)} 
                                        className="p-2 rounded-full hover:bg-amber-200/50 text-[#7A3E22]"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <InlineLoginForm />
                            </div>
                        </div>
                    )}
                </main>

                {/* BOTTOM NAVIGATION BAR & SWIPE CONTROLS */}
                <footer className="relative z-30 flex items-center justify-between px-6 py-4 border-t border-[#E6DCD0]/60 bg-[#F9F6F0]/90 backdrop-blur-md">
                    {/* Previous Button */}
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-all ${
                            currentSlide === 0 ? 'opacity-30 cursor-not-allowed text-stone-400' : 'text-[#7A3E22] hover:text-[#58250F]'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-2">
                        {[0, 1, 2, 3].map((index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`transition-all duration-300 rounded-full ${
                                    currentSlide === index 
                                        ? 'w-6 h-2 bg-[#7A3E22]' 
                                        : 'w-2 h-2 bg-[#D4C5B3] hover:bg-amber-800/40'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Next / Action Button */}
                    {currentSlide < 3 ? (
                        <button
                            onClick={nextSlide}
                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#7A3E22] hover:text-[#58250F] transition-all"
                        >
                            {currentSlide === 2 ? (deviceType === 'tablet' ? 'Sign In ↑' : 'Sign In →') : 'Next'} <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <span className="text-xs font-semibold text-[#8C6D5B]">Portal Active</span>
                    )}
                </footer>
            </div>
        </>
    );
}

// INLINE LOGIN FORM COMPONENT
function InlineLoginForm() {
    return (
        <Form
            {...store.form()}
            resetOnSuccess={['password']}
            className="flex flex-col gap-4 w-full"
        >
            {({ processing, errors }) => (
                <>
                    {/* USERNAME FIELD */}
                    <div className="grid gap-1.5 text-left w-full">
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
                                className="pl-10 pr-4 py-2.5 h-11 bg-[#F5F0E8] border border-[#E0D5C5] focus:border-[#7A3E22] focus:ring-1 focus:ring-[#7A3E22] text-[#4A3225] placeholder:text-[#B5A499] rounded-lg text-sm transition-all w-full"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* PASSWORD FIELD */}
                    <div className="grid gap-1.5 text-left w-full">
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
                                className="pl-10 pr-10 py-2.5 h-11 bg-[#F5F0E8] border border-[#E0D5C5] focus:border-[#7A3E22] focus:ring-1 focus:ring-[#7A3E22] text-[#4A3225] placeholder:text-[#B5A499] rounded-lg text-sm transition-all w-full"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* REMEMBER ME OPTION */}
                    <div className="flex items-center space-x-2.5 pt-1">
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
                        className="w-full mt-2 h-11 bg-[#7A3E22] hover:bg-[#612F18] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] border-none cursor-pointer"
                    >
                        {processing ? (
                            <Spinner className="w-4 h-4 text-white" />
                        ) : (
                            <>
                                SIGN IN <ArrowRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </Button>

                    <div className="relative w-full my-4 flex items-center justify-center">
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
