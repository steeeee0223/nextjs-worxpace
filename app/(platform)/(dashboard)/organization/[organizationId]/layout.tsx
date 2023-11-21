import { PropsWithChildren } from "react";
import { startCase } from "lodash";
import { auth } from "@clerk/nextjs";

import { OrgControl } from "./_components";

export async function generateMetadata() {
    const { orgSlug } = auth();
    return { title: startCase(orgSlug || "organization") };
}

const OrganizationIdLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="">
            <OrgControl />
            {children}
        </div>
    );
};

export default OrganizationIdLayout;
