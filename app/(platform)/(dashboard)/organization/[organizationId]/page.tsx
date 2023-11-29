import { Suspense } from "react";

import { BoardList } from "./_components";

type Params = { params: { organizationId: string } };

const Organization = ({ params: { organizationId } }: Params) => {
    return (
        <div className="px-2 md:px-4">
            <Suspense fallback={<BoardList.Skeleton />}>
                <BoardList orgId={organizationId} />
            </Suspense>
        </div>
    );
};

export default Organization;
