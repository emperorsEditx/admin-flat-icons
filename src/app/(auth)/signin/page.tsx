import SignInFormWrapper from "@/components/auth/SignInFormWrapper";
import { Metadata } from "next";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInFormWrapper />;
}
