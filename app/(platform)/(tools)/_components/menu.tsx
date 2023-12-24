"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Document } from "@prisma/client";
import { toast } from "sonner";
import { MoreHorizontal, Trash } from "lucide-react";

import { archiveDocument } from "@/actions";
import { useAction } from "@/hooks";
import { useTreeAction } from "@/components/tree";
import {
    Button,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    Skeleton,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { cn } from "@/lib";

interface MenuProps {
    documentId: string;
}

export const Menu = ({ documentId }: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const { dispatch } = useTreeAction<Document>();

    /** Action - Archive */
    const { execute: archive } = useAction(archiveDocument, {
        onSuccess: (data) => {
            dispatch({ type: "archive", payload: data });
            toast.success(`Document "${data.item.title}" Moved to Trash`);
            router.push(`/documents`);
        },
        onError: (e) => toast.error(e),
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                    <MoreHorizontal className={theme.size.icon} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60 z-[99999]"
                align="end"
                alignOffset={8}
                forceMount
            >
                <DropdownMenuItem onClick={() => archive({ id: documentId })}>
                    <Trash className={cn(theme.size.icon, "mr-2")} />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

Menu.Skeleton = function MenuSkeleton() {
    return <Skeleton className="h-10 w-10" />;
};
