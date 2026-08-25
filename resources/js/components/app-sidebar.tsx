import { Link } from '@inertiajs/react';
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
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
            {
                title: 'Orders',
                href: '#',
                icon: ShoppingBag,
            },
            {
                title: 'Products',
                href: '#',
                icon: Package,
            },
            {
                title: 'Categories',
                href: '#',
                icon: Tag,
            },
            {
                title: 'Waitresses',
                href: '#',
                icon: Users,
            },
        ],
    },

    {
        title: 'Finance & Reports',
        icon: BarChart3,
        children: [
            {
                title: 'Payments',
                href: '#',
                icon: CreditCard,
            },
            {
                title: 'Payroll',
                href: '#',
                icon: Wallet,
            },
            {
                title: 'Reports',
                href: '#',
                icon: BarChart3,
            },
            {
                title: 'Daily Closing',
                href: '#',
                icon: CalendarCheck,
            },
        ],
    },

    {
        title: 'System',
        icon: Settings,
        children: [
            {
                title: 'General Settings',
                href: '#',
                icon: Settings,
            },
            {
                title: 'Users',
                href: '#',
                icon: UserCog,
            },
            {
                title: 'Activity Logs',
                href: '#',
                icon: Activity,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className=''>
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="overflow-hidden">
                {/* Overview */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>

                    <SidebarMenu>
                        {overview.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Main Sections */}
                {sections.map((section) => (
                    <Collapsible
                        key={section.title}
                        defaultOpen
                        className="group/section"
                    >
                        <SidebarGroup className="px-2 py-0">
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="flex w-full items-center gap-2">
                                    <section.icon className="size-4" />

                                    <span>{section.title}</span>

                                    <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/section:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>

                            <CollapsibleContent>
                                <SidebarMenu>
                                    {section.children.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={{
                                                    children: item.title,
                                                }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    prefetch
                                                >
                                                    <item.icon />
                                                    <span>
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}