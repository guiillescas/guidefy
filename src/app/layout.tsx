import { Metadata } from 'next'
import { Inter, Montserrat, Space_Grotesk } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Script from 'next/script';

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
      <head />
      <body className={`${inter.className} ${montserrat.variable} ${spaceGrotesk.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </AuthProvider>
      </body>
    </html>
  );
}
