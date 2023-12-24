"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui";
import { theme } from "@/constants/theme";
import { cn } from "@/lib";

const Documents = () => {
    const { user } = useUser();

    return (
        <div
            className={cn(
                theme.flex.center,
                "h-full flex-col justify-center space-y-4"
            )}
        >
            <Image
                src="/empty.png"
                height="300"
                width="300"
                alt="Empty"
                className="dark:hidden"
            />
            <Image
                src="/empty-dark.png"
                height="300"
                width="300"
                alt="Empty"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s WorXpace
            </h2>
            <Button>
                <PlusCircle className={cn(theme.size.icon, "mr-2")} />
                Create a note
            </Button>
        </div>
    );
};

export default Documents;
