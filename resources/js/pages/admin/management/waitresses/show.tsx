import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Users, Phone, Hash, TrendingUp } from 'lucide-react';

interface FixedNumber {
    id: number;
    range_start: number;
    range_end: number;
    current_number: number;
    status: string;
}

interface Waitress {
    id: number;
    name: string;
    phone: string | null;
    commission_rate: number;
    status: 'active' | 'inactive';
    orders_count: number;
    total_sales: number;
    commission_earned: number;
    fixed_numbers: FixedNumber[];
    created_at: string;
}

interface Props {
    waitress: Waitress;
}

export default function WaitressShow({ waitress }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${waitress.name}"?`)) {
            router.delete(`/management/waitresses/${waitress.id}`);
        }
    };

    const firstRange = waitress.fixed_numbers?.[0];

    return (
        <>
            <Head title={`${waitress.name} - MaMa Café`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {waitress.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">Waitress profile & performance metrics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/management/waitresses">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Waitresses
                            </Button>
                        </Link>
                        <Link href={`/management/waitresses/${waitress.id}/edit`}>
                            <Button size="sm" className="gap-2 bg-[#823d21] hover:bg-[#682e18]">
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
                        <p className="text-3xl font-bold text-[#823d21]">{waitress.orders_count}</p>
                        <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold">Orders Handled</p>
                    </div>
                    <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
                        <p className="text-3xl font-bold text-emerald-600">${Number(waitress.total_sales).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold">Total Sales Revenue</p>
                    </div>
                    <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
                        <p className="text-3xl font-bold text-amber-600">${Number(waitress.commission_earned).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold">Commission Earned</p>
                    </div>
                </div>

                {/* Details Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="font-semibold text-lg">Staff Information</h2>
                        <Badge className={waitress.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'}>
                            {waitress.status === 'active' ? 'On Duty' : 'Off Duty'}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5 text-[#823d21]" /> Phone Number
                            </p>
                            <p className="mt-1 font-semibold text-base text-foreground">{waitress.phone ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <TrendingUp className="h-3.5 w-3.5 text-amber-600" /> Commission Rate
                            </p>
                            <p className="mt-1 font-semibold text-base text-foreground">{(Number(waitress.commission_rate) * 100).toFixed(0)}%</p>
                        </div>
                        {firstRange && (
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                    <Hash className="h-3.5 w-3.5 text-amber-600" /> Fixed Number Range
                                </p>
                                <p className="mt-1 font-semibold text-base text-foreground">{firstRange.range_start} – {firstRange.range_end}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Current: #{firstRange.current_number}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Registered Date</p>
                            <p className="mt-1 font-semibold text-base text-foreground">{waitress.created_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

WaitressShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/waitresses' },
            { title: 'Waitresses', href: '/management/waitresses' },
            { title: 'Waitress Profile', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
