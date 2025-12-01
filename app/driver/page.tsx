'use client';
import React, { useMemo, useState } from 'react';
import { useAppState } from '@/lib/state';
import Scanner from '@/components/Scanner';

function StatusButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="btn" disabled={disabled} onClick={onClick} style={{ marginRight: 8 }}>
      {label}
    </button>
  );
}

export default function DriverPage() {
  const { drivers, orders, updateOrderStatus, submitCash } = useAppState();
  const [driverId, setDriverId] = useState<string>(drivers[0]?.id ?? 'd1');
  const [lastScan, setLastScan] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const driver = useMemo(() => drivers.find((d) => d.id === driverId), [drivers, driverId]);

  const myOrders = useMemo(() => orders.filter((o) => o.assignedDriverId === driverId), [orders, driverId]);

  const handleScan = (code: string) => {
    setLastScan(code);
  };

  const totalCOD = myOrders.filter((o) => o.cod && o.status === 'DELIVERED').reduce((sum, o) => sum + o.amountDue, 0);

  return (
    <main className="row">
      <section className="col card">
        <h3 className="section-title">My Profile</h3>
        <div className="stack" style={{ marginBottom: 8 }}>
          <select className="select" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <span className="pill info">Cash: {driver?.cashOnHand.toLocaleString()} MMK</span>
        </div>
      </section>

      <section className="col card">
        <h3 className="section-title">Scanner</h3>
        <p className="muted">Scan parcel barcode to pick up or deliver.</p>
        <Scanner onDetected={handleScan} />
        {lastScan ? <div className="muted" style={{ marginTop: 8 }}>Detected: {lastScan}</div> : null}
      </section>

      <section className="col card">
        <h3 className="section-title">My Tasks</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>COD</th>
              <th>Workflow</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.length === 0 && <tr><td colSpan={4} className="muted">No orders assigned yet.</td></tr>}
            {myOrders.map((o) => (
              <tr key={o.id}>
                <td>
                  <div><strong>{o.reference}</strong></div>
                  <div className="muted">Barcode: {o.barcode}</div>
                  <div className="muted">OTP: {o.otp}</div>
                </td>
                <td>
                  <div>{o.customerName}</div>
                  <div className="muted">{o.address}</div>
                </td>
                <td>{o.cod ? <span className="pill warn">{o.amountDue.toLocaleString()} MMK</span> : 'No'}</td>
                <td>
                  <div className="stack">
                    <StatusButton
                      label="Accept"
                      disabled={o.status !== 'NEW'}
                      onClick={() => updateOrderStatus(o.id, 'ACCEPTED')}
                    />
                    <StatusButton
                      label="Picked Up"
                      disabled={!(o.status === 'ACCEPTED' && lastScan === o.barcode)}
                      onClick={() => updateOrderStatus(o.id, 'PICKED_UP')}
                    />
                    <StatusButton
                      label="In Transit"
                      disabled={o.status !== 'PICKED_UP'}
                      onClick={() => updateOrderStatus(o.id, 'IN_TRANSIT')}
                    />
                    <input
                      className="input"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ width: 100 }}
                    />
                    <StatusButton
                      label="Delivered"
                      disabled={!(o.status === 'IN_TRANSIT' && otp === o.otp)}
                      onClick={() => updateOrderStatus(o.id, 'DELIVERED')}
                    />
                    <StatusButton
                      label="Returned"
                      disabled={!(o.status === 'IN_TRANSIT')}
                      onClick={() => updateOrderStatus(o.id, 'RETURNED')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="col card">
        <h3 className="section-title">Cash Submission</h3>
        <p className="muted">Delivered COD Total: {totalCOD.toLocaleString()} MMK</p>
        <button
          className="btn success"
          disabled={totalCOD <= 0}
          onClick={() => submitCash(driverId, totalCOD)}
        >
          Submit Cash
        </button>
      </section>
    </main>
  );
}

