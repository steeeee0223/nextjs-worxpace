import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import Logo from "@/app/(marketing)/_components/logo";
import { Button, ModeToggle } from "@/components/ui";
import { FormPopover } from "@/components/form";
import { theme } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { MobileSidebar } from ".";

const Navbar = () => {
    return (
        <nav
            className={cn(
                theme.background.navbar,
                theme.flex.center,
                "fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm"
            )}
        >
            <MobileSidebar />
            <div className={theme.flex.gap4}>
                <div className="hidden md:flex">
                    <Logo />
                </div>
                <FormPopover align="start" side="bottom" sideOffset={18}>
                    <Button
                        size="sm"
                        className="rounded-sm hidden md:block h-auto py-1.5 px-2"
                    >
                        Create
                    </Button>
                </FormPopover>
                <FormPopover>
                    <Button size="sm" className="rounded-sm block md:hidden">
                        <Plus className={theme.size.icon} />
                    </Button>
                </FormPopover>
            </div>
            <div className={cn(theme.flex.gap2, "ml-auto")}>
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
