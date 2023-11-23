"use client";

import { forwardRef, useRef, KeyboardEventHandler } from "react";
import { useParams } from "next/navigation";
import { useOnClickOutside, useEventListener } from "usehooks-ts";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createCard } from "@/actions";
import { Button } from "@/components/ui/button";
import { FormSubmit, FormTextarea } from "@/components/form";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib/utils";

interface CardFormProps {
    listId: string;
    enableEditing: VoidFunction;
    disableEditing: VoidFunction;
    isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
    ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
        const params = useParams();
        const formRef = useRef<HTMLFormElement>(null);

        const { execute, fieldErrors } = useAction(createCard, {
            onSuccess: (data) => {
                toast.success(`Card "${data.title}" created`);
                formRef.current?.reset();
            },
            onError: (error) => toast.error(error),
        });

        useOnClickOutside(formRef, disableEditing);
        useEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") disableEditing();
        });

        const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
            e
        ) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
            }
        };

        const onSubmit = (formData: FormData) => {
            const title = formData.get("title") as string;
            const boardId = params.boardId as string;
            execute({ title, listId, boardId });
        };

        return isEditing ? (
            <form
                ref={formRef}
                action={onSubmit}
                className="m-1 py-0.5 px-1 space-y-4"
            >
                <FormTextarea
                    id="title"
                    onKeyDown={onTextareakeyDown}
                    ref={ref}
                    placeholder="Enter a title for this card..."
                    errors={fieldErrors}
                />
                <div className={theme.flex.gap1}>
                    <FormSubmit>Add card</FormSubmit>
                    <Button onClick={disableEditing} size="sm" variant="ghost">
                        <X className={theme.size.icon} />
                    </Button>
                </div>
            </form>
        ) : (
            <div className="pt-2 px-2">
                <Button
                    onClick={enableEditing}
                    className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
                    size="sm"
                    variant="ghost"
                >
                    <Plus className={cn(theme.size.icon, "mr-2")} />
                    Add a card
                </Button>
            </div>
        );
    }
);

CardForm.displayName = "CardForm";
