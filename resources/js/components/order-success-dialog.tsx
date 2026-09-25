import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderNumber?: string;
};

export function OrderSuccessDialog({ open, onOpenChange, orderNumber }: Props) {
    useEffect(() => {
        if (!open) {
            return;
        }

        confetti({
            particleCount: 120,
            spread: 85,
            origin: { y: 0.55 },
            colors: ['#22c55e', '#facc15', '#f97316', '#ffffff'],
            zIndex: 9999,
            disableForReducedMotion: true,
        });
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#E6DCD0] bg-[#FFFAF5] text-[#2C1810] sm:max-w-md">
                <DialogHeader className="items-center text-center">
                    <CheckCircle2 className="mb-3 size-14 text-green-500" />
                    <DialogTitle className="text-2xl font-black text-[#2C1810]">
                        Order confirmed!
                    </DialogTitle>
                    <DialogDescription className="text-base text-[#7A5B49]">
                        Thank you! Your order was placed successfully.
                        {orderNumber && (
                            <span className="mt-2 block font-medium text-[#2C1810]">
                                Order #{orderNumber}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Button
                    onClick={() => onOpenChange(false)}
                    className="mt-4 w-full bg-[#7A3E22] py-5 font-black text-white shadow-md transition hover:bg-[#612F18]"
                >
                    Done
                </Button>
            </DialogContent>
        </Dialog>
    );
}
