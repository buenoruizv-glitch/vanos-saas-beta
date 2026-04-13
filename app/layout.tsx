import type { Metadata } from "next";
import { TrpcProvider } from "@/components/providers/trpc-provider";
import { getMetadataBase } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "VanOS",
    template: "%s · VanOS",
  },
  description: "Plataforma para empresas de alquiler de autocaravanas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="font-sans">
      <body className="min-h-screen antialiased">
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}
