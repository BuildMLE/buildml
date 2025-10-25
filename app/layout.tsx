import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "BuildML - Build Custom ML Models in Minutes",
  description: "Create lightweight, custom ML models tailored to your specific business needs automatically.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:rgb(147,51,234);stop-opacity:1' /><stop offset='100%' style='stop-color:rgb(59,130,246);stop-opacity:1' /></linearGradient></defs><rect width='100' height='100' rx='15' fill='url(%23grad)'/><path d='M50 25 L55 35 L65 35 L57 42 L60 52 L50 45 L40 52 L43 42 L35 35 L45 35 Z M30 60 L32 65 L37 65 L33 68 L35 73 L30 70 L25 73 L27 68 L23 65 L28 65 Z M70 55 L72 60 L77 60 L73 63 L75 68 L70 65 L65 68 L67 63 L63 60 L68 60 Z M50 70 L52 75 L57 75 L53 78 L55 83 L50 80 L45 83 L47 78 L43 75 L48 75 Z' fill='white'/></svg>",
        type: "image/svg+xml",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
