"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button, Sheet, SheetContent } from "@/components/ui";
import { useMobileSidebar } from "@/hooks";
import { Sidebar } from ".";

const MobileSidebar = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const { isOpen, onOpen, onClose } = useMobileSidebar((state) => state);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        onClose();
    }, [pathname, isMounted]);

    return (
        <>
            <Button
                onClick={onOpen}
                variant="ghost"
                size="sm"
                className="block md:hidden mr-2"
            >
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="p-2 pt-10">
                    <Sidebar storageKey="x-sidebar-mobile-state" />
                </SheetContent>
            </Sheet>
        </>
    );
};

export default MobileSidebar;
