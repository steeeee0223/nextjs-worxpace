import { Suspense } from "react";

import { BoardList } from "./_components";

type Params = { params: { role: string; clientId: string } };

const Client = ({ params: { clientId } }: Params) => {
    return (
        <div className="px-2 md:px-4">
            <Suspense fallback={<BoardList.Skeleton />}>
                <BoardList clientId={clientId} />
            </Suspense>
        </div>
    );
};

export default Client;
