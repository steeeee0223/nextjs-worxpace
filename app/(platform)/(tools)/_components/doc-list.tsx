"use client";

import { Search, Settings, Trash } from "lucide-react";
import { Document } from "@prisma/client";

import { useTree } from "@/components/tree";
import { Item, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { useSearch, useSettings } from "@/hooks";

import AddItem from "./add-item";
import DocItems from "./doc-items";
import TrashBox from "./trash-box";
import { UserItem } from "./user-item";

interface DocListProps {
    isMobile?: boolean;
}

const DocList = ({ isMobile }: DocListProps) => {
    /** Search & Settings */
    const search = useSearch();
    const settings = useSettings();
    /** Docs */
    const { isLoading } = useTree<Document>();

    return (
        <>
            <div>
                <UserItem />
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
                {isLoading ? (
                    <>
                        <div className="mt-4">
                            {Array.from([0, 1, 0, 1, 1]).map((level, i) => (
                                <Item.Skeleton key={i} level={level} />
                            ))}
                        </div>
                    </>
                ) : (
                    <DocItems />
                )}
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
        </>
    );
};

export default DocList;
