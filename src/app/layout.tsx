import { Metadata } from 'next'
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
  title: 'Guidefy - Simplify Your Music Direction',
  description: 'Guidefy helps music directors create and modify song sequences in seconds. Organize setlists efficiently and lead your band with confidence.',
  keywords: 'music director, setlist management, band leadership, worship planning, song organization',
  openGraph: {
    title: 'Guidefy - Simplify Your Music Direction',
    description: 'Create and modify song sequences in seconds. Lead your band with confidence.',
    images: ['/lp-bg.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guidefy - Simplify Your Music Direction',
    description: 'Create and modify song sequences in seconds. Lead your band with confidence.',
    images: ['/lp-bg.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable} ${spaceGrotesk.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
