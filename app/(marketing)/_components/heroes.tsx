import Image from "next/image";

import { cn } from "@/lib/utils";
import { theme } from "@/constants/theme";

export default function Heroes() {
    return (
        <div
            className={cn(
                theme.flex.center,
                "flex-col justify-center max-w-5xl"
            )}
        >
            <div className={theme.flex.center}>
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] ">
                    <Image
                        src="/documents.png"
                        fill
                        className="object-contain dark:hidden"
                        alt="Documents"
                    />
                    <Image
                        src="/documents-dark.png"
                        fill
                        className="object-contain hidden dark:block"
                        alt="Documents"
                    />
                </div>
                <div className="relative h-[400px] w-[400px] hidden md:block">
                    <Image
                        src="/reading.png"
                        fill
                        className="object-contain dark:hidden"
                        alt="Reading"
                    />
                    <Image
                        src="/reading-dark.png"
                        fill
                        className="object-contain hidden dark:block"
                        alt="Reading"
                    />
                </div>
            </div>
        </div>
    );
}
