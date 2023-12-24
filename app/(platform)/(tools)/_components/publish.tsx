"use client";

import { useState } from "react";
import { Check, Copy, Globe } from "lucide-react";
import { Document } from "@prisma/client";
import { toast } from "sonner";

import { updateDocument } from "@/actions";
import { useTreeAction } from "@/components/tree";
import {
    Button,
    PopoverTrigger,
    Popover,
    PopoverContent,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction, useOrigin } from "@/hooks";
import { cn } from "@/lib";

interface PublishProps {
    document: Document;
}

export const Publish = ({ document }: PublishProps) => {
    /** Url */
    const origin = useOrigin();
    const url = `${origin}/preview/${document.id}`;
    /** Copy */
    const [copied, setCopied] = useState(false);
    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };
    /** Actions - Publish & Unpublish */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { dispatch } = useTreeAction<Document>();
    const { execute: update } = useAction(updateDocument, {
        onSuccess: (data) => {
            setIsSubmitting(false);
            dispatch({ type: "update", payload: data });
            data.isPublished
                ? toast.success(`Published Document: "${data.title}"`)
                : toast.success(`Unpublished Document: "${data.title}"`);
        },
        onError: (e) => toast.error(e),
    });
    const onPublish = () => {
        setIsSubmitting(true);
        update({ id: document.id, isPublished: true, log: true });
    };
    const onUnpublish = () => {
        setIsSubmitting(true);
        update({ id: document.id, isPublished: false, log: true });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {document.isPublished && (
                        <Globe
                            className={cn(theme.size.icon, "text-sky-500 ml-2")}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {document.isPublished ? (
                    <div className="space-y-4">
                        <div className={theme.flex.gap2}>
                            <Globe
                                className={cn(
                                    theme.size.icon,
                                    "text-sky-500 animate-pulse"
                                )}
                            />
                            <p className="text-xs font-medium text-sky-500">
                                This note is live on web.
                            </p>
                        </div>
                        <div className={theme.flex.center}>
                            <input
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="h-8 rounded-l-none"
                            >
                                {copied ? (
                                    <Check className={theme.size.icon} />
                                ) : (
                                    <Copy className={theme.size.icon} />
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            className="w-full text-xs"
                            disabled={isSubmitting}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div
                        className={cn(
                            theme.flex.center,
                            "flex-col justify-center"
                        )}
                    >
                        <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others.
                        </span>
                        <Button
                            disabled={isSubmitting}
                            onClick={onPublish}
                            className="w-full text-xs"
                            size="sm"
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
