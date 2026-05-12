import React from 'react';
import { 
  Banknote, 
  Receipt, 
  Star, 
  AlertTriangle,
  PlusCircle,
  PackagePlus,
  FileText
} from 'lucide-react';

export function Dashboard({ onNavigate }) {
  const stats = [
    { label: "Today's Sales", value: "KES 142,500", icon: Banknote, color: "#00A86B" },
    { label: "Total Transactions", value: "84", icon: Receipt, color: "#3B82F6" },
    { label: "Top Selling", value: "Blue Band 500g", icon: Star, color: "#F59E0B" },
    { label: "Low Stock Alerts", value: "12", icon: AlertTriangle, color: "#DC2626" },
  ];

  const recentSales = [
    { id: '1024', time: '10:24 AM', amount: 'KES 1,200', method: 'M-Pesa' },
    { id: '1023', time: '10:15 AM', amount: 'KES 450', method: 'Cash' },
    { id: '1022', time: '09:58 AM', amount: 'KES 3,800', method: 'Credit' },
    { id: '1021', time: '09:42 AM', amount: 'KES 150', method: 'Cash' },
    { id: '1020', time: '09:30 AM', amount: 'KES 2,100', method: 'M-Pesa' },
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <div className="chart-container card">
          <div className="card-header">
            <h3>Sales Performance</h3>
            <span className="subtitle">Last 7 Days (Hourly)</span>
          </div>
          <div className="dummy-chart">
            {/* Simple visual representation of a bar chart */}
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="chart-bar-wrapper">
                <div className="chart-bar" style={{ height: `${h}%` }}></div>
                <span className="bar-label">D{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="transactions-container card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="transaction-list">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="transaction-item">
                  <div className="t-info">
                    <span className="t-id">#{sale.id}</span>
                    <span className="t-time">{sale.time}</span>
                  </div>
                  <div className="t-method">{sale.method}</div>
                  <div className="t-amount">{sale.amount}</div>
                </div>
              ))
            ) : (
              <div className="empty-transactions">
                <p>No transactions yet today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="action-btn" onClick={() => onNavigate('sale')}>
          <PlusCircle size={24} />
          <span>New Sale</span>
        </button>
        <button className="action-btn" onClick={() => onNavigate('inventory')}>
          <PackagePlus size={24} />
          <span>Add Product</span>
        </button>
        <button className="action-btn" onClick={() => onNavigate('reports')}>
          <FileText size={24} />
          <span>View Reports</span>
        </button>
      </div>

      <style jsx="true">{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-3);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: var(--spacing-3);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .dashboard-row {
          display: grid;
          grid-template-columns: 60% 40%;
          gap: var(--spacing-3);
          height: 380px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-3);
        }

        .subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .dummy-chart {
          height: 260px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: var(--spacing-2) var(--spacing-4);
          background: #fcfcfc;
          border-radius: 8px;
        }

        .chart-bar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .chart-bar {
          width: 32px;
          background: var(--accent);
          border-radius: 4px 4px 0 0;
          min-height: 20px;
          transition: height 0.5s ease;
        }

        .bar-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .transaction-list {
          display: flex;
          flex-direction: column;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .t-info {
          display: flex;
          flex-direction: column;
        }

        .t-id {
          font-weight: 700;
          font-size: 0.875rem;
        }

        .t-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .t-method {
          font-size: 0.75rem;
          background: var(--background);
          padding: 2px 8px;
          border-radius: 99px;
          font-weight: 600;
        }

        .t-amount {
          font-weight: 700;
          color: var(--primary);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-3);
        }

        .empty-transactions {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          background: var(--background);
          border-radius: 8px;
          border: 1px dashed var(--border);
        }

        .action-btn {
          height: 64px;
          background: white;
          border: 2px solid var(--border);
          border-radius: var(--radius-card);
          color: var(--primary);
          font-size: 1.125rem;
          font-weight: 700;
          gap: var(--spacing-2);
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(0, 168, 107, 0.02);
        }
      `}</style>
    </div>
  );
}
