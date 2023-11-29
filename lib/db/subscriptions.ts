import { Subscription } from "@prisma/client";
import Stripe from "stripe";

import { fetchClient } from "@/lib/utils";
import { Client } from "@/lib/types";
import { db } from "./config";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async (): Promise<boolean> => {
    const client = fetchClient();
    const subscription = await db.subscription.findUnique({
        where: client,
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });
    if (!subscription) return false;

    const { stripePriceId, stripeCurrentPeriodEnd } = subscription;
    const isValid =
        stripePriceId &&
        stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();
    return !!isValid;
};

export const fetchSubscription = async (
    client: Client
): Promise<Subscription | null> =>
    await db.subscription.findUnique({ where: client });

export const createSubscription = async (
    session: Stripe.Checkout.Session,
    stripeSubscription: Stripe.Response<Stripe.Subscription>
): Promise<Subscription> => {
    const client = session?.metadata! as Client;
    return await db.subscription.create({
        data: {
            ...client,
            stripeSubscriptionId: stripeSubscription.id,
            stripeCustomerId: stripeSubscription.customer as string,
            stripePriceId: stripeSubscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                stripeSubscription.current_period_end * 1000
            ),
        },
    });
};

export const updateSubscription = async (
    stripeSubscription: Stripe.Response<Stripe.Subscription>
): Promise<Subscription> =>
    await db.subscription.update({
        where: {
            stripeSubscriptionId: stripeSubscription.id,
        },
        data: {
            stripePriceId: stripeSubscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                stripeSubscription.current_period_end * 1000
            ),
        },
    });
