"use client";

import { useState } from "react";
import { FileIcon } from "lucide-react";

import { Item } from "@/components/ui";
import { cn } from "@/lib";

import { useTree } from "./tree-context";
import { TreeItem } from "./types";

interface TreeListProps {
    parentId?: string | null;
    level?: number;
    onAddItem?: (parentId?: string) => void;
}

export function TreeList<T extends TreeItem>({
    parentId,
    level = 0,
    onAddItem,
}: TreeListProps) {
    const { getChildren, isItemActive, onClickItem } = useTree<T>();
    const items = getChildren(false, parentId);

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const onExpand = (itemId: string) =>
        setExpanded((prev) => ({ ...prev, [itemId]: !prev[itemId] }));

    return (
        <>
            <p
                style={{
                    paddingLeft: level ? `${level * 12 + 25}px` : undefined,
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside
            </p>
            {items.map(({ id, title }) => (
                <div key={id}>
                    <Item
                        id={id}
                        label={title}
                        icon={FileIcon}
                        // documentIcon={icon}
                        onClick={() => onClickItem(id)}
                        active={isItemActive(id)}
                        level={level}
                        expanded={expanded[id]}
                        onExpand={() => onExpand(id)}
                        onCreate={() => onAddItem?.(id)}
                    />
                    {expanded[id] && (
                        <TreeList parentId={id} level={level + 1} />
                    )}
                </div>
            ))}
        </>
    );
}
