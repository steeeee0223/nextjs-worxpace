import { PropsWithChildren } from "react";
import { startCase } from "lodash";
import { auth } from "@clerk/nextjs";

import { Separator } from "@/components/ui";
import { checkSubscription } from "@/lib";

import { Info, OrgControl } from "./_components";

export async function generateMetadata() {
    const { orgSlug } = auth();
    return { title: startCase(orgSlug || "organization") };
}

const ClientIdLayout = async ({ children }: PropsWithChildren) => {
    const isPro = await checkSubscription();

    return (
        <div className="w-full mb-20">
            <OrgControl />
            <Info isPro={isPro} />
            <Separator className="my-4" />
            {children}
        </div>
    );
};

export default ClientIdLayout;
