import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Users } from 'lucide-react';

interface TodaySummary {
    date: string;
    total_orders: number;
    total_sales: number;
    is_closed: boolean;
    closing?: any;
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
    todaySummary: TodaySummary;
    cafeFixedNumbers: string[];
    waitresses: WaitressItem[];
}

export default function DailyWaitressesCreate({
    todaySummary,
    cafeFixedNumbers = [],
    waitresses = [],
}: Props) {
    const [assignments, setAssignments] = useState<WaitressAssignment[]>(() => {
        if (todaySummary.closing?.waitress_assignments && todaySummary.closing.waitress_assignments.length > 0) {
            const savedMap = new Map(
                todaySummary.closing.waitress_assignments.map((a: WaitressAssignment) => [a.waitress_id, a])
            );
            return waitresses.map((w) => {
                const saved = savedMap.get(w.id) as WaitressAssignment | undefined;
                return {
                    waitress_id: w.id,
                    name: w.name,
                    assigned_number: saved ? saved.assigned_number : (w.current_number || cafeFixedNumbers[0] || ''),
                    is_active: saved ? Boolean(saved.is_active) : false,
                };
            });
        }

        return waitresses.map((w, index) => ({
            waitress_id: w.id,
            name: w.name,
            assigned_number: w.current_number || cafeFixedNumbers[index % cafeFixedNumbers.length] || '',
            is_active: w.status === 'active',
        }));
    });

    const form = useForm({
        closing_date: todaySummary.date,
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
        form.post('/finance/daily-closing');
    };

    return (
        <>
            <Head title={`Assign Today's Waitresses (${todaySummary.date}) - MaMa Café`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#823d21]" />
                            Assign Today's Waitresses ({todaySummary.date})
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Select active waitresses on floor duty today and assign their café numbers for shift orders.
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
                            <Badge className={todaySummary.is_closed ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700'}>
                                {todaySummary.is_closed ? 'Today Saved' : 'Pending Roster'}
                            </Badge>
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
                                                        id={`create-active-${item.waitress_id}`}
                                                        checked={item.is_active}
                                                        onChange={(e) => handleToggleActive(item.waitress_id, e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-[#823d21] focus:ring-[#823d21] cursor-pointer"
                                                    />
                                                </div>

                                                {/* Waitress Name */}
                                                <div className="col-span-5 md:col-span-5">
                                                    <label
                                                        htmlFor={`create-active-${item.waitress_id}`}
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
                                {form.processing ? 'Saving...' : 'Save Daily Roster'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

DailyWaitressesCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/daily-closing' },
            { title: 'Daily Waitresses', href: '/finance/daily-closing' },
            { title: 'Assign Today', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
