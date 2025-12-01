import './globals.css';
import Link from 'next/link';
import React from 'react';
import Providers from './providers';

export const metadata = {
  title: 'Lekya Logistics',
  description: 'Delivery Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="stack">
            <span style={{ fontWeight: 700 }}>Lekya Logistics</span>
            <span className="pill info">Demo</span>
          </div>
          <div className="stack">
            <Link className="link" href="/">Home</Link>
            <Link className="link" href="/admin">Admin</Link>
            <Link className="link" href="/driver">Driver</Link>
          </div>
        </nav>
        <div className="container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}

