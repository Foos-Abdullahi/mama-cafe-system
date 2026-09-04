import React, { useState, useMemo } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
            <Head title={`Edit ${order.order_number} — MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Edit Order {order.order_number}
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Modifying customer transaction details and line items.</p>
                        </div>
                    </div>
                    <Link href="/management/orders">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Orders
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Details Card */}
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                            Order Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="order_type" className="text-xs font-medium text-foreground">
                                    Order Type
                                </Label>
                                <Select
                                    value={form.data.order_type}
                                    onValueChange={(val) => form.setData('order_type', val)}
                                >
                                    <SelectTrigger id="order_type" className="w-full h-10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dine_in">Dine In</SelectItem>
                                        <SelectItem value="takeaway">Takeaway</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fixed_number" className="text-xs font-medium text-foreground">
                                    Fixed / Table Number
                                </Label>
                                <Input
                                    id="fixed_number"
                                    type="number"
                                    placeholder="e.g. 101"
                                    className="h-10"
                                    value={form.data.fixed_number}
                                    onChange={(e) => form.setData('fixed_number', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="waitress_id" className="text-xs font-medium text-foreground">
                                    Assigned Waitress
                                </Label>
                                <Select
                                    value={form.data.waitress_id || 'unassigned'}
                                    onValueChange={(val) => form.setData('waitress_id', val === 'unassigned' ? '' : val)}
                                >
                                    <SelectTrigger id="waitress_id" className="w-full h-10">
                                        <SelectValue placeholder="— No waitress assigned —" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">— No waitress assigned —</SelectItem>
                                        {waitresses.map((w) => (
                                            <SelectItem key={w.id} value={String(w.id)}>
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Order Line Items Card */}
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-2.5">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Order Line Items
                            </h2>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={addItem}
                                className="gap-1.5 text-xs shadow-xs"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {editItems.map((item, index) => {
                                const product = products.find((p) => p.id.toString() === item.product_id);
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-muted/20 p-3.5 rounded-lg border border-border/70"
                                    >
                                        <div className="flex-1">
                                            <Select
                                                value={item.product_id}
                                                onValueChange={(val) => updateItem(index, 'product_id', val)}
                                            >
                                                <SelectTrigger className="w-full h-10">
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.id} value={String(p.id)}>
                                                            {p.name} &mdash; ${Number(p.price).toFixed(2)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-muted-foreground">Qty:</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    className="w-20 h-10 text-center font-mono"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                />
                                            </div>
                                            <span className="w-24 text-right font-mono font-semibold text-foreground text-sm">
                                                ${product ? (Number(product.price) * item.quantity).toFixed(2) : '0.00'}
                                            </span>
                                            {editItems.length > 1 && (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => removeItem(index)}
                                                    className="h-9 w-9 text-destructive hover:bg-destructive/10 border-destructive/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-t border-border pt-3 flex items-center justify-between text-sm">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Updated Total</span>
                            <span className="font-mono font-bold text-lg text-[#823d21]">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Payment & Fulfillment Card */}
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                            Payment & Fulfillment
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="status" className="text-xs font-medium text-foreground">
                                    Order Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.data.status}
                                    onValueChange={(val) => form.setData('status', val)}
                                >
                                    <SelectTrigger id="status" className="w-full h-10">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.status} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="payment_status" className="text-xs font-medium text-foreground">
                                    Payment Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.data.payment_status}
                                    onValueChange={(val) => form.setData('payment_status', val)}
                                >
                                    <SelectTrigger id="payment_status" className="w-full h-10">
                                        <SelectValue placeholder="Select payment status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                        <SelectItem value="paid">Paid (Full)</SelectItem>
                                        <SelectItem value="partial">Partial</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.payment_status} />
                            </div>
                        </div>

                        {(form.data.payment_status === 'paid' || form.data.payment_status === 'partial') && (
                            <div className="grid gap-2">
                                <Label htmlFor="payment_method" className="text-xs font-medium text-foreground">
                                    Payment Method
                                </Label>
                                <Select
                                    value={form.data.payment_method}
                                    onValueChange={(val) => form.setData('payment_method', val)}
                                >
                                    <SelectTrigger id="payment_method" className="w-full h-10">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="credit">Credit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {form.data.payment_status === 'partial' && (
                            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 space-y-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount_paid" className="text-xs font-medium text-foreground">
                                        Amount Paid ($) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="amount_paid"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="h-10 font-mono"
                                        value={form.data.amount_paid}
                                        onChange={(e) => form.setData('amount_paid', e.target.value)}
                                    />
                                    <InputError message={form.errors.amount_paid} />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Order Total:</span>
                                    <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-orange-700 dark:text-orange-400">
                                    <span>Remaining Balance:</span>
                                    <span className="font-mono">${remaining.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {needsReason && (
                            <div className="grid gap-2">
                                <Label htmlFor="reason" className="text-xs font-medium text-foreground">
                                    Reason
                                </Label>
                                <Input
                                    id="reason"
                                    placeholder="Reason for cancellation / refund..."
                                    className="h-10"
                                    value={form.data.reason}
                                    onChange={(e) => form.setData('reason', e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Form Actions Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/management/orders">
                            <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={form.processing}
                            className="gap-1.5 text-xs shadow-xs bg-[#823d21] text-white hover:bg-[#682e18] min-w-[120px]"
                        >
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
