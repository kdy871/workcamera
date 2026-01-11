'use client';

import { MediaProvider } from '@/lib/MediaStore';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0c" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body>
        <MediaProvider>
          <main className="min-h-screen max-w-md mx-auto relative bg-background shadow-2xl overflow-hidden shadow-black/50">
            {children}
          </main>
        </MediaProvider>
      </body>
    </html>
  );
}
