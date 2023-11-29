"use client";

import { ReactNode, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { theme } from "@/constants/theme";
import { useAction, useProModal } from "@/hooks";
import { cn } from "@/lib/utils";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { FormPicker } from "./form-picker";

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
    const proModal = useProModal();

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data);
            toast.success("Board Created!");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error);
            proModal.onOpen();
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
                <div className="text-muted-foreground text-sm font-medium text-center pb-4">
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            theme.size.auto,
                            "p-2 absolute top-2 right-2 text-muted-foreground"
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
