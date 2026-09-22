import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
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

interface Employee {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    position: string;
    status: 'active' | 'inactive';
    hire_date: string | null;
    notes: string | null;
}
interface Props {
    employee: Employee;
    positions: string[];
}
type EmployeeStatus = 'active' | 'inactive';

export default function EmployeeEdit({ employee }: Props) {
    const form = useForm({
        name: employee.name,
        phone: employee.phone ?? '',
        email: employee.email ?? '',
        position: employee.position,
        status: employee.status as EmployeeStatus,
        hire_date: employee.hire_date ?? '',
        notes: employee.notes ?? '',
    });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.put(`/management/employees/${employee.id}`);
    };

    return (
        <>
            <Head title={`Edit ${employee.name} - MaMa Café`} />
            <div className="flex animate-in flex-col gap-6 p-4 duration-300 fade-in slide-in-from-bottom-3 md:p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <Edit className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold md:text-xl">
                                Edit Employee
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Update details for{' '}
                                <strong>{employee.name}</strong>.
                            </p>
                        </div>
                    </div>
                    <Link href="/management/employees">
                        <Button variant="outline" size="sm">
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
                                />
                            </Field>
                            <Field
                                label="Phone Number"
                                error={form.errors.phone}
                            >
                                <Input
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData('phone', e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Email Address"
                                error={form.errors.email}
                            >
                                <Input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Position"
                                error={form.errors.position}
                            >
                                <Input
                                    value={form.data.position}
                                    onChange={(e) =>
                                        form.setData('position', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            <Field label="Status" error={form.errors.status}>
                                <Select
                                    value={form.data.status}
                                    onValueChange={(value) =>
                                        form.setData(
                                            'status',
                                            value as EmployeeStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger>
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
                            <Field
                                label="Hire Date"
                                error={form.errors.hire_date}
                            >
                                <Input
                                    type="date"
                                    value={form.data.hire_date}
                                    onChange={(e) =>
                                        form.setData(
                                            'hire_date',
                                            e.target.value,
                                        )
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
                                />
                                <InputError message={form.errors.notes} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 border-t border-border pt-4">
                            <Link href="/management/employees">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={form.processing}
                                className="min-w-[120px] bg-[#823d21] text-white hover:bg-[#682e18]"
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
EmployeeEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Management', href: '/management/employees' },
            { title: 'Employees', href: '/management/employees' },
            { title: 'Edit Employee', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
