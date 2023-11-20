import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { theme } from "@/theme";
import Logo from "./logo";

export default function Footer() {
    return (
        <div
            className={cn(
                theme.flex.center,
                theme.background.navbar,
                "w-full p-6 z-50"
            )}
        >
            <Logo />
            <div
                className={cn(
                    theme.flex.gap2,
                    "md:ml-auto w-full justify-between md:justify-end text-muted-foreground"
                )}
            >
                <Button variant="ghost" size="sm">
                    Privacy Policy
                </Button>
                <Button variant="ghost" size="sm">
                    Terms & Conditions
                </Button>
            </div>
        </div>
    );
}
