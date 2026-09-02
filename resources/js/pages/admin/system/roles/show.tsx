import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Circle, Key, Lock, Pencil, Shield, Users } from 'lucide-react';

interface PermissionMeta {
    name: string;
    description: string;
    module: string;
}

interface RoleData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_system: boolean;
    permissions: string[];
    users_count: number;
}

interface Props {
    role: RoleData;
    permissionsByModule: Record<string, Record<string, PermissionMeta>>;
    totalPermissions: number;
}

export default function RolesShow({ role, permissionsByModule, totalPermissions }: Props) {
    const isAdmin = role.slug === 'admin';
    const grantedCount = isAdmin ? totalPermissions : role.permissions.length;

    return (
        <>
            <Head title={`${role.name} — Roles — MaMa Café`} />

            <div className="space-y-6 p-6 w-full">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">{role.name}</h1>
                            <Badge
                                variant="outline"
                                className={
                                    role.is_system
                                        ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }
                            >
                                {role.is_system ? 'System' : 'Custom'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground font-mono">{role.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild className="gap-2 text-sm">
                            <Link href="/system/roles">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button asChild className="gap-2 bg-[#823d21] text-sm text-white hover:bg-[#682e18]">
                            <Link href={`/system/roles/${role.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                                Edit Role
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border bg-card p-4 shadow-xs">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Privileges</p>
                        <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-[#823d21]" />
                            <span className="text-2xl font-bold">{grantedCount}</span>
                            <span className="text-sm text-muted-foreground">/ {totalPermissions}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-xs">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Assigned Users</p>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#823d21]" />
                            <span className="text-2xl font-bold">{role.users_count}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-xs">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Role Type</p>
                        <div className="flex items-center gap-2">
                            {role.is_system ? (
                                <Lock className="h-4 w-4 text-blue-500" />
                            ) : (
                                <Shield className="h-4 w-4 text-amber-500" />
                            )}
                            <span className="text-sm font-semibold">{role.is_system ? 'System Core' : 'Custom'}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {role.description && (
                    <div className="rounded-xl border bg-card p-5 shadow-xs">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</p>
                        <p className="text-sm text-foreground">{role.description}</p>
                    </div>
                )}

                {/* Permissions by Module */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 border-b px-5 py-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
                            <Key className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Module Privileges</p>
                    </div>

                    <div className="divide-y">
                        {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                            const moduleKeys = Object.keys(modulePerms);
                            const grantedInModule = isAdmin
                                ? moduleKeys.length
                                : moduleKeys.filter((k) => role.permissions.includes(k)).length;

                            return (
                                <div key={module}>
                                    <div className="flex items-center justify-between bg-muted/30 px-5 py-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                                            {module} Module
                                        </p>
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                            {grantedInModule} of {moduleKeys.length}
                                        </Badge>
                                    </div>
                                    <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 px-5 py-4">
                                        {Object.entries(modulePerms).map(([key, meta]) => {
                                            const granted = isAdmin || role.permissions.includes(key);
                                            return (
                                                <div
                                                    key={key}
                                                    className={`flex items-start gap-3 rounded-lg p-3 ${granted ? '' : 'opacity-40'}`}
                                                >
                                                    {granted ? (
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                                    ) : (
                                                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground leading-tight">{meta.name}</p>
                                                        <p className="mt-0.5 text-[11px] text-muted-foreground">{meta.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

RolesShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/settings' },
            { title: 'Roles & Permissions', href: '/system/roles' },
            { title: 'View Role', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
