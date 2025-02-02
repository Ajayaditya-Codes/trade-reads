import Nav from "@/components/ui/nav";
import { Provider } from "@/components/ui/provider";
import { ModeToggle } from "@/components/ui/theming/mode-toggle";
import { Toaster } from "@/components/ui/toaster";
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Head from "next/head";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
    return null;
  }

  return (
    <>
      <Head>
        <title>Trade Reads</title>
      </Head>
      <Provider>
        <Toaster />
        <main className="w-full">
          <Nav />
          {children}
        </main>
        <footer className="w-full flex flex-row space-x-5 items-center justify-center md:text-base text-sm p-10 px-0 text-center">
          <p>
            © Trade Reads, 2025. All rights reserved. Developed by Ajayaditya ✨
          </p>
          <ModeToggle />
          <LogoutLink className="border p-1 px-3 rounded-md">Logout</LogoutLink>
        </footer>{" "}
      </Provider>
    </>
  );
}
