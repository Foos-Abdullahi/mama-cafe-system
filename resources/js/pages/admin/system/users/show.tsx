import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, UserCog, Mail, Calendar, ShieldCheck, Clock } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'operations' | 'waitress';
    created_at: string;
    updated_at: string;
}

interface Props {
    user: UserData;
}

const roleBadges: Record<string, { label: string; class: string }> = {
    admin: { label: 'Admin', class: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 font-bold' },
    manager: { label: 'Manager', class: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    operations: { label: 'Operations / POS', class: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    waitress: { label: 'Waitress', class: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
};

export default function UserShow({ user }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete user account "${user.name}"?`)) {
            router.delete(`/system/users/${user.id}`);
        }
    };

    const role = roleBadges[user.role] || { label: user.role, class: '' };

    return (
        <>
            <Head title={`${user.name} — User Details`} />

            <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header with Title and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                                {user.name}
                            </h1>
                            <Badge
                                variant="outline"
                                className={`capitalize font-medium text-xs ${role.class}`}
                            >
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                {role.label}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Joined: {formatDateTime(user.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/system/users">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Users
                            </Button>
                        </Link>
                        <Link href={`/system/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs">
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="gap-1.5 text-xs shadow-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
                    {/* Left Column: Account Profile Overview */}
                    <div className="space-y-6">
                        <Panel title="Account Overview">
                            <div className="flex items-center gap-4 border-b border-border pb-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#823d21]/10 text-[#823d21]">
                                    <UserCog className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-foreground">{user.name}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <Mail className="h-3.5 w-3.5" />
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 space-y-2.5">
                                <SummaryRow label="Account Name" value={user.name} />
                                <SummaryRow label="Email Address" value={user.email} />
                                <SummaryRow label="System ID" value={`#USER-${user.id}`} />
                                <SummaryRow
                                    label="Assigned Role"
                                    value={<span className="capitalize">{user.role}</span>}
                                />
                            </div>
                        </Panel>

                        <Panel title="Permissions & Access Summary">
                            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-xs space-y-2 text-muted-foreground leading-relaxed">
                                <p>
                                    This user is assigned the <strong className="text-foreground capitalize">{user.role}</strong> role.
                                    {user.role === 'admin' && ' Full super-admin privileges over all orders, products, staff, financials, and system configurations.'}
                                    {user.role === 'manager' && ' Management access to monitor staff performance, review orders, manage catalog, and oversee shifts.'}
                                    {user.role === 'operations' && ' Operations access enabled for POS checkout, order intake, fulfillment, and daily operations.'}
                                    {user.role === 'waitress' && ' Waitress access scoped to order creation, personal commission tracking, and active assigned tables.'}
                                </p>
                            </div>
                        </Panel>
                    </div>

                    {/* Right Column: Timestamps & Activity Panel */}
                    <div className="space-y-6">
                        <Panel title="Account Metadata">
                            <div className="space-y-2.5">
                                <SummaryRow label="Created At" value={formatDateTime(user.created_at)} />
                                <SummaryRow label="Last Updated" value={formatDateTime(user.updated_at)} />
                                <SummaryRow label="Status" value="Active Account" strong />
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        </>
    );
}

function Panel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {title}
            </h2>
            {children}
        </div>
    );
}

function SummaryRow({
    label,
    value,
    strong,
}: {
    label: string;
    value: React.ReactNode;
    strong?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between text-xs ${
                strong
                    ? 'border-t border-border pt-2 text-sm font-bold text-foreground'
                    : 'text-muted-foreground'
            }`}
        >
            <span>{label}</span>
            <span
                className={
                    strong
                        ? 'font-mono text-base font-bold text-[#823d21]'
                        : 'font-mono font-medium text-foreground'
                }
            >
                {value}
            </span>
        </div>
    );
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

UserShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'System', href: '/system/users' },
            { title: 'Users', href: '/system/users' },
            { title: 'User Details', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
