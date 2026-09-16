import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Award, Coffee, Users } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';
import reports from '@/routes/finance/reports';

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

type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

interface Props {
    stats: StatSection[];
    orderReportChart: {
        period: ReportPeriod;
        series: { label: string; orders: number }[];
    };
    topProducts: TopProduct[];
    waitressLeaderboard: WaitressLeader[];
}

export default function ReportsIndex({ stats, orderReportChart, topProducts, waitressLeaderboard }: Props) {
    const [period, setPeriod] = useState<ReportPeriod>('weekly');

    useEffect(() => {
        setPeriod(orderReportChart.period);
    }, [orderReportChart.period]);

    function changePeriod(next: ReportPeriod) {
        setPeriod(next);

        router.get(reports.index.get({ query: { period: next } }).url, undefined, {
            preserveState: true,
            preserveScroll: true,
            only: ['orderReportChart'],
        });
    }

    const totalOrders = orderReportChart.series.reduce((sum, point) => sum + point.orders, 0);
    const averageOrders = orderReportChart.series.length > 0 ? totalOrders / orderReportChart.series.length : 0;
    const hasOrderData = orderReportChart.series.some((point) => point.orders > 0);

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
                    {/* Grid 2 Columns: Orders Report & Top Products */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Orders Report */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between gap-3 border-b pb-3">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-[#823d21]" />
                                    <h2 className="font-semibold text-base">Orders Report</h2>
                                </div>

                                <Select value={period} onValueChange={(val) => changePeriod(val as ReportPeriod)}>
                                    <SelectTrigger className="h-8 w-[136px] text-xs">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {!hasOrderData ? (
                                <p className="text-xs text-muted-foreground py-8 text-center">
                                    No orders recorded for this period.
                                </p>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={orderReportChart.series} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                            <Tooltip
                                                formatter={(val: any) => [`${val} orders`, 'Orders']}
                                                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                            />
                                            <Bar dataKey="orders" fill="#823d21" radius={[4, 4, 0, 0]} name="Orders" />
                                        </BarChart>
                                    </ResponsiveContainer>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <div className="rounded-lg border bg-muted/20 p-3">
                                            <p className="text-[11px] text-muted-foreground">Total Orders</p>
                                            <p className="font-mono text-base font-bold text-foreground">{totalOrders}</p>
                                        </div>
                                        <div className="rounded-lg border bg-muted/20 p-3">
                                            <p className="text-[11px] text-muted-foreground">
                                                {period === 'yearly' ? 'Avg Orders / Month' : 'Avg Orders / Day'}
                                            </p>
                                            <p className="font-mono text-base font-bold text-foreground">{averageOrders.toFixed(1)}</p>
                                        </div>
                                    </div>
                                </>
                            )}
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
