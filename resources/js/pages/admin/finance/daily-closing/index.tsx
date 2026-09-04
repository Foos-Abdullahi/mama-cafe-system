import React, { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarCheck, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface TodaySummary {
    date: string;
    total_orders: number;
    total_sales: number;
    cash_expected: number;
    mobile_money_total: number;
    card_total: number;
    credit_total: number;
    is_closed: boolean;
    closing?: any;
}

interface PastClosing {
    id: number;
    closing_date: string;
    total_orders: number;
    total_sales: number;
    cash_expected: number;
    cash_actual: number;
    mobile_money_total: number;
    card_total: number;
    credit_total: number;
    variance: number;
    notes: string | null;
    closed_by: string;
    created_at: string;
}

interface Props {
    todaySummary: TodaySummary;
    pastClosings: PastClosing[];
    stats: StatSection[];
}

export default function DailyClosingIndex({ todaySummary, pastClosings, stats }: Props) {
    const form = useForm({
        closing_date: todaySummary.date,
        cash_actual: todaySummary.closing ? String(todaySummary.closing.cash_actual) : '',
        notes: todaySummary.closing?.notes || '',
    });

    const variance = useMemo(() => {
        const actual = Number(form.data.cash_actual || 0);
        return actual - todaySummary.cash_expected;
    }, [form.data.cash_actual, todaySummary.cash_expected]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/daily-closing');
    };

    const columns: ColumnDef<PastClosing>[] = [
        {
            accessorKey: 'closing_date',
            header: 'Closing Date',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-[#823d21]" />
                    <span className="font-mono font-bold text-xs text-foreground">{row.original.closing_date}</span>
                </div>
            ),
        },
        {
            accessorKey: 'total_orders',
            header: 'Orders',
            cell: ({ row }) => <span className="text-xs font-medium">{row.original.total_orders} Orders</span>,
        },
        {
            accessorKey: 'total_sales',
            header: 'Total Revenue',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-foreground">
                    ${Number(row.original.total_sales).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'cash_expected',
            header: 'Expected Cash',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">${Number(row.original.cash_expected).toFixed(2)}</span>,
        },
        {
            accessorKey: 'cash_actual',
            header: 'Actual Cash',
            cell: ({ row }) => <span className="font-mono font-semibold text-xs text-foreground">${Number(row.original.cash_actual).toFixed(2)}</span>,
        },
        {
            accessorKey: 'variance',
            header: 'Variance',
            cell: ({ row }) => {
                const v = Number(row.original.variance);
                if (v === 0) {
                    return <Badge className="bg-emerald-500/10 text-emerald-700 font-mono text-[10px]">Exact ($0.00)</Badge>;
                }
                return (
                    <Badge className={v > 0 ? 'bg-blue-500/10 text-blue-700 font-mono text-[10px]' : 'bg-red-500/10 text-red-700 font-mono text-[10px]'}>
                        {v > 0 ? `+${v.toFixed(2)}` : `${v.toFixed(2)}`}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'closed_by',
            header: 'Closed By',
            cell: ({ row }) => <span className="text-xs text-muted-foreground font-medium">{row.original.closed_by}</span>,
        },
    ];

    return (
        <>
            <Head title="Daily Closing & EOD Reconciliation - MaMa Café" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Daily EOD Closing & Cash Reconciliation</h1>
                        <p className="text-xs text-muted-foreground">
                            Perform End-of-Day cash drawer balancing, track drawer variances, and review historical closings.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <StatsCard sections={stats} />

                {/* EOD Form & Historical Closings */}
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                    {/* Today's EOD Form Card */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-[#823d21]" />
                                    Today's EOD Drawer Closing ({todaySummary.date})
                                </h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Reconcile drawer cash against recorded system transactions.
                                </p>
                            </div>
                            <Badge className={todaySummary.is_closed ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700'}>
                                {todaySummary.is_closed ? 'Reconciled & Closed' : 'Open (Pending EOD)'}
                            </Badge>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Summary Numbers */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Today's Orders</p>
                                    <p className="text-lg font-bold text-foreground mt-1">{todaySummary.total_orders} Orders</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Revenue</p>
                                    <p className="text-lg font-bold text-foreground mt-1 font-mono">${todaySummary.total_sales.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Expected Cash</p>
                                    <p className="text-lg font-bold text-emerald-600 mt-1 font-mono">${todaySummary.cash_expected.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Digital & Credit</p>
                                    <p className="text-lg font-bold text-blue-600 mt-1 font-mono">
                                        ${(todaySummary.mobile_money_total + todaySummary.card_total + todaySummary.credit_total).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Actual Cash Input */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="cash_actual">
                                        Actual Cash Counted in Drawer ($) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="cash_actual"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={form.data.cash_actual}
                                        onChange={(e) => form.setData('cash_actual', e.target.value)}
                                        required
                                    />
                                    <InputError message={form.errors.cash_actual} />
                                </div>

                                {/* Calculated Variance Preview */}
                                <div className="rounded-lg border p-4 bg-background space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Calculated Cash Variance</p>
                                    <div className="flex items-center gap-2">
                                        {variance === 0 ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                        )}
                                        <span className={`text-xl font-bold font-mono ${variance === 0 ? 'text-emerald-600' : variance > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            ${variance.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {variance === 0 ? 'Cash drawer matches perfectly!' : variance > 0 ? 'Over cash in drawer.' : 'Shortage recorded.'}
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Closing Notes / Discrepancy Reason</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add notes regarding any cash drawer variance or shift observations..."
                                    value={form.data.notes}
                                    onChange={(e) => form.setData('notes', e.target.value)}
                                    rows={3}
                                />
                                <InputError message={form.errors.notes} />
                            </div>

                            <div className="flex justify-end border-t pt-4">
                                <Button type="submit" disabled={form.processing} className="bg-[#823d21] hover:bg-[#682e18] min-w-[180px]">
                                    {form.processing ? 'Reconciling...' : 'Submit EOD Closing'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Historical Closings Table */}
                    <div className="pt-2">
                        <DataTable
                            title="Historical Daily EOD Closings"
                            searchTitle="Filter closings by date..."
                            columns={columns}
                            data={pastClosings}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

DailyClosingIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/daily-closing' },
            { title: 'Daily Closing', href: '/finance/daily-closing' },
        ]}
    >
        {page}
    </AppLayout>
);
