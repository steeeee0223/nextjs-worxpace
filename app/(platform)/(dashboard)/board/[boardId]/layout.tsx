import { PropsWithChildren } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { fetchBoardById } from "@/lib";
import { BoardNavbar } from "./_components/board-navbar";

type Params = { params: { boardId: string } };
type BoardLayoutProps = PropsWithChildren<Params>;

export async function generateMetadata({ params: { boardId } }: Params) {
    const { orgId } = auth();
    if (!orgId) return { title: "Board" };

    const board = await fetchBoardById(orgId, boardId);
    return { title: board?.title || "Board" };
}

const BoardLayout = async ({
    children,
    params: { boardId },
}: BoardLayoutProps) => {
    const { orgId } = auth();
    if (!orgId) redirect("/select-org");

    const board = await fetchBoardById(orgId, boardId);
    if (!board) notFound();

    return (
        <div
            className="relative h-full"
            {...(board.image && {
                style: {
                    backgroundImage: `url(${board.image.fullUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                },
            })}
        >
            <BoardNavbar data={board} />

            {/* Make background darker */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Children */}
            <main className="relative pt-28 h-full">{children}</main>
        </div>
    );
};

export default BoardLayout;
