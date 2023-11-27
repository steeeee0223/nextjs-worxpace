"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { toast } from "sonner";

import { updateCard } from "@/actions";
import { Skeleton } from "@/components/ui";
import { FormInput } from "@/components/form";
import { theme } from "@/constants/theme";
import { useAction } from "@/hooks";
import { CardWithList } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
    data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
    const params = useParams();
    const [title, setTitle] = useState(data.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();
    const { execute } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });

            toast.success(`Renamed to "${data.title}"`);
            setTitle(data.title);
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onBlur = () => inputRef.current?.form?.requestSubmit();
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = params.boardId as string;

        if (title === data.title) return;
        execute({ title, boardId, id: data.id });
    };

    return (
        <div className="flex items-start gap-x-3 mb-6 w-full">
            <Layout className="text-secondary-foreground h-5 w-5 mt-1" />
            <div className="w-full">
                <form action={onSubmit}>
                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        defaultValue={title}
                        className={cn(
                            "focus:text-neutral-700 text-secondary-foreground",
                            "border-transparent focus-visible:border-input",
                            "font-semibold text-xl px-1 bg-transparent relative -left-1.5 w-[95%] focus-visible:bg-white mb-0.5 truncate"
                        )}
                    />
                </form>
                <p className="text-sm text-muted-foreground">
                    in list <span className="underline">{data.list.title}</span>
                </p>
            </div>
        </div>
    );
};

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className={cn(theme.bg.textArea, "h-6 w-6 mt-1")} />
            <div>
                <Skeleton className={cn(theme.bg.textArea, "w-24 h-6 mb-1")} />
                <Skeleton className={cn(theme.bg.textArea, "w-12 h-4")} />
            </div>
        </div>
    );
};
