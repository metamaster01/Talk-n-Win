// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/FloatingWhatsapp";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talk&Win App - Boost your Personality & Communication Skills",
  description:
    "Join Talk&Win to enhance your communication skills, build confidence, and unlock new opportunities. Start your journey today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* You can safely keep any <meta />, <link />, etc. here if needed in the future */}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.className} ${poppins.className} antialiased`}
      >
        <Navigation />
        {children}
        <Analytics />
        <Footer />

        <Script
          id="meta-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1195819672486156');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Noscript fallback – critical for users with JS disabled & for SEO/completeness */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1195819672486156&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        
        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
