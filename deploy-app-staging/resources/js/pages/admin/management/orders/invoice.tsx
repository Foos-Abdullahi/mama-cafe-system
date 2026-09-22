import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { printInvoice, printOrderReceipt } from '@/components/ops/print-invoice';
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

    const handlePrintReceipt = () => {
        printOrderReceipt({
            orderNumber: order.order_number,
            createdAt: formatDate(order.created_at),
            customer: order.waitress
                ? {
                      name: order.waitress.name,
                      phone: order.waitress.phone ?? null,
                      email: null,
                  }
                : null,
            items: (order.items || []).map((item) => ({
                name: item.product?.name ?? 'Item',
                quantity: item.quantity,
                unitPrice: formatCurrency(item.unit_price),
                total: formatCurrency(item.line_total),
            })),
            paymentMethod: order.payments?.[0]?.method ?? undefined,
            paymentStatus: order.payment_status,
            subtotal: formatCurrency(order.subtotal ?? order.total),
            discount:
                Number(order.discount || 0) > 0
                    ? formatCurrency(order.discount)
                    : undefined,
            tax:
                Number(order.tax || 0) > 0
                    ? formatCurrency(order.tax)
                    : undefined,
            total: formatCurrency(order.total),
            paidAmount: formatCurrency(totalPaid),
            balanceDue: formatCurrency(balanceDue),
            notes: order.fixed_number
                ? `Table #${order.fixed_number} · Order Type: ${order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}`
                : `Order Type: ${order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}`,
            company: company,
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

            <div className="flex flex-col items-center justify-center p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Top Action Bar */}
                <div className="no-print mb-4 flex w-full max-w-md items-center justify-between">
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
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={handlePrint}
                            className="gap-1.5 text-xs shadow-xs justify-center"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print Invoice
                        </Button>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md bg-card rounded-xl border border-border p-6 shadow-sm h-fit">
                    {/* Header - POS / Cafe Style */}
                    <div className="mb-4 text-center">
                        <h1 className="text-xl font-bold text-foreground tracking-tight">
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
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(order.created_at)}
                        </p>
                        <div className="mt-2.5">
                            <span className="inline-block rounded-md bg-accent/20 px-3 py-0.5 text-[11px] font-semibold text-accent-foreground tracking-wider uppercase">
                                INVOICE
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Details */}
                    <div className="my-3 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order #</span>
                            <span className="font-semibold text-foreground">
                                {order.order_number}
                            </span>
                        </div>
                        {order.fixed_number && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Table</span>
                                <span className="font-medium text-foreground">
                                    #{order.fixed_number}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Type</span>
                            <span className="font-medium text-foreground">
                                {order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                            </span>
                        </div>
                        {order.waitress && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Waitress / Staff</span>
                                <span className="font-medium text-foreground">
                                    {order.waitress.name}
                                </span>
                            </div>
                        )}
                        {order.payments?.[0]?.method && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium text-foreground capitalize">
                                    {order.payments[0].method.replace('_', ' ')}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className="font-medium text-foreground capitalize">
                                {order.payment_status}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Items Table */}
                    <div className="mt-3">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                                        Item
                                    </th>
                                    <th className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                                        Qty
                                    </th>
                                    <th className="py-2 text-right text-xs font-semibold text-muted-foreground uppercase">
                                        Price
                                    </th>
                                    <th className="py-2 text-right text-xs font-semibold text-muted-foreground uppercase">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-border/50"
                                    >
                                        <td className="py-2 text-foreground">
                                            <span className="font-medium">
                                                {item.product?.name ?? '—'}
                                            </span>
                                        </td>
                                        <td className="py-2 text-center text-foreground font-mono">
                                            {item.quantity}
                                        </td>
                                        <td className="py-2 text-right text-muted-foreground font-mono">
                                            {formatCurrency(item.unit_price)}
                                        </td>
                                        <td className="py-2 text-right font-semibold font-mono text-foreground">
                                            {formatCurrency(item.line_total)}
                                        </td>
                                    </tr>
                                ))}
                                {(!order.items || order.items.length === 0) && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-4 text-center text-xs text-muted-foreground"
                                        >
                                            No items listed.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="mt-3 space-y-1.5 text-sm">
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

                    {/* Notes / Order Type Info */}
                    <div className="mt-4 border-t border-border pt-3">
                        <p className="mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            Order Info
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {order.order_type === 'dine_in'
                                ? `Dine-in Order ${order.fixed_number ? `at Table #${order.fixed_number}` : ''}`
                                : 'Takeaway Order'}
                            {order.waitress ? ` · Attended by ${order.waitress.name}` : ''}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="my-6 text-center text-xs text-muted-foreground">
                        <p>Thank you for your business! · {companyName}</p>
                    </div>

                    {/* Print Buttons */}
                    <div className="no-print mt-4 border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                        <Button
                            className="w-full sm:w-1/2 gap-2 shadow-xs justify-center"
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
                    html, body {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: flex-start !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    header, nav, aside {
                        display: none !important;
                    }
                    .animate-in {
                        width: 100% !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                    }
                    .max-w-md, .bg-card {
                        max-width: 400px !important;
                        margin: 0 auto !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    @page {
                        margin: 8mm auto;
                        size: auto;
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
