import AppLogoIcon from '@/components/app-logo-icon';

/**
 * MaMa Café sidebar logo — coffee cup icon + brand name + sub-label.
 */
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                <AppLogoIcon className="size-5 text-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold tracking-tight">MaMa Café</span>
                <span className="truncate text-xs text-sidebar-foreground/60">&amp; Boba Tea</span>
            </div>
        </>
    );
}
