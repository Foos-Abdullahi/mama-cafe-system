import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CalendarCheck,
    ChevronDown,
    CreditCard,
    LayoutGrid,
    Package,
    Settings,
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
    SidebarSeparator,
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
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const sections: NavSection[] = [
    {
        title: 'Management',
        icon: LayoutGrid,
        children: [
            { title: 'Orders', href: '#', icon: ShoppingBag },
            { title: 'Products', href: '#', icon: Package },
            { title: 'Categories', href: '#', icon: Tag },
            { title: 'Waitresses', href: '#', icon: Users },
        ],
    },
    {
        title: 'Finance & Reports',
        icon: BarChart3,
        children: [
            { title: 'Payments', href: '#', icon: CreditCard },
            { title: 'Payroll', href: '#', icon: Wallet },
            { title: 'Reports', href: '#', icon: BarChart3 },
            { title: 'Daily Closing', href: '#', icon: CalendarCheck },
        ],
    },
    {
        title: 'System',
        icon: Settings,
        children: [
            { title: 'General Settings', href: '#', icon: Settings },
            { title: 'Users', href: '#', icon: UserCog },
            { title: 'Activity Logs', href: '#', icon: Activity },
        ],
    },
];

export function AppSidebar() {
    const { url } = usePage();

    const isActive = (href: string) => {
        if (href === '#') return false;
        if (href === dashboard()) return url === href;
        return url.startsWith(href);
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Header */}
            <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="overflow-hidden px-2 py-2">
                {/* Overview */}
                <SidebarGroup className="px-0 py-0">
                    <SidebarGroupLabel className="px-2.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                        Overview
                    </SidebarGroupLabel>
                    <SidebarMenu className="mt-1 space-y-0.5">
                        {overview.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className={cn(
                                            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                                            active
                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                                        )}
                                    >
                                        <Link href={item.href} prefetch>
                                            <item.icon className="size-4 shrink-0" />
                                            <span className="truncate">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>


                {/* Main Sections */}
                {sections.map((section) => {
                    return (
                        <Collapsible
                            key={section.title}
                            defaultOpen={true}
                            className="group/section"
                        >
                            <SidebarGroup className="px-0 py-0">
                                <SidebarGroupLabel asChild className="hover:bg-transparent">
                                    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 transition-all duration-200 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground">
                                        <section.icon className="size-4 shrink-0" />
                                        <span className="flex-1 text-left">{section.title}</span>
                                        <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]/section:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
                                    <SidebarMenu className="mt-1 ml-2 border-l border-sidebar-border/40 pl-2 space-y-0.5">
                                        {section.children.map((item) => {
                                            const active = isActive(item.href);
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={active}
                                                        tooltip={{ children: item.title }}
                                                        className={cn(
                                                            'flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
                                                            active
                                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                                                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                                                        )}
                                                    >
                                                        <Link href={item.href} prefetch>
                                                            <item.icon className="size-4 shrink-0" />
                                                            <span className="truncate">{item.title}</span>
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