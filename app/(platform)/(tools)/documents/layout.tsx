"use client";
import { PropsWithChildren } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document } from "@prisma/client";

import { TreeProvider } from "@/components/tree";
import { fetchUrl } from "@/lib";

import { Sidebar } from "../_components/sidebar";
import { SearchCommand } from "../_components/search-command";

const DocListProvider = TreeProvider<Document>;
const DocumentsLayout = ({ children }: PropsWithChildren) => {
    /** Docs */
    const router = useRouter();
    const params = useParams();
    const onClickItem = (id: string) => router.push(`/documents/${id}`);
    const isItemActive = (id: string) => params.documentId === id;
    const fetchItems = async () => {
        try {
            const data: Document[] = await fetchUrl(`/api/documents/`);
            return { data };
        } catch {
            return { error: `Error occurred while fetching documents` };
        }
    };

    return (
        <DocListProvider
            fetchItems={fetchItems}
            onClickItem={onClickItem}
            isItemActive={isItemActive}
        >
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto">
                <SearchCommand />
                {children}
            </main>
        </DocListProvider>
    );
};

export default DocumentsLayout;
