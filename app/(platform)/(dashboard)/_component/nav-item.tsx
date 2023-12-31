"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Book, CreditCard, Layout, Settings } from "lucide-react";

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Skeleton,
} from "@/components/ui";
import { theme } from "@/constants/theme";
import { Client as _Client, cn } from "@/lib";

export type Client = {
    role: _Client["role"];
    id: string;
    name: string;
    imageUrl: string;
    slug?: string | null;
};

interface NavItemProps {
    isExpanded: boolean;
    isActive: boolean;
    client: Client;
    onExpand: (id: string) => void;
}

const getRoutes = ({ role, clientId: id }: _Client) => {
    const iconStyle = cn(theme.size.icon, "mr-2");
    const path = role === "USER" ? "personal" : "organization";
    return [
        {
            label: "Documents",
            icon: <Book className={iconStyle} />,
            href: `/documents/`,
        },
        {
            label: "Boards",
            icon: <Layout className={iconStyle} />,
            href: `/${path}/${id}`,
        },
        {
            label: "Activity",
            icon: <Activity className={iconStyle} />,
            href: `/${path}/${id}/activity`,
        },
        {
            label: "Settings",
            icon: <Settings className={iconStyle} />,
            href: `/${path}/${id}/settings`,
        },
        {
            label: "Billing",
            icon: <CreditCard className={iconStyle} />,
            href: `/${path}/${id}/billing`,
        },
    ];
};

const NavItem = ({ isExpanded, isActive, client, onExpand }: NavItemProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const { role, id, imageUrl, name, slug } = client;
    const routes = getRoutes({ role, clientId: id });

    const onClick = (href: string) => router.push(href);

    return (
        <AccordionItem value={id} className="border-none">
            <AccordionTrigger
                onClick={() => onExpand(id)}
                className={cn(
                    theme.flex.gap2,
                    "text-secondary-foreground",
                    "p-1.5 rounded-md hover:bg-neutral-400/10 transition text-start no-underline hover:no-underline",
                    isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
                )}
            >
                <div className={theme.flex.gap2}>
                    <div className="w-7 h-7 relative">
                        <Image
                            fill
                            src={imageUrl}
                            alt="Role"
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
                            "text-secondary-foreground",
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
        <div className={theme.flex.gap2}>
            <div className="w-10 h-10 relative shrink-0">
                <Skeleton className={`${theme.size.full} absolute`} />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    );
};

export default NavItem;
