import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Receipt, Clock, ShoppingBag } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    fixed_number: number | null;
    waitress_name: string;
    order_type: string;
    total: number;
    payment_status: string;
    payment_method: string;
    created_at: string;
    items_count: number;
}

interface Props {
    orders: Order[];
    todayTotal: number;
    todayCount: number;
}

const statusColor = (status: string) => {
    if (status === 'paid') return 'bg-emerald-500/10 text-emerald-700';
    if (status === 'partial') return 'bg-amber-500/10 text-amber-700';
    return 'bg-red-500/10 text-red-600';
};

export default function PosOrders({ orders, todayTotal, todayCount }: Props) {
    return (
        <>
            <Head title="Order History - MaMa Café POS" />

            <div className="p-6">
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                    {/* Summary Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Today's Orders</p>
                        <p className="text-2xl font-bold font-mono mt-1">{todayCount}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Today's Revenue</p>
                        <p className="text-2xl font-bold font-mono text-[#823d21] mt-1">${todayTotal.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border bg-[#823d21]/5 border-[#823d21]/20 p-4 shadow-sm col-span-2 sm:col-span-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</p>
                        <p className="text-sm font-semibold mt-1 flex items-center gap-1.5 text-foreground">
                            <Clock className="h-3.5 w-3.5 text-[#823d21]" />
                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b">
                        <Receipt className="h-4 w-4 text-[#823d21]" />
                        <h2 className="font-semibold text-sm">Today's Order History</h2>
                        <Badge className="ml-auto text-[10px] bg-[#823d21]/10 text-[#823d21]">{orders.length} orders</Badge>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground space-y-2">
                            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/30" />
                            <p className="font-semibold text-sm">No orders yet today</p>
                            <p className="text-xs">Orders placed at the POS terminal will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b bg-muted/40 uppercase text-[10px] text-muted-foreground font-semibold">
                                    <tr>
                                        <th className="py-2.5 px-4">Order #</th>
                                        <th className="py-2.5 px-4">Waitress</th>
                                        <th className="py-2.5 px-4">Fixed #</th>
                                        <th className="py-2.5 px-4">Type</th>
                                        <th className="py-2.5 px-4">Items</th>
                                        <th className="py-2.5 px-4">Total</th>
                                        <th className="py-2.5 px-4">Method</th>
                                        <th className="py-2.5 px-4">Status</th>
                                        <th className="py-2.5 px-4 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {orders.map((o) => (
                                        <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="py-2.5 px-4 font-mono font-bold text-foreground">{o.order_number}</td>
                                            <td className="py-2.5 px-4 font-medium">{o.waitress_name}</td>
                                            <td className="py-2.5 px-4 font-mono text-muted-foreground">{o.fixed_number ?? '—'}</td>
                                            <td className="py-2.5 px-4 capitalize text-muted-foreground">{o.order_type.replace('_', ' ')}</td>
                                            <td className="py-2.5 px-4 text-muted-foreground">{o.items_count}</td>
                                            <td className="py-2.5 px-4 font-mono font-bold">${o.total.toFixed(2)}</td>
                                            <td className="py-2.5 px-4 capitalize font-mono text-muted-foreground">{o.payment_method.replace('_', ' ')}</td>
                                            <td className="py-2.5 px-4">
                                                <Badge className={`text-[10px] font-normal ${statusColor(o.payment_status)}`}>
                                                    {o.payment_status}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5 px-4 text-right font-mono text-muted-foreground">{o.created_at}</td>
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

PosOrders.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'POS Orders', href: '/pos/orders' }]}>
        {page}
    </AppLayout>
);
