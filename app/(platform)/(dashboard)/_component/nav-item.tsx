"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Skeleton,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { theme } from "@/theme";

export type Organization = {
    id: string;
    slug: string;
    imageUrl: string;
    name: string;
};

interface NavItemProps {
    isExpanded: boolean;
    isActive: boolean;
    organization: Organization;
    onExpand: (id: string) => void;
}

const getRoutes = (id: string) => {
    const iconStyle = "h-4 w-4 mr-2";
    return [
        {
            label: "Boards",
            icon: <Layout className={iconStyle} />,
            href: `/organization/${id}`,
        },
        {
            label: "Activity",
            icon: <Activity className={iconStyle} />,
            href: `/organization/${id}/activity`,
        },
        {
            label: "Settings",
            icon: <Settings className={iconStyle} />,
            href: `/organization/${id}/settings`,
        },
        {
            label: "Billing",
            icon: <CreditCard className={iconStyle} />,
            href: `/organization/${id}/billing`,
        },
    ];
};

const NavItem = ({
    isExpanded,
    isActive,
    organization,
    onExpand,
}: NavItemProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const { id, imageUrl, name, slug } = organization;
    const routes = getRoutes(id);

    const onClick = (href: string) => router.push(href);

    return (
        <AccordionItem value={id} className="border-none">
            <AccordionTrigger
                onClick={() => onExpand(id)}
                className={cn(
                    theme.flexGap,
                    theme.textColor,
                    "p-1.5 rounded-md hover:bg-neutral-400/10 transition text-start no-underline hover:no-underline",
                    isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
                )}
            >
                <div className={theme.flexGap}>
                    <div className="w-7 h-7 relative">
                        <Image
                            fill
                            src={imageUrl}
                            alt="Organization"
                            className="rounded-sm object-cover"
                        />
                    </div>
                    <span className="font-medium text-sm">{name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1">
                {routes.map(({ href, icon, label }) => (
                    <Button
                        key={href}
                        size="sm"
                        onClick={() => onClick(href)}
                        className={cn(
                            theme.background.none,
                            theme.textColor,
                            "w-full font-normal justify-start pl-10 mb-1",
                            "hover:bg-neutral-400/10",
                            pathname === href && "bg-sky-500/10 text-sky-700"
                        )}
                    >
                        {icon}
                        {label}
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    );
};

NavItem.Skleton = function SkeletonNavItem() {
    return (
        <div className={theme.flexGap}>
            <div className="w-10 h-10 relative shrink-0">
                <Skeleton className="h-full w-full absolute" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
};

export default NavItem;
