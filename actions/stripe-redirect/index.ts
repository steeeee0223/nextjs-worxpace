"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs";

import { PATH } from "@/constants/site";
import {
    absoluteUrl,
    fetchClient,
    fetchSubscription,
    stripe,
    ActionHandler,
    createSafeAction,
} from "@/lib";
import { StripeRedirect, type StripeRedirectInput } from "./schema";

const handler: ActionHandler<StripeRedirectInput, string> = async (data) => {
    let client;
    let user;
    try {
        client = fetchClient();
        user = await currentUser();
        if (!user) return { error: "Unauthorized" };
    } catch {
        return { error: "Unauthorized" };
    }

    const path = `/${PATH[client.role]}/${client.clientId}`;
    const settingsUrl = absoluteUrl(path);

    let url = "";
    try {
        const subscription = await fetchSubscription(client);

        if (subscription && subscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: subscription.stripeCustomerId,
                return_url: settingsUrl,
            });
            url = stripeSession.url;
        } else {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: user.emailAddresses[0].emailAddress,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "WorXpace Pro",
                                description:
                                    "Unlimited boards for your personal account or organization",
                            },
                            unit_amount: 2000,
                            recurring: { interval: "month" },
                        },
                        quantity: 1,
                    },
                ],
                metadata: client,
            });
            url = stripeSession.url || "";
        }
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong!" };
    }

    revalidatePath(path);
    return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
