"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Document } from "@prisma/client";

import { ToolbarSkeleton } from "@/app/(platform)/(tools)/documents/[documentId]/_component/toolbar";
import { Cover } from "@/components/ui";
import { theme } from "@/constants/theme";
import { useFetch } from "@/hooks";
import { cn, fetchUrl } from "@/lib";

interface Params {
    params: {
        documentId: string;
    };
}

const DocumentPage = ({ params: { documentId } }: Params) => {
    const {
        data: document,
        isLoading,
        error,
    } = useFetch<Document>(
        () =>
            fetchUrl(`/api/documents/${documentId}`)
                .then((data) => ({ data }))
                .catch((error) => ({ error })),
        {}
    );
    /** Block Note Editor */
    const BlockNoteEditor = useMemo(
        () =>
            dynamic(() => import("@/components/ui/block-editor"), {
                ssr: false,
            }),
        []
    );

    if (!document || isLoading) return <ToolbarSkeleton />;
    if (error) return notFound();
    return (
        <div className="pb-40 dark:bg-[#1F1F1F]">
            <Cover preview url={document.coverImage} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <div className="pl-[54px] group relative">
                    {!!document.icon && (
                        <p className="text-6xl pt-6">{document.icon}</p>
                    )}
                    <div
                        className={cn(
                            theme.flex.gap1,
                            "opacity-0 group-hover:opacity-100 py-4"
                        )}
                    />
                    <div className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]">
                        {document.title}
                    </div>
                </div>
                <BlockNoteEditor
                    editable={false}
                    initialContent={document.content}
                />
            </div>
        </div>
    );
};

export default DocumentPage;
