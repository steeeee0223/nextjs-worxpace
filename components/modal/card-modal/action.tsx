"use client";

import { useParams } from "next/navigation";
import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";

import { deleteCard, copyCard } from "@/actions";
import { Button, Skeleton } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction, useCardModal } from "@/hooks";
import { CardWithList } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ActionsProps {
    data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
    const params = useParams();
    const cardModal = useCardModal();

    const onError = (error: string) => toast.error(error);
    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
        copyCard,
        {
            onSuccess: (data) => {
                toast.success(`Card "${data.title}" copied`);
                cardModal.onClose();
            },
            onError,
        }
    );

    const { execute: executeDeleteCard, isLoading: isLoadingDelete } =
        useAction(deleteCard, {
            onSuccess: (data) => {
                toast.success(`Card "${data.title}" deleted`);
                cardModal.onClose();
            },
            onError,
        });

    const onCopy = () => {
        const boardId = params.boardId as string;
        executeCopyCard({ id: data.id, boardId });
    };

    const onDelete = () => {
        const boardId = params.boardId as string;
        executeDeleteCard({ id: data.id, boardId });
    };

    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">Actions</p>
            <Button
                onClick={onCopy}
                disabled={isLoadingCopy}
                variant="gray"
                className="w-full justify-start"
                size="inline"
            >
                <Copy className={cn(theme.size.icon, "mr-2")} />
                Copy
            </Button>
            <Button
                onClick={onDelete}
                disabled={isLoadingDelete}
                variant="gray"
                className="w-full justify-start"
                size="inline"
            >
                <Trash className={cn(theme.size.icon, "mr-2")} />
                Delete
            </Button>
        </div>
    );
};

Actions.Skeleton = function ActionsSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className={cn(theme.bg.textArea, "w-20 h-4")} />
            <Skeleton className={cn(theme.bg.textArea, "w-full h-8")} />
            <Skeleton className={cn(theme.bg.textArea, "w-full h-8")} />
        </div>
    );
};
