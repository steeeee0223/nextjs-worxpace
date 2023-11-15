import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Steeeee Notion",
    description: "The connected workspace where better, faster work happens",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/notion.svg",
                href: "/notion.svg",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/notion-dark.svg",
                href: "/notion-dark.svg",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="notion-key-2"
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
