import { ROLE } from "@prisma/client";

export const siteConfig = {
    name: "WorXpace",
    description: "The connected workspace where better, faster work happens",
};

export const PATH: Record<ROLE, string> = {
    USER: "personal",
    ORG: "organization",
};
