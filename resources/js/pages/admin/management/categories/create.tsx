import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Tag } from 'lucide-react';

export default function CategoryCreate() {
    const form = useForm({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/management/categories');
    };

    return (
        <>
            <Head title="Create Category - MaMa Café" />

            <div className="space-y-6 p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Create Category
                            </h1>
                            <p className="text-sm text-muted-foreground">Add a new menu category to group your café products.</p>
                        </div>
                    </div>
                    <Link href="/management/categories">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Categories
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    Category Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Hot Beverages, Cold Drinks, Snacks..."
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">
                                    Status <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value as any)}
                                >
                                    <option value="active">Active (Visible on POS)</option>
                                    <option value="inactive">Inactive (Hidden from POS)</option>
                                </select>
                                <InputError message={form.errors.status} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Brief description of the products in this category..."
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                rows={4}
                                required
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link href="/management/categories">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-[#823d21] hover:bg-[#682e18] min-w-[140px]"
                            >
                                {form.processing ? 'Creating...' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

CategoryCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/categories' },
            { title: 'Categories', href: '/management/categories' },
            { title: 'Create', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
