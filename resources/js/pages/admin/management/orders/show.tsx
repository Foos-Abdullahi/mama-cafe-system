import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Printer,
    ShoppingBag,
    Calendar,
    FileText,
    Banknote,
    RotateCcw,
} from 'lucide-react';
import {
    printInvoice,
    printOrderReceipt,
} from '@/components/ops/print-invoice';

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
    discount?: number;
    tax?: number;
    total: number;
    fixed_number: number | null;
    waitress?: Waitress;
    items: OrderItem[];
    payments: Payment[];
    created_at: string;
    completed_at: string | null;
}

interface CompanySettings {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    currency?: string;
    tax_rate?: number;
}

interface Props {
    order: Order;
    company?: CompanySettings;
}

const statusBadgeClasses: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300 border-slate-200 dark:border-slate-800',
    pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    completed:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    cancelled:
        'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    refunded:
        'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

const paymentBadgeClasses: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    pending:
        'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400',
    partial:
        'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    unpaid: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    refunded:
        'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

export default function OrderShow({ order, company }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [statusTarget, setStatusTarget] = useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [amountPaidInput, setAmountPaidInput] = useState('');
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        router.delete(`/management/orders/${order.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setConfirmOpen(false);
            },
        });
    };

    const handleStatusChange = () => {
        if (!statusTarget) return;
        setIsUpdatingStatus(true);
        router.patch(
            `/management/orders/${order.id}/status`,
            { status: statusTarget },
            {
                onFinish: () => {
                    setIsUpdatingStatus(false);
                    setStatusTarget(null);
                },
            },
        );
    };

    const openPaymentDialog = () => {
        setPaymentStatus(order.payment_status);
        setAmountPaidInput('');
        setPaymentError(null);
        setPaymentDialogOpen(true);
    };

    const handlePaymentChange = () => {
        let submitStatus = paymentStatus;

        if (paymentStatus === 'partial') {
            const amount = Number(amountPaidInput);
            if (!Number.isFinite(amount) || amount <= 0) {
                setPaymentError('Enter an amount greater than 0.');
                return;
            }
            if (amount > balanceDue) {
                setPaymentError(
                    `The payment cannot exceed the remaining balance of $${balanceDue.toFixed(2)}.`,
                );
                return;
            }
            if (amount >= balanceDue) {
                submitStatus = 'paid';
            }
        }

        setPaymentError(null);
        setIsUpdatingPayment(true);
        router.patch(
            `/management/orders/${order.id}/payment-status`,
            {
                payment_status: submitStatus,
                amount_paid:
                    submitStatus === 'partial'
                        ? Number(amountPaidInput)
                        : undefined,
            },
            {
                onSuccess: () => {
                    setPaymentDialogOpen(false);
                    setPaymentError(null);
                },
                onError: () => {
                    toast('Unable to update payment. Check the amount entered.');
                },
                onFinish: () => {
                    setIsUpdatingPayment(false);
                },
            },
        );
    };

    const totalPaid = (order.payments || []).reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0,
    );
    const balanceDue = Math.max(0, Number(order.total) - totalPaid);

    const handlePrintReceipt = () => {
        printOrderReceipt({
            orderNumber: order.order_number,
            createdAt: formatDateTime(order.created_at),
            customer: order.waitress
                ? {
                      name: order.waitress.name,
                      phone: (order.waitress as any).phone ?? null,
                      email: null,
                  }
                : null,
            items: (order.items || []).map((item) => ({
                name: item.product?.name ?? 'Item',
                quantity: item.quantity,
                unitPrice: `$${Number(item.unit_price).toFixed(2)}`,
                total: `$${Number(item.line_total).toFixed(2)}`,
            })),
            paymentMethod: order.payments?.[0]?.method ?? undefined,
            paymentStatus: order.payment_status,
            subtotal: `$${Number(order.subtotal ?? order.total).toFixed(2)}`,
            discount:
                Number(order.discount || 0) > 0
                    ? `$${Number(order.discount).toFixed(2)}`
                    : undefined,
            tax:
                Number(order.tax || 0) > 0
                    ? `$${Number(order.tax).toFixed(2)}`
                    : undefined,
            total: `$${Number(order.total).toFixed(2)}`,
            paidAmount: `$${totalPaid.toFixed(2)}`,
            balanceDue: `$${balanceDue.toFixed(2)}`,
            notes: order.fixed_number
                ? `Table #${order.fixed_number} · Order Type: ${order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}`
                : `Order Type: ${order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}`,
            company: company,
        });
    };

    const handlePrintInvoice = () => {
        printInvoice({
            orderNumber: order.order_number,
            createdAt: order.created_at,
            customer: order.waitress
                ? {
                      name: order.waitress.name,
                      phone: (order.waitress as any).phone ?? null,
                      email: null,
                      address: null,
                  }
                : null,
            items: (order.items || []).map((item) => ({
                name: item.product?.name ?? 'Item',
                quantity: item.quantity,
                unit_price: Number(item.unit_price),
                line_total: Number(item.line_total),
            })),
            paymentMethod: order.payments?.[0]?.method ?? null,
            paymentStatus: order.payment_status,
            paymentPhone: (order.waitress as any)?.phone ?? null,
            subtotal: Number(order.subtotal ?? order.total),
            discountAmount: Number(order.discount || 0),
            discountType: 'fixed',
            taxAmount: Number(order.tax || 0),
            shippingAmount: 0,
            grandTotal: Number(order.total),
            paidAmount: totalPaid,
            balanceDue: balanceDue,
            notes: order.fixed_number
                ? `Table #${order.fixed_number} · Order Type: ${order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}`
                : `Order Type: ${order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}`,
            company: company,
        });
    };

    return (
        <>
            <Head title={`${order.order_number} — Order Details`} />

            <div className="flex animate-in flex-col gap-6 p-4 duration-300 fade-in slide-in-from-bottom-3 md:p-6">
                {/* Header with Title and Actions */}
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center print:hidden">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                                {order.order_number}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium capitalize ${statusBadgeClasses[order.status] ?? ''}`}
                                >
                                    {order.status.replace('_', ' ')}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium capitalize ${paymentBadgeClasses[order.payment_status] ?? ''}`}
                                >
                                    {order.payment_status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {order.order_type === 'dine_in'
                                        ? 'Dine In'
                                        : 'Takeaway'}
                                </Badge>
                                {order.fixed_number && (
                                    <Badge
                                        variant="outline"
                                        className="font-mono text-xs"
                                    >
                                        Table #{order.fixed_number}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateTime(order.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrintReceipt}
                            className="justify-center gap-1.5 text-xs shadow-xs"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print Receipt
                        </Button>
                        <Link href={`/management/orders/${order.id}/invoice`}>
                            <Button
                                size="sm"
                                className="justify-center gap-1.5 text-xs shadow-xs"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                Invoice
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmOpen(true)}
                            className="gap-1.5 border-destructive/30 text-xs text-destructive shadow-xs hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                        {order.status === 'pending' && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        setStatusTarget('completed')
                                    }
                                    className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                >
                                    <ShoppingBag className="h-3.5 w-3.5" />
                                    Mark Completed
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStatusTarget('refunded')}
                                    className="gap-1.5 border-purple-300 text-xs text-purple-700 hover:bg-purple-50"
                                >
                                    Refund
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStatusTarget('cancelled')}
                                    className="gap-1.5 border-destructive/30 text-xs text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Cancel Order
                                </Button>
                            </>
                        )}
                        {order.status === 'cancelled' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStatusTarget('pending')}
                                className="gap-1.5 border-amber-300 text-xs text-amber-700 hover:bg-amber-50"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Re-Pending
                            </Button>
                        )}
                        {order.status === 'refunded' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStatusTarget('pending')}
                                className="gap-1.5 border-amber-300 text-xs text-amber-700 hover:bg-amber-50"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Back to Pending
                            </Button>
                        )}
                        <Link href="/management/orders">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs shadow-xs"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column: Order Items Table */}
                    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-[#823d21]" />
                                <h2 className="text-sm font-semibold text-foreground">
                                    Order Items
                                </h2>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                {order.items?.length || 0} items
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-center">
                                            Qty
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Unit Price
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Line Total
                                        </TableHead>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {order.items?.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-foreground">
                                                    {item.product?.name ?? '—'}
                                                </p>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    ID: #
                                                    {item.product?.id ??
                                                        item.id}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono font-medium">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                                                $
                                                {Number(
                                                    item.unit_price,
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                                                $
                                                {Number(
                                                    item.line_total,
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!order.items ||
                                        order.items.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
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
                                strong
                            />
                            <SummaryRow
                                label="Remaining Balance"
                                value={`$${balanceDue.toFixed(2)}`}
                                strong
                            />
                        </Panel>

                        {/* Order Details Panel */}
                        <Panel title="Order Details">
                            <SummaryRow
                                label="Order Type"
                                value={
                                    order.order_type === 'dine_in'
                                        ? 'Dine In'
                                        : 'Takeaway'
                                }
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
                    <Panel
                        title="Payment Records"
                        actions={
                            !['paid', 'refunded'].includes(
                                order.payment_status,
                            ) ? (
                                <Button
                                    size="sm"
                                    onClick={openPaymentDialog}
                                    className="h-7 gap-1.5 text-xs"
                                >
                                    <Banknote className="h-3.5 w-3.5" />
                                    {order.payment_status === 'partial'
                                        ? 'Pay Remaining'
                                        : 'Update Payment'}
                                </Button>
                            ) : null
                        }
                    >
                        {!order.payments || order.payments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No payment records logged for this order.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {order.payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="rounded-lg border border-border bg-muted/20 p-3 text-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground capitalize">
                                                {payment.method?.replace(
                                                    '_',
                                                    ' ',
                                                ) || 'Cash'}
                                            </span>
                                            <span className="font-mono font-bold text-foreground">
                                                $
                                                {Number(payment.amount).toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="capitalize">
                                                Status: {payment.status}
                                            </span>
                                            {payment.created_at && (
                                                <span>
                                                    {formatDateTime(
                                                        payment.created_at,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 grid gap-2 rounded-lg border border-border bg-muted/20 p-3 text-sm sm:grid-cols-2">
                            <SummaryRow
                                label="Paid"
                                value={`$${totalPaid.toFixed(2)}`}
                                strong
                            />
                            <SummaryRow
                                label="Remaining"
                                value={`$${balanceDue.toFixed(2)}`}
                                strong
                            />
                        </div>
                    </Panel>

                    <Panel title="Order Fulfillment">
                        <div className="space-y-2 text-sm">
                            <SummaryRow
                                label="Order Status"
                                value={order.status
                                    .replace('_', ' ')
                                    .toUpperCase()}
                                strong
                            />
                            <SummaryRow
                                label="Payment Status"
                                value={order.payment_status
                                    .replace('_', ' ')
                                    .toUpperCase()}
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

            <ConfirmDeleteDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleConfirmDelete}
                title={`Delete Order ${order.order_number}`}
                description="Are you sure you want to delete this order record? This action cannot be undone."
                isDeleting={isDeleting}
            />

            <Dialog
                open={statusTarget !== null}
                onOpenChange={(open) => !open && setStatusTarget(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Order Status</DialogTitle>
                        <DialogDescription>
                            Please confirm that you want to mark{' '}
                            {order.order_number} as{' '}
                            <span className="font-semibold capitalize">
                                {statusTarget}
                            </span>
                            .
                            {statusTarget === 'completed' &&
                                order.payment_status !== 'paid' && (
                                    <span className="mt-1 block rounded-md bg-amber-50 p-2 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                                        This order is not fully paid yet. Pay
                                        the remaining balance first.
                                    </span>
                                )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        {statusTarget === 'completed' &&
                        order.payment_status !== 'paid' ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    setStatusTarget(null);
                                    openPaymentDialog();
                                }}
                                className="gap-1.5"
                            >
                                <Banknote className="h-3.5 w-3.5" />
                                Update Payment
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStatusTarget(null)}
                                disabled={isUpdatingStatus}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={handleStatusChange}
                            disabled={
                                isUpdatingStatus ||
                                (statusTarget === 'completed' &&
                                    order.payment_status !== 'paid')
                            }
                            className={
                                statusTarget === 'cancelled'
                                    ? 'bg-destructive text-white hover:bg-destructive/90'
                                    : ''
                            }
                        >
                            {isUpdatingStatus
                                ? 'Updating...'
                                : 'Confirm Change'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Payment</DialogTitle>
                        <DialogDescription>
                            Update the payment state for {order.order_number}.
                            Current: <span className="capitalize">{order.payment_status.replace('_', ' ')}</span> —
                            ${totalPaid.toFixed(2)} of ${Number(order.total).toFixed(2)} paid. Balance
                            due: ${balanceDue.toFixed(2)}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="payment-status"
                                className="text-sm font-medium"
                            >
                                Payment status
                            </label>
                            <select
                                id="payment-status"
                                value={paymentStatus}
                                onChange={(event) =>
                                    setPaymentStatus(event.target.value)
                                }
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="partial">Partial</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        {paymentStatus === 'partial' && (
                            <div className="space-y-2">
                                <label
                                    htmlFor="amount-paid"
                                    className="text-sm font-medium"
                                >
                                    Additional payment amount
                                </label>
                                <input
                                    id="amount-paid"
                                    type="number"
                                    min="0.01"
                                    max={balanceDue}
                                    step="0.01"
                                    value={amountPaidInput}
                                    onChange={(event) => {
                                        setAmountPaidInput(event.target.value);
                                        setPaymentError(null);
                                    }}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Up to ${balanceDue.toFixed(2)} can be added
                                    toward the balance. Balance after payment: $
                                    {Math.max(
                                        0,
                                        balanceDue -
                                            Number(
                                                amountPaidInput || 0,
                                            ),
                                    ).toFixed(2)}
                                </p>
                            </div>
                        )}
                        {paymentStatus === 'paid' && (
                            <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                This will collect the remaining $
                                {balanceDue.toFixed(2)} and mark {order.order_number} as fully paid.
                            </p>
                        )}
                        {paymentError && (
                            <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
                                {paymentError}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPaymentDialogOpen(false)}
                            disabled={isUpdatingPayment}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handlePaymentChange}
                            disabled={isUpdatingPayment}
                        >
                            {isUpdatingPayment ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Panel({
    title,
    children,
    actions,
}: {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-sm font-semibold text-foreground">
                    {title}
                </h2>
                {actions}
            </div>
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
            <span className="text-xs text-muted-foreground">{label}</span>
            <span
                className={
                    strong
                        ? 'font-mono font-bold text-foreground'
                        : 'font-mono font-medium text-foreground'
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
