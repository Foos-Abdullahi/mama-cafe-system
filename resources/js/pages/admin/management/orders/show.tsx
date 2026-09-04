import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Printer, ShoppingBag, CreditCard, User, Calendar, Clock, Hash } from 'lucide-react';

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
    created_at?: string;
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

const statusBadgeClasses: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300 border-slate-200 dark:border-slate-800',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

const paymentBadgeClasses: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    partial: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    unpaid: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

export default function OrderShow({ order }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete order ${order.order_number}?`)) {
            router.delete(`/management/orders/${order.id}`);
        }
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const totalPaid = (order.payments || []).reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
    );
    const balanceDue = Math.max(0, Number(order.total) - totalPaid);

    return (
        <>
            <Head title={`${order.order_number} — Order Details`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                {order.order_number}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`capitalize font-medium text-xs ${statusBadgeClasses[order.status] ?? ''}`}
                                >
                                    {order.status.replace('_', ' ')}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`capitalize font-medium text-xs ${paymentBadgeClasses[order.payment_status] ?? ''}`}
                                >
                                    {order.payment_status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                                </Badge>
                                {order.fixed_number && (
                                    <Badge variant="outline" className="text-xs font-mono">
                                        Table #{order.fixed_number}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateTime(order.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrintReceipt}
                            className="gap-1.5 text-xs shadow-xs"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print Receipt
                        </Button>
                        <Link href={`/management/orders/${order.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive shadow-xs border-destructive/30"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                        <Link href="/management/orders">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column: Order Items Table */}
                    <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                        <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-[#823d21]" />
                                <h2 className="font-semibold text-foreground text-sm">
                                    Order Items
                                </h2>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                                {order.items?.length || 0} items
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Line Total</TableHead>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {order.items?.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-foreground">
                                                    {item.product?.name ?? '—'}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-mono">
                                                    ID: #{item.product?.id ?? item.id}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono font-medium">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                                                ${Number(item.unit_price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                                                ${Number(item.line_total).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                No items in this order.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Right Column: Panels */}
                    <div className="space-y-4">
                        {/* Summary Panel */}
                        <Panel title="Summary">
                            <SummaryRow
                                label="Subtotal"
                                value={`$${Number(order.subtotal ?? order.total).toFixed(2)}`}
                            />
                            <SummaryRow
                                label="Grand Total"
                                value={`$${Number(order.total).toFixed(2)}`}
                                strong
                            />
                            <SummaryRow
                                label="Paid Amount"
                                value={`$${totalPaid.toFixed(2)}`}
                            />
                            <SummaryRow
                                label="Balance Due"
                                value={`$${balanceDue.toFixed(2)}`}
                                strong
                            />
                        </Panel>

                        {/* Order Details Panel */}
                        <Panel title="Order Details">
                            <SummaryRow
                                label="Order Type"
                                value={order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                            />
                            {order.fixed_number && (
                                <SummaryRow
                                    label="Table Number"
                                    value={`#${order.fixed_number}`}
                                />
                            )}
                            <SummaryRow
                                label="Waitress"
                                value={order.waitress?.name ?? 'Walk-in'}
                            />
                            <SummaryRow
                                label="Order Date"
                                value={formatDateTime(order.created_at)}
                            />
                            {order.completed_at && (
                                <SummaryRow
                                    label="Completed At"
                                    value={formatDateTime(order.completed_at)}
                                />
                            )}
                        </Panel>
                    </div>
                </div>

                {/* Bottom Row: Payments */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Payment Records">
                        {(!order.payments || order.payments.length === 0) ? (
                            <p className="text-sm text-muted-foreground">
                                No payment records logged for this order.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {order.payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="rounded-lg border border-border p-3 text-sm bg-muted/20"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground capitalize">
                                                {payment.method?.replace('_', ' ') || 'Cash'}
                                            </span>
                                            <span className="font-bold font-mono text-foreground">
                                                ${Number(payment.amount).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="capitalize">Status: {payment.status}</span>
                                            {payment.created_at && (
                                                <span>{formatDateTime(payment.created_at)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Order Fulfillment">
                        <div className="space-y-2 text-sm">
                            <SummaryRow
                                label="Order Status"
                                value={order.status.replace('_', ' ').toUpperCase()}
                                strong
                            />
                            <SummaryRow
                                label="Payment Status"
                                value={order.payment_status.replace('_', ' ').toUpperCase()}
                                strong
                            />
                            <SummaryRow
                                label="Items Count"
                                value={`${order.items?.length || 0} items`}
                            />
                        </div>
                    </Panel>
                </div>
            </div>
        </>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h2 className="mb-3 font-semibold text-foreground text-sm border-b border-border pb-2">
                {title}
            </h2>
            {children}
        </section>
    );
}

function SummaryRow({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span
                className={
                    strong
                        ? 'font-bold font-mono text-foreground'
                        : 'font-medium font-mono text-foreground'
                }
            >
                {value}
            </span>
        </div>
    );
}

function TableHead({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`px-4 py-2.5 text-xs font-bold tracking-wider text-muted-foreground uppercase ${className}`}
        >
            {children}
        </th>
    );
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
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

