// app/layout.jsx

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// שים לב: אין טיפוסי TypeScript בקובץ הזה. כל הפרופס מוכנסים כמו ב־JSX טהור.
export const metadata = {
  title: "AACOS",
  description: "Advanced Consciousness Operating System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
    <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
    >
    {children}
    </body>
    </html>
  );
}
