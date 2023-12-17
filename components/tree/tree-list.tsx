"use client";

import { useState } from "react";
import { FileIcon } from "lucide-react";

import { Item, ItemProps } from "@/components/ui";
import { cn } from "@/lib";

import { useTree } from "./tree-context";
import { TreeItem } from "./types";

interface TreeListProps {
    parentId: string | null;
    level?: number;
    onAddItem?: (parentId?: string) => void;
    onDeleteItem?: ItemProps["onDelete"];
}

export function TreeList<T extends TreeItem>({
    parentId = null,
    level = 0,
    onAddItem,
    onDeleteItem,
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
            {items.map(({ id, title, icon }) => (
                <div key={id}>
                    <Item
                        id={id}
                        label={title}
                        icon={FileIcon}
                        documentIcon={icon}
                        onClick={() => onClickItem(id)}
                        active={isItemActive(id)}
                        level={level}
                        expanded={expanded[id]}
                        onExpand={() => onExpand(id)}
                        onCreate={() => onAddItem?.(id)}
                        onDelete={onDeleteItem}
                    />
                    {expanded[id] && (
                        <TreeList
                            parentId={id}
                            level={level + 1}
                            onAddItem={onAddItem}
                            onDeleteItem={onDeleteItem}
                        />
                    )}
                </div>
            ))}
        </>
    );
}
