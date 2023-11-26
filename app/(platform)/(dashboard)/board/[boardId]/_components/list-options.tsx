"use client";

import { useRef } from "react";
import { MoreHorizontal, X } from "lucide-react";

import {
    Button,
    ButtonProps,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
    Separator,
} from "@/components/ui";
import { FormSubmit } from "@/components/form";
import { theme } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface ListOptionsProps {
    listId: string;
    onAddCard?: () => void;
    onCopy?: (listId: string) => void;
    onDelete?: (listId: string) => void;
}

export const ListOptions = ({
    listId,
    onAddCard,
    onCopy,
    onDelete,
}: ListOptionsProps) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    const handleAddCard = () => onAddCard?.();
    const handleCopy = (_formData: FormData) => {
        onCopy?.(listId);
        closeRef.current?.click();
    };
    const handleDelete = (_formData: FormData) => {
        onDelete?.(listId);
        closeRef.current?.click();
    };

    const actionProps: ButtonProps = {
        className:
            "rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm",
        variant: "ghost",
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className={cn(theme.size.auto, "p-2 text-muted-foreground")}
                    variant="ghost"
                >
                    <MoreHorizontal className={cn(theme.size.icon)} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3"
                side="bottom"
                align="start"
            >
                <div className="text-muted-foreground text-sm font-medium text-center pb-4">
                    List actions
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className={cn(
                            theme.size.auto,
                            "p-2 absolute top-2 right-2 text-muted-foreground"
                        )}
                        variant="ghost"
                    >
                        <X className={theme.size.icon} />
                    </Button>
                </PopoverClose>
                <Button onClick={handleAddCard} {...actionProps}>
                    Add card...
                </Button>
                <form action={handleCopy}>
                    <FormSubmit {...actionProps}>Copy list...</FormSubmit>
                </form>
                <Separator />
                <form action={handleDelete}>
                    <FormSubmit {...actionProps}>Delete this list</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
