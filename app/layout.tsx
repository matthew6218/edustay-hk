import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduStay HK — Find your place in Hong Kong",
  description: "Explore student homes, understand your fit and connect with housing providers. A fictional marketplace demo.",
  robots: {index:false,follow:false},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
