"use client";

import { PropsWithChildren } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useOrganization, useUser } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { Skeleton } from "@/components/ui";
import { theme } from "@/constants/theme";

interface InfoProps extends PropsWithChildren {
    isPro: boolean;
}

interface InfoContent {
    isLoaded: boolean;
    name: string;
    imageUrl: string;
}

const Info = ({ isPro }: InfoProps) => {
    let content: InfoContent;
    const params = useParams();
    const { user, isLoaded: isUserLoaded } = useUser();
    const { organization, isLoaded: isOrgLoaded } = useOrganization();

    switch (params.role) {
        case "personal":
            content = {
                isLoaded: isUserLoaded,
                name: `${user?.firstName} ${user?.lastName}`,
                imageUrl: user?.imageUrl!,
            };
            break;
        case "organization":
            content = {
                isLoaded: isOrgLoaded,
                name: organization?.name!,
                imageUrl: organization?.imageUrl!,
            };
            break;
        default:
            content = {} as never;
            break;
    }

    return content.isLoaded ? (
        <div className={theme.flex.gap4}>
            <div className="w-[60px] h-[60px] relative">
                <Image
                    fill
                    src={content.imageUrl}
                    alt="Organization"
                    className="rounded-md object-cover"
                />
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-xl">{content.name}</p>
                <div
                    className={`${theme.flex.center} text-xs text-muted-foreground`}
                >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {isPro ? "Pro" : "Free"}
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
