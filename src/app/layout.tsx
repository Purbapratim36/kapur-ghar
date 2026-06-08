import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kapur Ghar | Traditional Assamese Mekhela Sador & Ethnic Fashion",
    template: "%s | Kapur Ghar",
  },
  description:
    "Discover authentic Assamese Mekhela Sador, Muga Silk, Pat Silk, Eri Silk, and handloom ethnic wear. Premium traditional fashion from Assam, handcrafted with love.",
  keywords: [
    "Mekhela Sador",
    "Assamese traditional wear",
    "Muga Silk",
    "Pat Silk",
    "Eri Silk",
    "Assamese handloom",
    "ethnic wear",
    "wedding collection",
    "bridal mekhela sador",
    "Kapur Ghar",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Kapur Ghar",
    title: "Kapur Ghar | Traditional Assamese Mekhela Sador & Ethnic Fashion",
    description:
      "Discover authentic Assamese Mekhela Sador, Muga Silk, Pat Silk, Eri Silk, and handloom ethnic wear.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kapur Ghar | Traditional Assamese Ethnic Fashion",
    description: "Premium Assamese Mekhela Sador & handloom ethnic wear.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#FFF8E7",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}
