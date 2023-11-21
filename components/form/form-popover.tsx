"use client";

import { ReactNode, useRef } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { createBoard } from "@/actions";
import {
    Button,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui";
import { useAction } from "@/hooks";
import { theme } from "@/theme";
import { cn } from "@/lib/utils";
import { FormInput, FormPicker, FormSubmit } from ".";
import { useRouter } from "next/navigation";

interface FormPopoverProps {
    children: ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
}: FormPopoverProps) => {
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement>(null);

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data);
            toast.success("Board Created!");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            console.log(error);
            toast.error(error);
        },
    });
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = (formData.get("image") as string) ?? "";
        execute({ title, image });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className="w-80 pt-3"
                align={align}
                side={side}
                sideOffset={sideOffset}
            >
                <div
                    className={cn(
                        theme.textColor,
                        "text-sm font-medium text-center pb-4"
                    )}
                >
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            theme.size.auto,
                            "p-2 absolute top-2 right-2 text-neutral-600"
                        )}
                    >
                        <X className={theme.size.icon} />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker id="image" errors={fieldErrors} />
                        <FormInput
                            type="text"
                            id="title"
                            label="Board title"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">Create</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
