import { Suspense } from "react";

import { Separator } from "@/components/ui";
import { BoardList, Info } from "./_components";

type Params = { params: { organizationId: string } };

const Organization = ({ params: { organizationId } }: Params) => {
    return (
        <div className="w-full mb-20">
            <Info />
            <Separator className="my-4" />
            <div className="px-2 md:px-4">
                <Suspense fallback={<BoardList.Skeleton />}>
                    <BoardList orgId={organizationId} />
                </Suspense>
            </div>
        </div>
    );
};

export default Organization;
