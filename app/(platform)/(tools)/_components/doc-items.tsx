"use client";

import { Document } from "@prisma/client";
import { toast } from "sonner";

import { createDocument } from "@/actions";
import { TreeList, useTreeAction } from "@/components/tree";
import { useAction } from "@/hooks";

const Docs = TreeList<Document>;
const DocItems = () => {
    const { dispatch } = useTreeAction<Document>();

    const { execute } = useAction(createDocument, {
        onSuccess: (data) => {
            toast.success(`Document Created: ${data.title}`);
            dispatch({ type: "add", payload: [data] });
        },
        onError: (e) => toast.error(e),
    });

    const handleCreate = (parentId?: string) =>
        execute({ title: "Untitled", parentId });

    return <Docs parentId={null} onAddItem={handleCreate} />;
};

export default DocItems;
