import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, UserCog, Mail, Calendar, ShieldCheck } from 'lucide-react';

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
            <Head title={`${user.name} - MaMa Café`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#823d21]/10 text-[#823d21]">
                            <UserCog className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {user.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">Staff account details & permissions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/system/users">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Users
                            </Button>
                        </Link>
                        <Link href={`/system/users/${user.id}/edit`}>
                            <Button size="sm" className="gap-2 bg-[#823d21] hover:bg-[#682e18]">
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="destructive" className="gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                {/* Details Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="font-semibold text-lg">Account Profile</h2>
                        <Badge className={`uppercase text-xs ${role.class}`}>{role.label}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <UserCog className="h-3.5 w-3.5 text-[#823d21]" /> Account Name
                            </p>
                            <p className="mt-1 font-semibold text-base text-foreground">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5 text-[#823d21]" /> Email Address
                            </p>
                            <p className="mt-1 font-semibold text-base text-foreground">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5 text-purple-600" /> Assigned Role
                            </p>
                            <p className="mt-1 font-semibold text-base text-foreground capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Created Date
                            </p>
                            <p className="mt-1 font-semibold text-base text-foreground">{user.created_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
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
