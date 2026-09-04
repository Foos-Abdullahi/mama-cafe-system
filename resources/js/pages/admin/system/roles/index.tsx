import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Shield,
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    Users,
    Lock,
    Layers,
    Key,
    UserCheck,
} from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { StatsCard, StatSection } from '@/components/tools/StatsCard';

interface RoleRow {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_system: boolean;
    permissions_count: number;
    users_count: number;
}

interface Stats {
    total_roles: number;
    system_roles: number;
    custom_roles: number;
    total_permissions: number;
    assigned_users: number;
}

interface Props {
    roles: RoleRow[];
    stats: Stats;
}

const statCards = (stats: Stats): StatSection[] => [
    {
        title: 'Total Roles',
        value: stats.total_roles,
        icon: Layers,
        color: 'primary',
    },
    {
        title: 'System Core Roles',
        value: stats.system_roles,
        icon: Lock,
        color: 'info',
    },
    {
        title: 'Custom Roles',
        value: stats.custom_roles,
        icon: Shield,
        color: 'warning',
    },
    {
        title: 'Defined Privileges',
        value: stats.total_permissions,
        icon: Key,
        color: 'accent',
    },
    {
        title: 'Assigned Users',
        value: stats.assigned_users,
        icon: UserCheck,
        color: 'success',
    },
];

export default function RolesIndex({ roles, stats }: Props) {
    const [search, setSearch] = useState('');

    const filtered = roles.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.slug.toLowerCase().includes(search.toLowerCase()) ||
            (r.description ?? '').toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = (role: RoleRow) => {
        router.delete(`/system/roles/${role.id}`);
    };

    return (
        <>
            <Head title="Roles & Permissions — MaMa Café" />

            <div className="p-6">
                {/* Page Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Roles &amp; Access Permissions</h1>
                        <p className="text-xs text-muted-foreground">
                            Manage role hierarchies, configure fine-grained module privileges, and audit assigned user accounts.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/system/users">
                                <Users className="h-4 w-4 mr-1" />
                                Users Roster
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/system/roles/create">
                                <Plus className="h-4 w-4" />
                                Create
                                <span className="hidden sm:inline">Role</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <StatsCard sections={statCards(stats)} />

                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">

                {/* Search */}
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="role-search"
                        placeholder="Search by role name, slug, description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 text-sm"
                    />
                </div>

                {/* Roles Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 w-[30%]">Role Name</th>
                                    <th className="px-4 py-3 w-[30%]">Description</th>
                                    <th className="px-4 py-3 text-center w-[15%]">Permissions</th>
                                    <th className="px-4 py-3 text-center w-[15%]">Assigned Users</th>
                                    <th className="px-4 py-3 text-right w-[10%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                                            No roles found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((role) => (
                                        <tr key={role.id} className="transition-colors hover:bg-muted/10">
                                            {/* Role Name + Slug */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-muted/30 text-muted-foreground">
                                                        <Shield className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-foreground">{role.name}</span>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    role.is_system
                                                                        ? 'border-blue-200 bg-blue-50 text-[10px] text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                                        : 'border-amber-200 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                }
                                                            >
                                                                {role.is_system ? 'System' : 'Custom'}
                                                            </Badge>
                                                        </div>
                                                        <p className="mt-0.5 text-[11px] text-muted-foreground">{role.slug}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="px-4 py-4">
                                                <p className="max-w-xs truncate text-sm text-muted-foreground">
                                                    {role.description ?? '—'}
                                                </p>
                                            </td>

                                            {/* Permissions Count */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-foreground">
                                                    <Key className="h-3 w-3 text-[#823d21]" />
                                                    {role.permissions_count} Privileges
                                                </span>
                                            </td>

                                            {/* Assigned Users */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Users className="h-3 w-3" />
                                                    {role.users_count} {role.users_count === 1 ? 'account' : 'accounts'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-xs">
                                                        <Link href={`/system/roles/${role.id}`}>
                                                            <Eye className="h-3.5 w-3.5" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-xs">
                                                        <Link href={`/system/roles/${role.id}/edit`}>
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </Button>

                                                    {!role.is_system && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Delete role &quot;{role.name}&quot;?</DialogTitle>
                                                                    <DialogDescription>
                                                                        This will permanently delete the <strong>{role.name}</strong> role.
                                                                        Users assigned this role will lose their access. This action cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        onClick={() => handleDelete(role)}
                                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                                    >
                                                                        Delete Role
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="border-t bg-muted/10 px-5 py-3 text-xs text-muted-foreground">
                        Showing {filtered.length} of {roles.length} roles
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

RolesIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/settings' },
            { title: 'Roles & Permissions', href: '/system/roles' },
        ]}
    >
        {page}
    </AppLayout>
);
