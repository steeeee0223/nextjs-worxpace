import { createApi } from "unsplash-js";

export const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
    fetch,
});

export type UnsplashImage = Record<string, any>;
export const fetchImages = async () => {
    const result = await unsplash.photos.getRandom({
        collectionIds: ["317099"],
        count: 9,
    });

    return result && result.response
        ? { data: result.response as UnsplashImage[] }
        : { error: "Failed to get images from Unsplash!" };
};
