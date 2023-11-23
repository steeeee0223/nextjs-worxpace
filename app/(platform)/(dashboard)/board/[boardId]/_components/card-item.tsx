"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

import { useCardModal } from "@/hooks";

interface CardItemProps {
    data: Card;
    index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
    const { onOpen } = useCardModal();

    return (
        <Draggable draggableId={data.id} index={index}>
            {({ dragHandleProps, draggableProps, innerRef }) => (
                <div
                    role="button"
                    ref={innerRef}
                    onClick={() => onOpen(data.id)}
                    {...dragHandleProps}
                    {...draggableProps}
                    className="text-neutral-700 truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
                >
                    {data.title}
                </div>
            )}
        </Draggable>
    );
};
