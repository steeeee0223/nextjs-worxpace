"use client";

import { ChevronDown, ChevronRight, LucideIcon, Plus } from "lucide-react";

import { cn } from "@/lib";
import { theme } from "@/constants/theme";
import { SPECIAL_KEYS } from "@/constants/keyboard";
import { Skeleton } from "@/components/ui";
import { MouseEvent } from "react";

export interface ItemProps {
    label: string;
    icon: LucideIcon;
    id?: string;
    documentIcon?: string | null;
    active?: boolean;
    expanded?: boolean;
    level?: number;
    shortcut?: string;
    onClick: () => void;
    onExpand?: () => void;
    onCreate?: () => void;
}

export const Item = ({
    id,
    label,
    icon: Icon,
    active,
    documentIcon,
    level = 0,
    expanded,
    shortcut,
    onClick,
    onExpand,
    onCreate,
}: ItemProps) => {
    const ExpandIcon = expanded ? ChevronDown : ChevronRight;
    const handleExpand = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onExpand?.();
    };
    const handleCreate = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onCreate?.();
        if (!expanded) onExpand?.();
    };

    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: `${((level ?? 0) + 1) * 12}px` }}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ExpandIcon
                        className={cn(
                            theme.size.icon,
                            "shrink-0 text-muted-foreground/50"
                        )}
                    />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            )}
            <span className="truncate">{label}</span>
            {shortcut && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {Array.from(shortcut).map((key, i) => (
                        <span
                            className={SPECIAL_KEYS.has(key) ? "text-xs" : ""}
                            key={i}
                        >
                            {key}
                        </span>
                    ))}
                </kbd>
            )}
            {!!id && (
                <div className={cn(theme.flex.gap2, "ml-auto")}>
                    <div
                        role="button"
                        onClick={handleCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus
                            className={cn(
                                theme.size.icon,
                                "text-muted-foreground"
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{
                paddingLeft: level ? `${level * 12 + 25}px` : "12px",
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className={theme.size.icon} />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};
