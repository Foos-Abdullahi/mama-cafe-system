import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Edit2 } from 'lucide-react';

interface DailyClosingData {
    id: number;
    closing_date: string;
    total_orders: number;
    total_sales: number;
    notes: string;
    waitress_assignments: WaitressAssignment[];
}

interface WaitressItem {
    id: number;
    name: string;
    phone: string;
    status: string;
    current_number: string;
}

interface WaitressAssignment {
    waitress_id: number;
    name: string;
    assigned_number: string;
    is_active: boolean;
}

interface Props {
    dailyClosing: DailyClosingData;
    cafeFixedNumbers: string[];
    waitresses: WaitressItem[];
}

export default function DailyWaitressesEdit({
    dailyClosing,
    cafeFixedNumbers = [],
    waitresses = [],
}: Props) {
    const [assignments, setAssignments] = useState<WaitressAssignment[]>(() => {
        const savedList = dailyClosing.waitress_assignments || [];
        const savedMap = new Map(savedList.map((a: WaitressAssignment) => [a.waitress_id, a]));

        return waitresses.map((w) => {
            const saved = savedMap.get(w.id) as WaitressAssignment | undefined;
            return {
                waitress_id: w.id,
                name: w.name,
                assigned_number: saved ? saved.assigned_number : (w.current_number || cafeFixedNumbers[0] || ''),
                is_active: saved ? Boolean(saved.is_active) : false,
            };
        });
    });

    const form = useForm({
        assignments: assignments,
    });

    const handleToggleActive = (id: number, active: boolean) => {
        const updated = assignments.map((item) => (item.waitress_id === id ? { ...item, is_active: active } : item));
        setAssignments(updated);
        form.setData('assignments', updated);
    };

    const handleNumberChange = (id: number, num: string) => {
        const updated = assignments.map((item) => (item.waitress_id === id ? { ...item, assigned_number: num } : item));
        setAssignments(updated);
        form.setData('assignments', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.setData('assignments', assignments);
        form.put(`/finance/daily-closing/${dailyClosing.id}`);
    };

    return (
        <>
            <Head title={`Edit Daily Waitresses (${dailyClosing.closing_date}) - MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                            <Edit2 className="h-5 w-5 text-[#823d21]" />
                            Edit Daily Waitresses ({dailyClosing.closing_date})
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Update working waitresses and assigned café numbers for <span className="font-semibold text-foreground">{dailyClosing.closing_date}</span>.
                        </p>
                    </div>
                    <Link href="/finance/daily-closing">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Daily Waitresses
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Waitress Shift Roster Table
                            </h2>
                            <span className="text-xs font-mono font-bold text-foreground">
                                Total Revenue: ${dailyClosing.total_sales.toFixed(2)} ({dailyClosing.total_orders} Orders)
                            </span>
                        </div>

                        {/* Waitresses Selection List */}
                        <div className="rounded-lg border overflow-hidden">
                            <div className="bg-muted/40 px-4 py-2.5 border-b grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <div className="col-span-2 md:col-span-1 text-center">Active?</div>
                                <div className="col-span-5 md:col-span-5">Waitress Name &amp; Contact</div>
                                <div className="col-span-5 md:col-span-6">Assigned Café Number for Today</div>
                            </div>

                            <div className="divide-y">
                                {assignments.length > 0 ? (
                                    assignments.map((item) => {
                                        const originalWaitress = waitresses.find((w) => w.id === item.waitress_id);
                                        return (
                                            <div
                                                key={item.waitress_id}
                                                className={`px-4 py-3.5 grid grid-cols-12 items-center transition-colors ${
                                                    item.is_active ? 'bg-card' : 'bg-muted/10 opacity-60'
                                                }`}
                                            >
                                                {/* Active Checkbox */}
                                                <div className="col-span-2 md:col-span-1 flex justify-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`edit-active-${item.waitress_id}`}
                                                        checked={item.is_active}
                                                        onChange={(e) => handleToggleActive(item.waitress_id, e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-[#823d21] focus:ring-[#823d21] cursor-pointer"
                                                    />
                                                </div>

                                                {/* Waitress Name */}
                                                <div className="col-span-5 md:col-span-5">
                                                    <label
                                                        htmlFor={`edit-active-${item.waitress_id}`}
                                                        className="font-medium text-sm text-foreground cursor-pointer block"
                                                    >
                                                        {item.name}
                                                    </label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {originalWaitress?.phone || 'No phone recorded'}
                                                    </span>
                                                </div>

                                                {/* Café Number Select */}
                                                <div className="col-span-5 md:col-span-6">
                                                    {item.is_active ? (
                                                        <Select
                                                            value={item.assigned_number}
                                                            onValueChange={(val) => handleNumberChange(item.waitress_id, val)}
                                                        >
                                                            <SelectTrigger className="w-full max-w-[260px] h-9">
                                                                <SelectValue placeholder="Select assigned number..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {cafeFixedNumbers.map((num) => (
                                                                    <SelectItem key={num} value={num}>
                                                                        Café Number #{num}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
                                                            Off Duty Today
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 text-center text-xs text-muted-foreground">
                                        No waitresses registered in the system yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                            <Link href="/finance/daily-closing">
                                <Button type="button" variant="outline" size="sm" className="shadow-xs">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                size="sm"
                                className="bg-[#823d21] text-white hover:bg-[#682e18] shadow-xs min-w-[150px] gap-1.5"
                            >
                                <Save className="h-4 w-4" />
                                {form.processing ? 'Saving...' : 'Update Daily Roster'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

DailyWaitressesEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/daily-closing' },
            { title: 'Daily Waitresses', href: '/finance/daily-closing' },
            { title: 'Edit Roster', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
