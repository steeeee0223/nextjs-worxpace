"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronsLeft, MenuIcon } from "lucide-react";

import { useNavControl } from "@/hooks";
import { cn } from "@/lib";

import DocList from "./doc-list";
import { UserItem } from "./user-item";

export const Sidebar = () => {
    const pathname = usePathname();
    const {
        isMobile,
        sidebarRef,
        navbarRef,
        isResetting,
        isCollapsed,
        handleMouseDown,
        collapse,
        resetWidth,
    } = useNavControl();

    useEffect(() => {
        isMobile ? collapse() : resetWidth();
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) collapse();
    }, [pathname, isMobile]);

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem />
                </div>
                <DocList />
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && (
                        <MenuIcon
                            onClick={resetWidth}
                            role="button"
                            className="h-6 w-6 text-muted-foreground"
                        />
                    )}
                </nav>
            </div>
        </>
    );
};
