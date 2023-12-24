import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

const ToolsLayout = ({ children }: PropsWithChildren) => {
    const { userId } = auth();
    if (!userId) redirect("/select-org");

    return <div className="h-full flex dark:bg-[#1F1F1F]">{children}</div>;
};

export default ToolsLayout;
