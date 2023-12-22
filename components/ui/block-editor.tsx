"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

interface EditorProps {
    initialContent?: string | null;
    editable?: boolean;
    onChange: (value: string) => void;
    onUpload?: (file: File) => Promise<string>;
}

const Editor = ({
    onChange,
    initialContent,
    editable,
    onUpload,
}: EditorProps) => {
    const { resolvedTheme } = useTheme();

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        onEditorContentChange: (editor) =>
            onChange(JSON.stringify(editor.topLevelBlocks, null, 0)),
        uploadFile: onUpload,
    });

    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
            />
        </div>
    );
};

export default Editor;
