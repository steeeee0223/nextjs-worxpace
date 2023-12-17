"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { Document } from "@prisma/client";
import { toast } from "sonner";

import { updateDocument } from "@/actions";
import { useAction } from "@/hooks";
import { Button, Input, Skeleton } from "@/components/ui";
import { useTreeAction } from "@/components/tree";
import { theme } from "@/constants/theme";

interface TitleProps {
    initialData: Document;
}

const Title = ({ initialData }: TitleProps) => {
    const [title, setTitle] = useState(initialData.title || "Untitled");
    /** Input */
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const enableInput = () => {
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(
                0,
                inputRef.current.value.length
            );
        }, 0);
    };
    const disableInput = () => setIsEditing(false);
    /** Action - Rename */
    const { dispatch } = useTreeAction<Document>();
    const { execute: update } = useAction(updateDocument, {
        onSuccess: (data) => {
            dispatch({ type: "update", payload: data });
            toast.success(`Renamed document "${data.title}"`);
        },
    });
    const onChange = (event: ChangeEvent<HTMLInputElement>) =>
        setTitle(event.target.value);

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            disableInput();
            update({ id: initialData.id, title, log: true });
        }
    };

    return (
        <div className={theme.flex.gap1}>
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 ml-1 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-normal h-auto ml-1 p-1"
                >
                    <span className="truncate">{initialData.title}</span>
                </Button>
            )}
        </div>
    );
};

Title.Skeleton = function TitleSkeleton() {
    return <Skeleton className="h-9 w-20 rounded-md" />;
};

export default Title;
