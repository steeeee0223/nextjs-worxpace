"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import { Accordion, Button, Separator, Skeleton } from "@/components/ui";
import { theme } from "@/constants/theme";
import { cn } from "@/lib";
import NavItem  from "./nav-item";

interface SidebarProps {
    storageKey?: string;
}

const Container = ({ children }: PropsWithChildren) => (
    <div
        className={cn(
            theme.flex.center,
            "text-muted-foreground font-medium text-xs px-1 py-2"
        )}
    >
        {children}
    </div>
);

const Sidebar = ({ storageKey = "x-sidebar-state" }: SidebarProps) => {
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
        storageKey,
        {}
    );

    const { user } = useUser();
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

    if (
        !isLoadedOrg ||
        !isLoadedOrgList ||
        userMemberships.isLoading ||
        !user
    ) {
        return (
            <>
                <div className={`${theme.flex.center} justify-between mb-2`}>
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
            <Container>
                <span>Workspaces</span>
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
            </Container>
            <Separator className="w-full my-2" />
            <Accordion
                type="multiple"
                defaultValue={defaultValues}
                className="space-y-2"
            >
                <Container>
                    <span>Personal</span>
                </Container>
                <NavItem
                    key={user.id}
                    isActive={!activeOrg}
                    isExpanded={expanded[user.id]}
                    client={{
                        role: "USER",
                        id: user.id,
                        name: `${user.firstName} ${user.lastName}`,
                        imageUrl: user.imageUrl,
                    }}
                    onExpand={onExpand}
                />
                <Separator className="w-full my-2" />
                <Container>
                    <span>Organizations</span>
                </Container>
                {userMemberships.data.map(({ organization }) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrg?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        client={{ ...organization, role: "ORG" }}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    );
};

export default Sidebar;
