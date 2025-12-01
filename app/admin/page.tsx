'use client';
import React, { useMemo, useState } from 'react';
import { useAppState } from '@/lib/state';
import DriversMap from '@/components/Map';

export default function AdminPage() {
  const { drivers, orders, cashSubmissions, assignOrder, approveCash } = useAppState();
  const [filterDriver, setFilterDriver] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => (filterDriver === 'all' ? true : o.assignedDriverId === filterDriver));
  }, [orders, filterDriver]);

  return (
    <main className="row">
      <section className="col card">
        <h3 className="section-title">Assignments</h3>
        <div className="stack" style={{ marginBottom: 8 }}>
          <select className="select" value={filterDriver} onChange={(e) => setFilterDriver(e.target.value)}>
            <option value="all">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id}>
                <td>
                  <div><strong>{o.reference}</strong></div>
                  <div className="muted">Barcode: {o.barcode}</div>
                </td>
                <td>{o.customerName}</td>
                <td>{o.address}</td>
                <td>
                  <span className="pill info">{o.status}</span>
                </td>
                <td>
                  <select
                    className="select"
                    value={o.assignedDriverId ?? ''}
                    onChange={(e) => assignOrder(o.id, e.target.value)}
                  >
                    <option value="" disabled>Select driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="col card">
        <h3 className="section-title">Live Map</h3>
        <p className="muted">Real-time locations of active drivers.</p>
        <DriversMap />
      </section>

      <section className="col card">
        <h3 className="section-title">Cash Collection Approvals</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cashSubmissions.length === 0 && (
              <tr><td colSpan={4} className="muted">No submissions yet.</td></tr>
            )}
            {cashSubmissions.map((c) => {
              const d = drivers.find((x) => x.id === c.driverId);
              return (
                <tr key={c.id}>
                  <td>{d?.name ?? c.driverId}</td>
                  <td>{c.amount.toLocaleString()} MMK</td>
                  <td>{new Date(c.date).toLocaleString()}</td>
                  <td>
                    {c.approved ? (
                      <span className="pill success">Approved</span>
                    ) : (
                      <button className="btn success" onClick={() => approveCash(c.id)}>Approve</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="col card">
        <h3 className="section-title">Driver Balances</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Phone</th>
              <th>Active</th>
              <th>Cash On Hand</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td className="muted">{d.phone}</td>
                <td>{d.active ? <span className="pill success">Active</span> : <span className="pill warn">Inactive</span>}</td>
                <td>{d.cashOnHand.toLocaleString()} MMK</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

