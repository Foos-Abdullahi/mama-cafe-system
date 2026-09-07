import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

interface FlashProps {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    toast?: FlashToast;
}

export function useFlashToast(): void {
    useEffect(() => {
        const handleFlash = (flash: FlashProps | undefined) => {
            if (!flash) return;

            if (flash.success) {
                toast.success(flash.success);
            }
            if (flash.error) {
                toast.error(flash.error);
            }
            if (flash.warning) {
                toast.warning(flash.warning);
            }
            if (flash.info) {
                toast.info(flash.info);
            }
            if (flash.toast) {
                toast[flash.toast.type || 'info'](flash.toast.message);
            }
        };

        const removeNavigateListener = router.on('navigate', (event) => {
            const pageProps = event.detail.page.props as { flash?: FlashProps };
            handleFlash(pageProps.flash);
        });

        const removeFlashListener = router.on('flash', (event) => {
            const eventFlash = (event as CustomEvent).detail?.flash;
            const data = eventFlash?.toast as FlashToast | undefined;

            if (data?.message) {
                toast[data.type || 'info'](data.message);
            }
        });

        return () => {
            removeNavigateListener();
            removeFlashListener();
        };
    }, []);
}
