import React, { useState, useMemo } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number | string;
}

interface Waitress {
    id: number;
    name: string;
}

interface OrderItem {
    id?: number;
    product_id: number;
    product?: Product;
    quantity: number;
    unit_price: number;
    line_total: number;
}

interface Payment {
    id: number;
    method: string;
    amount: number;
    status: string;
}

interface Order {
    id: number;
    order_number: string;
    order_type: string;
    status: string;
    payment_status: string;
    subtotal: number;
    total: number;
    fixed_number: number | null;
    waitress_id: number | null;
    waitress?: Waitress;
    items: OrderItem[];
    payments: Payment[];
}

interface Props {
    order: Order;
    products: Product[];
    waitresses: Waitress[];
}

interface EditableItem {
    product_id: string;
    quantity: number;
}

export default function OrderEdit({ order, products, waitresses }: Props) {
    const [editItems, setEditItems] = useState<EditableItem[]>(
        order.items.map((i) => ({ product_id: i.product_id.toString(), quantity: i.quantity }))
    );

    const form = useForm({
        waitress_id: order.waitress_id?.toString() ?? '',
        fixed_number: order.fixed_number?.toString() ?? '',
        order_type: order.order_type,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payments?.[0]?.method ?? 'cash',
        amount_paid: order.payments?.[0]?.amount?.toString() ?? '',
        reason: '',
        items: [] as EditableItem[],
    });

    const subtotal = useMemo(() => {
        return editItems.reduce((sum, item) => {
            const product = products.find((p) => p.id.toString() === item.product_id);
            return sum + (product ? Number(product.price) * item.quantity : 0);
        }, 0);
    }, [editItems, products]);

    const remaining = useMemo(() => {
        if (form.data.payment_status !== 'partial') return 0;
        return Math.max(0, subtotal - Number(form.data.amount_paid || 0));
    }, [subtotal, form.data.amount_paid, form.data.payment_status]);

    const addItem = () => setEditItems([...editItems, { product_id: products[0]?.id?.toString() ?? '', quantity: 1 }]);
    const removeItem = (i: number) => setEditItems(editItems.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof EditableItem, value: string | number) =>
        setEditItems(editItems.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({ ...data, items: editItems }));
        form.put(`/management/orders/${order.id}`);
    };

    const needsReason = form.data.status === 'cancelled' || form.data.status === 'refunded';

    return (
        <>
            <Head title={`Edit ${order.order_number} - MaMa Café`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit Order
                            </h1>
                            <p className="text-sm text-muted-foreground">Modifying order <strong>{order.order_number}</strong></p>
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
                                <Label>Order Type</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.order_type} onChange={(e) => form.setData('order_type', e.target.value)}>
                                    <option value="dine_in">Dine In</option>
                                    <option value="takeaway">Takeaway</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Fixed / Table Number</Label>
                                <Input type="number" placeholder="e.g. 101"
                                    value={form.data.fixed_number} onChange={(e) => form.setData('fixed_number', e.target.value)} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label>Assigned Waitress</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.waitress_id} onChange={(e) => form.setData('waitress_id', e.target.value)}>
                                    <option value="">— No waitress assigned —</option>
                                    {waitresses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="font-semibold text-lg">Order Line Items</h2>
                            <Button type="button" size="sm" variant="outline" onClick={addItem} className="gap-1">
                                <Plus className="h-4 w-4" /> Add Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {editItems.map((item, index) => {
                                const product = products.find((p) => p.id.toString() === item.product_id);
                                return (
                                    <div key={index} className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-muted/20 p-3 rounded-lg border">
                                        <select
                                            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={item.product_id}
                                            onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                        >
                                            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — ${Number(p.price).toFixed(2)}</option>)}
                                        </select>
                                        <div className="flex items-center gap-3">
                                            <Input type="number" min="1" className="w-24"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} />
                                            <span className="w-24 text-right font-semibold text-foreground">
                                                ${product ? (Number(product.price) * item.quantity).toFixed(2) : '0.00'}
                                            </span>
                                            {editItems.length > 1 && (
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
                            <span className="font-bold text-xl text-[#823d21]">Updated Total: ${subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-lg border-b pb-3">Payment & Fulfillment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label>Order Status <span className="text-red-500">*</span></Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                    <option value="draft">Draft</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                <InputError message={form.errors.status} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Payment Status <span className="text-red-500">*</span></Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.payment_status} onChange={(e) => form.setData('payment_status', e.target.value)}>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid (Full)</option>
                                    <option value="partial">Partial</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                                <InputError message={form.errors.payment_status} />
                            </div>
                        </div>

                        {(form.data.payment_status === 'paid' || form.data.payment_status === 'partial') && (
                            <div className="grid gap-2">
                                <Label>Payment Method</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.payment_method} onChange={(e) => form.setData('payment_method', e.target.value)}>
                                    <option value="cash">Cash</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="card">Card</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </div>
                        )}

                        {form.data.payment_status === 'partial' && (
                            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 p-4 space-y-3">
                                <div className="grid gap-2">
                                    <Label>Amount Paid ($) <span className="text-red-500">*</span></Label>
                                    <Input type="number" step="0.01" min="0" placeholder="0.00"
                                        value={form.data.amount_paid} onChange={(e) => form.setData('amount_paid', e.target.value)} />
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

                        {needsReason && (
                            <div className="grid gap-2">
                                <Label>Reason</Label>
                                <Input placeholder="Reason for cancellation / refund..."
                                    value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/management/orders">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={form.processing} className="bg-[#823d21] hover:bg-[#682e18] min-w-[140px]">
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

OrderEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/orders' },
            { title: 'Orders', href: '/management/orders' },
            { title: 'Edit Order', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
