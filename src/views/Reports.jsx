import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function Reports() {
  const [reportType, setReportType] = useState('Daily');

  const summaries = [
    { label: 'Total Revenue', value: 'KES 842,000', change: '+12.5%', isUp: true },
    { label: 'Net Profit', value: 'KES 214,500', change: '+8.2%', isUp: true },
    { label: 'Average Order', value: 'KES 2,450', change: '-2.4%', isUp: false },
    { label: 'New Customers', value: '142', change: '+18.0%', isUp: true },
  ];

  return (
    <div className="reports-view">
      <div className="filter-bar card">
        <div className="filter-left">
          <div className="filter-group">
            <Calendar size={16} />
            <input type="date" defaultValue="2026-05-12" />
            <span>to</span>
            <input type="date" defaultValue="2026-05-12" />
          </div>
          <div className="filter-group">
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option>Daily Report</option>
              <option>Weekly Report</option>
              <option>Monthly Report</option>
              <option>By Product</option>
              <option>Profit Margin</option>
            </select>
          </div>
        </div>
        <div className="filter-right">
          <button className="secondary-btn"><Download size={18} /> CSV</button>
          <button className="primary-btn"><Download size={18} /> Export PDF</button>
        </div>
      </div>

      <div className="reports-grid">
        {summaries.map((s, i) => (
          <div key={i} className="stat-card card">
            <span className="stat-label">{s.label}</span>
            <div className="stat-main">
              <span className="stat-value">{s.value}</span>
              <div className={`stat-change ${s.isUp ? 'up' : 'down'}`}>
                {s.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{s.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="report-details">
        <div className="chart-panel card">
          <div className="panel-header">
            <h3>Sales Trends</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot revenue"></span> Revenue</span>
              <span className="legend-item"><span className="dot profit"></span> Profit</span>
            </div>
          </div>
          <div className="dummy-line-chart">
            {/* Visual representation of a trend chart */}
            <svg viewBox="0 0 600 200" className="trend-svg">
              <path d="M0,150 Q75,130 150,140 T300,100 T450,120 T600,60" fill="none" stroke="var(--accent)" strokeWidth="3" />
              <path d="M0,170 Q75,160 150,165 T300,140 T450,155 T600,130" fill="none" stroke="#3B82F6" strokeWidth="3" />
            </svg>
            <div className="chart-x-axis">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="table-panel card">
          <div className="panel-header">
            <h3>Top Products</h3>
          </div>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="num">Qty</th>
                <th className="num">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Blue Band 500g', qty: 142, rev: '17,040' },
                { name: 'Sugar 1kg', qty: 98, rev: '15,680' },
                { name: 'Cooking Oil 2L', qty: 45, rev: '24,750' },
                { name: 'Wheat Flour 2kg', qty: 86, rev: '16,340' },
                { name: 'Milk 500ml', qty: 210, rev: '12,600' },
              ].map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td className="num">{p.qty}</td>
                  <td className="num font-bold">{p.rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx="true">{`
        .reports-view {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px var(--spacing-3);
        }

        .filter-left, .filter-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--background);
          padding: 0 12px;
          border-radius: 8px;
          height: 44px;
          border: 1px solid var(--border);
        }

        .filter-group input, .filter-group select {
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--primary);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-3);
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-main {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 0.8125rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .stat-change.up { color: var(--success); background: #f0fdf4; }
        .stat-change.down { color: var(--danger); background: #fef2f2; }

        .report-details {
          display: grid;
          grid-template-columns: 60% 40%;
          gap: var(--spacing-3);
          height: 400px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-3);
        }

        .chart-legend {
          display: flex;
          gap: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .dot { width: 10px; height: 10px; border-radius: 2px; }
        .dot.revenue { background: var(--accent); }
        .dot.profit { background: #3B82F6; }

        .dummy-line-chart {
          height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .trend-svg {
          width: 100%;
          height: 200px;
        }

        .chart-x-axis {
          display: flex;
          justify-content: space-between;
          padding: 12px 0 0;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .mini-table {
          width: 100%;
          border-collapse: collapse;
        }

        .mini-table th {
          text-align: left;
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding-bottom: 8px;
          border-bottom: 2px solid var(--background);
        }

        .mini-table td {
          padding: 10px 0;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--background);
        }

        .num { text-align: right; }
        .font-bold { font-weight: 700; color: var(--primary); }
      `}</style>
    </div>
  );
}
