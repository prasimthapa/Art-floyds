import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "~/providers/session";
import { ThemeProvider } from "~/providers/theme";
import { Footer } from "~/components/footer";
import { AxiomWebVitals } from "next-axiom";
import { Toaster } from "~/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Art Floyd",
  description: "art; sell; sell art; buy art",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AxiomWebVitals />
      <ThemeProvider attribute="class" defaultTheme="dark">
        <body className={`font-sans ${inter.variable}`}>
          <SessionProvider>
            <TRPCReactProvider>
              <div className="flex flex-col">
                {children}
                <Toaster richColors />
                <Footer />
              </div>
            </TRPCReactProvider>
          </SessionProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
