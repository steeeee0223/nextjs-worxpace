"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { Document } from "@prisma/client";
import { toast } from "sonner";

import { renameDocument } from "@/actions";
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
    const { execute: rename } = useAction(renameDocument, {
        onSuccess: (data) => {
            dispatch({ type: "rename", payload: data });
            toast.success(`Renamed document "${data.title}"`);
        },
    });
    const onChange = (event: ChangeEvent<HTMLInputElement>) =>
        setTitle(event.target.value);

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            disableInput();
            rename({ id: initialData.id, title });
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
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate">{title}</span>
                </Button>
            )}
        </div>
    );
};

Title.Skeleton = function TitleSkeleton() {
    return <Skeleton className="h-9 w-20 rounded-md" />;
};

export default Title;
