"use client";

import { Document } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { createDocument } from "@/actions";
import { useTreeAction } from "@/components/tree";
import { Item } from "@/components/ui";
import { useAction } from "@/hooks";

const AddItem = () => {
    const { dispatch } = useTreeAction<Document>();

    const { execute } = useAction(createDocument, {
        onSuccess: (data) => {
            toast.success(`Document Created: ${data.title}`);
            dispatch({ type: "add", payload: [data] });
        },
        onError: (e) => toast.error(e),
    });
    const handleCreate = () => execute({ title: "Untitled" });

    return <Item label="New page" icon={PlusCircle} onClick={handleCreate} />;
};

export default AddItem;
