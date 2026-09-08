import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanstackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: { default: "NoteHub", template: "%s | NoteHub" },
  metadataBase: new URL("https://notehub.com/"),
  description:
    "Capture your thoughts, organize your tasks, and manage your notes in one convenient NoteHub app.",
  openGraph: {
    title: "NoteHub",
    description: "Capture your thoughts, organize your tasks",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub app logo and interface",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <TanstackProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
