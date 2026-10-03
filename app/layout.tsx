import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAKISTAN CLUB INN HOTEL - Management System",
  description: "Advanced Hotel Management and Front Desk PMS System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

