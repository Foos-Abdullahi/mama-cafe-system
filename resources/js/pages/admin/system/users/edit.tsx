import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'operations' | 'waitress';
}

interface Props {
    user: UserData;
}

export default function UserEdit({ user }: Props) {
    const form = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/system/users/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit ${user.name} - MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                            Edit User Account
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Update profile details and system role for <span className="font-semibold text-foreground">{user.name}</span>.
                        </p>
                    </div>
                    <Link href="/system/users">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Users
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-6">
                        {/* Profile & Role Assignment */}
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                            Profile &amp; Role Assignment
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Email Address */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.email} />
                            </div>

                            {/* Role */}
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="role">User Role <span className="text-destructive">*</span></Label>
                                <Select
                                    value={form.data.role}
                                    onValueChange={(val) => form.setData('role', val as any)}
                                >
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder="Select a role..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="operations">Operations / Cashier (POS &amp; Orders)</SelectItem>
                                        <SelectItem value="manager">Manager (Reports &amp; Floor Management)</SelectItem>
                                        <SelectItem value="admin">Administrator (Full System Control)</SelectItem>
                                        <SelectItem value="waitress">Waitress</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.role} />
                            </div>
                        </div>

                        {/* Optional Password Update */}
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5 pt-2">
                            Update Password <span className="text-[11px] font-normal normal-case text-muted-foreground">(Leave blank to keep current password)</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Leave blank to preserve..."
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                />
                                <InputError message={form.errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Repeat new password..."
                                    value={form.data.password_confirmation}
                                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={form.errors.password_confirmation} />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/system/users">
                                <Button type="button" variant="outline" size="sm" className="shadow-xs">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                size="sm"
                                className="bg-[#823d21] text-white hover:bg-[#682e18] shadow-xs min-w-[130px]"
                            >
                                <Save className="h-3.5 w-3.5 mr-1.5" />
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

UserEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/users' },
            { title: 'Users', href: '/system/users' },
            { title: 'Edit Account', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
