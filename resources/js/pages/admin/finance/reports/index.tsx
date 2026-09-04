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
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Sales & Financial Reports</h1>
                        <p className="text-xs text-muted-foreground">
                            Deep insights into cafe revenue, product performance, payment distribution, and staff sales.
                        </p>
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
                            <div className="flex items-center gap-2 border-b pb-3">
                                <CreditCard className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base">Payment Method Breakdown</h2>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>Cash Payments</span>
                                        <span>${paymentBreakdown.cash.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.cash / totalPayments) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.cash / totalPayments) * 100 : 0}%` }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>Mobile Money</span>
                                        <span>${paymentBreakdown.mobile_money.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.mobile_money / totalPayments) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.mobile_money / totalPayments) * 100 : 0}%` }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>Card Payments</span>
                                        <span>${paymentBreakdown.card.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.card / totalPayments) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.card / totalPayments) * 100 : 0}%` }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span>Customer Credit</span>
                                        <span>${paymentBreakdown.credit.toFixed(2)} ({totalPayments > 0 ? ((paymentBreakdown.credit / totalPayments) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalPayments > 0 ? (paymentBreakdown.credit / totalPayments) * 100 : 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Selling Menu Products */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 border-b pb-3">
                                <Coffee className="h-5 w-5 text-[#823d21]" />
                                <h2 className="font-semibold text-base">Top Selling Products</h2>
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
                                            <span className="font-mono font-bold text-xs text-foreground">${Number(p.total_amount).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Waitress Performance Leaderboard */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Award className="h-5 w-5 text-[#823d21]" />
                            <h2 className="font-semibold text-base">Waitress Sales Leaderboard</h2>
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
                                            <th className="px-4 py-2 text-right">Commission Earned (15%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {waitressLeaderboard.map((w, index) => (
                                            <tr key={w.id} className="hover:bg-muted/10">
                                                <td className="px-4 py-3 font-bold text-foreground">#{index + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-foreground">{w.name}</td>
                                                <td className="px-4 py-3 text-center font-mono">{w.orders_count}</td>
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
