import React, { useState, useMemo } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, Plus, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number | string;
}

interface Waitress {
    id: number;
    name: string;
}

interface Props {
    products: Product[];
    waitresses: Waitress[];
}

interface OrderItem {
    product_id: string;
    quantity: number;
}

export default function OrderCreate({ products, waitresses }: Props) {
    const [items, setItems] = useState<OrderItem[]>([{ product_id: products[0]?.id?.toString() ?? '', quantity: 1 }]);

    const form = useForm({
        waitress_id: '',
        fixed_number: '',
        order_type: 'dine_in' as 'dine_in' | 'takeaway',
        status: 'completed' as string,
        payment_status: 'paid' as string,
        payment_method: 'cash' as string,
        amount_paid: '',
        items: [] as OrderItem[],
    });

    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => {
            const product = products.find((p) => p.id.toString() === item.product_id);
            return sum + (product ? Number(product.price) * item.quantity : 0);
        }, 0);
    }, [items, products]);

    const remaining = useMemo(() => {
        if (form.data.payment_status !== 'partial') return 0;
        return Math.max(0, subtotal - Number(form.data.amount_paid || 0));
    }, [subtotal, form.data.amount_paid, form.data.payment_status]);

    const addItem = () => setItems([...items, { product_id: products[0]?.id?.toString() ?? '', quantity: 1 }]);

    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
        setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({ ...data, items }));
        form.post('/management/orders');
    };

    return (
        <>
            <Head title="Create Order - MaMa Café" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Create Order
                            </h1>
                            <p className="text-sm text-muted-foreground">Register a new customer transaction.</p>
                        </div>
                    </div>
                    <Link href="/management/orders">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Orders
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Info */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-3">Order Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="order_type">Order Type <span className="text-red-500">*</span></Label>
                                <select id="order_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.order_type} onChange={(e) => form.setData('order_type', e.target.value as any)}>
                                    <option value="dine_in">Dine In</option>
                                    <option value="takeaway">Takeaway</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fixed_number">Fixed / Table Number</Label>
                                <Input id="fixed_number" type="number" placeholder="e.g. 101"
                                    value={form.data.fixed_number} onChange={(e) => form.setData('fixed_number', e.target.value)} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="waitress_id">Assigned Waitress</Label>
                                <select id="waitress_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.waitress_id} onChange={(e) => form.setData('waitress_id', e.target.value)}>
                                    <option value="">— No waitress assigned —</option>
                                    {waitresses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="font-semibold text-lg">Order Items <span className="text-red-500">*</span></h2>
                            <Button type="button" size="sm" variant="outline" onClick={addItem} className="gap-1">
                                <Plus className="h-4 w-4" /> Add Product Line
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => {
                                const product = products.find((p) => p.id.toString() === item.product_id);
                                return (
                                    <div key={index} className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-muted/20 p-3 rounded-lg border">
                                        <select
                                            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={item.product_id}
                                            onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                        >
                                            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — ${Number(p.price).toFixed(2)}</option>)}
                                        </select>
                                        <div className="flex items-center gap-3">
                                            <Input
                                                type="number"
                                                min="1"
                                                className="w-24"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                            />
                                            <span className="w-24 text-right font-semibold text-foreground">
                                                ${product ? (Number(product.price) * item.quantity).toFixed(2) : '0.00'}
                                            </span>
                                            {items.length > 1 && (
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t pt-3 flex justify-end">
                            <span className="font-bold text-xl text-[#823d21]">Subtotal Total: ${subtotal.toFixed(2)}</span>
                        </div>
                        <InputError message={form.errors.items} />
                    </div>

                    {/* Payment */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-3">Payment & Fulfillment</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Order Status <span className="text-red-500">*</span></Label>
                                <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                    <option value="completed">Completed</option>
                                    <option value="draft">Draft</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <InputError message={form.errors.status} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="payment_status">Payment Status <span className="text-red-500">*</span></Label>
                                <select id="payment_status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.payment_status} onChange={(e) => form.setData('payment_status', e.target.value)}>
                                    <option value="paid">Paid (Full)</option>
                                    <option value="partial">Partial Payment</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                                <InputError message={form.errors.payment_status} />
                            </div>
                        </div>

                        {(form.data.payment_status === 'paid' || form.data.payment_status === 'partial') && (
                            <div className="grid gap-2">
                                <Label htmlFor="payment_method">Payment Method</Label>
                                <select id="payment_method" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.payment_method} onChange={(e) => form.setData('payment_method', e.target.value)}>
                                    <option value="cash">Cash</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="card">Card</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </div>
                        )}

                        {form.data.payment_status === 'partial' && (
                            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-4 space-y-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount_paid">Amount Paid ($) <span className="text-red-500">*</span></Label>
                                    <Input id="amount_paid" type="number" step="0.01" min="0"
                                        placeholder="0.00" value={form.data.amount_paid}
                                        onChange={(e) => form.setData('amount_paid', e.target.value)} />
                                    <InputError message={form.errors.amount_paid} />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order Total:</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-orange-700 dark:text-orange-400">
                                    <span>Remaining Balance:</span>
                                    <span>${remaining.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/management/orders">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={form.processing} className="bg-[#823d21] hover:bg-[#682e18] min-w-[140px]">
                            {form.processing ? 'Creating...' : 'Create Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

OrderCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/orders' },
            { title: 'Orders', href: '/management/orders' },
            { title: 'Create', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
