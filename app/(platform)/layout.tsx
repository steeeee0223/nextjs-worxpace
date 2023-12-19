import { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ModalProvider, QueryProvider } from "@/components/providers";
import { EdgeStoreProvider } from "@/hooks";

export default function PlatformLayout({ children }: PropsWithChildren) {
    return (
        <ClerkProvider>
            <EdgeStoreProvider>
                <QueryProvider>
                    <Toaster />
                    <ModalProvider />
                    {children}
                </QueryProvider>
            </EdgeStoreProvider>
        </ClerkProvider>
    );
}
