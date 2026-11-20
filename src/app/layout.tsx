import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getConfig } from "@/platform/config";
import { SITE_NAME, SITE_TAGLINE } from "@/ui/site";
import "@fontsource-variable/instrument-sans/index.css";
import "./globals.css";

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(getConfig().NEXT_PUBLIC_SITE_URL),
    title: {
      default: `${SITE_NAME} — vetted drivers for your own car`,
      template: `%s · ${SITE_NAME}`,
    },
    description: SITE_TAGLINE,
    openGraph: { siteName: SITE_NAME, locale: "en_NG", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#f6efe4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-NG">
      <body>{children}</body>
    </html>
  );
}
