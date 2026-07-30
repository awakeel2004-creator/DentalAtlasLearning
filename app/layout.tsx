import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dental School Atlas",
  description:
    "An interactive dental anatomy, skeletal anatomy, histology, and pathology learning atlas.",
  icons: {
    icon: `${process.env.PAGES_BASE_PATH ?? ""}/favicon.svg`,
    shortcut: `${process.env.PAGES_BASE_PATH ?? ""}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
