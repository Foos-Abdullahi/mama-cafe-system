import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Users, Phone, Hash, TrendingUp, Calendar, DollarSign, Award, CheckCircle } from 'lucide-react';

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

    return (
        <>
            <Head title={`${waitress.name} — Waitress Profile`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                {waitress.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={
                                    waitress.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                                }
                            >
                                {waitress.status === 'active' ? 'On Duty' : 'Off Duty'}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-mono">
                                {(Number(waitress.commission_rate) * 100).toFixed(0)}% Commission
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Registered: {formatDateTime(waitress.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/management/waitresses/${waitress.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <Edit className="h-3.5 w-3.5" />
                                Edit Waitress
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive shadow-xs border-destructive/30"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                        <Link href="/management/waitresses">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Waitresses
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Key Performance Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Orders Handled
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#823d21]/10 text-[#823d21]">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold font-mono text-foreground">
                            {waitress.orders_count || 0}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Sales Generated
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold font-mono text-emerald-600">
                            ${Number(waitress.total_sales || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Commission Earned
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                                <Award className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-2xl font-bold font-mono text-amber-600">
                            ${Number(waitress.commission_earned || 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Left Column: Fixed Numbers & Assigned Range */}
                    <div className="space-y-4">
                        <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                            <div className="border-b border-border px-4 py-3 bg-muted/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-[#823d21]" />
                                    <h2 className="font-semibold text-foreground text-sm">
                                        Assigned Fixed Number Ranges ({waitress.fixed_numbers?.length || 0})
                                    </h2>
                                </div>
                            </div>

                            <div className="divide-y divide-border">
                                {waitress.fixed_numbers && waitress.fixed_numbers.length > 0 ? (
                                    waitress.fixed_numbers.map((range) => (
                                        <div key={range.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold font-mono text-sm text-foreground">
                                                        #{range.range_start} – #{range.range_end}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {range.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                                    Current active table index: #{range.current_number}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-muted-foreground">Total slots</span>
                                                <p className="font-mono font-bold text-sm text-foreground">
                                                    {range.range_end - range.range_start + 1}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-sm text-muted-foreground">
                                        No fixed number ranges assigned to this waitress.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Staff Profile Info */}
                    <div className="space-y-4">
                        <Panel title="Staff Profile">
                            <SummaryRow
                                label="Full Name"
                                value={waitress.name}
                                strong
                            />
                            <SummaryRow
                                label="Phone"
                                value={waitress.phone || '—'}
                            />
                            <SummaryRow
                                label="Commission"
                                value={`${(Number(waitress.commission_rate) * 100).toFixed(0)}%`}
                            />
                            <SummaryRow
                                label="Duty Status"
                                value={waitress.status === 'active' ? 'On Duty' : 'Off Duty'}
                            />
                            <SummaryRow
                                label="Hire Date"
                                value={formatDateTime(waitress.created_at)}
                            />
                        </Panel>

                        <Panel title="Financial Summary">
                            <SummaryRow
                                label="Total Orders"
                                value={`${waitress.orders_count || 0}`}
                            />
                            <SummaryRow
                                label="Gross Sales"
                                value={`$${Number(waitress.total_sales || 0).toFixed(2)}`}
                            />
                            <SummaryRow
                                label="Net Commission"
                                value={`$${Number(waitress.commission_earned || 0).toFixed(2)}`}
                                strong
                            />
                        </Panel>
                    </div>
                </div>
            </div>
        </>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h2 className="mb-3 font-semibold text-foreground text-sm border-b border-border pb-2">
                {title}
            </h2>
            {children}
        </section>
    );
}

function SummaryRow({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span
                className={
                    strong
                        ? 'font-bold font-mono text-foreground'
                        : 'font-medium font-mono text-foreground'
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

