"use client";

import Image from "next/image";
import { toast } from "sonner";

import { stripeRedirect } from "@/actions";
import { Button, Dialog, DialogContent } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction, useProModal } from "@/hooks";
import { cn } from "@/lib";

export const ProModal = () => {
    const { isOpen, onClose } = useProModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => (window.location.href = data),
        onError: (error) => toast.error(error),
    });

    const onClick = () => execute({});

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div
                    className={cn(
                        theme.flex.center,
                        "aspect-video relative justify-center"
                    )}
                >
                    <Image
                        src="/reading.png"
                        alt="Pro"
                        fill
                        className="object-contain pt-4 dark:hidden"
                    />
                    <Image
                        src="/reading-dark.png"
                        alt="Pro"
                        fill
                        className="object-contain pt-4 hidden dark:block"
                    />
                </div>
                <div className="text-secondary-foreground mx-auto space-y-6 p-6">
                    <h2 className="font-semibold text-xl">
                        Upgrade to WorXpace Pro Today!
                    </h2>
                    <p className="text-xs font-semibold text-muted-foreground">
                        Explore the best of WorXpace
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li>Unlimited boards</li>
                            <li>Advanced checklists</li>
                            <li>Admin and security features</li>
                            <li>And more!</li>
                        </ul>
                    </div>
                    <Button
                        disabled={isLoading}
                        onClick={onClick}
                        className="w-full"
                    >
                        Upgrade
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
