import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Payroll {
    id: number;
    waitress_name: string;
    waitress_phone: string;
    period_start: string;
    period_end: string;
    total_orders: number;
    total_sales: number;
    commission_rate: number;
    commission_amount: number;
    status: string;
    paid_at: string;
    notes: string | null;
}

interface Props {
    payroll: Payroll;
}

export default function PayrollShow({ payroll }: Props) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Payout Slip #${payroll.id} - MaMa Café`} />

            <div className="space-y-6 p-6">
                {/* Action Bar */}
                <div className="flex items-center justify-between print:hidden">
                    <Link href="/finance/payroll">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Payroll
                        </Button>
                    </Link>
                    <Button size="sm" onClick={handlePrint} className="gap-2 bg-[#823d21] hover:bg-[#682e18]">
                        <Printer className="h-4 w-4" /> Print Payout Slip
                    </Button>
                </div>

                {/* Printable Receipt Slip Card */}
                <div className="rounded-xl border bg-card p-8 shadow-sm space-y-6 w-full print:max-w-2xl print:mx-auto">
                    {/* Header Branding */}
                    <div className="text-center border-b pb-6 space-y-1">
                        <h1 className="text-2xl font-bold tracking-wider text-[#823d21] uppercase">MaMa Café</h1>
                        <p className="text-xs text-muted-foreground">Staff Commission Payout Slip</p>
                        <Badge className="mt-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Payout Settled
                        </Badge>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-b pb-6">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Payout ID</p>
                            <p className="font-mono font-bold text-foreground">#PAYROLL-{payroll.id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Waitress Name</p>
                            <p className="font-semibold text-foreground">{payroll.waitress_name}</p>
                            <p className="text-xs text-muted-foreground">{payroll.waitress_phone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Pay Period</p>
                            <p className="font-mono text-xs text-foreground">{payroll.period_start} to {payroll.period_end}</p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-xs text-muted-foreground uppercase font-semibold">Date Paid</p>
                            <p className="font-mono font-medium text-foreground">{payroll.paid_at}</p>
                        </div>
                    </div>

                    {/* Calculation Details */}
                    <div className="space-y-3 text-sm border-b pb-6">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Orders Served</span>
                            <span className="font-medium">{payroll.total_orders} Orders</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Sales Generated</span>
                            <span className="font-mono font-medium">${Number(payroll.total_sales).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Commission Rate</span>
                            <span className="font-medium">{(Number(payroll.commission_rate) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between border-t pt-3 font-bold text-xl text-[#823d21]">
                            <span>Net Commission Paid</span>
                            <span className="font-mono">${Number(payroll.commission_amount).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Notes & Signatures */}
                    {payroll.notes && (
                        <div className="text-xs text-muted-foreground bg-muted/20 p-3.5 rounded-lg border">
                            <span className="font-semibold text-foreground">Notes: </span>
                            {payroll.notes}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-muted-foreground">
                        <div className="border-t pt-2">
                            <p className="font-semibold text-foreground">Manager Signature</p>
                        </div>
                        <div className="border-t pt-2">
                            <p className="font-semibold text-foreground">Waitress Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PayrollShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Finance & Reports', href: '/finance/payroll' },
            { title: 'Payroll', href: '/finance/payroll' },
            { title: 'Payout Slip', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
