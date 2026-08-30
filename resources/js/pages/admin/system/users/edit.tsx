import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit } from 'lucide-react';

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

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Edit User Account
                            </h1>
                            <p className="text-sm text-muted-foreground">Update profile and role for <strong>{user.name}</strong>.</p>
                        </div>
                    </div>
                    <Link href="/system/users">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Users
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
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
                                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
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
                            <div className="grid gap-2">
                                <Label htmlFor="role">User Role <span className="text-red-500">*</span></Label>
                                <select
                                    id="role"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.role}
                                    onChange={(e) => form.setData('role', e.target.value as any)}
                                >
                                    <option value="operations">Operations / Cashier (POS & Orders)</option>
                                    <option value="manager">Manager (Reports & Floor Management)</option>
                                    <option value="admin">Administrator (Full System Control)</option>
                                    <option value="waitress">Waitress</option>
                                </select>
                                <InputError message={form.errors.role} />
                            </div>
                        </div>

                        {/* Optional Password Update */}
                        <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">
                                Update Password <span className="font-normal">(leave blank to keep current password)</span>
                            </p>
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
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link href="/system/users">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={form.processing} className="bg-[#823d21] hover:bg-[#682e18] min-w-[140px]">
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
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
