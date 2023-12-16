"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/modal";
import { cn } from "@/lib";
import { theme } from "@/constants/theme";
import { useTreeAction } from "@/components/tree";
import { useAction } from "@/hooks";
import { deleteDocument, restoreDocument } from "@/actions";
import { Document } from "@prisma/client";

interface BannerProps {
    documentId: string;
}
const $buttonProps =
    "rounded-sm border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal";

export const Banner = ({ documentId }: BannerProps) => {
    const router = useRouter();
    const { dispatch } = useTreeAction<Document>();

    const onError = (e: string) => toast.error(e);
    /** Action - Restore */
    const { execute: restore } = useAction(restoreDocument, {
        onSuccess: (data) => {
            dispatch({ type: "restore", payload: data });
            toast.success(`Restored document "${data.item.title}"`);
        },
        onError,
    });
    const onRestore = () => restore({ id: documentId });
    /** Action - Remove */
    const { execute: remove } = useAction(deleteDocument, {
        onSuccess: (data) => {
            dispatch({ type: "delete", payload: data.ids });
            toast.success(`Deleted document "${data.item.title}"`);
            router.push("/documents");
        },
        onError,
    });
    const onRemove = () => remove({ id: documentId });

    return (
        <div
            className={cn(
                theme.flex.gap2,
                "w-full bg-rose-500 text-center text-sm p-2 text-white justify-center"
            )}
        >
            <p>This page is in the Trash.</p>
            <Button
                size="sm"
                onClick={onRestore}
                variant="outline"
                className={$buttonProps}
            >
                Restore page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button size="sm" variant="outline" className={$buttonProps}>
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    );
};
