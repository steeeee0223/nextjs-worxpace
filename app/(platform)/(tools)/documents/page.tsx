"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { createDocument } from "@/actions";
import { Button } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { cn } from "@/lib";

const Documents = () => {
    const { user } = useUser();
    const { execute } = useAction(createDocument, {
        onSuccess: ({ title }) => toast.success(`Document Created: ${title}`),
        onError: (e) => toast.error(e),
    });

    const onSubmit = (formData: FormData) => {
        const title = "Untitled";
        const parentId = undefined;
        execute({ title, parentId });
    };

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
            <form action={onSubmit}>
                <Button type="submit">
                    <PlusCircle className={cn(theme.size.icon, "mr-2")} />
                    Create a note
                </Button>
            </form>
        </div>
    );
};

export default Documents;
