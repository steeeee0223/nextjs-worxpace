"use client";

import { useRef } from "react";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { copyList, deleteList } from "@/actions";
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
import { useAction } from "@/hooks";
import { cn } from "@/lib/utils";

interface ListOptionsProps {
    data: List;
    onAddCard: () => void;
}

export const ListOptions = ({
    data: { id, boardId },
    onAddCard,
}: ListOptionsProps) => {
    const closeRef = useRef<HTMLButtonElement>(null);

    const onError = (error: string) => toast.error(error);

    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" deleted`);
            closeRef.current?.click();
        },
        onError,
    });
    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" copied`);
            closeRef.current?.click();
        },
        onError,
    });

    const onDelete = (_formData: FormData) => executeDelete({ id, boardId });
    const onCopy = (_formData: FormData) => executeCopy({ id, boardId });

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
                <Button onClick={onAddCard} {...actionProps}>
                    Add card...
                </Button>
                <form action={onCopy}>
                    <FormSubmit {...actionProps}>Copy list...</FormSubmit>
                </form>
                <Separator />
                <form action={onDelete}>
                    <FormSubmit {...actionProps}>Delete this list</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
