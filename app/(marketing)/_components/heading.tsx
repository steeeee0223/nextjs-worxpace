"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui";
import { theme } from "@/constants/theme";

const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas , Documents, & Plans. Unified. Welcome to{" "}
                <span className="underline">Steeeee WorXpace</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Steeeee WorXpace is the connected workspace where <br />
                better, faster work happens.
            </h3>
            <Button>
                Get Started <ArrowRight className={`${theme.size.icon} ml-2`} />
            </Button>
        </div>
    );
};

export default Heading;
