import { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { ModalProvider, QueryProvider } from "@/components/providers";

export default function PlatformLayout({ children }: PropsWithChildren) {
    return (
        <ClerkProvider>
            <QueryProvider>
                <Toaster />
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    );
}
