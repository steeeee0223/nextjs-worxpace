import { create } from "zustand";
import { Document } from "@prisma/client";

type DocumentsStore = {
    documents: Document[];
    addDocuments: (newDocuments: Document[]) => void;
    getChildren: (parentId: string | null) => Document[];
};

export const useDocuments = create<DocumentsStore>((set, get) => ({
    documents: [],
    addDocuments: (newDocuments) =>
        set(({ documents }) => ({
            documents: [...documents, ...newDocuments],
        })),
    getChildren: ($parentId) => {
        const { documents } = get();
        console.log(`curr state`, documents);
        return documents.filter(
            ({ parentId, isArchived }) => parentId === $parentId && !isArchived
        );
    },
}));
