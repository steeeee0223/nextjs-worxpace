"use client";

import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

import { Button, type ButtonProps, CoverPicker } from "@/components/ui";
import { theme } from "@/constants/theme";
import { cn } from "@/lib";

interface CoverImageProps {
    url?: string;
    preview?: boolean;
    onUploadChange?: (file: File) => Promise<void>;
    onUnsplash?: (url: string) => void;
    onRemove?: () => void;
}

export const Cover = ({
    url,
    preview,
    onUploadChange,
    onUnsplash,
    onRemove,
}: CoverImageProps) => {
    /** Styles */
    const buttonProps: ButtonProps = {
        className: "text-muted-foreground text-xs",
        variant: "outline",
        size: "sm",
    };

    return (
        <div
            className={cn(
                "relative w-full h-[35vh] group",
                url ? "bg-muted" : "h-[12vh]"
            )}
        >
            {!!url && (
                <Image src={url} fill alt="Cover" className="object-cover" />
            )}
            {url && !preview && (
                <div
                    className={cn(
                        theme.flex.gap2,
                        "opacity-0 group-hover:opacity-100 absolute bottom-5 right-5"
                    )}
                >
                    <CoverPicker
                        asChild
                        onUploadChange={onUploadChange}
                        onUnsplash={onUnsplash}
                        onRemove={onRemove}
                    >
                        <Button {...buttonProps}>
                            <ImageIcon
                                className={cn(theme.size.icon, "mr-2")}
                            />
                            Change cover
                        </Button>
                    </CoverPicker>
                    <Button onClick={onRemove} {...buttonProps}>
                        <X className={cn(theme.size.icon, "mr-2")} />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    );
};
