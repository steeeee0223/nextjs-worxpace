import { PropsWithChildren } from "react";

const PersonalLayout = ({ children }: PropsWithChildren) => {
    return (
        <main className="pt-20 md:pt-20 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
            <div className="flex gap-x-7">{children}</div>
        </main>
    );
};

export default PersonalLayout;
