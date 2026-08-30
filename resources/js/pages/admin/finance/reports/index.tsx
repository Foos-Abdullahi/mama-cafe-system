import React from 'react';
import { Head } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Award, Coffee, CreditCard, Users } from 'lucide-react';
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
}

export default function ReportsIndex({ stats, paymentBreakdown, topProducts, waitressLeaderboard }: Props) {
    const totalPayments = paymentBreakdown.cash + paymentBreakdown.mobile_money + paymentBreakdown.card + paymentBreakdown.credit;

    return (
        <>
            <Head title="Sales Reports & Analytics - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-[#823d21]" />
                            Sales & Financial Reports
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Deep insights into cafe revenue, product performance, payment distribution, and staff sales.
                        </p>
                    </div>
                </div>

                {/* Overall KPI Stats */}
                <StatsCard sections={stats} />

                {/* Grid 2 Columns: Payment Methods & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment Distribution */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <CreditCard className="h-5 w-5 text-[#823d21]" />
                            <h2 className="font-semibold text-base">Payment Method Breakdown</h2>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span>Cash</span>
                                    <span>${paymentBreakdown.cash.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.cash / totalPayments) * 100).toFixed(0) : 0}%)</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.cash / totalPayments) * 100 : 0}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span>Mobile Money</span>
                                    <span>${paymentBreakdown.mobile_money.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.mobile_money / totalPayments) * 100).toFixed(0) : 0}%)</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.mobile_money / totalPayments) * 100 : 0}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span>Card</span>
                                    <span>${paymentBreakdown.card.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.card / totalPayments) * 100).toFixed(0) : 0}%)</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.card / totalPayments) * 100 : 0}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span>Customer Credit</span>
                                    <span>${paymentBreakdown.credit.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.credit / totalPayments) * 100).toFixed(0) : 0}%)</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.credit / totalPayments) * 100 : 0}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Coffee className="h-5 w-5 text-[#823d21]" />
                            <h2 className="font-semibold text-base">Top Selling Products</h2>
                        </div>

                        {topProducts.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic text-center py-6">No completed sales records found yet.</p>
                        ) : (
                            <ul className="divide-y">
                                {topProducts.map((p, idx) => (
                                    <li key={p.id} className="flex items-center justify-between py-2.5">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#823d21]/10 text-xs font-bold text-[#823d21]">
                                                #{idx + 1}
                                            </span>
                                            <span className="font-medium text-sm text-foreground">{p.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-sm text-foreground block font-mono">${p.total_amount.toFixed(2)}</span>
                                            <span className="text-xs text-muted-foreground">{p.total_qty} units sold</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Waitress Sales Leaderboard */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <Award className="h-5 w-5 text-[#823d21]" />
                        <h2 className="font-semibold text-base">Waitress Sales Leaderboard</h2>
                    </div>

                    {waitressLeaderboard.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-6">No waitress sales records yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/30">
                                    <tr>
                                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">Rank & Staff</th>
                                        <th className="text-center px-4 py-2 font-medium text-muted-foreground">Orders Served</th>
                                        <th className="text-right px-4 py-2 font-medium text-muted-foreground">Sales Generated</th>
                                        <th className="text-right px-4 py-2 font-medium text-muted-foreground">15% Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {waitressLeaderboard.map((w, idx) => (
                                        <tr key={w.id}>
                                            <td className="px-4 py-3 font-semibold flex items-center gap-3">
                                                <Badge variant="outline" className="font-mono text-xs">#{idx + 1}</Badge>
                                                <span>{w.name}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs">{w.orders_count} Orders</td>
                                            <td className="px-4 py-3 text-right font-mono font-bold">${w.total_sales.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">${w.commission.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
