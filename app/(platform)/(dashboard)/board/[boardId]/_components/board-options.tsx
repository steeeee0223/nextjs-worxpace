"use client";

import { toast } from "sonner";
import { MoreHorizontal, X } from "lucide-react";

import { deleteBoard } from "@/actions";
import {
    Button,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib/utils";

interface BoardOptionsProps {
    boardId: string;
}

export const BoardOptions = ({ boardId: id }: BoardOptionsProps) => {
    const { execute, isLoading } = useAction(deleteBoard, {
        onError: (error) => toast.error(error),
    });

    const onDelete = () => execute({ id });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className={cn(theme.size.auto, "p-2")}
                    variant="transparent"
                >
                    <MoreHorizontal className={theme.size.icon} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Board actions
                </div>
                <PopoverClose asChild>
                    <Button
                        className={cn(
                            theme.size.auto,
                            "p-2 absolute top-2 right-2 text-neutral-600"
                        )}
                        variant="ghost"
                    >
                        <X className={theme.size.icon} />
                    </Button>
                </PopoverClose>
                <Button
                    variant="ghost"
                    onClick={onDelete}
                    disabled={isLoading}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                >
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    );
};
