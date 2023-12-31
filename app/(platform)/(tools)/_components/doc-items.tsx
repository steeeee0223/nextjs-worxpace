"use client";

import { Document } from "@prisma/client";
import { toast } from "sonner";

import { createDocument, archiveDocument } from "@/actions";
import { TreeList, useTreeAction } from "@/components/tree";
import { useAction } from "@/hooks";
import { useRouter } from "next/navigation";

const Docs = TreeList<Document>;
const DocItems = () => {
    const router = useRouter();
    const { dispatch } = useTreeAction<Document>();
    const onError = (e: string) => toast.error(e);

    /** Create */
    const { execute: create } = useAction(createDocument, {
        onSuccess: (data) => {
            toast.success(`Document Created: ${data.title}`);
            dispatch({ type: "add", payload: [data] });
            router.push(`/documents/${data.id}`);
        },
        onError,
    });
    /** Archive */
    const { execute: archive } = useAction(archiveDocument, {
        onSuccess: (data) => {
            dispatch({ type: "archive", payload: data });
            toast.success(`Document "${data.item.title}" Moved to Trash`);
            router.push(`/documents`);
        },
        onError,
    });

    return (
        <Docs
            parentId={null}
            onAddItem={(parentId) => create({ title: "Untitled", parentId })}
            onDeleteItem={(id) => archive({ id })}
        />
    );
};

export default DocItems;
