"use client";

import Link from "next/link";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import { Accordion, Button, Skeleton } from "@/components/ui";
import { NavItem, Organization } from ".";
import { theme } from "@/theme";

interface SidebarProps {
    storageKey?: string;
}

const Sidebar = ({ storageKey = "x-sidebar-state" }: SidebarProps) => {
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
        storageKey,
        {}
    );
    const { organization: activeOrg, isLoaded: isLoadedOrg } =
        useOrganization();
    const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
        userMemberships: { infinite: true },
    });

    const defaultValues: string[] = Object.keys(expanded).reduce<string[]>(
        (acc, key) => {
            if (expanded[key]) acc.push(key);
            return acc;
        },
        []
    );

    const onExpand = (id: string) =>
        setExpanded((curr) => ({ ...curr, [id]: !expanded[id] }));

    if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (
            <>
                <div className={`${theme.flexCenter} justify-between mb-2`}>
                    <Skeleton className="h-10 w-[50%]" />
                    <Skeleton className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <NavItem.Skleton />
                    <NavItem.Skleton />
                    <NavItem.Skleton />
                </div>
            </>
        );
    }

    return (
        <>
            <div className={`${theme.flexCenter} font-medium text-xs mb-1`}>
                <span className="pl-4">Workspaces</span>
                <Button
                    asChild
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                >
                    <Link href="/select-org">
                        <Plus className={theme.size.icon} />
                    </Link>
                </Button>
            </div>
            <Accordion
                type="multiple"
                defaultValue={defaultValues}
                className="space-y-2"
            >
                {userMemberships.data.map(({ organization }) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrg?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        organization={organization as Organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    );
};

export default Sidebar;
