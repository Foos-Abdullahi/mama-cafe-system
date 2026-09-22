import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Confirm Deletion',
    description = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText = 'Yes, Delete',
    cancelText = 'Cancel',
    isDeleting = false,
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="gap-2 sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-sm text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
