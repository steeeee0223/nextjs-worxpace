"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { updateBoard } from "@/actions";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/form";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib/utils";

interface BoardTitleFormProps {
    title: string;
    boardId: string;
}

const BoardTitleForm = ({ title, boardId }: BoardTitleFormProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [defaultTitle, setDefaultTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };
    const disableEditing = () => setIsEditing(false);

    const { execute } = useAction(updateBoard, {
        onSuccess: ({ title }) => {
            toast.success(`Board "${title}" updated!`);
            setDefaultTitle(title);
            disableEditing();
        },
        onError: (error) => toast.error(error),
    });

    const onBlur = () => formRef.current?.requestSubmit();
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({ title: title, id: boardId });
    };

    return isEditing ? (
        <form action={onSubmit} ref={formRef} className={theme.flex.gap2}>
            <FormInput
                ref={inputRef}
                id="title"
                onBlur={onBlur}
                defaultValue={defaultTitle}
                className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
            />
        </form>
    ) : (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className={cn(theme.size.auto, "font-bold text-lg p-1 px-2")}
        >
            {defaultTitle}
        </Button>
    );
};

export default BoardTitleForm;
