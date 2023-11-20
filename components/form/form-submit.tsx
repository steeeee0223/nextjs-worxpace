"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button, ButtonProps } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface FormSubmitProps {
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    variant?: ButtonProps["variant"];
}

export const FormSubmit = ({
    children,
    disabled,
    className,
    variant,
}: FormSubmitProps) => {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending || disabled}
            variant={variant}
            size="sm"
            className={cn(className)}
        >
            {children}
        </Button>
    );
};
