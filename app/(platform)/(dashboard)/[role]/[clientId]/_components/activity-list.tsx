import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { ActivityItem, Skeleton } from "@/components/ui";
import { fetchLogs } from "@/lib";

const ActivityList = async () => {
    const { userId, orgId } = auth();
    if (!userId && !orgId) redirect("/select-org");

    const logs = await fetchLogs(userId, orgId);

    return (
        <ol className="space-y-4 mt-4">
            <p className="hidden last:block text-xs text-center text-muted-foreground">
                No activity found inside this organization
            </p>
            {logs.map((log) => (
                <ActivityItem key={log.id} data={log} />
            ))}
        </ol>
    );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
    return (
        <ol className="space-y-4 mt-4">
            {Array.from([80, 50, 70, 80, 75]).map((val, i) => (
                <Skeleton key={i} className={`w-[${val}%] h-14`} />
            ))}
        </ol>
    );
};

export default ActivityList;
