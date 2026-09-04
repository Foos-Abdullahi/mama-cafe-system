import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, CheckCircle, Calendar, User, DollarSign, FileText, ShoppingBag, Percent } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Payroll {
    id: number;
    waitress_name: string;
    waitress_phone: string;
    period_start: string;
    period_end: string;
    total_orders: number;
    total_sales: number;
    commission_rate: number;
    commission_amount: number;
    status: string;
    paid_at: string;
    notes: string | null;
}

interface Props {
    payroll: Payroll;
}

export default function PayrollShow({ payroll }: Props) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Payout Slip #${payroll.id} — MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Payout Slip #{payroll.id}
                            </h1>
                            <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 capitalize font-medium text-xs flex items-center gap-1"
                            >
                                <CheckCircle className="h-3 w-3" />
                                {payroll.status || 'Payout Settled'}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Pay Period: {payroll.period_start} &mdash; {payroll.period_end}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/finance/payroll">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Payroll
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="gap-1.5 text-xs shadow-xs bg-[#823d21] text-white hover:bg-[#682e18] hover:text-white border-transparent"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print Slip
                        </Button>
                    </div>
                </div>

                {/* Printable Receipt Slip Card (Optimized for view & print) */}
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    {/* Header Branding (shown nicely on screen & print) */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-xs text-center relative overflow-hidden">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-wider text-[#823d21] uppercase">MaMa Café</h2>
                            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Staff Commission Payout Slip</p>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Payout Confirmed & Settled
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                        {/* Left Side: Performance & Calculations */}
                        <div className="space-y-6">
                            <Panel title="Commission Calculation">
                                <div className="space-y-2.5">
                                    <SummaryRow
                                        label="Total Orders Handled"
                                        value={`${payroll.total_orders} Orders`}
                                    />
                                    <SummaryRow
                                        label="Total Sales Generated"
                                        value={`$${Number(payroll.total_sales).toFixed(2)}`}
                                    />
                                    <SummaryRow
                                        label="Agreed Commission Rate"
                                        value={`${(Number(payroll.commission_rate) * 100).toFixed(0)}%`}
                                    />
                                    <SummaryRow
                                        label="Net Commission Paid"
                                        value={`$${Number(payroll.commission_amount).toFixed(2)}`}
                                        strong
                                    />
                                </div>
                            </Panel>

                            {payroll.notes && (
                                <Panel title="Payout Notes">
                                    <p className="text-sm text-muted-foreground bg-muted/20 p-3.5 rounded-lg border border-border/60">
                                        {payroll.notes}
                                    </p>
                                </Panel>
                            )}

                            {/* Signatures Panel */}
                            <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8">
                                    Signatures & Authorization
                                </p>
                                <div className="grid grid-cols-2 gap-8 text-center text-xs">
                                    <div className="border-t border-dashed border-border pt-3">
                                        <p className="font-semibold text-foreground">Manager Signature</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Authorized Sign-off</p>
                                    </div>
                                    <div className="border-t border-dashed border-border pt-3">
                                        <p className="font-semibold text-foreground">Waitress Signature</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">Payment Received</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Staff & Record Details */}
                        <div className="space-y-6">
                            <Panel title="Staff Details">
                                <div className="space-y-2.5">
                                    <SummaryRow label="Staff Member" value={payroll.waitress_name} />
                                    <SummaryRow label="Phone Contact" value={payroll.waitress_phone || '—'} />
                                    <SummaryRow label="Slip ID" value={`#PAYROLL-${payroll.id}`} />
                                </div>
                            </Panel>

                            <Panel title="Period & Timing">
                                <div className="space-y-2.5">
                                    <SummaryRow label="Period Start" value={payroll.period_start} />
                                    <SummaryRow label="Period End" value={payroll.period_end} />
                                    <SummaryRow label="Date Paid" value={formatDateTime(payroll.paid_at)} />
                                </div>
                            </Panel>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {title}
            </h2>
            {children}
        </div>
    );
}

function SummaryRow({
    label,
    value,
    strong,
}: {
    label: string;
    value: React.ReactNode;
    strong?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between text-xs ${
                strong
                    ? 'border-t border-border pt-2 text-sm font-bold text-foreground'
                    : 'text-muted-foreground'
            }`}
        >
            <span>{label}</span>
            <span
                className={
                    strong
                        ? 'font-mono text-base font-bold text-[#823d21]'
                        : 'font-mono font-medium text-foreground'
                }
            >
                {value}
            </span>
        </div>
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

PayrollShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/payroll' },
            { title: 'Payroll', href: '/finance/payroll' },
            { title: 'Payout Slip', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
