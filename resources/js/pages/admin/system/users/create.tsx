import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function UserCreate() {
    const form = useForm({
        name: '',
        email: '',
        role: 'operations' as 'admin' | 'manager' | 'operations' | 'waitress',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/system/users');
    };

    return (
        <>
            <Head title="Add User Account - MaMa Café" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Create User Account
                            </h1>
                            <p className="text-sm text-muted-foreground">Register new staff login credentials and role.</p>
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
                                    placeholder="e.g. Ali Ahmed"
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
                                    placeholder="ali@mamacafe.test"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimum 8 characters..."
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password <span className="text-red-500">*</span></Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Repeat password..."
                                    value={form.data.password_confirmation}
                                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.password_confirmation} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link href="/system/users">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={form.processing} className="bg-[#823d21] hover:bg-[#682e18] min-w-[140px]">
                                {form.processing ? 'Creating...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

UserCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/users' },
            { title: 'Users', href: '/system/users' },
            { title: 'Create Account', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
