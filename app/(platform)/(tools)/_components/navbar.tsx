"use client";

import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Document } from "@prisma/client";
import { useFetch } from "usehooks-ts";

import { theme } from "@/constants/theme";
import { cn } from "@/lib";

import Title from "./title";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
    const params = useParams();
    const { data: document } = useFetch<Document>(
        `/api/documents/${params.documentId}`
    );

    if (document === undefined) {
        return (
            <nav
                className={cn(
                    theme.bg.navbar,
                    theme.flex.center,
                    "px-3 py-2 w-full"
                )}
            >
                <Title.Skeleton />
            </nav>
        );
    }

    if (document === null) return null;

    return (
        <>
            <nav
                className={cn(
                    theme.bg.navbar,
                    theme.flex.center,
                    "px-3 py-2 w-full gap-x-4"
                )}
            >
                {isCollapsed && (
                    <MenuIcon
                        role="button"
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                    />
                )}
                <div
                    className={cn(theme.flex.center, "justify-between w-full")}
                >
                    <Title initialData={document} />
                </div>
            </nav>
        </>
    );
};

export default Navbar;
