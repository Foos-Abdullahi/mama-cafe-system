import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
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
    UserRoundPlus,
    PauseCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Coffee,
    X,
    Phone,
    Hash,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import PosShell from '@/layouts/pos-shell';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Category {
    id: number;
    name: string;
    image_url: string | null;
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
    phone?: string | null;
    range_start: number | null;
    range_end: number | null;
    current_number: number | null;
}

interface Props {
    categories: Category[];
    products: Product[];
    waitresses: Waitress[];
    registeredWorkingNumbers?: (string | number)[];
    recentOrders: unknown[];
    nextOrderNumber: number;
    taxRate: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

/* ─── Payment methods ───────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
    {
        id: 'cash',
        label: 'Cash',
        icon: Banknote,
        bg: '#1B5C35',
        ring: '#266E3B',
    },
    {
        id: 'mobile_money',
        label: 'Mobile Money',
        icon: Smartphone,
        bg: '#5C2B0D',
        ring: '#70381B',
    },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   MaMa Café POS Terminal
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PosIndex({
    categories,
    products,
    waitresses,
    registeredWorkingNumbers = [],
    nextOrderNumber,
    taxRate,
}: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    /* ── State ─────────────────────────────────────────────────────────── */
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedWaitressId, setSelectedWaitressId] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState<
        'cash' | 'mobile_money' | 'card' | 'credit'
    >('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [currentOrderNum, setCurrentOrderNum] = useState(nextOrderNumber);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
    const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
    const [discountInput, setDiscountInput] = useState('0');
    const [saleConfirmOpen, setSaleConfirmOpen] = useState(false);
    const [salePaymentStatus, setSalePaymentStatus] = useState<
        'paid' | 'partial'
    >('paid');
    const [saleAmountPaid, setSaleAmountPaid] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    /** Mobile: show cart drawer */
    const [mobileCartOpen, setMobileCartOpen] = useState(false);
    const ITEMS_PER_PAGE = 50;

    /** Local waitress list — starts from server props, updated after quick-create */
    const [waitressList, setWaitressList] = useState<Waitress[]>(waitresses);
    const [availableWorkingNumbers, setAvailableWorkingNumbers] = useState<
        (string | number)[]
    >(registeredWorkingNumbers);

    /** Add-waitress dialog */
    const [addWaitressOpen, setAddWaitressOpen] = useState(false);
    const [newWaitressName, setNewWaitressName] = useState('');
    const [newWaitressPhone, setNewWaitressPhone] = useState('');
    const [newWaitressNumber, setNewWaitressNumber] = useState('');
    const [isCreatingWaitress, setIsCreatingWaitress] = useState(false);
    const [createWaitressError, setCreateWaitressError] = useState<
        string | null
    >(null);

    /** Assign working number dialog (for waitresses that don't have a working number) */
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [targetWaitress, setTargetWaitress] = useState<Waitress | null>(null);
    const [assignNumberValue, setAssignNumberValue] = useState('');
    const [isAssigningNumber, setIsAssigningNumber] = useState(false);
    const [assignNumberError, setAssignNumberError] = useState<string | null>(
        null,
    );

    const selectedWaitress = useMemo(
        () => waitressList.find((w) => String(w.id) === selectedWaitressId),
        [waitressList, selectedWaitressId],
    );

    /* ── Reset pagination on filter changes ────────────────────────────── */
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoryId, searchQuery]);

    /* ── Filtered products ─────────────────────────────────────────────── */
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory =
                selectedCategoryId === null ||
                p.category_id === selectedCategoryId;
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.category_name.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategoryId, searchQuery]);

    /* ── Pagination ────────────────────────────────────────────────────── */
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
    );
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice(
            (safePage - 1) * ITEMS_PER_PAGE,
            safePage * ITEMS_PER_PAGE,
        );
    }, [filteredProducts, safePage, ITEMS_PER_PAGE]);

    /* ── Cart calculations ─────────────────────────────────────────────── */
    const subtotal = useMemo(
        () => cart.reduce((s, i) => s + i.product.price * i.quantity, 0),
        [cart],
    );
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = taxableSubtotal * (taxRate / 100);
    const grandTotal = taxableSubtotal + taxAmount;

    /* ── Cart handlers ─────────────────────────────────────────────────── */
    const addToCart = useCallback((product: Product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        toast.success(`Added ${product.name} to order`);
    }, []);

    const updateQty = useCallback((productId: number, delta: number) => {
        setCart((prev) =>
            prev.map((i) =>
                i.product.id === productId
                    ? { ...i, quantity: Math.max(1, i.quantity + delta) }
                    : i,
            ),
        );
    }, []);

    const removeItem = useCallback((productId: number) => {
        setCart((prev) => prev.filter((i) => i.product.id !== productId));
        toast.info('Item removed from order');
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        setDiscountAmount(0);
        setDiscountType('fixed');
        setDiscountInput('0');
        setSelectedWaitressId('');
        setSelectedPayment('cash');
        setSalePaymentStatus('paid');
        setSaleAmountPaid('');
        toast.info('Cleared order cart');
    }, []);

    /* ── Complete Sale ─────────────────────────────────────────────────── */
    const handleCompleteSale = () => {
        if (cart.length === 0 || isProcessing) return;
        setSalePaymentStatus('paid');
        setSaleAmountPaid(grandTotal.toFixed(2));
        setSaleConfirmOpen(true);
    };

    const submitSale = () => {
        setSaleConfirmOpen(false);
        setIsProcessing(true);

        router.post(
            '/pos/orders',
            {
                order_type: 'dine_in',
                waitress_id: selectedWaitressId || null,
                payment_method: selectedPayment,
                payment_status: salePaymentStatus,
                amount_paid:
                    salePaymentStatus === 'partial'
                        ? Number(saleAmountPaid)
                        : undefined,
                discount: discountAmount,
                items: cart.map((i) => ({
                    product_id: i.product.id,
                    quantity: i.quantity,
                })),
            },
            {
                onSuccess: () => {
                    setOrderSuccess(true);
                    toast.success(
                        `Order #${currentOrderNum} placed successfully!`,
                    );
                    setCurrentOrderNum((n) => n + 1);
                    clearCart();
                    setMobileCartOpen(false);
                    setTimeout(() => setOrderSuccess(false), 3000);
                },
                onError: () => {
                    toast.error(
                        'Failed to complete sale. Please check your items.',
                    );
                },
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    /* ── Quick-create Waitress ─────────────────────────────────────────── */
    const handleCreateWaitress = async () => {
        if (!newWaitressName.trim() || isCreatingWaitress) return;
        setIsCreatingWaitress(true);
        setCreateWaitressError(null);

        try {
            const csrfMeta = document.querySelector<HTMLMetaElement>(
                'meta[name="csrf-token"]',
            );
            const response = await fetch('/pos/waitresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfMeta?.content ?? '',
                },
                body: JSON.stringify({
                    name: newWaitressName.trim(),
                    phone: newWaitressPhone.trim() || undefined,
                    working_number: newWaitressNumber
                        ? parseInt(newWaitressNumber, 10)
                        : undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const firstError = errorData?.errors
                    ? Object.values(errorData.errors).flat().join(' ')
                    : 'Failed to create waitress.';
                setCreateWaitressError(firstError as string);
                toast.error(firstError as string);
                return;
            }

            const created = (await response.json()) as Waitress;
            setWaitressList((prev) => [...prev, created]);
            if (created.current_number != null) {
                const numStr = String(created.current_number);
                setAvailableWorkingNumbers((prev) => {
                    if (!prev.map(String).includes(numStr)) {
                        return [...prev, created.current_number!];
                    }
                    return prev;
                });
            }
            setSelectedWaitressId(String(created.id));
            setAddWaitressOpen(false);
            setNewWaitressName('');
            setNewWaitressPhone('');
            setNewWaitressNumber('');

            if (created.current_number != null) {
                toast.success(
                    `Waitress "${created.name}" registered with Working No. #${created.current_number}`,
                );
            } else {
                toast.success(
                    `Waitress "${created.name}" registered successfully`,
                );
            }
        } catch {
            setCreateWaitressError('Network error. Please try again.');
            toast.error('Network error. Please try again.');
        } finally {
            setIsCreatingWaitress(false);
        }
    };

    /* ── Assign Working Number to existing waitress ────────────────────── */
    const openAssignModal = (waitress: Waitress) => {
        setTargetWaitress(waitress);
        setAssignNumberValue(
            waitress.current_number ? String(waitress.current_number) : '',
        );
        setAssignNumberError(null);
        setAssignModalOpen(true);
    };

    const handleAssignWorkingNumber = async () => {
        if (!targetWaitress || !assignNumberValue.trim() || isAssigningNumber)
            return;
        setIsAssigningNumber(true);
        setAssignNumberError(null);

        try {
            const csrfMeta = document.querySelector<HTMLMetaElement>(
                'meta[name="csrf-token"]',
            );
            const response = await fetch(
                `/pos/waitresses/${targetWaitress.id}/assign-number`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfMeta?.content ?? '',
                    },
                    body: JSON.stringify({
                        working_number: parseInt(assignNumberValue, 10),
                    }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const firstError = errorData?.errors
                    ? Object.values(errorData.errors).flat().join(' ')
                    : 'Failed to assign working number.';
                setAssignNumberError(firstError as string);
                toast.error(firstError as string);
                return;
            }

            const updated = (await response.json()) as Waitress;
            const newNum = updated.current_number;

            setWaitressList((prev) =>
                prev.map((w) =>
                    w.id === updated.id
                        ? {
                              ...w,
                              current_number: newNum,
                              range_start: newNum,
                              range_end: newNum,
                          }
                        : w,
                ),
            );

            if (newNum != null) {
                const numStr = String(newNum);
                setAvailableWorkingNumbers((prev) => {
                    if (!prev.map(String).includes(numStr)) {
                        return [...prev, newNum];
                    }
                    return prev;
                });
            }

            setAssignModalOpen(false);
            setAssignNumberValue('');
            toast.success(
                `Assigned Working No. #${newNum} to ${updated.name}!`,
            );
        } catch {
            setAssignNumberError('Network error. Please try again.');
            toast.error('Network error. Please try again.');
        } finally {
            setIsAssigningNumber(false);
        }
    };

    /* ── Search bar for the header center slot ─────────────────────────── */
    const searchBar = (
        <div className="relative w-full">
            <Search
                className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2"
                style={{ color: '#8A6B50' }}
            />
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border pr-4 pl-11 text-xs font-semibold transition-all outline-none focus:ring-2 focus:ring-[#C89B7B] md:h-11 md:text-sm"
                style={{
                    background: '#F4ECE2',
                    borderColor: '#CCAB88',
                    color: '#1F110B',
                }}
            />
        </div>
    );

    /* ── Order Panel (shared between desktop inline + mobile drawer) ─────── */
    const OrderPanel = () => (
        <aside
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            style={{ background: '#FAF6F0' }}
        >
            {/* Order Header */}
            <div
                className="flex shrink-0 items-center justify-between px-4 py-3"
                style={{ background: '#2C1810' }}
            >
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4.5 w-4.5 text-white/90" />
                    <span className="text-sm font-extrabold text-white md:text-base">
                        Current Order
                    </span>
                    <span
                        className="text-sm font-black md:text-base"
                        style={{ color: '#D4A57A' }}
                    >
                        #{currentOrderNum}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    {/* Close button (mobile only) */}
                    <button
                        type="button"
                        onClick={() => setMobileCartOpen(false)}
                        className="cursor-pointer rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 lg:hidden"
                        title="Close"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                    <button
                        type="button"
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-red-600/20 disabled:opacity-30"
                        title="Clear order"
                    >
                        <Trash2 className="h-4.5 w-4.5 text-red-400" />
                    </button>
                </div>
            </div>

            {/* Waitress Selector */}
            <div
                className="shrink-0 px-4 pt-2.5 pb-2"
                style={{ borderBottom: '1px solid #E8DDD2' }}
            >
                <div className="mb-1.5 flex items-center justify-between">
                    <p
                        className="text-[11px] font-black tracking-wider uppercase"
                        style={{ color: '#9B7A5E' }}
                    >
                        Working Waitress
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setCreateWaitressError(null);
                            setAddWaitressOpen(true);
                        }}
                        className="flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all hover:scale-105"
                        style={{ background: '#EDE0D0', color: '#2C1810' }}
                        title="Add or assign working waitress"
                    >
                        <UserRoundPlus className="h-3.5 w-3.5" />
                        <span>+ Add Waitress</span>
                    </button>
                </div>
                <Select
                    value={selectedWaitressId}
                    onValueChange={(val) => {
                        setSelectedWaitressId(val);
                        if (val === '') {
                            toast.info(
                                'Switched to Walk-in (no waitress assigned)',
                            );
                        } else {
                            const w = waitressList.find(
                                (x) => String(x.id) === val,
                            );
                            if (w) {
                                if (w.current_number != null) {
                                    toast.info(
                                        `Selected ${w.name} (Working No. #${w.current_number})`,
                                    );
                                } else {
                                    toast.warning(
                                        `${w.name} has no working number assigned`,
                                    );
                                }
                            }
                        }
                    }}
                >
                    <SelectTrigger
                        className="h-9 w-full rounded-xl border text-xs font-bold"
                        style={{
                            background: '#F4ECE2',
                            borderColor: '#CCAB88',
                            color: '#1F110B',
                        }}
                    >
                        <SelectValue placeholder="Select working waitress…" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="" className="text-xs font-semibold">
                            Walk-in (no waitress assigned)
                        </SelectItem>
                        {waitressList.map((w) => (
                            <SelectItem
                                key={w.id}
                                value={String(w.id)}
                                className="text-xs font-semibold"
                            >
                                <span>{w.name}</span>
                                {w.current_number != null ? (
                                    <span className="ml-1.5 font-mono text-[10px] font-bold text-[#823d21] opacity-75">
                                        (Working No. #{w.current_number})
                                    </span>
                                ) : (
                                    <span className="ml-1.5 rounded border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                        ⚠️ No number
                                    </span>
                                )}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Prompt to assign a working number if the selected waitress doesn't have one */}
                {selectedWaitress &&
                    selectedWaitress.current_number == null && (
                        <div className="mt-2 flex animate-in items-center justify-between gap-2 rounded-xl border border-amber-300/90 bg-amber-50/90 p-2 text-xs duration-200 fade-in slide-in-from-top-1">
                            <div className="flex min-w-0 flex-1 items-center gap-1.5 text-amber-900">
                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                <span className="truncate text-[11px] font-bold">
                                    {selectedWaitress.name} has no working
                                    number
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    openAssignModal(selectedWaitress)
                                }
                                className="shrink-0 cursor-pointer rounded-lg bg-[#2C1810] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition-all hover:bg-[#4A2818] active:scale-95"
                            >
                                Assign Number
                            </button>
                        </div>
                    )}
            </div>

            {/* Scrollable Cart Items Container — Hidden Scrollbar */}
            <div className="pos-scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-4 py-2.5">
                {cart.length === 0 ? (
                    <div
                        className="flex h-full flex-col items-center justify-center text-center"
                        style={{ color: '#9B7A5E' }}
                    >
                        <ShoppingCart className="mb-2 h-10 w-10 opacity-25" />
                        <p className="text-sm font-extrabold">Cart is empty</p>
                        <p className="mt-1 text-xs opacity-75">
                            Tap a drink or snack to add it to order
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex items-center gap-2.5 rounded-xl p-2 transition-all"
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E8DDD2',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                }}
                            >
                                <img
                                    src={
                                        item.product.image_url ??
                                        '/images/drink-item-0.jpg'
                                    }
                                    alt={item.product.name}
                                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                    onError={(e) => {
                                        (
                                            e.currentTarget as HTMLImageElement
                                        ).src = '/images/drink-item-0.jpg';
                                    }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p
                                        className="truncate text-xs font-extrabold md:text-sm"
                                        style={{ color: '#1F110B' }}
                                    >
                                        {item.product.name}
                                    </p>
                                    <p
                                        className="text-xs font-bold"
                                        style={{ color: '#8A6B50' }}
                                    >
                                        ${item.product.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Quantity Stepper */}
                                <div
                                    className="flex items-center gap-1 rounded-lg p-0.5"
                                    style={{
                                        background: '#F4ECE2',
                                        border: '1px solid #D4B99A',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQty(item.product.id, -1)
                                        }
                                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#5C3A28] transition-colors hover:bg-white"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-5 text-center text-xs font-black text-[#1F110B]">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateQty(item.product.id, 1)
                                        }
                                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#5C3A28] transition-colors hover:bg-white"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>

                                {/* Item Line Total */}
                                <p
                                    className="w-13 text-right text-xs font-black md:text-sm"
                                    style={{ color: '#1F110B' }}
                                >
                                    $
                                    {(
                                        item.product.price * item.quantity
                                    ).toFixed(2)}
                                </p>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.product.id)}
                                    className="ml-0.5 cursor-pointer rounded p-1 text-red-400 hover:bg-red-50"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Fixed Section: Financial Totals + Payment Buttons + CTA + Status */}
            <div className="shrink-0 border-t border-[#E8DDD2] bg-[#FAF6F0]">
                {/* Financial Totals Card — Sits directly above Payment Buttons with zero gap */}
                <div className="border-b border-[#E8DDD2] bg-white px-4 py-2.5">
                    <div className="space-y-1 text-xs font-bold text-[#7A5A42] md:text-sm">
                        <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span className="font-mono text-sm font-extrabold text-[#1F110B]">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>
                                Discount
                                {discountType === 'percentage' &&
                                    discountAmount > 0 &&
                                    subtotal > 0 && (
                                        <span className="ml-1 text-[10px] text-[#9B7A5E]">
                                            (
                                            {(
                                                (discountAmount / subtotal) *
                                                100
                                            ).toFixed(1)}
                                            %)
                                        </span>
                                    )}
                            </span>
                            <span className="font-mono text-sm font-extrabold text-[#1F110B]">
                                ${discountAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Tax ({taxRate}%)</span>
                            <span className="font-mono text-sm font-extrabold text-[#1F110B]">
                                ${taxAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between border-t border-[#E8DDD2] pt-1.5">
                        <span className="text-base font-black text-[#1F110B]">
                            TOTAL
                        </span>
                        <span className="font-mono text-2xl font-black text-[#8B1A1A] md:text-3xl">
                            ${grandTotal.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Payment Buttons 2×2 */}
                <div className="grid grid-cols-2 gap-2 px-4 pt-2.5 pb-2">
                    {PAYMENT_METHODS.map((pm) => (
                        <button
                            key={pm.id}
                            type="button"
                            onClick={() =>
                                setSelectedPayment(
                                    pm.id as typeof selectedPayment,
                                )
                            }
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold text-white transition-all active:scale-95 md:py-3.5 md:text-sm"
                            style={{
                                background:
                                    selectedPayment === pm.id ? pm.ring : pm.bg,
                                boxShadow:
                                    selectedPayment === pm.id
                                        ? `0 0 0 2px ${pm.ring}`
                                        : 'none',
                                opacity: selectedPayment === pm.id ? 1 : 0.88,
                            }}
                        >
                            <pm.icon className="h-4.5 w-4.5" /> {pm.label}
                            {selectedPayment === pm.id && (
                                <CheckCircle2 className="h-4 w-4" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Complete Sale CTA */}
                <div className="px-4 pb-2">
                    <button
                        type="button"
                        disabled={cart.length === 0 || isProcessing}
                        onClick={handleCompleteSale}
                        className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl py-3.5 text-base font-black text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40 md:py-4 md:text-lg"
                        style={{
                            background:
                                'linear-gradient(135deg, #C6862A, #BA7A29)',
                        }}
                    >
                        <CheckCircle2 className="h-5.5 w-5.5" />
                        {isProcessing ? 'Processing…' : 'Complete Sale'}
                    </button>
                </div>

                {/* Status Footer — ONE Single Dark Container/Pill */}
                <div className="flex items-center justify-end px-4 py-1.5">
                    <div
                        className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 shadow-sm"
                        style={{ background: '#2C1810', color: '#FFFFFF' }}
                    >
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-white">
                                Online
                            </span>
                        </div>
                        <span className="h-3 w-[1px] bg-white/20" />
                        <span className="text-xs font-semibold text-white/80">
                            {orderSuccess ? '✓ Order saved!' : 'Ready to serve'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );

    /* ═══════════════════════════════════════════════════════════════════
       RENDER
       ═══════════════════════════════════════════════════════════════════ */
    return (
        <PosShell title="POS Terminal" activeNav="POS" headerCenter={searchBar}>
            <Head title="POS Terminal — MaMa Café" />

            {/* ── TWO-COLUMN: PRODUCT CATALOG + RIGHT ORDER PANEL ── */}
            <div className="flex h-full min-h-0 overflow-hidden">
                {/* ── CENTER: SCROLLABLE PRODUCT CATALOG ──────────────── */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    {/* Category Pills — WIDER & HIGHER PADDING */}
                    <div
                        className="pos-scrollbar-hidden flex shrink-0 items-center gap-3.5 overflow-x-auto px-4 py-3.5 select-none md:gap-4 md:px-6"
                        style={{
                            borderBottom: '1px solid #E8DDD2',
                            background: '#FAF6F0',
                        }}
                    >
                        <button
                            onClick={() => setSelectedCategoryId(null)}
                            className="flex min-h-12 shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl px-6 py-2.5 text-sm font-extrabold transition-all active:scale-95 md:min-h-13 md:px-7 md:py-3 md:text-base"
                            style={
                                selectedCategoryId === null
                                    ? {
                                          background: '#2C1810',
                                          color: '#fff',
                                          boxShadow:
                                              '0 4px 12px rgba(44,24,16,0.3)',
                                      }
                                    : {
                                          background: '#EDE0D0',
                                          color: '#5C3A28',
                                      }
                            }
                        >
                            <Coffee className="h-4 w-4 stroke-[2.25] md:h-5 md:w-5" />
                            All
                        </button>
                        {categories.map((cat) => {
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() =>
                                        setSelectedCategoryId(cat.id)
                                    }
                                    className="flex min-h-12 shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl px-6 py-2.5 text-sm font-extrabold transition-all active:scale-95 md:min-h-13 md:px-7 md:py-3 md:text-base"
                                    style={
                                        selectedCategoryId === cat.id
                                            ? {
                                                  background: '#2C1810',
                                                  color: '#fff',
                                                  boxShadow:
                                                      '0 4px 12px rgba(44,24,16,0.3)',
                                              }
                                            : {
                                                  background: '#EDE0D0',
                                                  color: '#5C3A28',
                                              }
                                    }
                                >
                                    {cat.image_url ? (
                                        <img
                                            src={cat.image_url}
                                            alt=""
                                            className="h-7 w-7 rounded-full object-cover md:h-8 md:w-8"
                                        />
                                    ) : (
                                        <Tag className="h-4 w-4 stroke-[2.25] md:h-5 md:w-5" />
                                    )}
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Product Grid — INDEPENDENTLY SCROLLABLE */}
                    <div className="pos-scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-2 md:p-5">
                        {filteredProducts.length === 0 ? (
                            <div
                                className="flex h-full flex-col items-center justify-center text-center"
                                style={{ color: '#9B7A5E' }}
                            >
                                <Coffee className="mb-3 h-12 w-12 opacity-30" />
                                <p className="text-sm font-bold">
                                    No products found
                                </p>
                                <p className="mt-1 text-xs opacity-70">
                                    Try selecting another category or searching
                                    again.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* ── MOBILE LIST VIEW (< md) ── */}
                                <div className="flex flex-col gap-0 md:hidden">
                                    {paginatedProducts.map((product) => {
                                        const cartItem = cart.find(
                                            (i) => i.product.id === product.id,
                                        );
                                        const inCart = !!cartItem;
                                        return (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 border-b px-3 py-3 transition-colors active:bg-[#F4ECE2]"
                                                style={{
                                                    borderColor: '#EDE0D0',
                                                }}
                                            >
                                                {/* ── Circle selector ── */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (inCart) {
                                                            removeItem(
                                                                product.id,
                                                            );
                                                        } else {
                                                            addToCart(product);
                                                        }
                                                    }}
                                                    className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all"
                                                    style={{
                                                        borderColor: inCart
                                                            ? '#2C1810'
                                                            : '#C4A98A',
                                                        background: inCart
                                                            ? '#2C1810'
                                                            : 'transparent',
                                                    }}
                                                    aria-label={
                                                        inCart
                                                            ? 'Remove from order'
                                                            : 'Add to order'
                                                    }
                                                >
                                                    {inCart && (
                                                        <svg
                                                            viewBox="0 0 10 8"
                                                            fill="none"
                                                            className="h-3.5 w-3.5"
                                                        >
                                                            <path
                                                                d="M1 4l3 3 5-6"
                                                                stroke="white"
                                                                strokeWidth="1.8"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>

                                                {/* ── Thumbnail ── */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addToCart(product)
                                                    }
                                                    className="h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl"
                                                >
                                                    <img
                                                        src={
                                                            product.image_url ??
                                                            '/images/drink-item-0.jpg'
                                                        }
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (
                                                                e.currentTarget as HTMLImageElement
                                                            ).src =
                                                                '/images/drink-item-0.jpg';
                                                        }}
                                                    />
                                                </button>

                                                {/* ── Name + price ── */}
                                                <div
                                                    className="flex min-w-0 flex-1 cursor-pointer flex-col"
                                                    onClick={() =>
                                                        addToCart(product)
                                                    }
                                                >
                                                    <p
                                                        className="line-clamp-2 text-sm leading-snug font-extrabold"
                                                        style={{
                                                            color: '#1F110B',
                                                        }}
                                                    >
                                                        {product.name}
                                                    </p>
                                                    <span
                                                        className="mt-1 text-sm font-black"
                                                        style={{
                                                            color: '#2C1810',
                                                        }}
                                                    >
                                                        $
                                                        {product.price.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>

                                                {/* ── Quantity stepper (visible when in cart) ── */}
                                                {inCart ? (
                                                    <div
                                                        className="flex shrink-0 items-center gap-1 rounded-xl p-0.5"
                                                        style={{
                                                            background:
                                                                '#F4ECE2',
                                                            border: '1px solid #D4B99A',
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (
                                                                    cartItem.quantity <=
                                                                    1
                                                                ) {
                                                                    removeItem(
                                                                        product.id,
                                                                    );
                                                                } else {
                                                                    updateQty(
                                                                        product.id,
                                                                        -1,
                                                                    );
                                                                }
                                                            }}
                                                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#5C3A28] transition-colors hover:bg-white"
                                                        >
                                                            <Minus className="h-3.5 w-3.5" />
                                                        </button>
                                                        <span className="w-5 text-center text-sm font-black text-[#1F110B]">
                                                            {cartItem.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateQty(
                                                                    product.id,
                                                                    1,
                                                                );
                                                            }}
                                                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#5C3A28] transition-colors hover:bg-white"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    /* Plus button when not in cart */
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            addToCart(product)
                                                        }
                                                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors"
                                                        style={{
                                                            background:
                                                                '#EDE0D0',
                                                            color: '#2C1810',
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ── DESKTOP GRID VIEW (md+) ── */}
                                <div className="hidden gap-3 pb-3 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5">
                                    {paginatedProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => addToCart(product)}
                                            className="group flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl border p-2.5 text-center transition-all select-none hover:-translate-y-1 hover:shadow-lg active:scale-95"
                                            style={{
                                                background: '#FFFFFF',
                                                borderColor: '#E8DDD2',
                                                boxShadow:
                                                    '0 2px 6px rgba(0,0,0,0.04)',
                                            }}
                                        >
                                            <div
                                                className="mt-1 w-full overflow-hidden rounded-xl bg-[#FAF6F0]"
                                                style={{ height: 95 }}
                                            >
                                                <img
                                                    src={
                                                        product.image_url ??
                                                        '/images/drink-item-0.jpg'
                                                    }
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (
                                                            e.currentTarget as HTMLImageElement
                                                        ).src =
                                                            '/images/drink-item-0.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-2 flex w-full flex-col items-center px-1">
                                                <p
                                                    className="line-clamp-2 w-full text-center text-xs leading-tight font-extrabold md:text-sm"
                                                    style={{ color: '#1F110B' }}
                                                >
                                                    {product.name}
                                                </p>
                                                <div
                                                    className="mt-1.5 inline-block rounded-full px-3 py-0.5 text-xs font-black text-white shadow-xs"
                                                    style={{
                                                        background: '#7c2b20',
                                                    }}
                                                >
                                                    ${product.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div
                        className="flex shrink-0 flex-col gap-2 border-t border-[#E8DDD2] select-none"
                        style={{ background: '#FAF6F0' }}
                    >
                        {/* Pagination */}
                        {filteredProducts.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between gap-3 px-5 pt-2">
                                <span
                                    className="text-xs font-medium"
                                    style={{ color: '#9B7A5E' }}
                                >
                                    {Math.min(
                                        filteredProducts.length,
                                        (safePage - 1) * ITEMS_PER_PAGE + 1,
                                    )}
                                    –
                                    {Math.min(
                                        safePage * ITEMS_PER_PAGE,
                                        filteredProducts.length,
                                    )}{' '}
                                    of {filteredProducts.length}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={safePage === 1}
                                        onClick={() =>
                                            setCurrentPage(safePage - 1)
                                        }
                                        className="flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition-colors disabled:opacity-40"
                                        style={{
                                            borderColor: '#D4B99A',
                                            color: '#5C3A28',
                                            background: '#F4ECE2',
                                        }}
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />{' '}
                                        Prev
                                    </button>
                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: '#5C3A28' }}
                                    >
                                        {safePage} / {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={safePage === totalPages}
                                        onClick={() =>
                                            setCurrentPage(safePage + 1)
                                        }
                                        className="flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition-colors disabled:opacity-40"
                                        style={{
                                            borderColor: '#D4B99A',
                                            color: '#5C3A28',
                                            background: '#F4ECE2',
                                        }}
                                    >
                                        Next{' '}
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action pills */}
                        <div className="flex items-center justify-center gap-2 px-3 py-2.5 md:gap-3 md:px-5">
                            {[
                                { icon: Tag, label: 'Discount' },
                                { icon: FileText, label: 'Note' },
                                { icon: UserRound, label: 'Customer' },
                                { icon: PauseCircle, label: 'Hold' },
                            ].map(({ icon: Icon, label }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => {
                                        if (label === 'Discount') {
                                            setDiscountInput(
                                                discountType === 'percentage'
                                                    ? subtotal > 0
                                                          ? (
                                                                (discountAmount /
                                                                    subtotal) *
                                                                100
                                                            ).toFixed(1)
                                                          : '0'
                                                    : discountAmount.toFixed(2),
                                            );
                                            setDiscountDialogOpen(true);
                                        }
                                    }}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-[#EDE0D0] active:scale-95 md:px-4"
                                    style={{
                                        borderColor: '#D4B99A',
                                        color: '#5C3A28',
                                        background: '#F4ECE2',
                                    }}
                                >
                                    <Icon className="h-3.5 w-3.5" />{' '}
                                    <span className="hidden sm:inline">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: DESKTOP ORDER PANEL (WIDER SIDEBAR) ────────────────── */}
                <div className="hidden w-[24rem] shrink-0 flex-col overflow-hidden pt-3 pr-4 pb-0 pl-2 select-none lg:flex xl:w-[28rem] 2xl:w-[32rem]">
                    <div
                        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-tl-2xl rounded-tr-2xl shadow-lg"
                        style={{
                            border: '1.5px solid #E8DDD2',
                            borderBottom: 'none',
                        }}
                    >
                        <OrderPanel />
                    </div>
                </div>
            </div>

            {/* ── MOBILE: Cart FAB ── */}
            <button
                type="button"
                onClick={() => setMobileCartOpen(true)}
                className="fixed right-5 bottom-5 z-50 flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl transition-all active:scale-95 lg:hidden"
                style={{ background: '#2C1810' }}
            >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                    <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
                        style={{ background: '#C6862A' }}
                    >
                        {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                )}
                <span>
                    {grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : 'Cart'}
                </span>
            </button>

            {/* ── MOBILE: Cart Drawer ── */}
            {mobileCartOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                        onClick={() => setMobileCartOpen(false)}
                    />
                    {/* Drawer */}
                    <div
                        className="fixed right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden rounded-t-3xl lg:hidden"
                        style={{ maxHeight: '85vh', background: '#FAF6F0' }}
                    >
                        {/* Drag handle */}
                        <div className="flex shrink-0 justify-center pt-3 pb-1">
                            <div
                                className="h-1 w-10 rounded-full"
                                style={{ background: '#D4B99A' }}
                            />
                        </div>
                        <OrderPanel />
                    </div>
                </>
            )}

            {/* ── Add Waitress Dialog ── */}
            <Dialog
                open={discountDialogOpen}
                onOpenChange={setDiscountDialogOpen}
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black text-[#2C1810]">
                            Add Discount
                        </DialogTitle>
                        <DialogDescription>
                            Apply a discount to this order as a percentage or a
                            fixed amount.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#F4ECE2] p-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setDiscountType('percentage');
                                    setDiscountInput('0');
                                }}
                                className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-extrabold transition-all ${discountType === 'percentage' ? 'bg-[#2C1810] text-white shadow-xs' : 'text-[#5C3A28] hover:bg-[#EDE0D0]'}`}
                            >
                                %
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setDiscountType('fixed');
                                    setDiscountInput('0');
                                }}
                                className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-extrabold transition-all ${discountType === 'fixed' ? 'bg-[#2C1810] text-white shadow-xs' : 'text-[#5C3A28] hover:bg-[#EDE0D0]'}`}
                            >
                                $ Fixed
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="discount-amount">
                                {discountType === 'percentage'
                                    ? `Discount % (0 – 100)`
                                    : 'Discount amount ($)'}
                            </Label>
                            <Input
                                id="discount-amount"
                                type="number"
                                min="0"
                                max={
                                    discountType === 'percentage'
                                        ? 100
                                        : subtotal
                                }
                                step={
                                    discountType === 'percentage' ? '1' : '0.01'
                                }
                                value={discountInput}
                                onChange={(event) =>
                                    setDiscountInput(event.target.value)
                                }
                                autoFocus
                            />
                            {discountType === 'percentage' &&
                                Number(discountInput || 0) > 0 && (
                                    <p className="text-xs font-semibold text-[#5C3A28]">
                                        Savings: $
                                        {Math.min(
                                            subtotal,
                                            (subtotal *
                                                Number(discountInput || 0)) /
                                                100,
                                        ).toFixed(2)}
                                    </p>
                                )}
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            type="button"
                            className="rounded-lg border px-4 py-2 text-sm font-bold"
                            onClick={() => setDiscountDialogOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-[#2C1810] px-4 py-2 text-sm font-bold text-white"
                            onClick={() => {
                                const value = Number(discountInput);
                                if (discountType === 'percentage') {
                                    const pct = Math.min(
                                        Math.max(value, 0),
                                        100,
                                    );
                                    setDiscountAmount(
                                        (subtotal * pct) / 100,
                                    );
                                } else {
                                    setDiscountAmount(
                                        Number.isFinite(value)
                                            ? Math.min(
                                                  Math.max(value, 0),
                                                  subtotal,
                                              )
                                            : 0,
                                    );
                                }
                                setDiscountDialogOpen(false);
                            }}
                        >
                            Apply Discount
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={saleConfirmOpen} onOpenChange={setSaleConfirmOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-[#2C1810]">
                            {selectedPayment === 'mobile_money'
                                ? 'Confirm EVC (USSD)'
                                : 'Confirm Order'}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            {selectedPayment === 'mobile_money'
                                ? 'Please confirm you have completed the mobile money payment.'
                                : 'Please confirm you want to place this order.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-xl border border-[#B9DCCF] bg-[#EAF7F1] p-4">
                        <div className="flex items-center justify-between text-sm font-bold text-[#2C1810]">
                            <span>Payment method</span>
                            <span className="capitalize">
                                {selectedPayment.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setSalePaymentStatus('paid');
                                    setSaleAmountPaid(grandTotal.toFixed(2));
                                }}
                                className={`rounded-lg border px-3 py-2 text-sm font-bold ${salePaymentStatus === 'paid' ? 'border-[#1B8B62] bg-[#D5F3E5] text-[#145C43]' : 'border-[#B9DCCF] bg-white text-[#5C3A28]'}`}
                            >
                                Paid in Full
                            </button>
                            <button
                                type="button"
                                onClick={() => setSalePaymentStatus('partial')}
                                className={`rounded-lg border px-3 py-2 text-sm font-bold ${salePaymentStatus === 'partial' ? 'border-[#C6862A] bg-[#FFF1D7] text-[#7A4B0B]' : 'border-[#B9DCCF] bg-white text-[#5C3A28]'}`}
                            >
                                Partial Payment
                            </button>
                        </div>
                        {salePaymentStatus === 'partial' && (
                            <div className="mt-3 space-y-1.5">
                                <Label
                                    htmlFor="sale-amount-paid"
                                    className="text-xs font-bold text-[#2C1810]"
                                >
                                    Amount paid now
                                </Label>
                                <Input
                                    id="sale-amount-paid"
                                    type="number"
                                    min="0.01"
                                    max={Math.max(0, grandTotal - 0.01)}
                                    step="0.01"
                                    value={saleAmountPaid}
                                    onChange={(event) =>
                                        setSaleAmountPaid(event.target.value)
                                    }
                                    className="border-[#B9DCCF] bg-white"
                                />
                                <p className="text-xs font-semibold text-[#5C3A28]">
                                    Remaining: $
                                    {Math.max(
                                        0,
                                        grandTotal -
                                            Number(saleAmountPaid || 0),
                                    ).toFixed(2)}
                                </p>
                            </div>
                        )}
                        <div className="mt-2 flex items-center justify-between border-t border-[#B9DCCF] pt-2 text-base font-black text-[#2C1810]">
                            <span>Total</span>
                            <span>${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            type="button"
                            className="rounded-lg border px-4 py-2 text-sm font-bold"
                            onClick={() => setSaleConfirmOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="rounded-lg bg-[#32D39B] px-5 py-2 text-sm font-black text-[#071B18]"
                            onClick={submitSale}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? 'Processing...'
                                : selectedPayment === 'mobile_money'
                                  ? salePaymentStatus === 'partial'
                                      ? 'Confirm Partial Payment'
                                      : 'Confirm I Have Paid'
                                  : salePaymentStatus === 'partial'
                                    ? 'Place Partial Order'
                                    : 'Place Order'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={addWaitressOpen}
                onOpenChange={(open) => {
                    setAddWaitressOpen(open);
                    if (!open) {
                        setCreateWaitressError(null);
                        setNewWaitressName('');
                        setNewWaitressPhone('');
                        setNewWaitressNumber('');
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle
                            className="flex items-center gap-2 text-base font-black"
                            style={{ color: '#2C1810' }}
                        >
                            <UserRoundPlus
                                className="h-5 w-5"
                                style={{ color: '#C6862A' }}
                            />
                            Add Working Waitress
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground">
                            Register a floor waitress profile and assign an
                            official working number from System Settings.
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-1">
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="waitress-name"
                                className="text-xs font-bold"
                                style={{ color: '#5C3A28' }}
                            >
                                Waitress Full Name{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <UserRound
                                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-50"
                                    style={{ color: '#8A6B50' }}
                                />
                                <Input
                                    id="waitress-name"
                                    placeholder="e.g. Amina Hassan"
                                    value={newWaitressName}
                                    onChange={(e) =>
                                        setNewWaitressName(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' &&
                                        handleCreateWaitress()
                                    }
                                    className="pl-9 text-sm"
                                    style={{ borderColor: '#CCAB88' }}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="waitress-phone"
                                className="text-xs font-bold"
                                style={{ color: '#5C3A28' }}
                            >
                                Phone Number
                                <span className="ml-1 font-normal opacity-60">
                                    (optional)
                                </span>
                            </Label>
                            <div className="relative">
                                <Phone
                                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-50"
                                    style={{ color: '#8A6B50' }}
                                />
                                <Input
                                    id="waitress-phone"
                                    placeholder="e.g. 0712345678"
                                    value={newWaitressPhone}
                                    onChange={(e) =>
                                        setNewWaitressPhone(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' &&
                                        handleCreateWaitress()
                                    }
                                    className="pl-9 text-sm"
                                    style={{ borderColor: '#CCAB88' }}
                                    type="tel"
                                />
                            </div>
                        </div>

                        {/* Working Waitress Number Configuration */}
                        <div
                            className="flex flex-col gap-2 rounded-xl border p-3.5"
                            style={{
                                borderColor: '#E8DDD2',
                                background: '#FDFBF8',
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="waitress-number"
                                    className="text-xs font-bold"
                                    style={{ color: '#5C3A28' }}
                                >
                                    Working Waitress Number
                                    <span className="ml-1 font-normal opacity-60">
                                        (Floor Station No.)
                                    </span>
                                </Label>
                                <span className="text-[10px] font-bold tracking-wider text-[#8A6B50] uppercase">
                                    System Settings
                                </span>
                            </div>

                            {/* Dropdown to pick from registered numbers in Settings */}
                            {availableWorkingNumbers.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-medium text-[#7A5A42]">
                                        Choose from registered numbers in
                                        Settings:
                                    </span>
                                    <Select
                                        value={newWaitressNumber}
                                        onValueChange={(val) =>
                                            setNewWaitressNumber(val)
                                        }
                                    >
                                        <SelectTrigger
                                            className="h-9 w-full text-xs font-semibold"
                                            style={{
                                                borderColor: '#CCAB88',
                                                background: '#FFFFFF',
                                            }}
                                        >
                                            <SelectValue placeholder="Select registered working number…" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableWorkingNumbers.map(
                                                (num) => {
                                                    const assignedTo =
                                                        waitressList.find(
                                                            (w) =>
                                                                String(
                                                                    w.current_number,
                                                                ) ===
                                                                String(num),
                                                        );
                                                    return (
                                                        <SelectItem
                                                            key={num}
                                                            value={String(num)}
                                                            className="text-xs font-semibold"
                                                        >
                                                            Working No. #{num}{' '}
                                                            {assignedTo
                                                                ? `— (In use by ${assignedTo.name})`
                                                                : '— (Available)'}
                                                        </SelectItem>
                                                    );
                                                },
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Direct number input */}
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#7A5A42]">
                                    {availableWorkingNumbers.length > 0
                                        ? 'Or enter custom working number:'
                                        : 'Enter working waitress number:'}
                                </span>
                                <div className="relative">
                                    <Hash
                                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-50"
                                        style={{ color: '#8A6B50' }}
                                    />
                                    <Input
                                        id="waitress-number"
                                        placeholder="e.g. 101 or 614451036"
                                        value={newWaitressNumber}
                                        onChange={(e) =>
                                            setNewWaitressNumber(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                ),
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            handleCreateWaitress()
                                        }
                                        className="pl-9 font-mono text-sm"
                                        style={{
                                            borderColor: '#CCAB88',
                                            background: '#FFFFFF',
                                        }}
                                        inputMode="numeric"
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {/* Quick-select pill badges */}
                            {availableWorkingNumbers.length > 0 && (
                                <div className="pt-1">
                                    <span className="mb-1 block text-[10px] text-muted-foreground">
                                        Quick pick registered numbers from
                                        Settings:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {availableWorkingNumbers.map((num) => {
                                            const isSelected =
                                                String(newWaitressNumber) ===
                                                String(num);
                                            return (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() =>
                                                        setNewWaitressNumber(
                                                            String(num),
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold transition-all ${
                                                        isSelected
                                                            ? 'scale-105 bg-[#2C1810] text-white shadow-xs'
                                                            : 'bg-[#EDE0D0] text-[#5C3A28] hover:bg-[#E2D2BE]'
                                                    }`}
                                                >
                                                    #{num}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <p className="text-[11px] text-muted-foreground">
                                Official working number configured in System
                                Settings for floor orders and receipts.
                            </p>
                        </div>

                        {/* Error message */}
                        {createWaitressError && (
                            <p
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700"
                                style={{ background: '#FEE2E2' }}
                            >
                                {createWaitressError}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            onClick={() => setAddWaitressOpen(false)}
                            className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-bold transition-colors hover:bg-[#EDE0D0]"
                            style={{ borderColor: '#D4B99A', color: '#5C3A28' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateWaitress}
                            disabled={
                                !newWaitressName.trim() || isCreatingWaitress
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                            style={{
                                background:
                                    'linear-gradient(135deg, #C6862A, #BA7A29)',
                            }}
                        >
                            {isCreatingWaitress ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <UserRoundPlus className="h-4 w-4" />
                                    Save Waitress
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Assign Working Number Dialog ── */}
            <Dialog
                open={assignModalOpen}
                onOpenChange={(open) => {
                    setAssignModalOpen(open);
                    if (!open) {
                        setTargetWaitress(null);
                        setAssignNumberValue('');
                        setAssignNumberError(null);
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle
                            className="flex items-center gap-2 text-base font-black"
                            style={{ color: '#2C1810' }}
                        >
                            <Hash
                                className="h-5 w-5"
                                style={{ color: '#C6862A' }}
                            />
                            Assign Working Number
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground">
                            Assign an official working floor station number to{' '}
                            <strong className="text-foreground">
                                {targetWaitress?.name}
                            </strong>
                            .
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-1">
                        <div
                            className="rounded-xl border p-3"
                            style={{
                                borderColor: '#E8DDD2',
                                background: '#FDFBF8',
                            }}
                        >
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-muted-foreground">
                                    Staff Member:
                                </span>
                                <span className="font-bold text-[#2C1810]">
                                    {targetWaitress?.name}
                                </span>
                            </div>
                            {targetWaitress?.phone && (
                                <div className="mt-1 flex items-center justify-between text-xs">
                                    <span className="font-semibold text-muted-foreground">
                                        Phone:
                                    </span>
                                    <span className="font-mono text-muted-foreground">
                                        {targetWaitress.phone}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Working Number Selection */}
                        <div
                            className="flex flex-col gap-2 rounded-xl border p-3.5"
                            style={{
                                borderColor: '#E8DDD2',
                                background: '#FDFBF8',
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="assign-working-number"
                                    className="text-xs font-bold"
                                    style={{ color: '#5C3A28' }}
                                >
                                    Working Waitress Number{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <span className="text-[10px] font-bold tracking-wider text-[#8A6B50] uppercase">
                                    System Settings
                                </span>
                            </div>

                            {/* Dropdown to pick from registered numbers in Settings */}
                            {availableWorkingNumbers.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-medium text-[#7A5A42]">
                                        Choose from registered numbers in
                                        Settings:
                                    </span>
                                    <Select
                                        value={assignNumberValue}
                                        onValueChange={(val) =>
                                            setAssignNumberValue(val)
                                        }
                                    >
                                        <SelectTrigger
                                            className="h-9 w-full text-xs font-semibold"
                                            style={{
                                                borderColor: '#CCAB88',
                                                background: '#FFFFFF',
                                            }}
                                        >
                                            <SelectValue placeholder="Select registered working number…" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableWorkingNumbers.map(
                                                (num) => {
                                                    const assignedTo =
                                                        waitressList.find(
                                                            (w) =>
                                                                String(
                                                                    w.current_number,
                                                                ) ===
                                                                    String(
                                                                        num,
                                                                    ) &&
                                                                w.id !==
                                                                    targetWaitress?.id,
                                                        );
                                                    return (
                                                        <SelectItem
                                                            key={num}
                                                            value={String(num)}
                                                            className="text-xs font-semibold"
                                                        >
                                                            Working No. #{num}{' '}
                                                            {assignedTo
                                                                ? `— (In use by ${assignedTo.name})`
                                                                : '— (Available)'}
                                                        </SelectItem>
                                                    );
                                                },
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Direct number input */}
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-[#7A5A42]">
                                    {availableWorkingNumbers.length > 0
                                        ? 'Or enter custom working number:'
                                        : 'Enter working waitress number:'}
                                </span>
                                <div className="relative">
                                    <Hash
                                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-50"
                                        style={{ color: '#8A6B50' }}
                                    />
                                    <Input
                                        id="assign-working-number"
                                        placeholder="e.g. 101 or 614451036"
                                        value={assignNumberValue}
                                        onChange={(e) =>
                                            setAssignNumberValue(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                ),
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            handleAssignWorkingNumber()
                                        }
                                        className="pl-9 font-mono text-sm"
                                        style={{
                                            borderColor: '#CCAB88',
                                            background: '#FFFFFF',
                                        }}
                                        inputMode="numeric"
                                        maxLength={10}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Quick-select pill badges */}
                            {availableWorkingNumbers.length > 0 && (
                                <div className="pt-1">
                                    <span className="mb-1 block text-[10px] text-muted-foreground">
                                        Quick pick registered numbers:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {availableWorkingNumbers.map((num) => {
                                            const isSelected =
                                                String(assignNumberValue) ===
                                                String(num);
                                            return (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() =>
                                                        setAssignNumberValue(
                                                            String(num),
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold transition-all ${
                                                        isSelected
                                                            ? 'scale-105 bg-[#2C1810] text-white shadow-xs'
                                                            : 'bg-[#EDE0D0] text-[#5C3A28] hover:bg-[#E2D2BE]'
                                                    }`}
                                                >
                                                    #{num}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error message */}
                        {assignNumberError && (
                            <p
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700"
                                style={{ background: '#FEE2E2' }}
                            >
                                {assignNumberError}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            onClick={() => setAssignModalOpen(false)}
                            className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-bold transition-colors hover:bg-[#EDE0D0]"
                            style={{ borderColor: '#D4B99A', color: '#5C3A28' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAssignWorkingNumber}
                            disabled={
                                !assignNumberValue.trim() || isAssigningNumber
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
                            style={{
                                background:
                                    'linear-gradient(135deg, #C6862A, #BA7A29)',
                            }}
                        >
                            {isAssigningNumber ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <Hash className="h-4 w-4" />
                                    Assign Number
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PosShell>
    );
}
