"use client";

import { useEffect, useState } from "react";

import { ListWithCards } from "@/lib/types";
import { ListForm } from "./list-form";
import ListItem from "./list-item";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    return (
        <ol className="flex gap-x-3 h-full">
            {orderedData.map((list, index) => (
                <ListItem key={list.id} index={index} data={list} />
            ))}
            <ListForm />
            {/* Empty space at the end of x-axis */}
            <div className="" />
        </ol>
    );
};

export default ListContainer;
