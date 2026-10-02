import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Atkinson_Hyperlegible_Mono, Young_Serif } from "next/font/google";
import { site } from "@/site";
import { sceneTimeScript } from "@/scene/bali-time";
import { themeScript } from "@/theme/theme";
import "./globals.css";
import "./scene.css";

// Atkinson Hyperlegible was designed by the Braille Institute for low-vision
// readers: distinct letterforms (Il1, O0) make it calm and clear for UI text.
// The original cut (not "Next") ships fallback metrics, so the fallback font
// takes up the same space and nothing shifts if the web font arrives late.
const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  // "optional": if the font isn't there within ~100ms, keep the metric-matched
  // fallback for this visit instead of re-painting text late (it's cached next time).
  display: "optional",
});

// Headings: a soft, slightly old-fashioned serif. Warm without being cute.
const display = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-young-serif",
  display: "optional",
});

// Numbers and the rental slip, set like a printed receipt. Same family as
// the body text, so it reads as one voice. Below the fold on phones, so it
// isn't preloaded and stays off the critical path.
const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-atkinson-mono",
  display: "optional",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.shortName}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf0ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1615" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script sets data-theme before React hydrates.
    <html
      lang="en"
      data-theme="light"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme and Bali time of day, applied before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript + sceneTimeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to the designer
        </a>
        {children}
      </body>
    </html>
  );
}
