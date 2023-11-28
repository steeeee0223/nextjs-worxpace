import { AuditLog, ENTITY_TYPE } from "@prisma/client";

import { db } from "./config";

export const fetchLogs = async (
    userId: string,
    orgId: string
): Promise<AuditLog[]> =>
    await db.auditLog.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
    });

export const fetchLogsByType = async (
    userId: string,
    orgId: string,
    entityId: string,
    type: ENTITY_TYPE
): Promise<AuditLog[]> =>
    await db.auditLog.findMany({
        where: { orgId, entity: { is: { entityId, type } } },
        orderBy: { createdAt: "desc" },
        take: 3,
    });
