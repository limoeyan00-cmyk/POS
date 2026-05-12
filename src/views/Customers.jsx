import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus,
  History,
  Phone,
  Mail,
  Wallet
} from 'lucide-react';
import { db } from '../services/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');

  const customers = useLiveQuery(
    () => db.customers?.where('name').startsWithIgnoreCase(searchQuery).toArray() || [],
    [searchQuery]
  ) || [];

  // Dummy data if DB is empty for demo
  const displayCustomers = customers.length > 0 ? customers : [
    { id: 1, name: 'John Kamau', phone: '0712345678', email: 'john@example.com', totalSpent: 45000, credit: 2500 },
    { id: 2, name: 'Mary Atieno', phone: '0722000111', email: 'mary@test.co.ke', totalSpent: 12000, credit: 0 },
    { id: 3, name: 'Peter Njoroge', phone: '0733444555', email: 'peter@njoro.com', totalSpent: 8500, credit: 1200 },
  ];

  return (
    <div className="customers-view">
      <div className="view-header">
        <div className="header-title">
          <h1>Customer Management</h1>
          <p>Maintain relationships and track customer credit</p>
        </div>
        <button className="primary-btn">
          <UserPlus size={20} />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="filter-bar card">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th className="num">Total Purchases (KES)</th>
              <th className="num">Credit Balance (KES)</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayCustomers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="p-cell">
                    <span className="p-name">{c.name}</span>
                    <span className="p-sku">ID: CUST-{c.id}</span>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <div className="contact-item"><Phone size={12} /> {c.phone}</div>
                    <div className="contact-item"><Mail size={12} /> {c.email}</div>
                  </div>
                </td>
                <td className="num font-bold">{c.totalSpent?.toLocaleString()}</td>
                <td className="num">
                  <div className="credit-cell">
                    {c.credit > 0 ? (
                      <span className="badge-credit warning">
                        <Wallet size={12} />
                        KES {c.credit.toLocaleString()}
                      </span>
                    ) : (
                      <span className="badge-credit grey">KES 0</span>
                    )}
                  </div>
                </td>
                <td className="actions">
                  <div className="action-buttons">
                    <button className="icon-btn edit"><History size={16} /></button>
                    <button className="icon-btn edit"><Edit2 size={16} /></button>
                    <button className="icon-btn delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx="true">{`
        .customers-view {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .header-title h1 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .header-title p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .filter-bar {
          padding: var(--spacing-2) var(--spacing-3);
        }

        .search-input {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 500px;
        }

        .search-input input {
          width: 100%;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.9375rem;
        }

        .table-container { padding: 0; }
        
        .inventory-table {
          width: 100%;
          border-collapse: collapse;
        }

        .inventory-table th {
          text-align: left;
          background: #f8fafc;
          padding: 14px 20px;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .inventory-table td {
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
          height: var(--row-height);
        }

        .num { text-align: right; }
        .font-bold { font-weight: 700; }

        .p-cell { display: flex; flex-direction: column; }
        .p-name { font-weight: 700; color: var(--primary); }
        .p-sku { font-size: 0.75rem; color: var(--text-secondary); }

        .contact-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .credit-cell {
          display: flex;
          justify-content: flex-end;
        }

        .badge-credit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.8125rem;
          font-weight: 700;
        }

        .badge-credit.warning {
          background: #fffbeb;
          color: var(--warning);
          border: 1px solid #fde68a;
        }

        .badge-credit.grey {
          background: var(--background);
          color: var(--text-secondary);
        }

        .actions { width: 140px; }
        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: white;
          color: var(--text-secondary);
        }

        .icon-btn:hover { background: var(--background); color: var(--accent); }
        .icon-btn.delete:hover { color: var(--danger); border-color: var(--danger); }
      `}</style>
    </div>
  );
}
