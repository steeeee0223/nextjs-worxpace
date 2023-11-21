"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { defaultImages } from "@/constants/images";
import { useFetch } from "@/hooks";
import { UnsplashImage, fetchImages } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { theme } from "@/theme";
import { FormErrors } from ".";

export interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
    const { pending } = useFormStatus();

    const [images, setImages] = useState<UnsplashImage[]>(defaultImages);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const { isLoading } = useFetch<UnsplashImage[]>(fetchImages, {
        onSuccess: (data) => setImages(data),
        onError: () => setImages(defaultImages),
    });

    return isLoading ? (
        <div className={cn(theme.flex.center, "p-6 justify-center")}>
            <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
        </div>
    ) : (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                            pending && "opacity-50 hover:opacity-50 cursor-auto"
                        )}
                        onClick={() => {
                            if (pending) return;
                            setSelectedImageId(image.id);
                        }}
                    >
                        <input
                            type="radio"
                            id={id}
                            name={id}
                            className="hidden"
                            checked={selectedImageId === image.id}
                            readOnly
                            disabled={pending}
                            value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                        />
                        <Image
                            src={image.urls.thumb}
                            alt="Unsplash image"
                            className="object-cover rounded-sm"
                            fill
                        />
                        {selectedImageId === image.id && (
                            <div
                                className={cn(
                                    theme.size.full,
                                    theme.flex.center,
                                    "absolute inset-y-0 bg-black/30 justify-center"
                                )}
                            >
                                <Check
                                    className={cn(
                                        theme.size.icon,
                                        "text-white"
                                    )}
                                />
                            </div>
                        )}
                        <Link
                            href={image.links.html}
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                        >
                            {image.user.name}
                        </Link>
                    </div>
                ))}
            </div>
            <FormErrors id="image" errors={errors} />
        </div>
    );
};
