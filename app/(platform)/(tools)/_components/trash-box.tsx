"use client";

import { MouseEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document } from "@prisma/client";
import { Search, Trash, Undo } from "lucide-react";
import { toast } from "sonner";

import { deleteDocument, restoreDocument } from "@/actions";
import { ConfirmModal } from "@/components/modal";
import { useTree, useTreeAction } from "@/components/tree";
import { Input, Spinner } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib";

const TrashBox = () => {
    const router = useRouter();
    const params = useParams();

    /** Tree */
    const { archivedItems: archivedDocs } = useTree<Document>();
    const { dispatch } = useTreeAction<Document>();

    const [search, setSearch] = useState("");
    const filteredDocuments = archivedDocs.filter(({ title }) =>
        title.toLowerCase().includes(search.toLowerCase())
    );

    const onClick = (documentId: string) =>
        router.push(`/documents/${documentId}`);

    const onError = (e: string) => toast.error(e);
    /** Action - Restore */
    const { execute: restore } = useAction(restoreDocument, {
        onSuccess: (data) => {
            dispatch({ type: "restore", payload: data });
            toast.success(`Restored document "${data.item.title}"`);
        },
        onError,
    });
    const onRestore = (e: MouseEvent<HTMLDivElement>, documentId: string) => {
        e.stopPropagation();
        restore({ id: documentId });
    };
    /** Action - Remove */
    const { execute: remove } = useAction(deleteDocument, {
        onSuccess: (data) => {
            dispatch({ type: "delete", payload: data.ids });
            toast.success(`Deleted document "${data.item.title}"`);
            if (params.documentId === data.item.id) router.push("/documents");
        },
        onError,
    });
    const onRemove = (documentId: string) => remove({ id: documentId });

    if (archivedDocs === undefined) {
        return (
            <div className={cn(theme.flex.center, "h-full justify-center p-4")}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className={cn(theme.flex.gap1, "p-2")}>
                <Search className={cn(theme.size.icon, "mr-2")} />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by page title..."
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No documents found.
                </p>
                {filteredDocuments?.map(({ id, title }) => (
                    <div
                        key={id}
                        role="button"
                        onClick={() => onClick(id)}
                        className={cn(
                            theme.flex.center,
                            "text-sm rounded-sm w-full hover:bg-primary/5 text-primary justify-between"
                        )}
                    >
                        <span className="truncate pl-2">{title}</span>
                        <div className={cn(theme.flex.gap1, "p-1")}>
                            <div
                                onClick={(e) => onRestore(e, id)}
                                role="button"
                                className={cn(theme.bg.hover, "rounded-sm p-1")}
                            >
                                <Undo
                                    className={cn(
                                        theme.size.icon,
                                        "text-muted-foreground"
                                    )}
                                />
                            </div>
                            <ConfirmModal onConfirm={() => onRemove(id)}>
                                <div
                                    role="button"
                                    className={cn(
                                        theme.bg.hover,
                                        "rounded-sm p-1"
                                    )}
                                >
                                    <Trash
                                        className={cn(
                                            theme.size.icon,
                                            "text-muted-foreground"
                                        )}
                                    />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrashBox;
