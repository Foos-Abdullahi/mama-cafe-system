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
import { UserCog, Plus, MoreHorizontal, Eye, Edit, Trash2, ShieldCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'operations' | 'waitress';
    created_at: string;
}

interface Props {
    users: UserItem[];
    stats: StatSection[];
}

const roleBadges: Record<string, { label: string; class: string }> = {
    admin: { label: 'Admin', class: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 font-bold' },
    manager: { label: 'Manager', class: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    operations: { label: 'Operations / POS', class: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    waitress: { label: 'Waitress', class: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
};

export default function UsersIndex({ users, stats }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user account?')) {
            router.delete(`/system/users/${id}`);
        }
    };

    const columns: ColumnDef<UserItem>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Staff Member',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#823d21]/10 text-[#823d21] font-semibold text-xs">
                        {row.original.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <span className="font-semibold text-foreground block">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.email}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const r = roleBadges[row.original.role] || { label: row.original.role, class: '' };
                return <Badge className={`uppercase text-[10px] ${r.class}`}>{r.label}</Badge>;
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.created_at}</span>,
        },
        {
            id: 'actions',
            header: () => <span className="text-right block">Actions</span>,
            cell: ({ row }) => {
                const u = row.original;
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
                                    <Link href={`/system/users/${u.id}`} className="flex items-center cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                        View Account
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/system/users/${u.id}/edit`} className="flex items-center cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                        Edit Account & Role
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(u.id)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
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
            <Head title="Users Management - MaMa Café" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <UserCog className="h-6 w-6 text-[#823d21]" />
                            Users & Role Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage staff login credentials, roles (*Admin*, *Manager*, *Operations*, *Waitress*), and permissions.
                        </p>
                    </div>
                    <Link href="/system/users/create">
                        <Button className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm">
                            <Plus className="h-4 w-4" /> Add User Account
                        </Button>
                    </Link>
                </div>

                <StatsCard sections={stats} />

                <DataTable
                    title="System User Accounts"
                    searchTitle="Filter users by name or email..."
                    columns={columns}
                    data={users}
                />
            </div>
        </>
    );
}

UsersIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/users' },
            { title: 'Users', href: '/system/users' },
        ]}
    >
        {page}
    </AppLayout>
);
