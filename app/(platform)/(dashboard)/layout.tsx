import { PropsWithChildren } from "react";

import { Navbar } from "./_component";

const DashboardLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="h-full">
            <Navbar />
            {children}
        </div>
    );
};

export default DashboardLayout;
