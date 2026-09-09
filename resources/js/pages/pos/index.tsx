import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CheckCircle2,
    Banknote,
    Smartphone,
    CreditCard,
    BadgeDollarSign,
    BarChart3,
    Tag,
    FileText,
    UserRound,
    PauseCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    LogOut,
    ClipboardList,
    Home,
    Coffee,
} from 'lucide-react';
import type { User } from '@/types';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Category {
    id: number;
    name: string;
    products_count: number;
}

interface Product {
    id: number;
    category_id: number;
    category_name: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
}

interface Waitress {
    id: number;
    name: string;
    range_start: number | null;
    range_end: number | null;
    current_number: number | null;
}

interface Props {
    categories: Category[];
    products: Product[];
    waitresses: Waitress[];
    recentOrders: unknown[];
    nextOrderNumber: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

/* ─── Category icon mapping ─────────────────────────────────────────────── */
const CATEGORY_EMOJI: Record<string, string> = {
    'Hot Coffee':    '☕',
    'Boba Tea':      '🧋',
    'Cold Drinks':   '🧊',
    'Shakes':        '🥤',
    'Hot Tea':       '🍵',
};

/* ─── Payment methods ───────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
    { id: 'cash',         label: 'Cash',         icon: Banknote,         bg: '#1B5C35', ring: '#266E3B' },
    { id: 'mobile_money', label: 'Mobile Money',  icon: Smartphone,       bg: '#5C2B0D', ring: '#70381B' },
    { id: 'card',         label: 'Card',          icon: CreditCard,       bg: '#1A1A1A', ring: '#2A2A2A' },
    { id: 'credit',       label: 'Credit',        icon: BadgeDollarSign,  bg: '#3B1A6E', ring: '#522A7F' },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   MaMa Café POS Terminal
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PosIndex({ categories, products, waitresses, nextOrderNumber }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    /* ── State ─────────────────────────────────────────────────────────── */
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery]               = useState('');
    const [cart, setCart]                             = useState<CartItem[]>([]);
    const [selectedWaitressId, setSelectedWaitressId] = useState<string>('');
    const [selectedPayment, setSelectedPayment]       = useState<'cash' | 'mobile_money' | 'card' | 'credit'>('cash');
    const [isProcessing, setIsProcessing]             = useState(false);
    const [orderSuccess, setOrderSuccess]             = useState(false);
    const [currentOrderNum, setCurrentOrderNum]       = useState(nextOrderNumber);
    const [now, setNow]                               = useState(new Date());
    const [showUserMenu, setShowUserMenu]             = useState(false);
    const [discountAmount, setDiscountAmount]         = useState(0);
    const [currentPage, setCurrentPage]               = useState(1);
    const ITEMS_PER_PAGE = 25;

    /* ── Live clock ────────────────────────────────────────────────────── */
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /* ── Reset pagination on filter changes ────────────────────────────── */
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoryId, searchQuery]);

    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    /* ── Filtered products ─────────────────────────────────────────────── */
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategoryId === null || p.category_id === selectedCategoryId;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category_name.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategoryId, searchQuery]);

    /* ── Pagination ────────────────────────────────────────────────────── */
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
    }, [filteredProducts, safePage, ITEMS_PER_PAGE]);

    /* ── Cart calculations ─────────────────────────────────────────────── */
    const subtotal    = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.quantity, 0), [cart]);
    const grandTotal  = Math.max(0, subtotal - discountAmount);

    /* ── Cart handlers ─────────────────────────────────────────────────── */
    const addToCart = useCallback((product: Product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product, quantity: 1 }];
        });
    }, []);

    const updateQty = useCallback((productId: number, delta: number) => {
        setCart(prev =>
            prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        );
    }, []);

    const removeItem = useCallback((productId: number) => {
        setCart(prev => prev.filter(i => i.product.id !== productId));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        setDiscountAmount(0);
        setSelectedWaitressId('');
        setSelectedPayment('cash');
    }, []);

    /* ── Complete Sale ─────────────────────────────────────────────────── */
    const handleCompleteSale = () => {
        if (cart.length === 0 || isProcessing) return;
        setIsProcessing(true);

        router.post('/pos/orders', {
            order_type:     'dine_in',
            waitress_id:    selectedWaitressId || null,
            payment_method: selectedPayment,
            payment_status: 'paid',
            discount:       discountAmount,
            items:          cart.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        }, {
            onSuccess: () => {
                setOrderSuccess(true);
                setCurrentOrderNum(n => n + 1);
                clearCart();
                setTimeout(() => setOrderSuccess(false), 3000);
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    /* ═══════════════════════════════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════════════════════════════ */
    return (
        <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#F8F3EC', fontFamily: 'system-ui, sans-serif' }}>
            <Head title="POS Terminal — MaMa Café" />

            {/* ── MAIN CONTENT AREA ───────────────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* ── TOP HEADER BAR ────────────────────────────────────── */}
                <header
                    className="flex h-16 items-center gap-4 px-5 shrink-0"
                    style={{ background: '#2C1810', borderBottom: '2px solid #3D2015' }}
                >
                    {/* Brand */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl"
                            style={{ background: '#5C2B0D' }}
                        >
                            <Coffee className="h-5 w-5 text-white" />
                        </div>
                        <div className="leading-tight">
                            <div className="text-base font-bold text-white tracking-wide">MaMa Café</div>
                            <div className="text-[9px] font-medium tracking-widest uppercase" style={{ color: '#A07050' }}>
                                Coffee • Boba • Ice Chocolate
                            </div>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative flex-1 max-w-md mx-auto">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" style={{ color: '#8A6B50' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-10 w-full rounded-full border pl-10 pr-4 text-sm outline-none focus:ring-2"
                            style={{
                                background: '#F4ECE2',
                                borderColor: '#CCAB88',
                                color: '#1F110B',
                            }}
                        />
                    </div>

                    {/* Nav links */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {[
                            { label: 'Home',     icon: Home,          href: '/pos' },
                            { label: 'Orders',   icon: ClipboardList, href: '/pos/orders' },
                            { label: 'Reports',  icon: BarChart3,     href: '/finance/reports' },
                        ].map(({ label, icon: Icon, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors hover:bg-white/10"
                            >
                                <Icon className="h-4 w-4 text-white/80" />
                                <span className="text-[10px] text-white/70">{label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Cashier + clock */}
                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                        {/* Clock */}
                        <div className="hidden lg:flex flex-col items-end leading-tight">
                            <span className="text-sm font-bold text-white">{timeStr}</span>
                            <span className="text-[10px]" style={{ color: '#A07050' }}>{dateStr}</span>
                        </div>
                        {/* Online dot */}
                        <div className="relative">
                            <span className="flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                            </span>
                        </div>

                        {/* Cashier dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(v => !v)}
                                className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
                            >
                                <div
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ background: '#5C2B0D' }}
                                >
                                    {user?.name?.charAt(0).toUpperCase() ?? 'C'}
                                </div>
                                <div className="hidden lg:block leading-tight text-left">
                                    <div className="text-xs font-semibold text-white">
                                        Cashier {user?.name?.split(' ')[0] ?? 'Staff'}
                                    </div>
                                </div>
                                <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                            </button>
                            {showUserMenu && (
                                <div
                                    className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border shadow-xl py-1"
                                    style={{ background: '#2C1810', borderColor: '#3D2015' }}
                                >
                                    <Link
                                        href="/management/orders"
                                        className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:bg-white/10"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <ClipboardList className="h-3.5 w-3.5" /> All Orders
                                    </Link>
                                    <div className="my-1 border-t" style={{ borderColor: '#3D2015' }} />
                                    <button
                                        onClick={() => router.post('/logout')}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-white/10"
                                    >
                                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── TWO-COLUMN WORK AREA ──────────────────────────────── */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ── CENTER: PRODUCT CATALOG ──────────────────────── */}
                    <div className="flex flex-1 flex-col overflow-hidden">

                        {/* Category Pills */}
                        <div
                            className="flex items-center gap-2 overflow-x-auto px-5 py-3 shrink-0"
                            style={{ borderBottom: '1px solid #E8DDD2', background: '#FAF6F0' }}
                        >
                            <button
                                onClick={() => setSelectedCategoryId(null)}
                                className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
                                style={
                                    selectedCategoryId === null
                                        ? { background: '#2C1810', color: '#fff', boxShadow: '0 2px 6px rgba(44,24,16,0.3)' }
                                        : { background: '#EDE0D0', color: '#5C3A28' }
                                }
                            >
                                ☕ All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategoryId(cat.id)}
                                    className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all"
                                    style={
                                        selectedCategoryId === cat.id
                                            ? { background: '#2C1810', color: '#fff', boxShadow: '0 2px 6px rgba(44,24,16,0.3)' }
                                            : { background: '#EDE0D0', color: '#5C3A28' }
                                    }
                                >
                                    {CATEGORY_EMOJI[cat.name] ?? '🍹'} {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Product Grid — 5 columns */}
                        <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {filteredProducts.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center" style={{ color: '#9B7A5E' }}>
                                    <Coffee className="mb-3 h-12 w-12 opacity-30" />
                                    <p className="text-sm font-semibold">No products found</p>
                                    <p className="text-xs mt-1 opacity-70">Try a different category or search term.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 pt-0" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                                    {paginatedProducts.map(product => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => addToCart(product)}
                                            className="group flex flex-col items-center overflow-hidden rounded-2xl border p-0 pt-0 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                                            style={{
                                                background:   '#FFFFFF',
                                                borderColor:  '#E8DDD2',
                                                boxShadow:    '0 1px 4px rgba(0,0,0,0.06)',
                                            }}
                                        >
                                            {/* Drink image */}
                                            <div className="w-full overflow-hidden" style={{ height: 120 }}>
                                                <img
                                                    src={product.image_url ?? '/images/drink-item-0.jpg'}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/drink-item-0.jpg'; }}
                                                />
                                            </div>
                                            {/* Name + price */}
                                            <div className="w-full px-2 py-2.5">
                                                <p className="mb-1.5 text-xs font-semibold leading-tight" style={{ color: '#1F110B' }}>
                                                    {product.name}
                                                </p>
                                                <div
                                                    className="inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white"
                                                    style={{ background: '#2C1810' }}
                                                >
                                                    ${product.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {filteredProducts.length > 0 && totalPages > 1 && (
                            <div
                                className="flex shrink-0 items-center justify-between gap-3 px-5 py-2.5"
                                style={{ background: '#FAF6F0', borderTop: '1px solid #E8DDD2' }}
                            >
                                <span className="text-xs font-medium" style={{ color: '#9B7A5E' }}>
                                    Showing {Math.min(filteredProducts.length, (safePage - 1) * ITEMS_PER_PAGE + 1)}–
                                    {Math.min(safePage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={safePage === 1}
                                        onClick={() => setCurrentPage(safePage - 1)}
                                        className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40"
                                        style={{ borderColor: '#D4B99A', color: '#5C3A28', background: '#F4ECE2' }}
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" /> Prev
                                    </button>
                                    <span className="text-xs font-bold" style={{ color: '#5C3A28' }}>
                                        {safePage} / {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={safePage === totalPages}
                                        onClick={() => setCurrentPage(safePage + 1)}
                                        className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40"
                                        style={{ borderColor: '#D4B99A', color: '#5C3A28', background: '#F4ECE2' }}
                                    >
                                        Next <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Utility Bar */}
                        <div
                            className="flex items-center justify-center gap-3 px-5 py-2.5 shrink-0"
                            style={{ background: '#FAF6F0', borderTop: '1px solid #E8DDD2' }}
                        >
                            {[
                                { icon: Tag,        label: 'Discount' },
                                { icon: FileText,   label: 'Note' },
                                { icon: UserRound,  label: 'Customer' },
                                { icon: PauseCircle,label: 'Hold' },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-[#EDE0D0]"
                                    style={{ borderColor: '#D4B99A', color: '#5C3A28', background: '#F4ECE2' }}
                                >
                                    <Icon className="h-3.5 w-3.5" /> {label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: ORDER PANEL ──────────────────────────── */}
                    <div
                        className="flex w-80 shrink-0 flex-col overflow-hidden"
                        style={{ background: '#FAF6F0', borderLeft: '2px solid #E8DDD2' }}
                    >
                        {/* Order header */}
                        <div
                            className="flex items-center justify-between px-4 py-3 shrink-0"
                            style={{ background: '#2C1810' }}
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-white/80" />
                                <span className="text-sm font-bold text-white">Current Order</span>
                                <span className="text-sm font-bold" style={{ color: '#D4A57A' }}>
                                    #{currentOrderNum}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={clearCart}
                                disabled={cart.length === 0}
                                className="rounded-lg p-1.5 transition-colors hover:bg-red-600/20 disabled:opacity-30"
                                title="Clear order"
                            >
                                <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                        </div>

                        {/* Waitress selector */}
                        {waitresses.length > 0 && (
                            <div className="px-4 pt-3 pb-2 shrink-0" style={{ borderBottom: '1px solid #E8DDD2' }}>
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#9B7A5E' }}>
                                    Waitress
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => setSelectedWaitressId('')}
                                        className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                                        style={
                                            selectedWaitressId === ''
                                                ? { background: '#2C1810', color: '#fff' }
                                                : { background: '#EDE0D0', color: '#5C3A28' }
                                        }
                                    >
                                        Walk-in
                                    </button>
                                    {waitresses.map(w => (
                                        <button
                                            key={w.id}
                                            onClick={() => setSelectedWaitressId(String(w.id))}
                                            className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                                            style={
                                                selectedWaitressId === String(w.id)
                                                    ? { background: '#2C1810', color: '#fff' }
                                                    : { background: '#EDE0D0', color: '#5C3A28' }
                                            }
                                        >
                                            {w.name.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            {cart.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center" style={{ color: '#9B7A5E' }}>
                                    <ShoppingCart className="mb-2 h-10 w-10 opacity-20" />
                                    <p className="text-xs font-medium">Cart is empty</p>
                                    <p className="mt-1 text-[11px] opacity-70">Tap a drink to add it</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {cart.map(item => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center gap-2 rounded-xl p-2"
                                            style={{ background: '#fff', border: '1px solid #E8DDD2' }}
                                        >
                                            <img
                                                src={item.product.image_url ?? '/images/drink-item-0.jpg'}
                                                alt={item.product.name}
                                                className="h-10 w-10 rounded-lg object-cover shrink-0"
                                                onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/drink-item-0.jpg'; }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-xs font-semibold" style={{ color: '#1F110B' }}>
                                                    {item.product.name}
                                                </p>
                                                <p className="text-[11px]" style={{ color: '#9B7A5E' }}>
                                                    ${item.product.price.toFixed(2)}
                                                </p>
                                            </div>
                                            {/* Qty stepper */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.product.id, -1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                                                    style={{ border: '1px solid #D0C0B0' }}
                                                >
                                                    <Minus className="h-3 w-3" style={{ color: '#5C3A28' }} />
                                                </button>
                                                <span className="w-5 text-center text-xs font-bold" style={{ color: '#1F110B' }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.product.id, 1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                                                    style={{ border: '1px solid #D0C0B0' }}
                                                >
                                                    <Plus className="h-3 w-3" style={{ color: '#5C3A28' }} />
                                                </button>
                                            </div>
                                            {/* Line total */}
                                            <p className="w-12 text-right text-xs font-bold" style={{ color: '#1F110B' }}>
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="shrink-0 px-4 py-3" style={{ borderTop: '1px solid #E8DDD2' }}>
                            <div className="space-y-1 text-xs" style={{ color: '#7A5A42' }}>
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span className="font-mono">${discountAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (0%)</span>
                                    <span className="font-mono">$0.00</span>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline justify-between border-t pt-2" style={{ borderColor: '#E8DDD2' }}>
                                <span className="text-sm font-bold" style={{ color: '#1F110B' }}>TOTAL</span>
                                <span className="font-mono text-2xl font-black" style={{ color: '#8B1A1A' }}>
                                    ${grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Payment Buttons 2×2 */}
                        <div className="shrink-0 grid grid-cols-2 gap-2 px-4 pb-2">
                            {PAYMENT_METHODS.map(pm => (
                                <button
                                    key={pm.id}
                                    type="button"
                                    onClick={() => setSelectedPayment(pm.id as typeof selectedPayment)}
                                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white transition-all"
                                    style={{
                                        background:   selectedPayment === pm.id ? pm.ring : pm.bg,
                                        boxShadow:    selectedPayment === pm.id ? `0 0 0 2px ${pm.ring}` : 'none',
                                        opacity:      selectedPayment === pm.id ? 1 : 0.85,
                                    }}
                                >
                                    <pm.icon className="h-4 w-4" /> {pm.label}
                                </button>
                            ))}
                        </div>

                        {/* Complete Sale CTA */}
                        <div className="shrink-0 px-4 pb-3">
                            <button
                                type="button"
                                disabled={cart.length === 0 || isProcessing}
                                onClick={handleCompleteSale}
                                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg, #C6862A, #BA7A29)' }}
                            >
                                <CheckCircle2 className="h-5 w-5" />
                                {isProcessing ? 'Processing…' : 'Complete Sale'}
                            </button>
                        </div>

                        {/* Status footer */}
                        <div
                            className="flex items-center justify-between shrink-0 px-4 py-2"
                            style={{ borderTop: '1px solid #E8DDD2', background: '#FAF6F0' }}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-[10px] font-medium" style={{ color: '#5C3A28' }}>Online</span>
                            </div>
                            <span className="text-[10px]" style={{ color: '#9B7A5E' }}>
                                {orderSuccess ? '✓ Order saved!' : 'Ready to serve'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click-away for user menu */}
            {showUserMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            )}
        </div>
    );
}


