import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
