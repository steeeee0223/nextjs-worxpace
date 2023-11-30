import { notFound } from "next/navigation";
import { OrganizationProfile, UserProfile } from "@clerk/nextjs";

type Params = {
    params: {
        role: string;
        clientId: string;
    };
};

const SettingsPage = ({ params: { role } }: Params) => {
    const props = {
        elements: {
            rootBox: {
                boxShadow: "none",
                width: "100%",
            },
            card: {
                border: "1px solid #e5e5e5",
                boxShadow: "none",
                width: "100%",
            },
        },
    };
    switch (role) {
        case "personal":
            return <UserProfile appearance={props} />;
        case "organization":
            return <OrganizationProfile appearance={props} />;
        default:
            return notFound();
    }
};

export default SettingsPage;
