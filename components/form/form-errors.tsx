import { XCircle } from "lucide-react";

import { theme } from "@/constants/theme";
import { cn } from "@/lib/utils";

export interface FormErrorProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
}

export const FormErrors = ({ id, errors }: FormErrorProps) => {
    if (!errors) return null;
    return (
        <div
            className="mt-2 text-xs text-rose-500"
            aria-live="polite"
            id={`${id}-error`}
        >
            {errors?.[id]?.map((error) => (
                <div
                    key={error}
                    className={cn(
                        theme.flex.center,
                        "font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm"
                    )}
                >
                    <XCircle className={cn(theme.size.icon, "mr-2")} />
                    {error}
                </div>
            ))}
        </div>
    );
};
