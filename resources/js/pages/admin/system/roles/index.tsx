import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Save, CheckCircle2, Lock, Info } from 'lucide-react';

interface PermissionMeta {
    name: string;
    description: string;
    category: string;
    admin: boolean;
    manager: boolean;
    operations: boolean;
    waitress: boolean;
}

interface Props {
    permissions: Record<string, PermissionMeta>;
    stats: StatSection[];
}

export default function RolesIndex({ permissions, stats }: Props) {
    const [permState, setPermState] = useState(permissions);

    const form = useForm({
        permissions: permissions,
    });

    const handleToggle = (permKey: string, role: 'manager' | 'operations' | 'waitress', value: boolean) => {
        setPermState((prev) => {
            const next = {
                ...prev,
                [permKey]: {
                    ...prev[permKey],
                    [role]: value,
                },
            };
            form.setData('permissions', next);
            return next;
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/system/roles', {
            preserveScroll: true,
        });
    };

    // Group permissions by category
    const categories = Array.from(new Set(Object.values(permissions).map((p) => p.category)));

    return (
        <>
            <Head title="Role & Permissions Management - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Header Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Shield className="h-6 w-6 text-[#823d21]" /> Role & Permissions Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configure feature access and action privileges for cafe staff roles.
                        </p>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={form.processing}
                        className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm shrink-0"
                    >
                        <Save className="h-4 w-4" />
                        {form.processing ? 'Saving...' : 'Save Role Permissions'}
                    </Button>
                </div>

                {/* Info Card */}
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 text-xs text-muted-foreground shadow-xs">
                    <Info className="h-5 w-5 text-[#823d21] shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-foreground">How Role Permissions Work:</p>
                        <p className="mt-0.5">
                            Check or uncheck boxes below to grant or revoke specific section access for staff roles.
                            <strong className="text-foreground"> Admin</strong> always retains full permission control.
                            Changes update both sidebar visibility and backend route protection.
                        </p>
                    </div>
                </div>

                {/* Role Permissions Matrix Table */}
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b bg-muted/50 uppercase text-[11px] text-muted-foreground font-semibold">
                                <tr>
                                    <th className="py-3 px-4 w-[40%]">Permission & Description</th>
                                    <th className="py-3 px-3 text-center w-[15%]">
                                        <div className="flex items-center justify-center gap-1">
                                            <Lock className="h-3 w-3 text-red-500" />
                                            <span>Admin</span>
                                        </div>
                                    </th>
                                    <th className="py-3 px-3 text-center w-[15%]">Manager</th>
                                    <th className="py-3 px-3 text-center w-[15%]">Operations</th>
                                    <th className="py-3 px-3 text-center w-[15%]">Waitress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {categories.map((cat) => {
                                    const categoryPerms = Object.entries(permState).filter(
                                        ([_, meta]) => meta.category === cat
                                    );

                                    return (
                                        <React.Fragment key={cat}>
                                            <tr className="bg-muted/20">
                                                <td colSpan={5} className="py-2 px-4 font-bold text-[11px] uppercase tracking-wider text-[#823d21]">
                                                    {cat} Section
                                                </td>
                                            </tr>
                                            {categoryPerms.map(([permKey, meta]) => (
                                                <tr key={permKey} className="hover:bg-muted/10 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <p className="font-semibold text-sm text-foreground">{meta.name}</p>
                                                        <p className="text-[11px] text-muted-foreground">{meta.description}</p>
                                                    </td>

                                                    {/* Admin Checkbox (Always Enabled / Checked) */}
                                                    <td className="py-3 px-3 text-center">
                                                        <div className="flex justify-center">
                                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1">
                                                                <CheckCircle2 className="h-3 w-3" /> Allowed
                                                            </Badge>
                                                        </div>
                                                    </td>

                                                    {/* Manager Checkbox */}
                                                    <td className="py-3 px-3 text-center">
                                                        <div className="flex justify-center">
                                                            <Checkbox
                                                                checked={meta.manager}
                                                                onCheckedChange={(checked) =>
                                                                    handleToggle(permKey, 'manager', Boolean(checked))
                                                                }
                                                                className="border-muted-foreground data-[state=checked]:bg-[#823d21] data-[state=checked]:border-[#823d21]"
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* Operations Checkbox */}
                                                    <td className="py-3 px-3 text-center">
                                                        <div className="flex justify-center">
                                                            <Checkbox
                                                                checked={meta.operations}
                                                                onCheckedChange={(checked) =>
                                                                    handleToggle(permKey, 'operations', Boolean(checked))
                                                                }
                                                                className="border-muted-foreground data-[state=checked]:bg-[#823d21] data-[state=checked]:border-[#823d21]"
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* Waitress Checkbox */}
                                                    <td className="py-3 px-3 text-center">
                                                        <div className="flex justify-center">
                                                            <Checkbox
                                                                checked={meta.waitress}
                                                                onCheckedChange={(checked) =>
                                                                    handleToggle(permKey, 'waitress', Boolean(checked))
                                                                }
                                                                className="border-muted-foreground data-[state=checked]:bg-[#823d21] data-[state=checked]:border-[#823d21]"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t bg-muted/10 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={form.processing}
                            className="bg-[#823d21] hover:bg-[#682e18] text-white font-semibold flex items-center gap-2 shadow-sm"
                        >
                            <Save className="h-4 w-4" />
                            {form.processing ? 'Saving...' : 'Save Role Permissions'}
                        </Button>
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
            { title: 'Role Permissions', href: '/system/roles' },
        ]}
    >
        {page}
    </AppLayout>
);
