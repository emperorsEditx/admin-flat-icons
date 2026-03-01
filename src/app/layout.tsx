"use client";

import { Outfit } from 'next/font/google';
import './globals.css';
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@iamqitmeer/toster';
import '@iamqitmeer/toster/dist/styles.css';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <SessionProvider>
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <Toaster
                position="top-right"
                theme="system"
              />
            </SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
