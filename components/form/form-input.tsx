"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Input, InputProps, Label } from "@/components/ui";
import { theme } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

export interface FormInputProps {
    id: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    defaultValue?: string;
    onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    (
        {
            id,
            label,
            type,
            placeholder,
            required,
            disabled,
            errors,
            className,
            defaultValue,
            onBlur,
        },
        ref
    ) => {
        const { pending } = useFormStatus();
        const inputProps: InputProps = {
            onBlur,
            type,
            defaultValue,
            required,
            id,
            name: id,
            placeholder,
            disabled: pending || disabled,
            className: cn("text-sm px-2 py-1 h-7", className),
            "aria-describedby": `${id}-error`,
        };
        return (
            <div className="space-y-2">
                <div className="space-y-1">
                    {label && (
                        <Label
                            htmlFor={id}
                            className={cn(
                                theme.text.neutral,
                                "text-xs font-semibold"
                            )}
                        >
                            {label}
                        </Label>
                    )}
                    <Input ref={ref} {...inputProps} />
                </div>
                <FormErrors id={id} errors={errors} />
            </div>
        );
    }
);

FormInput.displayName = "FormInput";
