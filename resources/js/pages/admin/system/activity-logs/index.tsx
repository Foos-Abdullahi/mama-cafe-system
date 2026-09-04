import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { StatsCard, StatSection } from '@/components/tools/StatsCard';
import { DataTable } from '@/components/tools/table/main-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Activity, ShieldCheck, Filter } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface ActivityItem {
    id: number;
    action: string;
    description: string;
    user_name: string;
    ip_address: string;
    created_at: string;
}

interface Props {
    logs: ActivityItem[];
    stats: StatSection[];
    filters: {
        action?: string;
    };
}

export default function ActivityLogsIndex({ logs, stats, filters }: Props) {
    const [selectedAction, setSelectedAction] = useState(filters.action || '');

    const handleFilterChange = (action: string) => {
        setSelectedAction(action);
        router.get(
            '/system/activity-logs',
            { action: action || undefined },
            { preserveState: true, replace: true }
        );
    };

    const columns: ColumnDef<ActivityItem>[] = [
        {
            accessorKey: 'id',
            header: 'Log ID',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#LOG-{row.original.id}</span>,
        },
        {
            accessorKey: 'action',
            header: 'Action Event',
            cell: ({ row }) => (
                <Badge variant="outline" className="font-mono text-xs uppercase bg-secondary/50">
                    {row.original.action}
                </Badge>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => <span className="text-xs text-foreground font-medium">{row.original.description}</span>,
        },
        {
            accessorKey: 'user_name',
            header: 'User',
            cell: ({ row }) => <span className="text-xs font-semibold text-[#823d21]">{row.original.user_name}</span>,
        },
        {
            accessorKey: 'ip_address',
            header: 'IP Address',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ip_address}</span>,
        },
        {
            accessorKey: 'created_at',
            header: 'Timestamp',
            cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.created_at}</span>,
        },
    ];

    return (
        <>
            <Head title="Activity Logs & Audit Trail - MaMa Café" />

            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">System Activity Logs & Audit Trail</h1>
                        <p className="text-xs text-muted-foreground">
                            Audit trail recording staff actions, order modifications, settings changes, and security events.
                        </p>
                    </div>
                </div>

                <StatsCard sections={stats} />

                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-in-out">
                

                    <DataTable
                        title="System Audit Trail"
                        searchTitle="Filter logs by description or user..."
                        columns={columns}
                        data={logs}
                    />
                </div>
            </div>
        </>
    );
}

ActivityLogsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/activity-logs' },
            { title: 'Activity Logs', href: '/system/activity-logs' },
        ]}
    >
        {page}
    </AppLayout>
);
