import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Apsarah — Premium Indian Wear",
  description: "Contemporary Indian fashion shaped by heritage, craftsmanship and effortless elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-full flex flex-col bg-[#fffaf5] text-[#2b1713]`}
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <WishlistProvider>
                <SiteShell>{children}</SiteShell>
              </WishlistProvider>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
