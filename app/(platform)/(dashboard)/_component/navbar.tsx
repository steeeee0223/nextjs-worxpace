import Logo from "@/app/(marketing)/_components/logo";
import { Button } from "@/components/ui";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-background dark:bg-[#1F1F1F] flex items-center">
            {/** @todo modile sidebar */}
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                    <Logo />
                </div>
                <Button
                    size="sm"
                    className="rounded-sm hidden md:block h-auto py-1.5 px-2"
                >
                    Create
                </Button>
                <Button size="sm" className="rounded-sm hidden md:hidden">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
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
