import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title = 'MaMa Café Portal',
    description = 'Please sign in to access the admin panel.',
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F9F6F0] text-[#4A3225] overflow-hidden animate-slide-in-right sm:animate-slide-in-bottom">
            {/* Left Column: Coffee Background & Overlay */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-stone-900">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url('/images/coffee-bg.jpg')` }}
                />
                {/* Dark Gradient Overlay for optimal contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-200/90 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20 shadow-sm">
                        MaMa Café System
                    </span>
                </div>

                {/* Bottom Left Overlay Text (Matches Image 2) */}
                <div className="relative z-10 max-w-lg mb-4">
                    <h2 className="font-serif text-4xl xl:text-5xl font-bold tracking-tight text-white/95 leading-tight">
                        Elevate the Art of Coffee.
                    </h2>
                    <p className="mt-3 text-base text-amber-100/80 font-light leading-relaxed">
                        Streamlined operations for the modern, artisanal coffee house.
                    </p>
                </div>
            </div>

            {/* Right Column: Centered Login Card */}
            <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-8 md:p-12 bg-[#F9F6F0]">
                <div className="w-full max-w-[420px] rounded-2xl bg-[#F5F0E8] p-6 sm:p-10 shadow-[0_12px_40px_rgba(122,62,34,0.08)] border border-[#E6DCD0] flex flex-col items-center">
                    {/* MaMa Cafe Logo */}
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 shadow-sm border border-amber-900/10 p-0.5 bg-white flex items-center justify-center">
                        <img
                            src="/images/mama-cafe-logo.jpg"
                            alt="MaMa Café Logo"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* Header Title & Subtitle */}
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C2C16] tracking-tight text-center">
                        {title || 'MaMa Café Portal'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8C6D5B] mt-1.5 mb-7 text-center">
                        {description || 'Please sign in to access the admin panel.'}
                    </p>

                    {/* Form Component */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

