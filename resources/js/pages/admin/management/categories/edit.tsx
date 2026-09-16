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
import { ArrowLeft, Edit } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    status: 'active' | 'inactive';
}

interface Props {
    category: Category;
}

export default function CategoryEdit({ category }: Props) {
    const form = useForm({
        name: category.name,
        description: category.description,
        image_url: category.image_url ?? '',
        status: category.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/management/categories/${category.id}`);
    };

    return (
        <>
            <Head title={`Edit ${category.name} — MaMa Café`} />

            <div className="flex animate-in flex-col gap-6 p-4 duration-300 fade-in slide-in-from-bottom-3 md:p-6">
                {/* Header with Title and Actions */}
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                                Edit Category
                            </h1>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Update details for category{' '}
                                <strong>{category.name}</strong>.
                            </p>
                        </div>
                    </div>
                    <Link href="/management/categories">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs shadow-xs"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Categories
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="border-b border-border pb-2.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                Category Profile & Status
                            </h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-medium text-foreground"
                                    >
                                        Category Name{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        className="h-10"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        required
                                        autoFocus
                                    />
                                    <InputError message={form.errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="image_url"
                                        className="text-xs font-medium text-foreground"
                                    >
                                        Category Image URL
                                    </Label>
                                    <Input
                                        id="image_url"
                                        type="url"
                                        placeholder="https://example.com/category-image.jpg"
                                        className="h-10"
                                        value={form.data.image_url}
                                        onChange={(e) =>
                                            form.setData(
                                                'image_url',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={form.errors.image_url}
                                    />
                                </div>

                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="status"
                                        className="text-xs font-medium text-foreground"
                                    >
                                        Status{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(
                                            val: 'active' | 'inactive',
                                        ) => form.setData('status', val)}
                                    >
                                        <SelectTrigger
                                            id="status"
                                            className="h-10 w-full"
                                        >
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Active (Visible on POS)
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive (Hidden from POS)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.status} />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 pt-2">
                            <Label
                                htmlFor="description"
                                className="text-xs font-medium text-foreground"
                            >
                                Description{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                rows={4}
                                required
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/management/categories">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs shadow-xs"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={form.processing}
                                className="min-w-[120px] gap-1.5 bg-[#823d21] text-xs text-white shadow-xs hover:bg-[#682e18]"
                            >
                                {form.processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

CategoryEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/categories' },
            { title: 'Categories', href: '/management/categories' },
            { title: 'Edit Category', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
