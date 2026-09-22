import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Circle, Key, Lock, Pencil, Shield, Users, ShieldCheck, Layers } from 'lucide-react';

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
            <Head title={`${role.name} — Role Details`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                {role.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={
                                    role.is_system
                                        ? 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium text-xs'
                                        : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-xs'
                                }
                            >
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                {role.is_system ? 'System Role' : 'Custom Role'}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-mono flex items-center gap-1.5">
                            <Key className="h-3.5 w-3.5" />
                            slug: {role.slug}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/system/roles">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Roles
                            </Button>
                        </Link>
                        <Link href={`/system/roles/${role.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Role
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Granted Privileges
                        </p>
                        <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-[#823d21]" />
                            <span className="text-2xl font-bold font-mono text-foreground">{grantedCount}</span>
                            <span className="text-xs text-muted-foreground font-mono">/ {totalPermissions} perms</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Assigned Staff Users
                        </p>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#823d21]" />
                            <span className="text-2xl font-bold font-mono text-foreground">{role.users_count}</span>
                            <span className="text-xs text-muted-foreground">active users</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Role Classification
                        </p>
                        <div className="flex items-center gap-2">
                            {role.is_system ? (
                                <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            )}
                            <span className="text-base font-semibold text-foreground">
                                {role.is_system ? 'Core System Role' : 'Custom Defined'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Role Description Panel if set */}
                {role.description && (
                    <Panel title="Role Description">
                        <p className="text-sm text-muted-foreground bg-muted/20 p-3.5 rounded-lg border border-border/60">
                            {role.description}
                        </p>
                    </Panel>
                )}

                {/* Module Privileges Breakdown */}
                <Panel title="Module Privileges Breakdown">
                    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                        {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                            const moduleKeys = Object.keys(modulePerms);
                            const grantedInModule = isAdmin
                                ? moduleKeys.length
                                : moduleKeys.filter((k) => role.permissions.includes(k)).length;

                            return (
                                <div key={module}>
                                    <div className="flex items-center justify-between bg-muted/30 px-4 py-2.5 border-b border-border/50">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-3.5 w-3.5 text-[#823d21]" />
                                            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                                                {module} Module
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5">
                                            {grantedInModule} of {moduleKeys.length} enabled
                                        </Badge>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 p-4">
                                        {Object.entries(modulePerms).map(([key, meta]) => {
                                            const granted = isAdmin || role.permissions.includes(key);
                                            return (
                                                <div
                                                    key={key}
                                                    className={`flex items-start gap-2.5 rounded-lg p-2.5 border transition-all ${
                                                        granted
                                                            ? 'border-border/70 bg-card shadow-xs'
                                                            : 'border-transparent opacity-40 bg-muted/10'
                                                    }`}
                                                >
                                                    {granted ? (
                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                    ) : (
                                                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-semibold text-foreground leading-tight truncate">
                                                            {meta.name}
                                                        </p>
                                                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                                                            {meta.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Panel>
            </div>
        </>
    );
}

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {title}
            </h2>
            {children}
        </div>
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
