import { Suspense } from "react";

import { ActivityList } from "../_components";

const ActivityPage = () => {
    return (
        <Suspense fallback={<ActivityList.Skeleton />}>
            <ActivityList />
        </Suspense>
    );
};

export default ActivityPage;
