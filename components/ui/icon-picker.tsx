"use client";

import { useTheme } from "next-themes";
import EmojiPicker, { Theme } from "emoji-picker-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { PropsWithChildren } from "react";

interface IconPickerProps extends PropsWithChildren {
    asChild?: boolean;
    onChange: (icon: string) => void;
}

export const IconPicker = ({
    onChange,
    children,
    asChild,
}: IconPickerProps) => {
    const { resolvedTheme } = useTheme();
    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;

    const themeMap = {
        dark: Theme.DARK,
        light: Theme.LIGHT,
    };

    const theme = themeMap[currentTheme];

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
            <PopoverContent className="z-[99999] p-0 w-full border-none shadow-none">
                <EmojiPicker
                    height={350}
                    theme={theme}
                    onEmojiClick={(data) => onChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
};
