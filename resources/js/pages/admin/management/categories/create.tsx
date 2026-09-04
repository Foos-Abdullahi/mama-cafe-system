import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
            <Head title="Create Category — MaMa Café" />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Tag className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                Create Category
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Add a new menu category to group your café products.</p>
                        </div>
                    </div>
                    <Link href="/management/categories">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Categories
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2.5">
                                Category Profile & Status
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-xs font-medium text-foreground">
                                        Category Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Hot Beverages, Cold Drinks, Snacks..."
                                        className="h-10"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={form.errors.name} />
                                </div>

                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="status" className="text-xs font-medium text-foreground">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(val: 'active' | 'inactive') => form.setData('status', val)}
                                    >
                                        <SelectTrigger id="status" className="w-full h-10">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active (Visible on POS)</SelectItem>
                                            <SelectItem value="inactive">Inactive (Hidden from POS)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.status} />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 pt-2">
                            <Label htmlFor="description" className="text-xs font-medium text-foreground">
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

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/management/categories">
                                <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={form.processing}
                                className="gap-1.5 text-xs shadow-xs bg-[#823d21] text-white hover:bg-[#682e18] min-w-[120px]"
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
            { title: 'Create Category', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
