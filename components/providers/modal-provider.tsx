"use client";

import { useEffect, useState } from "react";

import { CardModal } from "@/components/modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted ? (
        <>
            <CardModal />
        </>
    ) : null;
};
