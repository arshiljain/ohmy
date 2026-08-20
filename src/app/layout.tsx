import type { Metadata } from "next";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dune Rise — Creative Technology Studio",
  description:
    "Dune Rise builds distinctive brands, digital experiences, websites, and creative technology for ambitious ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-nav-theme="dark"
      data-nav-bg="transparent"
      data-nav-style="default"
      data-sidebar-theme="dark"
      data-title-theme="dark"
    >
      <head>
        <link
          rel="stylesheet"
          href="/assets/fonts/fonts-latin.css"
        />
        <link rel="stylesheet" href="/assets/shopify-source.css" />
      </head>
      <body className="place-items-end">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
