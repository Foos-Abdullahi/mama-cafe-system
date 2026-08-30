import React, { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
    ArrowLeft,
    CheckCircle2,
    Printer,
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

export default function PosIndex({ categories, products, waitresses, recentOrders }: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
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
            const matchesCategory = selectedCategoryId === null || p.category_id === selectedCategoryId;
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category_name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategoryId, searchQuery]);

    // Cart calculations
    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.product.id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
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
            amount_paid: data.payment_status === 'paid' ? grandTotal.toString() : data.amount_paid,
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

            <div className="space-y-6 p-6">
                {/* POS Header Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#823d21] text-white shadow-sm">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                Point of Sale Terminal
                            </h1>
                            <p className="text-xs text-muted-foreground">Fast cashier counter ordering & receipt checkout</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main POS Interface Grid (Left Menu Catalog + Right Live Cart) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left & Middle Area: Product Catalog (Cols 7/12) */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* Search & Category Pills */}
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search beverages, coffee, snacks..."
                                    className="pl-9 h-10 bg-card"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Filter Tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                <Button
                                    variant={selectedCategoryId === null ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-8 text-xs font-semibold rounded-full shrink-0 ${
                                        selectedCategoryId === null ? 'bg-[#823d21] hover:bg-[#682e18] text-white' : ''
                                    }`}
                                    onClick={() => setSelectedCategoryId(null)}
                                >
                                    All Items ({products.length})
                                </Button>
                                {categories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                                        size="sm"
                                        className={`h-8 text-xs font-semibold rounded-full shrink-0 ${
                                            selectedCategoryId === cat.id ? 'bg-[#823d21] hover:bg-[#682e18] text-white' : ''
                                        }`}
                                        onClick={() => setSelectedCategoryId(cat.id)}
                                    >
                                        {cat.name} ({cat.products_count})
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Product Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredProducts.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl bg-card">
                                    <Coffee className="h-10 w-10 mx-auto mb-2 text-[#823d21]/40" />
                                    <p className="font-semibold text-sm">No products found</p>
                                    <p className="text-xs">Try selecting a different category or search term.</p>
                                </div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="group relative flex flex-col justify-between rounded-xl border bg-card p-3.5 shadow-xs transition-all duration-200 hover:border-[#823d21] hover:shadow-md cursor-pointer select-none"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/50 font-normal">
                                                    {product.category_name}
                                                </Badge>
                                                <span className="font-mono font-bold text-sm text-[#823d21]">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-[#823d21] transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-[11px] text-muted-foreground line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between pt-2 border-t text-xs font-semibold text-muted-foreground group-hover:text-[#823d21]">
                                            <span>Add to order</span>
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#823d21]/10 group-hover:bg-[#823d21] group-hover:text-white transition-colors">
                                                <Plus className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Area: Live Order & Cart Panel (Cols 5/12) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-5">
                            {/* Order Customer Settings */}
                            <div className="space-y-4 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold text-base flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-[#823d21]" /> Current Order
                                    </h2>
                                    <div className="flex rounded-lg bg-muted p-1 gap-1">
                                        <button
                                            type="button"
                                            onClick={() => form.setData('order_type', 'dine_in')}
                                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                                form.data.order_type === 'dine_in'
                                                    ? 'bg-background text-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            Dine In
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => form.setData('order_type', 'takeaway')}
                                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                                form.data.order_type === 'takeaway'
                                                    ? 'bg-background text-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            Takeaway
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="waitress" className="text-xs flex items-center gap-1">
                                            <UserCheck className="h-3 w-3 text-[#823d21]" /> Waitress
                                        </Label>
                                        <select
                                            id="waitress"
                                            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={form.data.waitress_id}
                                            onChange={(e) => {
                                                const wId = e.target.value;
                                                const w = waitresses.find((item) => String(item.id) === wId);
                                                form.setData((prev) => ({
                                                    ...prev,
                                                    waitress_id: wId,
                                                    fixed_number: w?.current_number ? String(w.current_number) : prev.fixed_number,
                                                }));
                                            }}
                                        >
                                            <option value="">— Walk-in / None —</option>
                                            {waitresses.map((w) => (
                                                <option key={w.id} value={w.id}>
                                                    {w.name} {w.range_start ? `(#${w.range_start}-${w.range_end})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="fixed_no" className="text-xs flex items-center gap-1">
                                            <Hash className="h-3 w-3 text-amber-600" /> Table / Fixed #
                                        </Label>
                                        <Input
                                            id="fixed_no"
                                            type="number"
                                            placeholder="e.g. 101"
                                            className="mt-1 h-9 text-xs font-mono"
                                            value={form.data.fixed_number}
                                            onChange={(e) => form.setData('fixed_number', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="space-y-3 min-h-[200px] max-h-[320px] overflow-y-auto pr-1">
                                {cart.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground space-y-2">
                                        <ShoppingBag className="h-8 w-8 mx-auto text-muted-foreground/40" />
                                        <p className="text-xs font-medium">Cart is currently empty</p>
                                        <p className="text-[11px] text-muted-foreground">Select products from the menu to build order.</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg border bg-muted/20"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-xs text-foreground truncate">{item.product.name}</p>
                                                <p className="text-[11px] font-mono text-muted-foreground">
                                                    ${item.product.price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center rounded-md border bg-background">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.product.id, -1)}
                                                        className="p-1 hover:bg-muted text-muted-foreground rounded-l-md"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-7 text-center text-xs font-semibold font-mono">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.product.id, 1)}
                                                        className="p-1 hover:bg-muted text-muted-foreground rounded-r-md"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <span className="w-16 text-right font-mono font-bold text-xs">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Cart Totals Summary */}
                            <div className="border-t pt-4 space-y-2 text-xs">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span>Discount ($)</span>
                                    <Input
                                        type="number"
                                        step="0.50"
                                        min="0"
                                        className="w-20 h-7 text-xs text-right font-mono p-1"
                                        value={form.data.discount}
                                        onChange={(e) => form.setData('discount', e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-between text-base font-bold text-foreground border-t pt-2">
                                    <span>Total Payable</span>
                                    <span className="font-mono text-[#823d21] text-lg">${grandTotal.toFixed(2)}</span>
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
                                    className="flex-2 bg-[#823d21] hover:bg-[#682e18] text-white font-semibold text-xs gap-1.5 shadow-sm"
                                >
                                    <CreditCard className="h-4 w-4" /> Checkout & Pay (${grandTotal.toFixed(2)})
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
                                <CreditCard className="h-5 w-5" /> Complete POS Sale
                            </DialogTitle>
                            <DialogDescription>
                                Select payment method and confirm customer transaction.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCheckoutSubmit} className="space-y-5 py-2">
                            {/* Amount Payable Banner */}
                            <div className="rounded-xl bg-[#823d21]/10 border border-[#823d21]/20 p-4 text-center">
                                <p className="text-xs uppercase font-semibold text-muted-foreground">Total Amount Due</p>
                                <p className="text-3xl font-bold font-mono text-[#823d21] mt-1">${grandTotal.toFixed(2)}</p>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="space-y-2">
                                <Label className="text-xs">Payment Method</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'cash', label: 'Cash', icon: DollarSign },
                                        { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
                                        { id: 'card', label: 'Card', icon: CreditCard },
                                        { id: 'credit', label: 'Customer Credit', icon: Receipt },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => form.setData('payment_method', m.id as any)}
                                            className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                                                form.data.payment_method === m.id
                                                    ? 'border-[#823d21] bg-[#823d21]/10 text-[#823d21] ring-1 ring-[#823d21]'
                                                    : 'bg-background hover:bg-muted text-muted-foreground'
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
                                <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tendered" className="text-xs">Cash Tendered ($)</Label>
                                        <Input
                                            id="tendered"
                                            type="number"
                                            step="0.50"
                                            placeholder="e.g. 20.00"
                                            className="font-mono text-sm"
                                            value={cashTendered}
                                            onChange={(e) => setCashTendered(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold pt-1 border-t">
                                        <span className="text-muted-foreground">Change Due to Customer:</span>
                                        <span className="font-mono text-emerald-600 text-sm">${cashChange.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Payment Status Selector */}
                            <div className="grid gap-2">
                                <Label htmlFor="payment_status" className="text-xs">Payment Settlement</Label>
                                <select
                                    id="payment_status"
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                                    value={form.data.payment_status}
                                    onChange={(e) => form.setData('payment_status', e.target.value as any)}
                                >
                                    <option value="paid">Full Payment Received</option>
                                    <option value="partial">Partial Payment</option>
                                    <option value="unpaid">Unpaid / Deferred</option>
                                </select>
                            </div>

                            {form.data.payment_status === 'partial' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="amount_paid" className="text-xs">Amount Paid ($)</Label>
                                    <Input
                                        id="amount_paid"
                                        type="number"
                                        step="0.01"
                                        value={form.data.amount_paid}
                                        onChange={(e) => form.setData('amount_paid', e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="bg-[#823d21] hover:bg-[#682e18] text-white gap-2 font-semibold"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {form.processing ? 'Processing...' : 'Complete Sale & Print Receipt'}
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
    <AppLayout
        breadcrumbs={[
            { title: 'POS Terminal', href: '/pos' },
        ]}
    >
        {page}
    </AppLayout>
);
