import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Coffee,
    Home,
    ClipboardList,
    BarChart3,
    Package,
    Settings,
    Store,
    Warehouse,
    ChevronDown,
    LogOut,
    LayoutGrid,
    Menu,
    X,
    UserRound,
} from 'lucide-react';
import type { User } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
    children: React.ReactNode;
    title?: string;
    /** Currently active nav item label, e.g. "POS" or "Orders" */
    activeNav?: string;
    /** Optional search bar content rendered in the header center slot */
    headerCenter?: React.ReactNode;
}

const NAV_ITEMS = [
    { label: 'POS', icon: Store, href: '/pos' },
    { label: 'Products', icon: Package, href: '/management/products' },
    { label: 'Inventory', icon: Warehouse, href: '/finance/expenses' },
    { label: 'Reports', icon: BarChart3, href: '/finance/reports' },
    { label: 'Settings', icon: Settings, href: '/system/settings' },
] as const;

export default function PosShell({
    children,
    title,
    activeNav = 'POS',
    headerCenter,
}: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    const [now, setNow] = useState(new Date());
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const dateStr = now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div
            className="flex h-screen w-screen flex-col overflow-hidden bg-[#FAF6F0]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
            {title && <Head title={`${title} — MaMa Café`} />}

            {/* ── TOP HEADER ── */}
            <header
                className="z-20 flex h-20 w-full shrink-0 items-center justify-between gap-4 px-4 select-none md:h-22 md:px-6"
                style={{
                    background: '#2C1810',
                    borderBottom: '2px solid #3D2015',
                }}
            >
                {/* Left: Hamburger Toggle + Brand Logo */}
                <div className="flex shrink-0 items-center gap-3">
                    <button
                        type="button"
                        className="cursor-pointer rounded-lg p-1.5 text-white/90 transition-colors hover:bg-white/10"
                        onClick={() => setMobileSidebarOpen((v) => !v)}
                        aria-label="Toggle sidebar"
                    >
                        {mobileSidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                    <img
                        src="/images/hero/MaMaCaféWhiteLogoLockup.png"
                        alt="MaMa Café"
                        className="h-18 w-auto max-h-24 object-contain sm:h-20 md:h-24 lg:h-28 max-w-[400px] md:max-w-[480px]"
                    />
                </div>

                {/* Center slot: Search bar expanding nicely to fill middle space */}
                {headerCenter && (
                    <div className="mx-4 min-w-0 flex-1 max-w-3xl md:mx-6">
                        {headerCenter}
                    </div>
                )}
                {!headerCenter && <div className="flex-1" />}

                {/* Right: nav + user card + clock */}
                <div className="flex shrink-0 items-center gap-3 md:gap-5">
                    {/* Desktop inline nav */}
                    <nav className="hidden items-center gap-3 lg:flex">
                        {[
                            { label: 'Home', icon: Home, href: '/dashboard' },
                            { label: 'Orders', icon: ClipboardList, href: '/management/orders' },
                            {
                                label: 'Reports',
                                icon: BarChart3,
                                href: '/finance/reports',
                            },
                        ].map(({ label, icon: Icon, href }) => {
                            const isActive = activeNav === label;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className="relative flex flex-col items-center justify-center rounded-lg px-3 py-1.5 transition-colors hover:text-white"
                                    style={{
                                        color: isActive ? '#E5B88A' : 'rgba(255,255,255,0.85)',
                                    }}
                                >
                                    <Icon className="h-5 w-5" style={{ color: isActive ? '#E5B88A' : undefined }} />
                                    <span className="mt-1 text-xs font-bold leading-none">
                                        {label}
                                    </span>
                                    {isActive && (
                                        <span
                                            className="absolute -bottom-1 h-0.5 w-6 rounded-full"
                                            style={{ background: '#E5B88A' }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Dropdown Card */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-2 transition-colors hover:bg-white/10 outline-none"
                                style={{
                                    background: '#3D2015',
                                    borderColor: '#5C3120',
                                }}
                            >
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-black text-white shadow-xs"
                                    style={{ background: '#5C2B0D' }}
                                >
                                    <UserRound className="h-5 w-5 text-white/90" />
                                </div>
                                <div className="flex flex-col items-start text-left leading-tight">
                                    <span className="text-[11px] font-medium text-white/70">
                                        {typeof user?.role === 'string' ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Cashier'}
                                    </span>
                                    <span className="text-xs font-black text-white">
                                        {user?.name ?? 'Abdullahi'}
                                    </span>
                                </div>
                                <ChevronDown className="ml-1 h-4 w-4 text-white/60" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-52 rounded-xl border py-1.5 shadow-xl"
                            style={{
                                background: '#2C1810',
                                borderColor: '#3D2015',
                            }}
                        >
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-white/10 focus:bg-white/10 focus:text-red-400 border-none outline-none"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clock */}
                    <div className="flex items-center gap-2.5 border-l border-white/15 pl-3">
                        <div className="flex flex-col items-end leading-tight">
                            <span className="text-[11px] font-bold text-white/90">
                                {dateStr}
                            </span>
                            <span
                                className="text-xs font-black"
                                style={{ color: '#E5B88A' }}
                            >
                                {timeStr}
                            </span>
                        </div>
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                        </span>
                    </div>
                </div>
            </header>

            {/* ── BODY: LEFT SIDEBAR + CONTENT ── */}
            <div className="relative flex min-h-0 flex-1 overflow-hidden">
                {/* Mobile sidebar overlay */}
                {mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/40 md:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}

                {/* ── LEFT VERTICAL SIDEBAR ── */}
                <aside
                    className={`pos-scrollbar-hidden z-40 flex h-full w-40 shrink-0 flex-col justify-between overflow-y-auto p-2.5 py-4 transition-transform duration-300 select-none md:relative md:flex md:w-44 md:translate-x-0 lg:w-48 ${mobileSidebarOpen ? 'fixed top-15 left-0 translate-x-0' : 'fixed top-15 left-0 -translate-x-full'} md:static`}
                    style={{
                        background: '#F5EFE6',
                        borderRight: '1px solid #E5D9CC',
                    }}
                >
                    {/* Top Section */}
                    <div className="flex flex-col items-center gap-3">
                        {/* Compact active POS indicator button — Horizontal layout matching Image 2 */}
                        <div
                            className="flex w-full items-center justify-center gap-2 rounded-2xl px-3.5 py-3 text-white shadow-xs transition-transform hover:scale-[1.02]"
                            style={{ background: '#2C1810' }}
                        >
                            <LayoutGrid
                                className="h-5 w-5 shrink-0"
                                style={{ color: '#E5B88A' }}
                            />
                            <span
                                className="text-xs font-black tracking-wider uppercase"
                                style={{ color: '#E5B88A' }}
                            >
                                POS
                            </span>
                        </div>

                        {/* Nav items — Transparent background on cream sidebar container */}
                        <div className="flex w-full flex-col items-center gap-2 pt-1">
                            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
                                const isActive = activeNav === label;
                                return (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={() =>
                                            setMobileSidebarOpen(false)
                                        }
                                        className="group flex w-full flex-col items-center justify-center rounded-2xl px-3 py-3 text-center transition-all active:scale-95 hover:bg-[#2C1810]"
                                        style={{
                                            background: isActive ? '#2C1810' : 'transparent',
                                            color: isActive ? '#E5B88A' : '#5C3A28',
                                            boxShadow: isActive
                                                ? '0 2px 6px rgba(44,24,16,0.25)'
                                                : 'none',
                                        }}
                                    >
                                        <Icon
                                            className="h-6 w-6 transition-colors group-hover:text-[#E5B88A]"
                                            style={{ color: isActive ? '#E5B88A' : '#5C3A28' }}
                                        />
                                        <span className="mt-1 text-xs font-extrabold leading-tight transition-colors group-hover:text-[#E5B88A]">
                                            {label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom branding logo — Fitting nicely inside wider sidebar */}
                    <div className="mt-4 flex w-full flex-col items-center px-1 text-center">
                        <img
                            src="/images/hero/MaMaCaféGoodMoodLogo.png"
                            alt="MaMa Café - Good Drinks Good Mood"
                            className="w-full max-w-[140px] object-contain transition-transform hover:scale-105 md:max-w-[160px]"
                        />
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="min-h-0 min-w-0 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
