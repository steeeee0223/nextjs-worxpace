import { Board } from "@prisma/client";

import { theme } from "@/constants/theme";
import { cn } from "@/lib/utils";
import BoardTitleForm from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
    data: Board;
}

export const BoardNavbar = ({ data }: BoardNavbarProps) => {
    return (
        <div
            className={cn(
                theme.flex.gap4,
                "w-full h-14 z-[40]",
                "fixed top-14 px-6",
                "bg-black/50 text-white"
            )}
        >
            <BoardTitleForm data={data} />
            <div className="ml-auto">
                <BoardOptions boardId={data.id} />
            </div>
        </div>
    );
};
