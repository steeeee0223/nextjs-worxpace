"use client";

import { useState, useRef } from "react";
import { useEventListener } from "usehooks-ts";
import { List } from "@prisma/client";

import { FormInput } from "@/components/form";
import { cn } from "@/lib/utils";
import { theme } from "@/constants/theme";

interface ListHeaderProps {
    title: string;
    listId: string;
    onUpdateTitle?: (data: Pick<List, "id" | "title">) => void;
}

export const ListHeader = ({
    listId,
    title,
    onUpdateTitle,
}: ListHeaderProps) => {
    const [defaultTitle, setDefaultTitle] = useState(title);
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

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        if (title !== defaultTitle) {
            setDefaultTitle(title);
            onUpdateTitle?.({ title, id: listId });
        }
        disableEditing();
    };

    const onBlur = () => formRef.current?.requestSubmit();

    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") formRef.current?.requestSubmit();
    });

    return isEditing ? (
        <form ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
            <FormInput
                ref={inputRef}
                onBlur={onBlur}
                id="title"
                placeholder="Enter list title.."
                defaultValue={defaultTitle}
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
    );
};
