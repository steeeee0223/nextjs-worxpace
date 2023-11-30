import { PropsWithChildren } from "react";
import { startCase } from "lodash";
import { auth } from "@clerk/nextjs";

import { Separator } from "@/components/ui";
import { checkSubscription } from "@/lib";

import { Info, Control } from "./_components";

export async function generateMetadata() {
    const { orgSlug } = auth();
    return { title: startCase(orgSlug || "organization") };
}

const ClientIdLayout = async ({ children }: PropsWithChildren) => {
    const isPro = await checkSubscription();

    return (
        <div className="w-full mb-20">
            <Control />
            <Info isPro={isPro} />
            <Separator className="my-4" />
            {children}
        </div>
    );
};

export default ClientIdLayout;
