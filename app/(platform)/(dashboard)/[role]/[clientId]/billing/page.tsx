import { checkSubscription } from "@/lib";

import { SubscriptionButton } from "../_components";

const BillingPage = async () => {
    const isPro = await checkSubscription();

    return <SubscriptionButton isPro={isPro} />;
};

export default BillingPage;
