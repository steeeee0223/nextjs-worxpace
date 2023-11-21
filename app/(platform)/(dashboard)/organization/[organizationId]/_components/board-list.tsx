import Link from "next/link";
import { HelpCircle, User2 } from "lucide-react";

import { fetchBoards } from "@/lib/fetch";
import { Hint, Skeleton } from "@/components/ui";
import { FormPopover } from "@/components/form";
import { cn } from "@/lib/utils";
import { theme } from "@/constants/theme";

interface BoardListProps {
    orgId: string;
}

const BoardList = async ({ orgId }: BoardListProps) => {
    const boards = await fetchBoards(orgId);

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    theme.flex.center,
                    theme.text.neutral,
                    "font-semibold text-lg"
                )}
            >
                <User2 className="h-6 w-6 mr-2" />
                Your Boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map(({ id, title, image }) => (
                    <Link
                        key={id}
                        href={`/board/${id}`}
                        className={cn(
                            theme.size.full,
                            "group relative aspect-video",
                            "bg-no-repeat bg-center bg-cover bg-sky-700",
                            "rounded-sm p-2 overflow-hidden"
                        )}
                        {...(image && {
                            style: {
                                backgroundImage: `url(${image.thumbUrl})`,
                            },
                        })}
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                        <p className="relative font-semibold text-white">
                            {title}
                        </p>
                    </Link>
                ))}
                <FormPopover side="right" sideOffset={10}>
                    <div
                        role="button"
                        className={cn(
                            theme.size.full,
                            theme.flex.center,
                            "aspect-video relative bg-muted rounded-sm flex-col gap-y-1 justify-center hover:opacity-75 transition"
                        )}
                    >
                        <p className="text-sm">Create new board</p>
                        <Hint
                            sideOffset={40}
                            description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
                        >
                            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    );
};

BoardList.Skeleton = function SkeletonBoardList() {
    return (
        <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8)
                .fill(null)
                .map((_, i) => (
                    <Skeleton
                        key={i}
                        className={cn(theme.size.full, "aspect-video p-2")}
                    />
                ))}
        </div>
    );
};

export default BoardList;
