import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
} from 'recharts';
import {
    Monitor,
    ShoppingBag,
    Package,
    Clock,
    Activity,
    ArrowUpRight,
    TrendingUp,
    Users,
    Plus,
} from 'lucide-react';
import { dashboard } from '@/routes';

interface SalesTrendItem {
    day: string;
    date: string;
    sales: number;
    orders: number;
}

interface WaitressPerformanceItem {
    name: string;
    sales: number;
    orders: number;
    commission: number;
}

interface PaymentBreakdownItem {
    name: string;
    value: number;
    color: string;
}

interface RecentOrder {
    id: number;
    order_number: string;
    waitress_name: string;
    order_type: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
}

interface RecentActivity {
    id: number;
    user_name: string;
    action: string;
    description: string;
    created_at: string;
}

interface Props {
    stats: StatSection[];
    paymentBreakdown: PaymentBreakdownItem[];
    salesTrend: SalesTrendItem[];
    waitressPerformance: WaitressPerformanceItem[];
    recentOrders: RecentOrder[];
    recentActivities: RecentActivity[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border bg-card p-3 shadow-lg text-xs space-y-1">
                <p className="font-bold text-foreground">{label}</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} style={{ color: entry.color }} className="font-semibold">
                        {entry.name}: {entry.name === 'Sales' ? `$${entry.value.toFixed(2)}` : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard({ stats, paymentBreakdown, salesTrend, waitressPerformance, recentOrders, recentActivities }: Props) {
    return (
        <>
            <Head title="Executive Dashboard - MaMa Café" />
            <div className="p-6">
                {/* Header / Welcome Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-primary p-6 text-white shadow-md">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight">Welcome back to MaMa Café Dashboard</h1>
                        <p className="text-xs text-white/80">Real-time cafe operations, daily sales trends, and floor staff performance.</p>
                    </div>
                    <Link href="/pos">
                        <Button className="bg-white text-[#823d21] hover:bg-white/90 font-bold gap-2 shadow-sm shrink-0" size={'sm'}>
                            <Monitor className="h-4 w-4" /> Open POS Terminal
                        </Button>
                    </Link>
                </div>

                {/* KPI Stats */}
                <StatsCard sections={stats} />

                {/* Charts & Tables Content */}
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                    {/* ── CHARTS ROW 1: 7-Day Sales Trend (Area) + Payment Breakdown (Pie) ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 7-Day Area Chart */}
                        <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-base flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-[#823d21]" /> 7-Day Sales Revenue Trend
                                    </h2>
                                    <p className="text-xs text-muted-foreground">Daily gross sales over the last 7 days.</p>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={230}>
                                <AreaChart data={salesTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#823d21" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#823d21" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip
                                        formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Sales']}
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#823d21" strokeWidth={2} fillOpacity={1} fill="url(#salesGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Payment Method Distribution */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Activity className="h-5 w-5 text-[#823d21]" /> Payment Methods
                            </h2>
                            <p className="text-xs text-muted-foreground">Revenue share per channel.</p>

                            <div className="space-y-3 pt-2">
                                {paymentBreakdown.map((item) => {
                                    const total = paymentBreakdown.reduce((sum, p) => sum + p.value, 0);
                                    const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
                                    return (
                                        <div key={item.name} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span>{item.name}</span>
                                                <span className="font-mono">${item.value.toFixed(2)} ({pct}%)</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── CHARTS ROW 2: Waitress Performance Bar Chart ── */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-base flex items-center gap-2">
                                    <Users className="h-5 w-5 text-[#823d21]" /> Waitress Performance &amp; Commission Breakdown
                                </h2>
                                <p className="text-xs text-muted-foreground">Total sales generated and 15% commission earned per floor staff member.</p>
                            </div>
                        </div>
                        {waitressPerformance.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic text-center py-8">No waitress sales data available yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={waitressPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip
                                        formatter={(val: any, name: any) => [`$${Number(val).toFixed(2)}`, name === 'sales' ? 'Total Sales' : 'Commission (15%)']}
                                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="sales" fill="#823d21" radius={[4, 4, 0, 0]} name="sales" />
                                    <Bar dataKey="commission" fill="#10b981" radius={[4, 4, 0, 0]} name="commission" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* ── RECENT TRANSACTIONS TABLE ── */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-base flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-[#823d21]" /> Recent Orders Roster
                                </h2>
                                <p className="text-xs text-muted-foreground">Latest transactions processed across floor &amp; takeaway.</p>
                            </div>
                            <Link href="/management/orders">
                                <Button variant="ghost" size="sm" className="text-xs gap-1">
                                    View All <ArrowUpRight className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b bg-muted/40 uppercase text-[10px] text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="py-2.5 px-3">Order #</th>
                                        <th className="py-2.5 px-3">Waitress</th>
                                        <th className="py-2.5 px-3">Type</th>
                                        <th className="py-2.5 px-3">Total Amount</th>
                                        <th className="py-2.5 px-3">Payment</th>
                                        <th className="py-2.5 px-3">Status</th>
                                        <th className="py-2.5 px-3 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-muted-foreground italic">No orders recorded today.</td>
                                        </tr>
                                    ) : (
                                        recentOrders.map((o) => (
                                            <tr key={o.id} className="hover:bg-muted/20">
                                                <td className="py-2.5 px-3 font-mono font-bold text-foreground">{o.order_number}</td>
                                                <td className="py-2.5 px-3 font-medium text-foreground">{o.waitress_name}</td>
                                                <td className="py-2.5 px-3 capitalize">
                                                    <Badge variant="outline" className="text-[10px] font-normal">
                                                        {o.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                                                    </Badge>
                                                </td>
                                                <td className="py-2.5 px-3 font-mono font-bold">${o.total.toFixed(2)}</td>
                                                <td className="py-2.5 px-3 capitalize font-mono text-muted-foreground">{o.payment_method.replace('_', ' ')}</td>
                                                <td className="py-2.5 px-3">
                                                    <Badge className={o.status === 'completed'
                                                        ? 'bg-emerald-500/10 text-emerald-700 text-[10px] font-normal'
                                                        : 'bg-amber-500/10 text-amber-700 text-[10px] font-normal'
                                                    }>
                                                        {o.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">{o.created_at}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard() }]}>
        {page}
    </AppLayout>
);
