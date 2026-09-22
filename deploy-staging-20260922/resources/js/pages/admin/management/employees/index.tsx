import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import type { StatSection } from '@/components/tools/StatsCard';
import { StatsCard } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';

interface Employee {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    position: string;
    status: 'active' | 'inactive';
    hire_date: string | null;
    created_at: string | null;
}

interface Props {
    employees: Employee[];
    stats: StatSection[];
}

export default function EmployeesIndex({ employees, stats }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/management/employees/${deleteTarget.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: 'name',
            header: 'Employee',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#823d21]/10 text-xs font-semibold text-[#823d21]">
                        {row.original.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <span className="block font-semibold text-foreground">
                            {row.original.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {row.original.phone ||
                                row.original.email ||
                                'No contact details'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'position',
            header: 'Position',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.original.position}
                </Badge>
            ),
        },
        {
            accessorKey: 'hire_date',
            header: 'Hire Date',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground">
                    {row.original.hire_date || 'Not recorded'}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    className={
                        row.original.status === 'active'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground hover:bg-muted'
                    }
                >
                    {row.original.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: () => <span className="block text-right">Actions</span>,
            cell: ({ row }) => (
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
                                <Link
                                    href={`/management/employees/${row.original.id}/edit`}
                                    className="flex cursor-pointer items-center"
                                >
                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                    Edit Employee
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeleteTarget(row.original)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Employee
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Employees Management - MaMa Café" />
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Employees Management
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Manage the wider cafe team, including cashiers,
                            baristas, and support staff.
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/management/employees/create">
                            <Plus className="h-4 w-4" />
                            Add{' '}
                            <span className="hidden sm:inline">Employee</span>
                        </Link>
                    </Button>
                </div>
                <StatsCard sections={stats} />
                <div className="mt-6 animate-in duration-1000 ease-in-out fade-in slide-in-from-bottom-6">
                    <DataTable
                        title="Cafe Employees"
                        searchTitle="Filter employees by name..."
                        columns={columns}
                        data={employees}
                    />
                </div>
            </div>
            <ConfirmDeleteDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
                title={
                    deleteTarget
                        ? `Delete Employee "${deleteTarget.name}"`
                        : 'Confirm Deletion'
                }
                description="Are you sure you want to delete this employee? This action cannot be undone."
                isDeleting={isDeleting}
            />
        </>
    );
}

EmployeesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/employees' },
            { title: 'Employees', href: '/management/employees' },
        ]}
    >
        {page}
    </AppLayout>
);
