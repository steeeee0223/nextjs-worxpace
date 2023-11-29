import { Separator } from "@/components/ui/";
import { checkSubscription } from "@/lib";

import { Info, SubscriptionButton } from "../_components";

const BillingPage = async () => {
    const isPro = await checkSubscription();

    return (
        <div className="w-full">
            <Info isPro={isPro} />
            <Separator className="my-4" />
            <SubscriptionButton isPro={isPro} />
        </div>
    );
};

export default BillingPage;
