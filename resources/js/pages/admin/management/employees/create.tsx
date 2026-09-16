import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface Props {
    positions: string[];
}

export default function EmployeeCreate({ positions }: Props) {
    const form = useForm({
        name: '',
        phone: '',
        email: '',
        position: positions[0] ?? 'Staff',
        status: 'active',
        hire_date: '',
        notes: '',
    });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/management/employees');
    };

    return (
        <>
            <Head title="Add Employee - MaMa Café" />
            <EmployeeForm
                title="Add Employee"
                description="Register a cashier, barista, or another cafe team member."
                form={form}
                submit={submit}
                submitLabel="Save Employee"
            />
        </>
    );
}

function EmployeeForm({
    title,
    description,
    form,
    submit,
    submitLabel,
}: {
    title: string;
    description: string;
    form: ReturnType<typeof useForm>;
    submit: (event: React.FormEvent) => void;
    submitLabel: string;
}) {
    return (
        <div className="flex animate-in flex-col gap-6 p-4 duration-300 fade-in slide-in-from-bottom-3 md:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                        <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                            {title}
                        </h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <Link href="/management/employees">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Employees
                    </Button>
                </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs md:p-6">
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field label="Full Name" error={form.errors.name}>
                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                required
                                autoFocus
                                placeholder="e.g. Layla Hassan"
                            />
                        </Field>
                        <Field label="Phone Number" error={form.errors.phone}>
                            <Input
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData('phone', e.target.value)
                                }
                                placeholder="+252 61 XXX XXXX"
                            />
                        </Field>
                        <Field label="Email Address" error={form.errors.email}>
                            <Input
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                placeholder="name@mamacafe.test"
                            />
                        </Field>
                        <Field label="Position" error={form.errors.position}>
                            <Input
                                value={form.data.position}
                                onChange={(e) =>
                                    form.setData('position', e.target.value)
                                }
                                placeholder="e.g. Barista, Cashier, Supervisor"
                                required
                            />
                        </Field>
                        <Field label="Status" error={form.errors.status}>
                            <Select
                                value={form.data.status}
                                onValueChange={(value) =>
                                    form.setData('status', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Hire Date" error={form.errors.hire_date}>
                            <Input
                                type="date"
                                value={form.data.hire_date}
                                onChange={(e) =>
                                    form.setData('hire_date', e.target.value)
                                }
                            />
                        </Field>
                        <div className="grid gap-2 md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                                placeholder="Optional shift or employment notes"
                            />
                            <InputError message={form.errors.notes} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-border pt-4">
                        <Link href="/management/employees">
                            <Button type="button" variant="outline" size="sm">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={form.processing}
                            className="min-w-[120px] bg-[#823d21] text-white hover:bg-[#682e18]"
                        >
                            {form.processing ? 'Saving...' : submitLabel}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>
                {label} <span className="text-red-500">*</span>
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

EmployeeCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/employees' },
            { title: 'Employees', href: '/management/employees' },
            { title: 'Add Employee', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
