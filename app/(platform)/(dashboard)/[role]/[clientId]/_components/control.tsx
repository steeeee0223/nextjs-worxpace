"use client";

import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

const Control = () => {
    const params = useParams();
    const { setActive } = useOrganizationList();

    if (params.role !== "personal" && params.role !== "organization")
        redirect("/select-org");

    useEffect(() => {
        if (!setActive) return;

        const organization =
            params.role === "organization" ? (params.clientId as string) : null;
        setActive({ organization });
    }, [setActive, params.clientId, params.role]);

    return null;
};

export default Control;
