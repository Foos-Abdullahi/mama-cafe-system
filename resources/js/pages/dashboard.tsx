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

            <div className="space-y-6 p-6">
                {/* Welcome Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-primary p-6 text-white shadow-md">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back to MaMa Café Dashboard</h1>
                        <p className="text-sm text-white/80">Real-time cafe operations, daily sales trends, and floor staff performance.</p>
                    </div>
                    <Link href="/pos">
                        <Button className="bg-white text-[#823d21] hover:bg-white/90 font-bold gap-2 shadow-sm shrink-0">
                            <Monitor className="h-4 w-4" /> Open POS Terminal
                        </Button>
                    </Link>
                </div>

                {/* KPI Stats */}
                <StatsCard sections={stats} />



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
                                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    name="Sales"
                                    stroke="#823d21"
                                    strokeWidth={2.5}
                                    fill="url(#salesGradient)"
                                    dot={{ fill: '#823d21', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Quick Actions — vertical list */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div>
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Plus className="h-5 w-5 text-[#823d21]" /> Quick Actions
                            </h2>
                            <p className="text-xs text-muted-foreground">Fast-launch frequently used actions.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                { href: '/pos', icon: Monitor, label: 'POS Terminal', desc: 'Open cashier terminal', color: 'bg-[#823d21]' },
                                { href: '/management/orders/create', icon: ShoppingBag, label: 'New Order', desc: 'Create a customer order', color: 'bg-blue-600' },
                                { href: '/management/products/create', icon: Package, label: 'Add Product', desc: 'Add a menu item', color: 'bg-amber-600' },
                            ].map((action) => (
                                <Link key={action.href} href={action.href} className="group">
                                    <div className="flex items-center gap-4 p-3.5 rounded-xl border bg-muted/20 hover:bg-[#823d21]/10 hover:border-[#823d21] transition-all cursor-pointer">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.color} text-white group-hover:scale-105 transition-transform`}>
                                            <action.icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-foreground group-hover:text-[#823d21]">{action.label}</p>
                                            <p className="text-xs text-muted-foreground">{action.desc}</p>
                                        </div>
                                        <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-[#823d21] shrink-0" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CHARTS ROW 2: Waitress Performance Bar Chart + Activity ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Waitress Performance Bar Chart */}
                    <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div>
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#823d21]" /> Waitress Sales Performance
                            </h2>
                            <p className="text-xs text-muted-foreground">Total sales generated per floor waitress.</p>
                        </div>
                        {waitressPerformance.length === 0 ? (
                            <div className="flex h-[220px] items-center justify-center text-muted-foreground text-xs">
                                No waitress performance data yet.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={waitressPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="sales" name="Sales" fill="#823d21" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="commission" name="Commission" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Live System Activity */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Activity className="h-5 w-5 text-[#823d21]" /> Live System Activity
                            </h2>
                            <Link href="/system/activity-logs" className="text-xs text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {recentActivities.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-6 text-center">No recent activity logs.</p>
                            ) : (
                                recentActivities.map((act) => (
                                    <div key={act.id} className="flex items-start gap-2.5 text-xs pb-2 border-b last:border-none">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#823d21]/10 text-[#823d21] font-bold text-[10px]">
                                            {act.user_name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground line-clamp-1">{act.description}</p>
                                            <p className="text-[10px] text-muted-foreground">{act.user_name} · {act.created_at}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#823d21]" /> Recent Customer Orders
                            </h2>
                            <p className="text-xs text-muted-foreground">Latest transactions across floor and POS terminal.</p>
                        </div>
                        <Link href="/management/orders">
                            <Button variant="outline" size="sm" className="gap-1 text-xs">
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
                                    <th className="py-2.5 px-3">Total</th>
                                    <th className="py-2.5 px-3">Method</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">No orders processed yet.</td>
                                    </tr>
                                ) : (
                                    recentOrders.map((o) => (
                                        <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="py-2.5 px-3 font-mono font-bold text-foreground">{o.order_number}</td>
                                            <td className="py-2.5 px-3 font-medium">{o.waitress_name}</td>
                                            <td className="py-2.5 px-3 capitalize text-muted-foreground">{o.order_type.replace('_', ' ')}</td>
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
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard() }]}>
        {page}
    </AppLayout>
);
