import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { fetchLists } from "@/lib/fetch";
import ListContainer from "./_components/list-container";

type Params = {
    params: { boardId: string };
};

const BoardPage = async ({ params: { boardId } }: Params) => {
    const { orgId } = auth();
    if (!orgId) redirect("/select-org");

    const lists = await fetchLists(orgId, boardId);

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer boardId={boardId} data={lists} />
        </div>
    );
};

export default BoardPage;
