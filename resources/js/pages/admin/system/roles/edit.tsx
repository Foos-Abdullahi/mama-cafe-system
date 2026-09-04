import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Key, Lock, Save, Shield, ChevronDown } from 'lucide-react';

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
}

interface Props {
    role: RoleData;
    permissionsByModule: Record<string, Record<string, PermissionMeta>>;
}

export default function RolesEdit({ role, permissionsByModule }: Props) {
    const allPermissionKeys = Object.values(permissionsByModule).flatMap((m) => Object.keys(m));

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        slug: role.slug,
        description: role.description ?? '',
        permissions: role.permissions,
    });

    const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

    const togglePermission = (key: string, checked: boolean) => {
        setData('permissions', checked ? [...data.permissions, key] : data.permissions.filter((k) => k !== key));
    };

    const toggleModule = (modulePerms: Record<string, PermissionMeta>, checked: boolean) => {
        const keys = Object.keys(modulePerms);
        if (checked) {
            setData('permissions', [...new Set([...data.permissions, ...keys])]);
        } else {
            setData('permissions', data.permissions.filter((k) => !keys.includes(k)));
        }
    };

    const toggleAll = () => {
        if (data.permissions.length === allPermissionKeys.length) {
            setData('permissions', []);
        } else {
            setData('permissions', allPermissionKeys);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/system/roles/${role.id}`);
    };

    const toggleModuleCollapse = (module: string) => {
        setCollapsedModules((prev) => ({ ...prev, [module]: !prev[module] }));
    };

    const isAllSelected = data.permissions.length === allPermissionKeys.length;

    return (
        <>
            <Head title={`Edit ${role.name} — MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">Edit Role</h1>
                            <Badge
                                variant="outline"
                                className={
                                    role.is_system
                                        ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                        : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }
                            >
                                {role.is_system ? 'System Role' : 'Custom Role'}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {role.is_system
                                ? 'System role identity cannot be changed. You can only update its permissions.'
                                : 'Update role details and configure module permissions.'}
                        </p>
                    </div>
                    <Link href="/system/roles">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Roles
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Identification Card */}
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-6">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                            Role Identification
                        </h2>
                        <div className="space-y-4">
                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="role-name">
                                        Role Name
                                        {!role.is_system && <span className="text-destructive"> *</span>}
                                    </Label>
                                    <Input
                                        id="role-name"
                                        value={data.name}
                                        disabled={role.is_system}
                                        onChange={(e) => !role.is_system && setData('name', e.target.value)}
                                        className="disabled:cursor-not-allowed disabled:opacity-60"
                                        required={!role.is_system}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Slug */}
                                <div className="grid gap-2">
                                    <Label htmlFor="role-slug">
                                        Role Identifier (Slug)
                                    </Label>
                                    <Input
                                        id="role-slug"
                                        value={data.slug}
                                        disabled={role.is_system}
                                        onChange={(e) => !role.is_system && setData('slug', e.target.value)}
                                        className="font-mono disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="role-description">
                                    Role Description &amp; Scope
                                </Label>
                                <textarea
                                    id="role-description"
                                    value={data.description}
                                    disabled={role.is_system}
                                    onChange={(e) => !role.is_system && setData('description', e.target.value)}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 resize-none"
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </div>

                    {/* Permissions Card */}
                    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-5 md:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                                    <Key className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Granted Module Privileges</p>
                                    <p className="text-xs text-muted-foreground">
                                        Select the permissions &amp; actions allowed for this role.
                                    </p>
                                </div>
                            </div>
                            {role.slug !== 'admin' && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleAll}
                                    className="shrink-0 text-xs shadow-xs"
                                >
                                    {isAllSelected ? 'Deselect All' : 'Toggle All Permissions'}
                                </Button>
                            )}
                        </div>

                        {/* Admin notice */}
                        {role.slug === 'admin' && (
                            <div className="flex items-center gap-3 border-b border-border bg-blue-50/70 dark:bg-blue-950/30 px-5 py-3 md:px-6">
                                <Lock className="h-4 w-4 shrink-0 text-blue-600" />
                                <p className="text-xs text-blue-700 dark:text-blue-400">
                                    The Administrator role always has full access to all permissions regardless of what is selected here.
                                </p>
                            </div>
                        )}

                        <div className="divide-y divide-border">
                            {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                                const moduleKeys = Object.keys(modulePerms);
                                const selectedCount = moduleKeys.filter((k) => data.permissions.includes(k)).length;
                                const isCollapsed = collapsedModules[module];
                                const allModuleSelected = selectedCount === moduleKeys.length;

                                return (
                                    <div key={module}>
                                        {/* Module Header */}
                                        <div className="flex items-center justify-between bg-muted/30 px-5 py-3 md:px-6">
                                            <button
                                                type="button"
                                                onClick={() => toggleModuleCollapse(module)}
                                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-[#823d21] transition-colors"
                                            >
                                                <ChevronDown
                                                    className={`h-3.5 w-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                                                />
                                                {module} Module
                                                <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 border-border">
                                                    {role.slug === 'admin' ? moduleKeys.length : selectedCount} of {moduleKeys.length}
                                                </Badge>
                                            </button>
                                            {role.slug !== 'admin' && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModule(modulePerms, !allModuleSelected)}
                                                    className="text-[11px] font-medium text-[#823d21] hover:underline"
                                                >
                                                    {allModuleSelected ? 'Deselect All' : 'Select All'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Module Permissions Grid */}
                                        {!isCollapsed && (
                                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 p-4 md:p-6 bg-card">
                                                {Object.entries(modulePerms).map(([key, meta]) => {
                                                    const isAdminRole = role.slug === 'admin';
                                                    return (
                                                        <label
                                                            key={key}
                                                            htmlFor={`perm-${key}`}
                                                            className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-2.5 hover:border-border hover:bg-muted/30 transition-colors"
                                                        >
                                                            <Checkbox
                                                                id={`perm-${key}`}
                                                                checked={isAdminRole || data.permissions.includes(key)}
                                                                disabled={isAdminRole}
                                                                onCheckedChange={(checked) =>
                                                                    !isAdminRole && togglePermission(key, Boolean(checked))
                                                                }
                                                                className="mt-0.5 data-[state=checked]:bg-[#823d21] data-[state=checked]:border-[#823d21] disabled:opacity-80"
                                                            />
                                                            <div className="space-y-0.5">
                                                                <p className="text-xs font-medium text-foreground leading-snug">
                                                                    {meta.name}
                                                                </p>
                                                                <p className="text-[11px] text-muted-foreground leading-normal">
                                                                    {meta.description}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                        <Link href="/system/roles">
                            <Button type="button" variant="outline" size="sm" className="shadow-xs">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            size="sm"
                            className="gap-1.5 bg-[#823d21] text-white hover:bg-[#682e18] shadow-xs min-w-[130px]"
                        >
                            <Save className="h-3.5 w-3.5" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RolesEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/settings' },
            { title: 'Roles & Permissions', href: '/system/roles' },
            { title: 'Edit Role', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
