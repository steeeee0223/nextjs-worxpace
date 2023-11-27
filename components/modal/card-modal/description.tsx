"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { toast } from "sonner";

import { updateCard } from "@/actions";
import { Button, Skeleton } from "@/components/ui";
import { FormTextarea, FormSubmit } from "@/components/form";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { CardWithList } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DescriptionProps {
    data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
    const params = useParams();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const disableEditing = () => setIsEditing(false);
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => textareaRef.current?.focus());
    };

    useEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape") disableEditing();
    });
    useOnClickOutside(formRef, disableEditing);

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });
            toast.success(`Card "${data.title}" updated`);
            disableEditing();
        },
        onError: (error) => toast.error(error),
    });

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;
        execute({ id: data.id, description, boardId });
    };

    return (
        <div className="flex items-start gap-x-3 w-full text-secondary-foreground">
            <AlignLeft className="h-5 w-5 mt-0.5" />
            <div className="w-full">
                <p className="font-semibold mb-2 text-secondary-foreground">
                    Description
                </p>
                {isEditing ? (
                    <form action={onSubmit} ref={formRef} className="space-y-2">
                        <FormTextarea
                            id="description"
                            className="w-full mt-2"
                            placeholder="Add a more detailed description"
                            defaultValue={data.description || undefined}
                            errors={fieldErrors}
                            ref={textareaRef}
                        />
                        <div className={theme.flex.gap2}>
                            <FormSubmit>Save</FormSubmit>
                            <Button
                                type="button"
                                onClick={disableEditing}
                                size="sm"
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        onClick={enableEditing}
                        role="button"
                        className={cn(
                            theme.bg.textArea,
                            "min-h-[78px] text-sm font-medium py-3 px-3.5 rounded-md"
                        )}
                    >
                        {data.description ||
                            "Add a more detailed description..."}
                    </div>
                )}
            </div>
        </div>
    );
};

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className={cn(theme.bg.textArea, "h-6 w-6")} />
            <div className="w-full">
                <Skeleton className={cn(theme.bg.textArea, "w-24 h-6 mb-2")} />
                <Skeleton
                    className={cn(theme.bg.textArea, "w-full h-[78px]")}
                />
            </div>
        </div>
    );
};
