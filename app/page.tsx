'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="grid">
      <section className="card">
        <h3 className="section-title">Manager Dashboard</h3>
        <p className="muted">Assign orders, track drivers in real-time, and approve cash collection.</p>
        <div className="stack" style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={() => router.push('/admin')}>Open Admin</button>
        </div>
      </section>
      <section className="card">
        <h3 className="section-title">Driver App (Web)</h3>
        <p className="muted">View assigned tasks, scan barcodes, update delivery status, and submit cash.</p>
        <div className="stack" style={{ marginTop: 12 }}>
          <button className="btn success" onClick={() => router.push('/driver')}>Open Driver</button>
        </div>
      </section>
      <section className="card">
        <h3 className="section-title">About This Demo</h3>
        <ul>
          <li>Simulated orders, drivers, and live locations</li>
          <li>Local-only state; no external services required</li>
          <li>Scan using camera via Web APIs</li>
        </ul>
      </section>
    </main>
  );
}

