"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { File } from "lucide-react";
import { Document } from "@prisma/client";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { useFetch, useSearch } from "@/hooks";
import { cn, fetchUrl } from "@/lib";
import { toast } from "sonner";

export const SearchCommand = () => {
    const { user } = useUser();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const { toggle, isOpen, onClose } = useSearch();

    /** Fetch */
    const fetchChildren = async () => {
        try {
            const data: Document[] = await fetchUrl(
                `/api/documents?archived=${false}`
            );
            return { data };
        } catch (error) {
            return { error: String(error) };
        }
    };
    const { data: documents } = useFetch<Document[]>(fetchChildren, {
        onError: (e) => toast.error(`Error occurred while fetching documents`),
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
        };

        addEventListener("keydown", down);
        return () => removeEventListener("keydown", down);
    }, [toggle]);

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    };

    if (!isMounted) return null;

    return (
        <CommandDialog
            className="z-[99999] pb-1"
            open={isOpen}
            onOpenChange={onClose}
        >
            <CommandInput
                placeholder={`Search ${user?.fullName}'s WorXpace...`}
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents?.map(({ id, title, icon }) => (
                        <CommandItem
                            key={id}
                            value={`${id}-${title}`}
                            title={title}
                            onSelect={onSelect}
                            className="mb-1"
                        >
                            {icon ? (
                                <p className="mr-2 text-[18px]">{icon}</p>
                            ) : (
                                <File className={cn(theme.size.icon, "mr-2")} />
                            )}
                            <span>{title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
