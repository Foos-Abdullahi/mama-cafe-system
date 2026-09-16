import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { printInvoice } from '@/components/ops/print-invoice';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';

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
    phone?: string;
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

interface InvoicePageProps {
    order: Order;
    company: CompanySettings;
}

export default function OpsOrdersInvoice({ order, company }: InvoicePageProps) {
    const totalPaid = (order.payments || []).reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
    );
    const balanceDue = Math.max(0, Number(order.total) - totalPaid);

    const handlePrint = () => {
        printInvoice({
            orderNumber: order.order_number,
            createdAt: order.created_at,
            customer: order.waitress
                ? {
                      name: order.waitress.name,
                      phone: order.waitress.phone ?? null,
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
            paymentPhone: order.waitress?.phone ?? null,
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
            company: company
                ? {
                      name: company.name,
                      address: company.address,
                      city: company.city,
                      country: company.country,
                      phone: company.phone,
                      email: company.email,
                  }
                : undefined,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        const dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${dateStr} · ${timeStr}`;
    };

    const companyName = company?.name || 'MaMa Café & Boba Tea';
    const companyAddress =
        [company?.address, company?.city, company?.country]
            .filter(Boolean)
            .join(', ') || 'Mogadishu, Somalia';

    return (
        <>
            <Head title={`Invoice - ${order.order_number}`} />

            <div className="flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Top Action Bar */}
                <div className="no-print mb-4 flex w-full max-w-4xl items-center justify-between">
                    <Link href={`/management/orders/${order.id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs shadow-xs"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Order
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        onClick={handlePrint}
                        className="gap-1.5 text-xs shadow-xs"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Print Invoice
                    </Button>
                </div>

                {/* Printable Invoice Card */}
                <div className="invoice-print-card mx-auto w-full max-w-4xl bg-card rounded-xl border border-border p-6 md:p-8 shadow-xs">
                    {/* Header: Company & Invoice Info */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                {companyName}
                            </h1>
                            <p className="text-xs text-muted-foreground mt-1">
                                {companyAddress} · {company.phone || '+252 61 555 0101'}
                            </p>
                            {company.email && (
                                <p className="text-xs text-muted-foreground">
                                    {company.email}
                                </p>
                            )}
                        </div>

                        <div className="sm:text-right">
                            <h2 className="text-2xl font-extrabold tracking-wider text-foreground uppercase">
                                INVOICE
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {formatDate(order.created_at)}
                            </p>
                            <div className="mt-2 inline-block">
                                <span className="rounded-md bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground tracking-wider uppercase">
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/20 border border-border text-sm">
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Order #
                            </span>
                            <span className="font-semibold text-foreground">
                                {order.order_number}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Order Type
                            </span>
                            <span className="font-medium text-foreground">
                                {order.order_type === 'dine_in'
                                    ? `Dine In ${order.fixed_number ? `(#${order.fixed_number})` : ''}`
                                    : 'Takeaway'}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Staff / Attendant
                            </span>
                            <span className="font-medium text-foreground">
                                {order.waitress?.name ?? 'Walk-in'}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Payment Method
                            </span>
                            <span className="font-medium text-foreground capitalize">
                                {order.payments?.[0]?.method
                                    ? order.payments[0].method.replace('_', ' ')
                                    : 'Cash'}
                            </span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto my-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="py-2.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="py-2.5 px-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                                        Qty
                                    </th>
                                    <th className="py-2.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                                        Unit Price
                                    </th>
                                    <th className="py-2.5 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                                        Line Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {order.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-muted/20 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-foreground font-medium">
                                            {item.product?.name ?? '—'}
                                        </td>
                                        <td className="py-3 px-4 text-center text-foreground font-mono">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3 px-4 text-right text-muted-foreground font-mono">
                                            {formatCurrency(item.unit_price)}
                                        </td>
                                        <td className="py-3 px-4 text-right font-semibold font-mono text-foreground">
                                            {formatCurrency(item.line_total)}
                                        </td>
                                    </tr>
                                ))}
                                {(!order.items || order.items.length === 0) && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-6 text-center text-xs text-muted-foreground"
                                        >
                                            No items recorded.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-border pt-6">
                        <div className="text-xs text-muted-foreground max-w-sm space-y-1">
                            <p className="font-semibold uppercase tracking-wider text-foreground">
                                Payment Note
                            </p>
                            <p>
                                Status:{' '}
                                <span className="font-medium capitalize text-foreground">
                                    {order.payment_status}
                                </span>{' '}
                                · Logged with{' '}
                                {order.payments?.length || 0} transaction record(s).
                            </p>
                        </div>

                        <div className="w-full sm:w-80 space-y-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="font-mono">{formatCurrency(order.subtotal ?? order.total)}</span>
                            </div>
                            {Number(order.discount || 0) > 0 && (
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Discount</span>
                                    <span className="font-mono text-destructive">
                                        -{formatCurrency(order.discount)}
                                    </span>
                                </div>
                            )}
                            {Number(order.tax || 0) > 0 && (
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax</span>
                                    <span className="font-mono">{formatCurrency(order.tax)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between pt-1 text-base font-bold text-foreground">
                                <span>Total</span>
                                <span className="font-mono">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Paid</span>
                                <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(totalPaid)}
                                </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Balance Due</span>
                                <span
                                    className={`font-semibold font-mono ${
                                        balanceDue > 0
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    {formatCurrency(balanceDue)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
                        <p>Thank you for your business! · {companyName}</p>
                    </div>

                    {/* Print Button at Bottom */}
                    <div className="no-print mt-6 border-t border-border pt-4">
                        <Button
                            className="w-full gap-2 shadow-xs"
                            onClick={handlePrint}
                        >
                            <Printer className="h-4 w-4" />
                            Print Invoice
                        </Button>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body {
                        background: white !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    .invoice-print-card {
                        max-width: 100% !important;
                        width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    header, nav, aside {
                        display: none !important;
                    }
                    * {
                        page-break-inside: avoid !important;
                    }
                }
            `}</style>
        </>
    );
}

OpsOrdersInvoice.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/orders' },
            { title: 'Orders', href: '/management/orders' },
            { title: 'Invoice', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
