"use client";

import { useRef, useState } from "react";
import { List } from "@prisma/client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { copyList, deleteList, updateList } from "@/actions";
import { useAction } from "@/hooks";
import { ListWithCards } from "@/lib/types";
import { cn } from "@/lib/utils";

import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { ListHeader } from "./list-header";
import { ListOptions } from "./list-options";

interface ListItemProps {
    data: ListWithCards;
    index: number;
}

const ListItem = ({
    data: { id, boardId, title, cards },
    index,
}: ListItemProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const disableEditing = () => setIsEditing(false);
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => textareaRef.current?.focus());
    };

    const onError = (error: string) => toast.error(error);

    const { execute: executeUpdateListTitle } = useAction(updateList, {
        onSuccess: ({ title }) => {
            toast.success(`Renamed to "${title}"`);
        },
        onError,
    });
    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: ({ title }) => {
            toast.success(`List "${title}" copied`);
        },
        onError,
    });
    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: ({ title }) => {
            toast.success(`List "${title}" deleted`);
        },
        onError,
    });

    const onUpdateTitle = ({ title, id }: Pick<List, "title" | "id">) =>
        executeUpdateListTitle({ title, id, boardId: boardId });
    const onCopy = (id: string) => executeCopy({ id, boardId: boardId });
    const onDelete = (id: string) => executeDelete({ id, boardId: boardId });

    return (
        <Draggable draggableId={id} index={index}>
            {({ draggableProps, innerRef, dragHandleProps }) => (
                <li
                    ref={innerRef}
                    {...draggableProps}
                    className="shrink-0 h-full w-[272px] select-none"
                >
                    <div
                        {...dragHandleProps}
                        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
                    >
                        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start- gap-x-2">
                            <ListHeader
                                title={title}
                                listId={id}
                                onUpdateTitle={onUpdateTitle}
                            />
                            <ListOptions
                                listId={id}
                                onAddCard={enableEditing}
                                onCopy={onCopy}
                                onDelete={onDelete}
                            />
                        </div>
                        <Droppable droppableId={id} type="card">
                            {({ innerRef, droppableProps, placeholder }) => (
                                <ol
                                    ref={innerRef}
                                    {...droppableProps}
                                    className={cn(
                                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                                        cards.length > 0 ? "mt-2" : "mt-0"
                                    )}
                                >
                                    {cards.map((card, index) => (
                                        <CardItem
                                            index={index}
                                            key={card.id}
                                            data={card}
                                        />
                                    ))}
                                    {placeholder}
                                </ol>
                            )}
                        </Droppable>
                        <CardForm
                            ref={textareaRef}
                            listId={id}
                            isEditing={isEditing}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                        />
                    </div>
                </li>
            )}
        </Draggable>
    );
};

export default ListItem;
