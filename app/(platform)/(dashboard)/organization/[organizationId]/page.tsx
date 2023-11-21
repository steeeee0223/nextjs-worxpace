"use client";

import { Separator } from "@/components/ui";
import { BoardList, Info } from "./_components";

type Params = { params: { organizationId: string } };

const Organization = ({ params: { organizationId } }: Params) => {
    return (
        <div className="w-full mb-20">
            <Info />
            <Separator className="my-4" />
            <div className="px-2 md:px-4">
                <BoardList />
            </div>
        </div>
    );
};

export default Organization;
