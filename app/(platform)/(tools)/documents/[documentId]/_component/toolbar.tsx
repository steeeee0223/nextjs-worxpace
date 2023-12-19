"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { ImageIcon, Smile, X } from "lucide-react";
import { Document } from "@prisma/client";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

import { updateDocument } from "@/actions";
import { useTreeAction } from "@/components/tree";
import {
    Button,
    type ButtonProps,
    Cover,
    CoverPicker,
    IconPicker,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction, useEdgeStore } from "@/hooks";
import { cn } from "@/lib";

interface ToolbarProps {
    document: Document;
    preview?: boolean;
}

const Toolbar = ({ document, preview }: ToolbarProps) => {
    /** Input */
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(document.title);
    const enableInput = () => {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(document.title);
            inputRef.current?.focus();
        }, 0);
    };
    const disableInput = () => setIsEditing(false);
    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            disableInput();
        }
    };
    /** Edgestore */
    const { edgestore } = useEdgeStore();
    /** Tree Actions */
    const { dispatch } = useTreeAction<Document>();
    /** Action - update */
    const { execute: update } = useAction(updateDocument, {
        onSuccess: (data) => {
            toast.success(`Update successfully`);
            dispatch({ type: "update", payload: data });
        },
        onError: (e: string) => toast.error(e),
    });
    const onUpdateTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.currentTarget.value);
        update({
            id: document.id,
            title: e.currentTarget.value || "Untitled",
        });
    };
    const onIconSelect = (icon: string) => update({ id: document.id, icon });
    const onRemoveIcon = () => update({ id: document.id, icon: null });
    const onUploadCover = async (file: File) => {
        const res = await edgestore.publicFiles.upload({
            file,
        });
        update({ id: document.id, coverImage: res.url });
    };
    const onUnsplashCover = (url: string) => {
        console.log(`updating unsplash cover to db: ${url}`);
        update({ id: document.id, coverImage: url });
        console.log(`updated d unsplash cover to db`);
    };
    const onRemoveCover = () => update({ id: document.id, coverImage: null });
    /** Props */
    const buttonProps: ButtonProps = {
        className: "text-muted-foreground text-xs",
        variant: "gray",
        size: "sm",
    };

    return (
        <>
            {document.coverImage ? (
                <Cover url={document.coverImage} onRemove={onRemoveCover} />
            ) : (
                <div className="h-[35vh]" />
            )}
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <div className="pl-[54px] group relative">
                    {!!document.icon && !preview && (
                        <div className={cn(theme.flex.gap2, "group/icon pt-6")}>
                            <IconPicker onChange={onIconSelect}>
                                <p className="text-6xl hover:opacity-75 transition">
                                    {document.icon}
                                </p>
                            </IconPicker>
                            <Button
                                onClick={onRemoveIcon}
                                className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                                variant="outline"
                                size="icon"
                            >
                                <X className={theme.size.icon} />
                            </Button>
                        </div>
                    )}
                    {!!document.icon && preview && (
                        <p className="text-6xl pt-6">{document.icon}</p>
                    )}
                    <div
                        className={cn(
                            theme.flex.gap1,
                            "opacity-0 group-hover:opacity-100 py-4"
                        )}
                    >
                        {!document.icon && !preview && (
                            <IconPicker asChild onChange={onIconSelect}>
                                <Button {...buttonProps}>
                                    <Smile
                                        className={cn(theme.size.icon, "mr-2")}
                                    />
                                    Add icon
                                </Button>
                            </IconPicker>
                        )}
                        {!document.coverImage && !preview && (
                            <CoverPicker
                                asChild
                                onUploadChange={onUploadCover}
                                onUnsplash={onUnsplashCover}
                                onRemove={onRemoveCover}
                            >
                                <Button {...buttonProps}>
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Add cover
                                </Button>
                            </CoverPicker>
                        )}
                    </div>
                    {isEditing && !preview ? (
                        <TextareaAutosize
                            ref={inputRef}
                            onBlur={disableInput}
                            onKeyDown={onKeyDown}
                            value={value}
                            onChange={onUpdateTitle}
                            className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                        />
                    ) : (
                        <div
                            onClick={enableInput}
                            className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
                        >
                            {document.title}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Toolbar;
