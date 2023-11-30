import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, AuditLog, Entity, ROLE } from "@prisma/client";

import { db } from "@/lib";

export const createAuditLog = async (entity: Entity, action: ACTION) => {
    try {
        const { orgId } = auth();
        const user = await currentUser();
        if (!user) throw new Error("User not found!");

        await db.auditLog.create({
            data: {
                entity,
                action,
                orgId: orgId ?? undefined,
                role: orgId ? ROLE.ORG : ROLE.USER,
                user: {
                    userId: user.id,
                    image: user.imageUrl,
                    name: `${user.firstName} ${user.lastName}`,
                },
            },
        });
    } catch (error) {
        console.log(`[AUDIT] Error, ${error}`);
    }
};

export const generateLogMessage = (log: AuditLog): string => {
    const {
        action,
        entity: { title, type },
    } = log;
    switch (action) {
        case ACTION.CREATE:
            return `created ${type.toLowerCase()} "${title}"`;
        case ACTION.UPDATE:
            return `updated ${type.toLowerCase()} "${title}"`;
        case ACTION.DELETE:
            return `deleted ${type.toLowerCase()} "${title}"`;
        default:
            return `unknown action ${type.toLowerCase()} "${title}"`;
    }
};
