import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Tashrif } from "tashrif/react";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s · ${SITE_NAME}`,
    },
    applicationName: SITE_NAME,
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Tashrif clientId={process.env.TASHRIF_CLIENT_ID} />
                {children}
            </body>
        </html>
    );
}
