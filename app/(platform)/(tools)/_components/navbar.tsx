"use client";

import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Document } from "@prisma/client";

import { theme } from "@/constants/theme";
import { useFetch } from "@/hooks";
import { cn, fetchUrl } from "@/lib";

import Title from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
    const params = useParams();
    const fetchItem = async () => {
        try {
            const data: Document = await fetchUrl(
                `/api/documents/${params.documentId}`
            );
            return { data };
        } catch {
            return { error: `Error occurred while fetching document` };
        }
    };
    const { data: document } = useFetch<Document>(fetchItem, {}, [params]);

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
                    <div className={theme.flex.gap2}>
                        <Menu documentId={document.id} />
                    </div>
                </div>
            </nav>
            {document.isArchived && <Banner documentId={document.id} />}
        </>
    );
};

export default Navbar;
