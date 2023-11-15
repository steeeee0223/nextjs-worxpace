"use client";

import { useEffect, useState } from "react";

export const useScrollTop = (threshold: number = 10): boolean => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > threshold);

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrolled;
};
