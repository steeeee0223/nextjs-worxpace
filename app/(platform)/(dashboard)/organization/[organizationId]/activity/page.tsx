import { Suspense } from "react";

import { Separator } from "@/components/ui";
import { checkSubscription } from "@/lib";

import { ActivityList, Info } from "../_components";

const ActivityPage = async () => {
    const isPro = await checkSubscription();

    return (
        <div className="w-full">
            <Info isPro={isPro} />
            <Separator className="my-4 w-full" />
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    );
};

export default ActivityPage;
