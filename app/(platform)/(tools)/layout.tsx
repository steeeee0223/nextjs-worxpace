import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { Sidebar } from "./_components/sidebar";

const ToolsLayout = ({ children }: PropsWithChildren) => {
    const { userId } = auth();
    if (!userId) redirect("/select-org");

    return (
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto">{children}</main>
        </div>
    );
};

export default ToolsLayout;
