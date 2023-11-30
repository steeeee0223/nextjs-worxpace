import { AuditLog, ENTITY_TYPE, ROLE } from "@prisma/client";

import { db } from "./config";

export const fetchLogs = async (
    userId: string,
    orgId?: string
): Promise<AuditLog[]> => {
    const role = orgId ? ROLE.ORG : ROLE.USER;
    return await db.auditLog.findMany({
        where: { role, orgId, user: { is: { userId } } },
        orderBy: { createdAt: "desc" },
    });
};

export const fetchLogsByType = async (
    userId: string,
    entityId: string,
    type: ENTITY_TYPE,
    orgId?: string
): Promise<AuditLog[]> => {
    const role = orgId ? ROLE.ORG : ROLE.USER;
    return await db.auditLog.findMany({
        where: {
            role,
            orgId,
            user: { is: { userId } },
            entity: { is: { entityId, type } },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
    });
};
