import React, { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Search,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Coffee,
    CheckCircle2,
    DollarSign,
    Smartphone,
    UserCheck,
    Hash,
    Receipt,
} from 'lucide-react';

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

interface RecentOrder {
    id: number;
    order_number: string;
    fixed_number: number | null;
    waitress_name: string;
    order_type: string;
    total: number;
    payment_status: string;
    payment_method: string;
    created_at: string;
}

interface Props {
    categories: Category[];
    products: Product[];
    waitresses: Waitress[];
    recentOrders: RecentOrder[];
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function PosIndex({
    categories,
    products,
    waitresses,
    recentOrders,
}: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [cashTendered, setCashTendered] = useState('');

    const form = useForm({
        order_type: 'dine_in' as 'dine_in' | 'takeaway',
        fixed_number: '',
        waitress_id: '',
        payment_method: 'cash' as 'cash' | 'mobile_money' | 'card' | 'credit',
        payment_status: 'paid' as 'paid' | 'partial' | 'unpaid',
        amount_paid: '',
        discount: '0',
        items: [] as { product_id: number; quantity: number }[],
    });

    // Filter Products
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory =
                selectedCategoryId === null ||
                p.category_id === selectedCategoryId;
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategoryId, searchQuery]);

    // Cart calculations
    const subtotal = useMemo(() => {
        return cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0,
        );
    }, [cart]);

    const discountAmount = Number(form.data.discount || 0);
    const grandTotal = Math.max(0, subtotal - discountAmount);

    const cashChange = useMemo(() => {
        const tendered = Number(cashTendered || 0);
        return Math.max(0, tendered - grandTotal);
    }, [cashTendered, grandTotal]);

    // Cart Handlers
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id,
            );
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.product.id === productId) {
                            const newQty = item.quantity + delta;
                            return newQty > 0
                                ? { ...item, quantity: newQty }
                                : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[],
        );
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setCashTendered('');
    };

    // Submit POS Order
    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const itemsPayload = cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
        }));

        form.transform((data) => ({
            ...data,
            items: itemsPayload,
            amount_paid:
                data.payment_status === 'paid'
                    ? grandTotal.toString()
                    : data.amount_paid,
        }));

        form.post('/pos/orders', {
            onSuccess: () => {
                setIsCheckoutOpen(false);
                clearCart();
                form.reset();
            },
        });
    };

    return (
        <>
            <Head title="POS Terminal - MaMa Café" />

            <div className="animate-in p-6 duration-1000 ease-in-out fade-in slide-in-from-bottom-6">
                {/* Main POS Interface Grid (Left Menu Catalog + Right Live Cart) */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* Left & Middle Area: Product Catalog (Cols 7/12) */}
                    <div className="space-y-5 lg:col-span-7">
                        {/* Search & Category Pills */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search beverages, coffee, snacks..."
                                    className="h-10 bg-card pl-9"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>

                            {/* Category Filter Tabs */}
                            <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
                                <Button
                                    variant={
                                        selectedCategoryId === null
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    className={`h-8 shrink-0 rounded-full text-xs font-semibold ${
                                        selectedCategoryId === null
                                            ? 'bg-[#823d21] text-white shadow-sm hover:bg-[#682e18]'
                                            : 'shadow-xs'
                                    }`}
                                    onClick={() => setSelectedCategoryId(null)}
                                >
                                    All Items ({products.length})
                                </Button>
                                {categories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant={
                                            selectedCategoryId === cat.id
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className={`h-8 shrink-0 rounded-full text-xs font-semibold ${
                                            selectedCategoryId === cat.id
                                                ? 'bg-[#823d21] text-white shadow-sm hover:bg-[#682e18]'
                                                : 'shadow-xs'
                                        }`}
                                        onClick={() =>
                                            setSelectedCategoryId(cat.id)
                                        }
                                    >
                                        {cat.name} ({cat.products_count})
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Product Cards Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {filteredProducts.length === 0 ? (
                                <div className="col-span-full rounded-xl border bg-card py-12 text-center text-muted-foreground">
                                    <Coffee className="mx-auto mb-2 h-10 w-10 text-[#823d21]/40" />
                                    <p className="text-sm font-semibold">
                                        No products found
                                    </p>
                                    <p className="text-xs">
                                        Try selecting a different category or
                                        search term.
                                    </p>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-card p-3 shadow-xs transition-all duration-200 select-none hover:border-[#823d21] hover:shadow-md"
                                    >
                                        <div>
                                            {/* Product Image Container / Placeholder */}
                                            <div className="relative mb-2.5 flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-[#823d21]/5 to-amber-500/10">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-[#823d21]/40 transition-colors group-hover:text-[#823d21]/60">
                                                        <Coffee className="h-8 w-8" />
                                                    </div>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className="absolute top-2 left-2 border-border bg-background/90 px-1.5 py-0 text-[10px] font-medium shadow-xs backdrop-blur-sm"
                                                >
                                                    {product.category_name}
                                                </Badge>
                                                <span className="absolute right-2 bottom-2 rounded-md bg-[#823d21] px-2 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
                                                    $
                                                    {Number(
                                                        product.price,
                                                    ).toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-[#823d21]">
                                                    {product.name}
                                                </h3>
                                                {product.description && (
                                                    <p className="line-clamp-2 text-[11px] text-muted-foreground">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between border-t pt-2 text-xs font-semibold text-muted-foreground group-hover:text-[#823d21]">
                                            <span>Add to order</span>
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#823d21]/10 transition-colors group-hover:bg-[#823d21] group-hover:text-white">
                                                <Plus className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Area: Live Order & Cart Panel (Cols 5/12) */}
                    <div className="space-y-4 lg:col-span-5">
                        <div className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
                            {/* Order Customer Settings */}
                            <div className="space-y-4 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-base font-semibold">
                                        <Receipt className="h-4 w-4 text-[#823d21]" />{' '}
                                        Current Order
                                    </h2>
                                    <div className="flex gap-1 rounded-lg bg-muted p-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                form.setData(
                                                    'order_type',
                                                    'dine_in',
                                                )
                                            }
                                            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                                form.data.order_type ===
                                                'dine_in'
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            Dine In
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                form.setData(
                                                    'order_type',
                                                    'takeaway',
                                                )
                                            }
                                            className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                                form.data.order_type ===
                                                'takeaway'
                                                    ? 'bg-background text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            Takeaway
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label
                                            htmlFor="waitress"
                                            className="flex items-center gap-1 text-xs"
                                        >
                                            <UserCheck className="h-3 w-3 text-[#823d21]" />{' '}
                                            Waitress
                                        </Label>
                                        <Select
                                            value={
                                                form.data.waitress_id || 'none'
                                            }
                                            onValueChange={(value) => {
                                                const wId =
                                                    value === 'none'
                                                        ? ''
                                                        : value;
                                                const w = waitresses.find(
                                                    (item) =>
                                                        String(item.id) === wId,
                                                );
                                                form.setData((prev) => ({
                                                    ...prev,
                                                    waitress_id: wId,
                                                    fixed_number:
                                                        w?.current_number
                                                            ? String(
                                                                  w.current_number,
                                                              )
                                                            : prev.fixed_number,
                                                }));
                                            }}
                                        >
                                            <SelectTrigger
                                                id="waitress"
                                                className="mt-1 h-9 w-full text-xs"
                                            >
                                                <SelectValue placeholder="Walk-in / None" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Walk-in / None
                                                </SelectItem>
                                                {waitresses.map((w) => (
                                                    <SelectItem
                                                        key={w.id}
                                                        value={String(w.id)}
                                                    >
                                                        {w.name}{' '}
                                                        {w.range_start
                                                            ? `(#${w.range_start}-${w.range_end})`
                                                            : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="fixed_no"
                                            className="flex items-center gap-1 text-xs"
                                        >
                                            <Hash className="h-3 w-3 text-amber-600" />{' '}
                                            Table / Fixed #
                                        </Label>
                                        <Input
                                            id="fixed_no"
                                            type="number"
                                            placeholder="e.g. 101"
                                            className="mt-1 h-9 font-mono text-xs shadow-sm"
                                            value={form.data.fixed_number}
                                            onChange={(e) =>
                                                form.setData(
                                                    'fixed_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="max-h-[320px] min-h-[200px] space-y-3 overflow-y-auto pr-1">
                                {cart.length === 0 ? (
                                    <div className="space-y-2 py-12 text-center text-muted-foreground">
                                        <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground/40" />
                                        <p className="text-xs font-medium">
                                            Cart is currently empty
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Select products from the menu to
                                            build order.
                                        </p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border bg-card p-2.5 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-semibold text-foreground">
                                                    {item.product.name}
                                                </p>
                                                <p className="font-mono text-[11px] text-muted-foreground">
                                                    $
                                                    {item.product.price.toFixed(
                                                        2,
                                                    )}{' '}
                                                    × {item.quantity}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center rounded-md border bg-background shadow-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product.id,
                                                                -1,
                                                            )
                                                        }
                                                        className="rounded-l-md p-1 text-muted-foreground hover:bg-muted"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-7 text-center font-mono text-xs font-semibold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product.id,
                                                                1,
                                                            )
                                                        }
                                                        className="rounded-r-md p-1 text-muted-foreground hover:bg-muted"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <span className="w-16 text-right font-mono text-xs font-bold">
                                                    $
                                                    {(
                                                        item.product.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.product.id,
                                                        )
                                                    }
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Totals Summary */}
                            <div className="space-y-2 border-t pt-4 text-xs">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono font-medium">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Discount ($)</span>
                                    <Input
                                        type="number"
                                        step="0.50"
                                        min="0"
                                        className="h-7 w-20 p-1 text-right font-mono text-xs shadow-sm"
                                        value={form.data.discount}
                                        onChange={(e) =>
                                            form.setData(
                                                'discount',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex justify-between border-t pt-2 text-base font-bold text-foreground">
                                    <span>Total Payable</span>
                                    <span className="font-mono text-lg text-[#823d21]">
                                        ${grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Cart Actions */}
                            <div className="flex gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={clearCart}
                                    disabled={cart.length === 0}
                                    className="flex-1 text-xs"
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={cart.length === 0}
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="flex-2 gap-1.5 bg-[#823d21] text-xs font-semibold text-white shadow-sm hover:bg-[#682e18]"
                                >
                                    <CreditCard className="h-4 w-4" /> Checkout
                                    & Pay (${grandTotal.toFixed(2)})
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout & Payment Modal */}
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-[#823d21]">
                                <CreditCard className="h-5 w-5" /> Complete POS
                                Sale
                            </DialogTitle>
                            <DialogDescription>
                                Select payment method and confirm customer
                                transaction.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleCheckoutSubmit}
                            className="space-y-5 py-2"
                        >
                            {/* Amount Payable Banner */}
                            <div className="rounded-xl border border-[#823d21]/20 bg-[#823d21]/10 p-4 text-center">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">
                                    Total Amount Due
                                </p>
                                <p className="mt-1 font-mono text-3xl font-bold text-[#823d21]">
                                    ${grandTotal.toFixed(2)}
                                </p>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="space-y-2">
                                <Label className="text-xs">
                                    Payment Method
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        {
                                            id: 'cash',
                                            label: 'Cash',
                                            icon: DollarSign,
                                        },
                                        {
                                            id: 'mobile_money',
                                            label: 'Mobile Money',
                                            icon: Smartphone,
                                        },
                                        {
                                            id: 'card',
                                            label: 'Card',
                                            icon: CreditCard,
                                        },
                                        {
                                            id: 'credit',
                                            label: 'Customer Credit',
                                            icon: Receipt,
                                        },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() =>
                                                form.setData(
                                                    'payment_method',
                                                    m.id as any,
                                                )
                                            }
                                            className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-semibold transition-all ${
                                                form.data.payment_method ===
                                                m.id
                                                    ? 'border-[#823d21] bg-[#823d21]/10 text-[#823d21] shadow-sm ring-1 ring-[#823d21]'
                                                    : 'bg-background text-muted-foreground shadow-xs hover:bg-muted hover:shadow-sm'
                                            }`}
                                        >
                                            <m.icon className="h-4 w-4 shrink-0" />
                                            <span>{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cash Change Calculator */}
                            {form.data.payment_method === 'cash' && (
                                <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="tendered"
                                            className="text-xs"
                                        >
                                            Cash Tendered ($)
                                        </Label>
                                        <Input
                                            id="tendered"
                                            type="number"
                                            step="0.50"
                                            placeholder="e.g. 20.00"
                                            className="font-mono text-sm shadow-sm"
                                            value={cashTendered}
                                            onChange={(e) =>
                                                setCashTendered(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex justify-between border-t pt-1 text-xs font-semibold">
                                        <span className="text-muted-foreground">
                                            Change Due to Customer:
                                        </span>
                                        <span className="font-mono text-sm text-emerald-600">
                                            ${cashChange.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Payment Status Selector */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="payment_status"
                                    className="text-xs"
                                >
                                    Payment Settlement
                                </Label>
                                <Select
                                    value={form.data.payment_status}
                                    onValueChange={(value) =>
                                        form.setData(
                                            'payment_status',
                                            value as
                                                'paid' | 'partial' | 'unpaid',
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="payment_status"
                                        className="h-9 w-full text-xs"
                                    >
                                        <SelectValue placeholder="Select payment status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">
                                            Full Payment Received
                                        </SelectItem>
                                        <SelectItem value="partial">
                                            Partial Payment
                                        </SelectItem>
                                        <SelectItem value="unpaid">
                                            Unpaid / Deferred
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {form.data.payment_status === 'partial' && (
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="amount_paid"
                                        className="text-xs"
                                    >
                                        Amount Paid ($)
                                    </Label>
                                    <Input
                                        id="amount_paid"
                                        type="number"
                                        step="0.01"
                                        className="shadow-sm"
                                        value={form.data.amount_paid}
                                        onChange={(e) =>
                                            form.setData(
                                                'amount_paid',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                            )}

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCheckoutOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="gap-2 bg-[#823d21] font-semibold text-white hover:bg-[#682e18]"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {form.processing
                                        ? 'Processing...'
                                        : 'Complete Sale & Print Receipt'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

PosIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'POS Terminal', href: '/pos' }]}>
        {page}
    </AppLayout>
);
