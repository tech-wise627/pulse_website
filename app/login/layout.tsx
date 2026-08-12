import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Fostride Pulse",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
