"use client";

import { useScrollTop } from "@/hooks";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui";
import { theme } from "@/constants/theme";

import Logo from "./logo";

export default function Navbar() {
    const scrolled = useScrollTop();

    return (
        <div
            className={cn(
                theme.background.navbar,
                theme.flex.center,
                "z-50 fixed top-0 w-full p-6",
                scrolled && "border-b shadow-sm"
            )}
        >
            <Logo />
            <div
                className={cn(
                    theme.flex.gap2,
                    "md:ml-auto md:justify-end justify-between w-full"
                )}
            >
                <ModeToggle />
            </div>
        </div>
    );
}
