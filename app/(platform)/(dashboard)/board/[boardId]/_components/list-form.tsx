"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createList } from "@/actions";
import { Button } from "@/components/ui";
import { FormInput, FormSubmit } from "@/components/form";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib/utils";

interface ListFormProps {
    boardId: string;
}

export const ListForm = ({ boardId }: ListFormProps) => {
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };
    const disableEditing = () => setIsEditing(false);

    const { execute, fieldErrors } = useAction(createList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" created`);
            disableEditing();
            router.refresh();
        },
        onError: (error) => toast.error(error),
    });

    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") disableEditing();
    });
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({ title, boardId });
    };

    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            {isEditing ? (
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput
                        ref={inputRef}
                        errors={fieldErrors}
                        id="title"
                        className={cn(
                            theme.inputBorder,
                            "text-sm px-2 py-1 h-7 font-medium transition"
                        )}
                        placeholder="Enter list title..."
                    />
                    <div className={theme.flex.gap1}>
                        <FormSubmit className="mr-2">Add list</FormSubmit>
                        <Button
                            onClick={disableEditing}
                            size="sm"
                            variant="ghost"
                        >
                            <X className={theme.size.icon} />
                        </Button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={enableEditing}
                    className={cn(
                        theme.flex.center,
                        "text-neutral-700",
                        "w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 font-medium text-sm"
                    )}
                >
                    <Plus className={cn(theme.size.icon, "mr-2")} />
                    Add a list
                </button>
            )}
        </li>
    );
};
