import type React from "react";
import type { Metadata } from "next";
import { Cormorant, Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/toaster";
import { MainLayout } from "@/components/main-layout";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HIT - Admin Dashboard",
  description: "A comprehensive eCommerce admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${quicksand.variable}`} suppressHydrationWarning >
      <body className="font-quicksand antialiased">
        <script src="https://js.paystack.co/v1/inline.js" async></script>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <CartProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </CartProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
