import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createSubscription, stripe, updateSubscription } from "@/lib";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        console.log(`[Webhook] ERROR: ${error}`);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
    );
    if (event.type === "checkout.session.completed") {
        if (!session?.metadata)
            return new NextResponse("Client ID is required", { status: 400 });

        await createSubscription(session, subscription);
    }

    if (event.type === "invoice.payment_succeeded") {
        await updateSubscription(subscription);
    }

    return new NextResponse(null, { status: 200 });
}
