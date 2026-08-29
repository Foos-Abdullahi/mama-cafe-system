import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Hash } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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
    commission_rate: number | string;
    status: 'active' | 'inactive';
    orders_count: number;
    total_sales: number;
    commission_earned: number;
    fixed_numbers: FixedNumber[];
    created_at?: string;
}

interface Props {
    waitresses: Waitress[];
    stats: StatSection[];
}

export default function WaitressesIndex({ waitresses, stats }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this waitress?')) {
            router.delete(`/management/waitresses/${id}`);
        }
    };

    const columns: ColumnDef<Waitress>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Waitress Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#823d21]/10 text-[#823d21] font-semibold text-xs">
                        {row.original.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <span className="font-semibold text-foreground block">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.phone || 'No phone'}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'fixed_numbers',
            header: 'Fixed Number Range',
            cell: ({ row }) => {
                const fn = row.original.fixed_numbers?.[0];
                return fn ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-foreground">
                        <Hash className="h-3.5 w-3.5 text-amber-600" />
                        <span>Range: {fn.range_start} - {fn.range_end}</span>
                        <Badge variant="outline" className="ml-1 text-[10px] bg-secondary/40">
                            Current: #{fn.current_number}
                        </Badge>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground italic">Unassigned</span>
                );
            },
        },
        {
            accessorKey: 'orders_count',
            header: 'Orders Handled',
            cell: ({ row }) => (
                <span className="font-medium text-xs text-foreground">
                    {row.original.orders_count} Orders
                </span>
            ),
        },
        {
            accessorKey: 'commission_rate',
            header: 'Commission',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-bold text-xs bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20">
                    {(Number(row.original.commission_rate) * 100).toFixed(0)}%
                </Badge>
            ),
        },
        {
            accessorKey: 'total_sales',
            header: 'Sales / Earned',
            cell: ({ row }) => (
                <div>
                    <span className="font-mono font-bold text-foreground block text-xs">
                        Sales: ${Number(row.original.total_sales).toFixed(2)}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-600 font-medium">
                        Comm: ${Number(row.original.commission_earned).toFixed(2)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.original.status === 'active';
                return (
                    <Badge
                        className={
                            isActive
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20'
                                : 'bg-muted text-muted-foreground hover:bg-muted'
                        }
                    >
                        {isActive ? 'Active' : 'Off Duty'}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                const w = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/waitresses/${w.id}`} className="flex items-center cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                        View Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/management/waitresses/${w.id}/edit`} className="flex items-center cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                        Edit Staff
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(w.id)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Waitress
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Waitresses Management - MaMa Café" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Waitresses Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage floor staff, their fixed number ranges and commissions.
                        </p>
                    </div>
                    <Link href="/management/waitresses/create">
                        <Button className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm">
                            <Plus className="h-4 w-4" /> Add Waitress
                        </Button>
                    </Link>
                </div>

                <StatsCard sections={stats} />

                <DataTable
                    title="Floor Staff"
                    searchTitle="Filter waitresses by name..."
                    columns={columns}
                    data={waitresses}
                />
            </div>
        </>
    );
}

WaitressesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/waitresses' },
            { title: 'Waitresses', href: '/management/waitresses' },
        ]}
    >
        {page}
    </AppLayout>
);
