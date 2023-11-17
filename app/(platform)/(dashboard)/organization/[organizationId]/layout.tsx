import { PropsWithChildren } from "react";

import OrgControl from "./_components/org-control";

const OrganizationIdLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="">
            <OrgControl />
            {children}
        </div>
    );
};

export default OrganizationIdLayout;
