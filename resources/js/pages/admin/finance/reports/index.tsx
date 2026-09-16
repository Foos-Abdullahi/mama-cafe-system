import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { Award, Coffee, CreditCard, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import AppLayout from '@/layouts/app-layout';

interface TopProduct {
    id: number;
    name: string;
    total_qty: number;
    total_amount: number;
}

interface WaitressLeader {
    id: number;
    name: string;
    orders_count: number;
    total_sales: number;
    commission: number;
}

interface Filters {
    global_from: string | null;
    global_to: string | null;
    revenue_from: string | null;
    revenue_to: string | null;
    products_from: string | null;
    products_to: string | null;
    leaderboard_from: string | null;
    leaderboard_to: string | null;
    payments_from: string | null;
    payments_to: string | null;
}

interface Props {
    stats: StatSection[];
    paymentBreakdown: {
        cash: number;
        mobile_money: number;
        card: number;
        credit: number;
    };
    topProducts: TopProduct[];
    waitressLeaderboard: WaitressLeader[];
    filters: Filters;
}

/** Small inline date-range filter used per section */
function SectionFilter({
    fromKey,
    toKey,
    fromValue,
    toValue,
    onApply,
}: {
    fromKey: string;
    toKey: string;
    fromValue: string;
    toValue: string;
    onApply: (params: Record<string, string>) => void;
}) {
    return (
        <DateRangePicker
            fromDate={fromValue}
            toDate={toValue}
            placeholder="Filter Date"
            onApply={(from, to) => onApply({ [fromKey]: from, [toKey]: to })}
            onClear={() => onApply({ [fromKey]: '', [toKey]: '' })}
        />
    );
}

export default function ReportsIndex({ stats, paymentBreakdown, topProducts, waitressLeaderboard, filters }: Props) {
    const totalPayments = paymentBreakdown.cash + paymentBreakdown.mobile_money + paymentBreakdown.card + paymentBreakdown.credit;

    // Global filter state
    const [globalFrom, setGlobalFrom] = useState(filters.global_from ?? '');
    const [globalTo, setGlobalTo] = useState(filters.global_to ?? '');

    /** Apply arbitrary query params via Inertia router (merges with existing) */
    const applyFilter = (params: Record<string, string>) => {
        router.get('/finance/reports', { ...params }, { preserveState: true, preserveScroll: true });
    };

    const applyGlobal = (fromStr?: string, toStr?: string) => {
        const fromVal = fromStr !== undefined ? fromStr : globalFrom;
        const toVal = toStr !== undefined ? toStr : globalTo;
        router.get(
            '/finance/reports',
            {
                from: fromVal,
                to: toVal,
                revenue_from: fromVal,
                revenue_to: toVal,
                products_from: fromVal,
                products_to: toVal,
                leaderboard_from: fromVal,
                leaderboard_to: toVal,
                payments_from: fromVal,
                payments_to: toVal,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearAll = () => {
        setGlobalFrom('');
        setGlobalTo('');
        router.get('/finance/reports', {}, { preserveState: false });
    };

    const hasGlobalFilter = filters.global_from || filters.global_to;

    return (
        <>
            <Head title="Sales Reports & Analytics - MaMa Café" />
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold">Sales &amp; Financial Reports</h1>
                        <p className="text-xs text-muted-foreground">
                            Deep insights into café revenue, product performance, payment distribution, and staff sales.
                        </p>
                    </div>
                </div>

                {/* ─── Global Date Filter Bar ─── */}
                <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#823d21]/10 text-[#823d21]">
                                <Filter className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-foreground">Global Date Range Filter</h3>
                                <p className="text-[11px] text-muted-foreground">Filter all report sections simultaneously</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <DateRangePicker
                                fromDate={globalFrom}
                                toDate={globalTo}
                                placeholder="Select Date Range"
                                onApply={(from, to) => {
                                    setGlobalFrom(from);
                                    setGlobalTo(to);
                                    applyGlobal(from, to);
                                }}
                                onClear={clearAll}
                            />
                            {hasGlobalFilter && (
                                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={clearAll}>
                                    <X className="h-3.5 w-3.5" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overall KPI Stats */}
                <StatsCard sections={stats} />

                {/* Analytics Content Grid */}
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                    {/* Grid 2 Columns: Payment Methods & Top Products */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Payment Distribution */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-[#823d21]" />
                                    <h2 className="font-semibold text-base">Payment Method Breakdown</h2>
                                </div>
                                <SectionFilter
                                    fromKey="payments_from"
                                    toKey="payments_to"
                                    fromValue={filters.payments_from ?? ''}
                                    toValue={filters.payments_to ?? ''}
                                    onApply={applyFilter}
                                />
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Cash Payments', value: paymentBreakdown.cash, color: 'bg-emerald-500' },
                                    { label: 'Mobile Money', value: paymentBreakdown.mobile_money, color: 'bg-blue-500' },
                                    { label: 'Card Payments', value: paymentBreakdown.card, color: 'bg-purple-500' },
                                    { label: 'Customer Credit', value: paymentBreakdown.credit, color: 'bg-amber-500' },
                                ].map(({ label, value, color }) => (
                                    <div key={label}>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span>{label}</span>
                                            <span>
                                                ${value.toFixed(2)} (
                                                {totalPayments > 0 ? ((value / totalPayments) * 100).toFixed(1) : 0}%)
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${color} rounded-full`}
                                                style={{ width: `${totalPayments > 0 ? (value / totalPayments) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Selling Menu Products */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-2">
                                    <Coffee className="h-5 w-5 text-[#823d21]" />
                                    <h2 className="font-semibold text-base">Top Selling Products</h2>
                                </div>
                                <SectionFilter
                                    fromKey="products_from"
                                    toKey="products_to"
                                    fromValue={filters.products_from ?? ''}
                                    toValue={filters.products_to ?? ''}
                                    onApply={applyFilter}
                                />
                            </div>

                            {topProducts.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-4 text-center">No sales data recorded yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {topProducts.map((p, idx) => (
                                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#823d21]/10 text-[#823d21] font-bold text-xs">
                                                    #{idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-foreground">{p.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">{p.total_qty} Units Sold</p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-bold text-xs text-foreground">
                                                ${Number(p.total_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Waitress Performance Leaderboard */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base">Waitress Sales Leaderboard</h2>
                            </div>
                            <SectionFilter
                                fromKey="leaderboard_from"
                                toKey="leaderboard_to"
                                fromValue={filters.leaderboard_from ?? ''}
                                toValue={filters.leaderboard_to ?? ''}
                                onApply={applyFilter}
                            />
                        </div>

                        {waitressLeaderboard.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4 text-center">No waitress sales history found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted/30 uppercase text-[10px] font-semibold text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-2">Rank</th>
                                            <th className="px-4 py-2">Waitress Name</th>
                                            <th className="px-4 py-2 text-center">Completed Orders</th>
                                            <th className="px-4 py-2 text-right">Total Sales Revenue</th>
                                            <th className="px-4 py-2 text-right">Commission Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {waitressLeaderboard.map((w, index) => (
                                            <tr key={w.id} className={`hover:bg-muted/10 ${index === 0 ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                                                <td className="px-4 py-3 font-bold text-foreground">
                                                    {index === 0 ? '🏆' : `#${index + 1}`}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-foreground">{w.name}</td>
                                                <td className="px-4 py-3 text-center font-mono">{w.orders_count}</td>
                                                <td className="px-4 py-3 text-right font-mono font-bold">${w.total_sales.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                                                    ${w.commission.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/reports' },
            { title: 'Reports', href: '/finance/reports' },
        ]}
    >
        {page}
    </AppLayout>
);
