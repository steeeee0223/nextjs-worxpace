import { Suspense } from "react";

import { Separator } from "@/components/ui";
import { ActivityList, Info } from "../_components";

const ActivityPage = () => {
    return (
        <div className="w-full">
            <Info />
            <Separator className="my-4 w-full" />
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    );
};

export default ActivityPage;
