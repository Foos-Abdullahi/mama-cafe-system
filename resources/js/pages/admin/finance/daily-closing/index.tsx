import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarCheck, UserCheck, ShieldCheck, UserPlus, Edit2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface TodaySummary {
    date: string;
    total_orders: number;
    total_sales: number;
    is_closed: boolean;
    closing?: any;
}

interface WaitressAssignment {
    waitress_id: number;
    name: string;
    assigned_number: string;
    is_active: boolean;
}

interface PastClosing {
    id: number;
    closing_date: string;
    total_orders: number;
    total_sales: number;
    notes: string | null;
    waitress_assignments: WaitressAssignment[];
    closed_by: string;
    created_at: string;
}

interface Props {
    todaySummary: TodaySummary;
    pastClosings: PastClosing[];
    stats: StatSection[];
}

export default function DailyWaitressesIndex({
    todaySummary,
    pastClosings = [],
    stats,
}: Props) {
    const columns: ColumnDef<PastClosing>[] = [
        {
            accessorKey: 'closing_date',
            header: 'Date',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-[#823d21]" />
                    <span className="font-mono font-bold text-xs text-foreground">{row.original.closing_date}</span>
                </div>
            ),
        },
        {
            accessorKey: 'waitress_assignments',
            header: 'Working Waitresses & Assigned Numbers',
            cell: ({ row }) => {
                const list = row.original.waitress_assignments || [];
                if (list.length === 0) {
                    return <span className="text-xs text-muted-foreground italic">No waitresses assigned</span>;
                }
                return (
                    <div className="flex flex-wrap gap-1.5 py-1">
                        {list.map((w, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="bg-[#823d21]/10 text-[#823d21] border-[#823d21]/20 font-medium text-[11px] gap-1 px-2.5 py-1"
                            >
                                <UserCheck className="h-3 w-3" />
                                {w.name}
                                <span className="font-mono font-bold bg-[#823d21] text-white rounded-full px-1.5 py-0.2 text-[10px] ml-0.5">
                                    #{w.assigned_number}
                                </span>
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'total_orders',
            header: 'Orders Handled',
            cell: ({ row }) => <span className="text-xs font-semibold text-foreground">{row.original.total_orders} Orders</span>,
        },
        {
            accessorKey: 'total_sales',
            header: 'Daily Revenue',
            cell: ({ row }) => (
                <span className="font-mono font-bold text-sm text-foreground">
                    ${Number(row.original.total_sales).toFixed(2)}
                </span>
            ),
        },
        {
            accessorKey: 'closed_by',
            header: 'Recorded By',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {row.original.closed_by}
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <Link href={`/finance/daily-closing/${row.original.id}/edit`}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 text-xs border-[#823d21]/30 text-[#823d21] hover:bg-[#823d21]/10 shadow-xs"
                            >
                                <Edit2 className="h-3.5 w-3.5" /> Edit Roster
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Daily Waitresses - MaMa Café" />

            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                            Daily Waitresses
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Manage active daily waitresses and assign their working café numbers for floor orders.
                        </p>
                    </div>

                    <Link href="/finance/daily-closing/create">
                        <Button
                            size="sm"
                            className="bg-[#823d21] text-white hover:bg-[#682e18] shadow-xs gap-1.5"
                        >
                            <UserPlus className="h-4 w-4" />
                            Assign Today's Waitresses ({todaySummary.date})
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <StatsCard sections={stats} />

                {/* Main DataTable View */}
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-in-out">
                    <DataTable
                        title="Daily Waitress Shift Rosters"
                        searchTitle="Filter rosters by date..."
                        columns={columns}
                        data={pastClosings}
                    />
                </div>
            </div>
        </>
    );
}

DailyWaitressesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/daily-closing' },
            { title: 'Daily Waitresses', href: '/finance/daily-closing' },
        ]}
    >
        {page}
    </AppLayout>
);
