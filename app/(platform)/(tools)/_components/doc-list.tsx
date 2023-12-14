"use client";

import { Search, Settings, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Document } from "@prisma/client";
import { toast } from "sonner";

import { TreeProvider } from "@/components/tree";
import { Item, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { useFetch, useSearch, useSettings } from "@/hooks";
import { fetchUrl } from "@/lib";

import AddItem from "./add-item";
import DocItems from "./doc-items";
import TrashBox from "./trash-box";

const DocListProvider = TreeProvider<Document>;

interface DocListProps {
    isMobile?: boolean;
}

const DocList = ({ isMobile }: DocListProps) => {
    /** Search & Settings */
    const search = useSearch();
    const settings = useSettings();
    /** Docs */
    const router = useRouter();
    const params = useParams();
    const onClickItem = (id: string) => router.push(`/documents/${id}`);
    const isItemActive = (id: string) => params.documentId === id;
    /** Fetch */
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
                    onClick={search.onOpen}
                    shortcut="⌘K"
                />
                <Item
                    label="Settings"
                    icon={Settings}
                    onClick={settings.onOpen}
                    shortcut="⌘,"
                />
                <AddItem />
            </div>
            <div className="mt-4">
                <DocItems />
                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item label="Trash" icon={Trash} />
                    </PopoverTrigger>
                    <PopoverContent
                        className="p-0 w-72 z-[99999]"
                        side={isMobile ? "bottom" : "right"}
                    >
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>
        </DocListProvider>
    );
};

export default DocList;
