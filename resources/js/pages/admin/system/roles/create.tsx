import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Key, Shield, ChevronDown } from 'lucide-react';

interface PermissionMeta {
    name: string;
    description: string;
    module: string;
}

interface Props {
    permissionsByModule: Record<string, Record<string, PermissionMeta>>;
}

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s_-]/g, '')
        .trim()
        .replace(/\s+/g, '_');
}

export default function RolesCreate({ permissionsByModule }: Props) {
    const allPermissionKeys = Object.values(permissionsByModule).flatMap((m) => Object.keys(m));

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as string[],
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

    const handleNameChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            name: value,
            slug: slugManuallyEdited ? prev.slug : slugify(value),
        }));
    };

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
        post('/system/roles');
    };

    const toggleModuleCollapse = (module: string) => {
        setCollapsedModules((prev) => ({ ...prev, [module]: !prev[module] }));
    };

    const isAllSelected = data.permissions.length === allPermissionKeys.length;

    return (
        <>
            <Head title="Create Role — MaMa Café" />

            <div className="space-y-6 p-6 w-full">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Role</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Define a custom role title, machine identifier, and grant granular module privileges.
                        </p>
                    </div>
                    <Button variant="ghost" asChild className="gap-2 text-sm">
                        <Link href="/system/roles">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Roles
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Identification Card */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center gap-3 border-b px-5 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">Role Identification</p>
                                <p className="text-xs text-muted-foreground">Role title and unique machine slug.</p>
                            </div>
                        </div>
                        <div className="space-y-4 p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label htmlFor="role-name" className="text-sm font-medium text-foreground">
                                        Role Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="role-name"
                                        placeholder="e.g. Head Cashier, Floor Supervisor"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="text-sm"
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                {/* Slug */}
                                <div className="space-y-1.5">
                                    <label htmlFor="role-slug" className="text-sm font-medium text-foreground">
                                        Role Identifier (Slug) <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="role-slug"
                                        placeholder="e.g. head_cashier, floor_supervisor"
                                        value={data.slug}
                                        onChange={(e) => {
                                            setSlugManuallyEdited(true);
                                            setData('slug', slugify(e.target.value));
                                        }}
                                        className="font-mono text-sm"
                                    />
                                    {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label htmlFor="role-description" className="text-sm font-medium text-foreground">
                                    Role Description &amp; Scope
                                </label>
                                <textarea
                                    id="role-description"
                                    placeholder="Explain duties, access restrictions, and administrative responsibilities..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Permissions Card */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
                                    <Key className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Granted Module Privileges</p>
                                    <p className="text-xs text-muted-foreground">
                                        Select the permissions &amp; actions allowed for this role.
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={toggleAll}
                                className="shrink-0 text-xs"
                            >
                                {isAllSelected ? 'Deselect All' : 'Toggle All Permissions'}
                            </Button>
                        </div>

                        <div className="divide-y">
                            {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
                                const moduleKeys = Object.keys(modulePerms);
                                const selectedCount = moduleKeys.filter((k) => data.permissions.includes(k)).length;
                                const isCollapsed = collapsedModules[module];
                                const allModuleSelected = selectedCount === moduleKeys.length;

                                return (
                                    <div key={module}>
                                        {/* Module Header */}
                                        <div className="flex items-center justify-between bg-muted/30 px-5 py-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleModuleCollapse(module)}
                                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-[#823d21] transition-colors"
                                            >
                                                <ChevronDown
                                                    className={`h-3.5 w-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                                                />
                                                {module} Module
                                                <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">
                                                    {selectedCount} of {moduleKeys.length}
                                                </Badge>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleModule(modulePerms, !allModuleSelected)}
                                                className="text-[11px] font-medium text-[#823d21] hover:underline"
                                            >
                                                {allModuleSelected ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>

                                        {/* Module Permissions Grid */}
                                        {!isCollapsed && (
                                            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 px-5 py-4">
                                                {Object.entries(modulePerms).map(([key, meta]) => (
                                                    <label
                                                        key={key}
                                                        htmlFor={`perm-${key}`}
                                                        className="flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-muted/20 transition-colors"
                                                    >
                                                        <Checkbox
                                                            id={`perm-${key}`}
                                                            checked={data.permissions.includes(key)}
                                                            onCheckedChange={(checked) =>
                                                                togglePermission(key, Boolean(checked))
                                                            }
                                                            className="mt-0.5 border-muted-foreground data-[state=checked]:bg-[#823d21] data-[state=checked]:border-[#823d21]"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground leading-tight">
                                                                {meta.name}
                                                            </p>
                                                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                                {meta.description}
                                                            </p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/system/roles">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2 bg-[#823d21] text-white hover:bg-[#682e18]"
                        >
                            <Shield className="h-4 w-4" />
                            {processing ? 'Creating...' : 'Create Role'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RolesCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/settings' },
            { title: 'Roles & Permissions', href: '/system/roles' },
            { title: 'Create Role', href: '/system/roles/create' },
        ]}
    >
        {page}
    </AppLayout>
);
