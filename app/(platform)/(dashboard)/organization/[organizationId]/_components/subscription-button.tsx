"use client";

import { toast } from "sonner";

import { stripeRedirect } from "@/actions";
import { Button } from "@/components/ui";
import { useAction, useProModal } from "@/hooks";

interface SubscriptionButtonProps {
    isPro: boolean;
}

const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
    const proModal = useProModal();

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => (window.location.href = data),
        onError: (error) => toast.error(error),
    });

    const onClick = () => (isPro ? execute({}) : proModal.onOpen());

    return (
        <Button onClick={onClick} disabled={isLoading}>
            {isPro ? "Manage subscription" : "Upgrade to pro"}
        </Button>
    );
};

export default SubscriptionButton;
