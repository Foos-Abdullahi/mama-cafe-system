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

            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Activity className="h-6 w-6 text-[#823d21]" />
                            System Activity Logs & Audit Trail
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Audit trail recording staff actions, order modifications, settings changes, and security events.
                        </p>
                    </div>
                </div>

                <StatsCard sections={stats} />

                <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mr-2">
                        <Filter className="h-4 w-4" /> Filter Action:
                    </div>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedAction}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option value="">All Action Events</option>
                        <option value="user_create">User Create</option>
                        <option value="user_update">User Update</option>
                        <option value="user_delete">User Delete</option>
                        <option value="settings_update">Settings Update</option>
                    </select>

                    {selectedAction && (
                        <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => handleFilterChange('')}>
                            Reset Filter
                        </Button>
                    )}
                </div>

                <DataTable
                    title="System Audit Trail"
                    searchTitle="Filter logs by description or user..."
                    columns={columns}
                    data={logs}
                />
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
