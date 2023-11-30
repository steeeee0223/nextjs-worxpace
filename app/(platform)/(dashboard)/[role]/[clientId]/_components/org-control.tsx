"use client";

import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

const OrgControl = () => {
    const params = useParams();
    const { setActive } = useOrganizationList();

    if (params.role !== "personal" && params.role !== "organization")
        redirect("/select-org");

    useEffect(() => {
        if (!setActive) return;
        if (params.role === "organization")
            setActive({ organization: params.clientId as string });
    }, [setActive, params.clientId, params.role]);

    return null;
};

export default OrgControl;
