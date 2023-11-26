"use client";

import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    type OnDragEndResponder,
} from "@hello-pangea/dnd";
import { toast } from "sonner";

import { updateCardOrder, updateListOrder } from "@/actions";
import { useAction } from "@/hooks";
import { ListWithCards } from "@/lib/types";
import { reorder } from "@/lib/utils";
import { ListForm } from "./list-form";
import ListItem from "./list-item";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => toast.success(`List reordered`),
        onError: (error) => toast.error(error),
    });
    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => toast.success(`Card reordered`),
        onError: (error) => toast.error(error),
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd: OnDragEndResponder = (result) => {
        const { destination: dest, source: src, type } = result;
        if (!dest) return;

        /** If dropped in same position */
        if (dest.droppableId === src.droppableId && dest.index === src.index)
            return;

        /** User moves a list */
        if (type === "list") {
            const items = reorder(orderedData, src.index, dest.index).map(
                (item, i) => ({ ...item, order: i })
            );
            setOrderedData(items);
            /** Trigger server action */
            executeUpdateListOrder({ items, boardId });
        }

        /** User moves a card */
        if (type === "card") {
            let newOrderedData = [...orderedData];
            /** Source & destination lists */
            const srcList = newOrderedData.find(
                ({ id }) => src.droppableId === id
            );
            const destList = newOrderedData.find(
                ({ id }) => dest.droppableId === id
            );
            if (!srcList || !destList) return;

            /** Check if cards exists on the `srcList` */
            if (!srcList.cards) srcList.cards = [];

            /** Check if cards exists on the `destList` */
            if (!destList.cards) destList.cards = [];

            /** Move the card in the same list */
            if (src.droppableId === dest.droppableId) {
                const reorderedCards = reorder(
                    srcList.cards,
                    src.index,
                    dest.index
                );
                reorderedCards.forEach((card, i) => (card.order = i));
                srcList.cards = reorderedCards;
                setOrderedData(newOrderedData);
                /** Trigger server action */
                executeUpdateCardOrder({ boardId, items: reorderedCards });
            } else {
                /** Move the card to another list */
                /** Remove card from `srcList` */
                const [movedCard] = srcList.cards.splice(src.index, 1);

                /** Assign the new `listId` to the moved card */
                movedCard.listId = dest.droppableId;

                /** Add card to `destList` */
                destList.cards.splice(dest.index, 0, movedCard);
                srcList.cards.forEach((card, i) => (card.order = i));

                /** Update the order for each card in `destList` */
                destList.cards.forEach((card, i) => (card.order = i));
                setOrderedData(newOrderedData);
                /** Trigger server action */
                executeUpdateCardOrder({ boardId, items: destList.cards });
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {({ droppableProps, innerRef, placeholder }) => (
                    <ol
                        ref={innerRef}
                        {...droppableProps}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index) => (
                            <ListItem key={list.id} index={index} data={list} />
                        ))}
                        {placeholder}
                        <ListForm boardId={boardId} />
                        {/* Empty space at the end of x-axis */}
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default ListContainer;
