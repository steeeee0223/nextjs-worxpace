"use client";

import { useEffect, useState } from "react";

import { CardModal, ProModal } from "@/components/modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted ? (
        <>
            <CardModal />
            <ProModal />
        </>
    ) : null;
};
