"use client";

import { Search, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Document } from "@prisma/client";
import { toast } from "sonner";

import { TreeProvider } from "@/components/tree";
import { Item } from "@/components/ui";
import { useFetch } from "@/hooks";
import { fetchUrl } from "@/lib";

import AddItem from "./add-item";
import DocItems from "./doc-items";

const DocListProvider = TreeProvider<Document>;
const DocList = () => {
    const router = useRouter();
    const params = useParams();
    const onClickItem = (id: string) => router.push(`/documents/${id}`);
    const isItemActive = (id: string) => params.documentId === id;

    /** Fetch  */
    const fetchChildren = async () => {
        try {
            const data: Document[] = await fetchUrl(`/api/documents/`);
            return { data };
        } catch (error) {
            return { error: String(error) };
        }
    };
    const { data, isLoading } = useFetch<Document[]>(fetchChildren, {
        onError: (e) => toast.error(`Error occurred while fetching documents`),
    });

    if (!data || isLoading)
        return (
            <>
                <div>
                    {Array.from([0, 0, 0]).map((level, i) => (
                        <Item.Skeleton key={i} level={level} />
                    ))}
                </div>
                <div className="mt-4">
                    {Array.from([0, 1, 1]).map((level, i) => (
                        <Item.Skeleton key={i} level={level} />
                    ))}
                </div>
            </>
        );
    return (
        <DocListProvider
            initialItems={data}
            onClickItem={onClickItem}
            isItemActive={isItemActive}
        >
            <div>
                <Item
                    label="Search"
                    icon={Search}
                    onClick={() => {}}
                    shortcut="⌘K"
                />
                <Item
                    label="Settings"
                    icon={Settings}
                    onClick={() => {}}
                    shortcut="⌘,"
                />
                <AddItem />
            </div>
            <div className="mt-4">
                <DocItems />
            </div>
        </DocListProvider>
    );
};

export default DocList;
