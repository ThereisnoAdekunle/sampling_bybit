import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bybit - Login",
  description: "Login to your Bybit account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 