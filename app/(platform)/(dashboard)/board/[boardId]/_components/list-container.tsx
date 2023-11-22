"use client";

import { ListWithCards } from "@/lib/types";
import { ListForm } from "./list-form";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
    return (
        <ol className="">
            <ListForm />
            {/* Empty space at the end of x-axis */}
            <div className="" />
        </ol>
    );
};

export default ListContainer;
