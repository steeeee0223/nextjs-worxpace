"use client";

import { useRef, useState } from "react";
import { Board } from "@prisma/client";
import { toast } from "sonner";

import { updateBoard } from "@/actions";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/form";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib/utils";

interface BoardTitleFormProps {
    data: Board;
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
    const { execute } = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board "${data.title}" updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => toast.error(error),
    });

    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };
    const disableEditing = () => setIsEditing(false);

    const onBlur = () => formRef.current?.requestSubmit();
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({ title: title, id: data.id });
    };

    return isEditing ? (
        <form action={onSubmit} ref={formRef} className={theme.flex.gap2}>
            <FormInput
                ref={inputRef}
                id="title"
                onBlur={onBlur}
                defaultValue={title}
                className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
            />
        </form>
    ) : (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className={cn(theme.size.auto, "font-bold text-lg p-1 px-2")}
        >
            {title}
        </Button>
    );
};

export default BoardTitleForm;
