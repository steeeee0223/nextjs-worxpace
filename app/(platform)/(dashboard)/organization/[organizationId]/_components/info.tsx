"use client";

import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { theme } from "@/constants/theme";
import { Skeleton } from "@/components/ui";

const Info = () => {
    const { organization, isLoaded } = useOrganization();

    return isLoaded ? (
        <div className={theme.flex.gap4}>
            <div className="w-[60px] h-[60px] relative">
                <Image
                    fill
                    src={organization?.imageUrl!}
                    alt="Organization"
                    className="rounded-md object-cover"
                />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">{organization?.name}</p>
                <div
                    className={`${theme.flex.center} text-xs text-muted-foreground`}
                >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Free
                </div>
            </div>
        </div>
    ) : (
        <Info.Skeleton />
    );
};

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className={theme.flex.gap4}>
            <div className="w-[60px] h-[60px] relative">
                <Skeleton className={`${theme.size.full} absolute`} />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-[200px]" />
                <div className={theme.flex.center}>
                    <Skeleton className={`${theme.size.icon} mr-2`} />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
        </div>
    );
};

export default Info;
