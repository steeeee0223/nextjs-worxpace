import { PropsWithChildren } from "react";

import { Sidebar } from "../_component";

const RoleLayout = ({ children }: PropsWithChildren) => {
    return (
        <main className="pt-20 md:pt-20 px-4 w-full 2xl:max-w-screen-xl">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block">
                    <Sidebar />
                </div>
                {children}
            </div>
        </main>
    );
};

export default RoleLayout;
