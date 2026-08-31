import * as React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CalendarCheck,
    ChevronDown,
    CreditCard,
    LayoutGrid,
    Monitor,
    Package,
    Settings,
    Shield,
    ShoppingBag,
    Tag,
    UserCog,
    Users,
    Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';

type NavItem = {
    title: string;
    href: string;
    icon: React.ElementType;
};

type NavSection = {
    title: string;
    icon: React.ElementType;
    children: NavItem[];
};

const overview: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
        icon: LayoutGrid,
    },
    {
        title: 'POS Terminal',
        href: '/pos',
        icon: Monitor,
    },
];

const sections: NavSection[] = [
    {
        title: 'Management',
        icon: LayoutGrid,
        children: [
            { title: 'Orders', href: '/management/orders', icon: ShoppingBag },
            { title: 'Products', href: '/management/products', icon: Package },
            { title: 'Categories', href: '/management/categories', icon: Tag },
            { title: 'Waitresses', href: '/management/waitresses', icon: Users },
        ],
    },
    {
        title: 'Finance & Reports',
        icon: BarChart3,
        children: [
            { title: 'Payments', href: '/finance/payments', icon: CreditCard },
            { title: 'Payroll', href: '/finance/payroll', icon: Wallet },
            { title: 'Reports', href: '/finance/reports', icon: BarChart3 },
            { title: 'Daily Closing', href: '/finance/daily-closing', icon: CalendarCheck },
        ],
    },
    {
        title: 'System',
        icon: Settings,
        children: [
            { title: 'General Settings', href: '/system/settings', icon: Settings },
            { title: 'Role Permissions', href: '/system/roles', icon: Shield },
            { title: 'Users', href: '/system/users', icon: UserCog },
            { title: 'Activity Logs', href: '/system/activity-logs', icon: Activity },
        ],
    },
];

export function AppSidebar() {
    const { url, props } = usePage();
    const { state } = useSidebar();
    const user = (props.auth as any)?.user as { name: string; email: string; role?: string } | undefined;
    const role = user?.role || 'admin';

    const isActive = (href: string) => {
        if (!href || href === '#') return false;
        const currentPath = (url.split('?')[0] || '').replace(/\/$/, '') || '/';
        const targetPath = (href.split('?')[0] || '').replace(/\/$/, '') || '/';

        if (targetPath === '/dashboard' || targetPath === '/' || targetPath === '/pos') {
            return currentPath === targetPath;
        }

        return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
    };

    // Filter overview based on user role
    const filteredOverview = overview.filter((item) => {
        if (item.title === 'Dashboard') {
            return role === 'admin' || role === 'manager' || role === 'operations';
        }
        if (item.title === 'POS Terminal') {
            return true; // Available to all roles
        }
        return true;
    });

    // Filter sections based on user role
    const filteredSections = sections
        .map((section) => {
            const children = section.children.filter((item) => {
                if (role === 'admin') return true;

                if (role === 'manager') {
                    return section.title !== 'System';
                }

                if (role === 'operations') {
                    return item.title === 'Orders';
                }

                if (role === 'waitress') {
                    return item.title === 'Orders';
                }

                return false;
            });

            return { ...section, children };
        })
        .filter((section) => section.children.length > 0);

    // Track open state of sections in expanded mode
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        sections.forEach((section) => {
            initial[section.title] = true;
        });
        return initial;
    });

    // Automatically expand section when current route matches any child
    React.useEffect(() => {
        filteredSections.forEach((section) => {
            if (section.children.some((child) => isActive(child.href))) {
                setOpenSections((prev) => ({
                    ...prev,
                    [section.title]: true,
                }));
            }
        });
    }, [url]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Header */}
            <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={role === 'waitress' ? '/pos' : dashboard.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation with hidden scrollbar */}
            <SidebarContent className="overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0 px-2 py-2 space-y-1">
                {/* Overview */}
                {filteredOverview.length > 0 && (
                    <SidebarGroup className="px-0 py-0">
                        <SidebarGroupLabel className="px-2.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                            Overview
                        </SidebarGroupLabel>
                        <SidebarMenu className="mt-1 space-y-0.5 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:space-y-1">
                            {filteredOverview.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            tooltip={{ children: item.title }}
                                            className={cn(
                                                'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                                                'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-8',
                                                active
                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                                                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                                            )}
                                        >
                                            <Link href={item.href} prefetch className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center">
                                                <item.icon className="size-4 shrink-0" />
                                                <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                )}

                {/* Main Sections */}
                {filteredSections.map((section) => {
                    const isSectionHasActiveChild = section.children.some((child) => isActive(child.href));
                    const isSectionOpen = state === 'collapsed' ? true : (openSections[section.title] ?? true);

                    return (
                        <Collapsible
                            key={section.title}
                            open={isSectionOpen}
                            onOpenChange={(isOpen) => {
                                if (state !== 'collapsed') {
                                    setOpenSections((prev) => ({
                                        ...prev,
                                        [section.title]: isOpen,
                                    }));
                                }
                            }}
                            className="group/section"
                        >
                            <SidebarGroup className="px-0 py-0">
                                <SidebarGroupLabel asChild className="hover:bg-transparent">
                                    <CollapsibleTrigger
                                        className={cn(
                                            'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
                                            isSectionHasActiveChild
                                                ? 'text-sidebar-foreground font-bold'
                                                : 'text-sidebar-foreground/60'
                                        )}
                                    >
                                        <section.icon className={cn('size-4 shrink-0', isSectionHasActiveChild && 'text-sidebar-primary')} />
                                        <span className="flex-1 text-left">{section.title}</span>
                                        <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]/section:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
                                    <SidebarMenu className="mt-1 ml-2 border-l border-sidebar-border/40 pl-2 space-y-0.5 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:space-y-1">
                                        {section.children.map((item) => {
                                            const active = isActive(item.href);
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={active}
                                                        tooltip={{ children: item.title }}
                                                        className={cn(
                                                            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                                                            'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-8',
                                                            active
                                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                                                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                                                        )}
                                                    >
                                                        <Link href={item.href} prefetch className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center">
                                                            <item.icon className="size-4 shrink-0" />
                                                            <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    );
                })}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-sidebar-border px-2 py-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}