import type { Metadata } from "next";
import { Inter, Montserrat, Space_Grotesk } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ['latin'] })
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space'
})

export const metadata: Metadata = {
  title: "Guidefy",
  description: "Unlock the full power of Music Direction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable} ${spaceGrotesk.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
