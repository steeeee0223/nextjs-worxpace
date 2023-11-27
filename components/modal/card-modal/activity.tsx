"use client";

import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";

import { ActivityItem, Skeleton } from "@/components/ui";
import { theme } from "@/constants/theme";
import { cn } from "@/lib";

interface ActivityProps {
    data: AuditLog[];
}

export const Activity = ({ data }: ActivityProps) => {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <ActivityIcon className="h-5 w-5 mt-0.5 text-secondary-foreground" />
            <div className="w-full">
                <p className="font-semibold text-secondary-foreground mb-2">
                    Activity
                </p>
                <ol className="mt-2 space-y-4">
                    {data.map((item) => (
                        <ActivityItem key={item.id} data={item} />
                    ))}
                </ol>
            </div>
        </div>
    );
};

Activity.Skeleton = function ActivitySkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className={cn("h-6 w-6", theme.bg.textArea)} />
            <div className="w-full">
                <Skeleton className={cn("w-24 h-6 mb-2", theme.bg.textArea)} />
                <Skeleton className={cn("w-full h-10", theme.bg.textArea)} />
            </div>
        </div>
    );
};
