import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MusicProvider } from "@/components/music-provider";
import { AppShell } from "@/components/app-shell";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: { default: "Melody | موسیقی، همیشه همراه تو", template: "%s | Melody" },
  description: "Melody؛ دنیای موسیقی به سبک تو. آهنگ‌ها، هنرمندان، پلی‌لیست‌ها و کشف هوشمند موسیقی در یک تجربهٔ تازه.",
  applicationName: "Melody",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Melody" },
  icons: { icon: [{ url: `${basePath}/icons/icon.svg`, type: "image/svg+xml" }, { url: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" }], apple: `${basePath}/icons/icon-192.png` },
  openGraph: { title: "Melody | موسیقی، همیشه همراه تو", description: "موسیقی مناسب حال امروزت رو پیدا کن.", images: [`${basePath}/images/hero-melody.jpg`], type: "website", locale: "fa_IR" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#080b17" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="fa" dir="rtl"><body data-base-path={basePath}><MusicProvider><AppShell>{children}</AppShell></MusicProvider></body></html>;
}
