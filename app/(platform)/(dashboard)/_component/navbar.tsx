import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import Logo from "@/app/(marketing)/_components/logo";
import { Button, ModeToggle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { theme } from "@/theme";
import { MobileSidebar } from ".";

const Navbar = () => {
    return (
        <nav
            className={cn(
                theme.background.navbar,
                theme.flexCenter,
                "fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm"
            )}
        >
            <MobileSidebar />
            <div className={`${theme.flexCenter} gap-x-4`}>
                <div className="hidden md:flex">
                    <Logo />
                </div>
                <Button
                    size="sm"
                    className="rounded-sm hidden md:block h-auto py-1.5 px-2"
                >
                    Create
                </Button>
                <Button size="sm" className="rounded-sm block md:hidden">
                    <Plus className={theme.size.icon} />
                </Button>
            </div>
            <div className={`ml-auto ${theme.flexGap}`}>
                <OrganizationSwitcher
                    // hidePersonal
                    afterSelectPersonalUrl="/personal/:id"
                    afterCreateOrganizationUrl="/organization/:id"
                    afterSelectOrganizationUrl="/organization/:id"
                    afterLeaveOrganizationUrl="/select-org"
                    appearance={{
                        elements: {
                            rootBox: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "ghostwhite",
                                borderRadius: 6,
                            },
                        },
                    }}
                />
                <ModeToggle size="sm" />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: { avatarBox: { height: 30, width: 30 } },
                    }}
                />
            </div>
        </nav>
    );
};

export default Navbar;
