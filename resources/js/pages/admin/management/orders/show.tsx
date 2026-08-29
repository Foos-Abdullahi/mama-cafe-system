import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, ShoppingCart, User, CreditCard, Package } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface OrderItem {
    id: number;
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

interface Waitress {
    id: number;
    name: string;
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
    waitress?: Waitress;
    items: OrderItem[];
    payments: Payment[];
    created_at: string;
    completed_at: string | null;
}

interface Props {
    order: Order;
}

const statusColor: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
};

const paymentColor: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    partial: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
};

export default function OrderShow({ order }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete order ${order.order_number}?`)) {
            router.delete(`/management/orders/${order.id}`);
        }
    };

    const payment = order.payments?.[0];
    const amountPaid = payment?.amount ?? 0;
    const remaining = Math.max(0, Number(order.total) - Number(amountPaid));

    return (
        <>
            <Head title={`${order.order_number} - MaMa Café`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {order.order_number}
                            </h1>
                            <p className="text-sm text-muted-foreground">Order transaction details & digital receipt</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/management/orders">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Orders
                            </Button>
                        </Link>
                        <Link href={`/management/orders/${order.id}/edit`}>
                            <Button size="sm" className="gap-2 bg-[#823d21] hover:bg-[#682e18]">
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-3 flex-wrap">
                    <Badge className={statusColor[order.status] ?? ''}>{order.status.replace('_', ' ')}</Badge>
                    <Badge className={paymentColor[order.payment_status] ?? ''}>{order.payment_status.replace('_', ' ')}</Badge>
                    <Badge variant="outline">{order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}</Badge>
                    {order.fixed_number && <Badge variant="outline">Table #{order.fixed_number}</Badge>}
                </div>

                {/* Order Info */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-3 flex items-center gap-2">
                        <User className="h-4 w-4 text-[#823d21]" /> Order Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Waitress</p>
                            <p className="mt-1 font-medium text-foreground">{order.waitress?.name ?? '— Walk-in —'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Created At</p>
                            <p className="mt-1 font-medium text-foreground">{order.created_at}</p>
                        </div>
                        {order.completed_at && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Completed At</p>
                                <p className="mt-1 font-medium text-foreground">{order.completed_at}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-6 py-4 border-b bg-muted/30">
                        <Package className="h-4 w-4 text-[#823d21]" />
                        <h2 className="font-semibold text-base">Items ({order.items.length})</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-muted/20">
                            <tr>
                                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Product</th>
                                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Qty</th>
                                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Unit Price</th>
                                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-3.5 font-medium">{item.product?.name ?? '—'}</td>
                                    <td className="px-4 py-3.5 text-center">{item.quantity}</td>
                                    <td className="px-4 py-3.5 text-right font-mono">${Number(item.unit_price).toFixed(2)}</td>
                                    <td className="px-6 py-3.5 text-right font-semibold font-mono">${Number(item.line_total).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t bg-muted/10">
                            <tr>
                                <td colSpan={3} className="px-6 py-3.5 text-right font-semibold text-base">Order Total</td>
                                <td className="px-6 py-3.5 text-right font-bold text-xl text-[#823d21] font-mono">${Number(order.total).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Payment */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[#823d21]" /> Payment Summary
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-semibold capitalize text-foreground">{payment?.method?.replace('_', ' ') ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount Paid</span>
                            <span className="font-bold text-emerald-600 font-mono text-base">${Number(amountPaid).toFixed(2)}</span>
                        </div>
                        {order.payment_status === 'partial' && (
                            <div className="flex justify-between border-t pt-3">
                                <span className="text-muted-foreground font-medium">Remaining Unpaid Balance</span>
                                <span className="font-bold text-orange-600 font-mono text-base">${remaining.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/orders' },
            { title: 'Orders', href: '/management/orders' },
            { title: 'Order Details', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
