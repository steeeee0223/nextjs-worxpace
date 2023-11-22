"use client";

import { useState, useRef } from "react";
import { useEventListener } from "usehooks-ts";
import { List } from "@prisma/client";
import { toast } from "sonner";

import { useAction } from "@/hooks";
import { updateList } from "@/actions";
import { FormInput } from "@/components/form";
import { cn } from "@/lib/utils";
import { theme } from "@/constants/theme";

interface ListHeaderProps {
    data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };
    const disableEditing = () => setIsEditing(false);

    const { execute } = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to "${data.title}"`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        return title === data.title
            ? disableEditing()
            : execute({ title, id: data.id, boardId: data.boardId });
    };

    const onBlur = () => formRef.current?.requestSubmit();

    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") formRef.current?.requestSubmit();
    });

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start- gap-x-2">
            {isEditing ? (
                <form
                    ref={formRef}
                    action={handleSubmit}
                    className="flex-1 px-[2px]"
                >
                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        placeholder="Enter list title.."
                        defaultValue={title}
                        className={cn(
                            theme.inputBorder,
                            "text-neutral-700",
                            "text-sm font-medium",
                            "px-[7px] py-1 h-7",
                            "bg-transparent focus:bg-white",
                            "transition truncate"
                        )}
                    />
                    <button type="submit" hidden />
                </form>
            ) : (
                <div
                    onClick={enableEditing}
                    className="text-neutral-700 w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
                >
                    {title}
                </div>
            )}
        </div>
    );
};
