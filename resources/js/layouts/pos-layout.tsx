import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Coffee,
    ShoppingBag,
    History,
    LogOut,
    User as UserIcon,
    Clock,
    ChevronDown,
    LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import type { User } from '@/types';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function PosLayout({ children, title }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const handleLogout = () => {
        router.post('/logout');
    };

    const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {title && <Head title={`${title} — MaMa Café POS`} />}

            {/* ── POS Top Navigation Bar ── */}
            <header className="sticky top-0 z-50 h-14 border-b bg-[#231008] text-white flex items-center justify-between px-4 shadow-md shrink-0">
                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#823d21]">
                        <Coffee className="h-4 w-4 text-white" />
                    </div>
                    <div className="leading-none">
                        <span className="font-bold text-sm tracking-wide">MaMa Café</span>
                        <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-white/50 border border-white/20 rounded px-1.5 py-0.5">
                            Operations Portal
                        </span>
                    </div>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    <Link href="/pos">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 h-8"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" /> POS Terminal
                        </Button>
                    </Link>
                    <Link href="/pos/orders">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 h-8"
                        >
                            <History className="h-3.5 w-3.5" /> Order History
                        </Button>
                    </Link>
                </nav>

                {/* Right: Clock + User Dropdown */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/60 mr-1">
                        <Clock className="h-3 w-3" />
                        <span>{timeStr}</span>
                        <span className="text-white/30">·</span>
                        <span>{dateStr}</span>
                    </div>

                    {/* User Profile Dropdown */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 px-2.5 text-xs text-white hover:text-white hover:bg-white/10 h-9 rounded-lg border border-white/10 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#823d21] text-white font-bold text-[10px]">
                                            {user.name.slice(0, 1).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-xs max-w-[120px] truncate">{user.name}</span>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56 rounded-xl p-1 shadow-lg" align="end">
                                <DropdownMenuLabel className="p-2 font-normal">
                                    <div className="flex items-center gap-2">
                                        <UserInfo user={user} showEmail={true} />
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/settings/profile"
                                            className="flex w-full items-center gap-2 text-xs font-medium cursor-pointer"
                                        >
                                            <UserIcon className="h-4 w-4" />
                                            My Account Profile
                                        </Link>
                                    </DropdownMenuItem>

                                    {isAdminOrManager && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/dashboard"
                                                className="flex w-full items-center gap-2 text-xs font-medium cursor-pointer"
                                            >
                                                <LayoutGrid className="h-4 w-4" />
                                                Back to Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 text-xs font-medium text-red-600 focus:text-red-600 dark:text-red-400 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>

            {/* ── Page Content ── */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
