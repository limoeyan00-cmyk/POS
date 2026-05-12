import React from 'react';
import { X, Printer, ShoppingCart } from 'lucide-react';

export function ReceiptPanel({ isOpen, onClose, saleData }) {
  if (!isOpen) return null;

  return (
    <div className="receipt-overlay">
      <div className="receipt-panel card">
        <div className="panel-header">
          <h3>Transaction Complete</h3>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="receipt-scroll">
          <div className="receipt-thermal">
            <div className="receipt-header">
              <h2 className="biz-name">POS GUESTHOUSE</h2>
              <p>Mombasa Road, Nairobi</p>
              <p>Tel: +254 700 000 000</p>
              <div className="divider"></div>
              <p className="receipt-meta">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Time: {new Date().toLocaleTimeString()}</span>
              </p>
              <p className="receipt-meta">
                <span>Receipt #: {Math.floor(Math.random() * 90000) + 10000}</span>
                <span>Cashier: Admin</span>
              </p>
              <div className="divider"></div>
            </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="qty">Qty</th>
                  <th className="amt">Total</th>
                </tr>
              </thead>
              <tbody>
                {saleData?.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className="qty">{item.quantity}</td>
                    <td className="amt">{(item.sellingPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="divider"></div>
            
            <div className="receipt-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>KES {saleData?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Discount</span>
                <span>- KES {saleData?.discount?.toLocaleString() || 0}</span>
              </div>
              <div className="total-row grand-total">
                <span>TOTAL</span>
                <span>KES {saleData?.total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="receipt-footer">
              <p>Payment: {saleData?.paymentMethod?.toUpperCase()}</p>
              {saleData?.changeDue > 0 && <p>Change: KES {saleData.changeDue.toLocaleString()}</p>}
              <div className="thank-you">
                <p>Thank you for your business!</p>
                <p>Please come again</p>
              </div>
              <div className="barcode-placeholder">|||| || ||||| || |||</div>
            </div>
          </div>
        </div>

        <div className="panel-actions">
          <button className="primary-btn print-btn">
            <Printer size={20} />
            <span>Print Receipt</span>
          </button>
          <button className="secondary-btn new-sale-btn" onClick={onClose}>
            <ShoppingCart size={20} />
            <span>New Sale</span>
          </button>
          <button className="text-btn reprint-link">Reprint Last Receipt</button>
        </div>
      </div>

      <style jsx="true">{`
        .receipt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 37, 64, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-end;
          z-index: 1000;
        }

        .receipt-panel {
          width: 440px;
          height: 100vh;
          border-radius: 0;
          display: flex;
          flex-direction: column;
          padding: 0;
          animation: slideIn 0.3s cubic-bezier(0, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .panel-header {
          padding: var(--spacing-3);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .receipt-scroll {
          flex: 1;
          overflow-y: auto;
          background: #f8fafc;
          padding: var(--spacing-4);
          display: flex;
          justify-content: center;
        }

        .receipt-thermal {
          width: 320px;
          background: white;
          padding: var(--spacing-3);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.875rem;
          color: black;
          height: fit-content;
        }

        .biz-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 1.125rem;
          margin-bottom: 4px;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: var(--spacing-2);
        }

        .receipt-header p {
          margin: 0;
          font-size: 0.75rem;
        }

        .divider {
          border-top: 1px dashed #ccc;
          margin: 12px 0;
        }

        .receipt-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
        }

        .receipt-table th {
          text-align: left;
          font-size: 0.75rem;
          padding-bottom: 8px;
        }

        .receipt-table td {
          padding: 4px 0;
          vertical-align: top;
        }

        .qty { text-align: center; width: 40px; }
        .amt { text-align: right; width: 80px; }

        .receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
        }

        .grand-total {
          font-weight: 900;
          font-size: 1.125rem;
          margin-top: 4px;
        }

        .receipt-footer {
          text-align: center;
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .thank-you {
          margin: 16px 0;
          font-weight: 700;
        }

        .barcode-placeholder {
          font-size: 1.25rem;
          letter-spacing: 2px;
          opacity: 0.3;
        }

        .panel-actions {
          padding: var(--spacing-3);
          border-top: 1px solid var(--border);
          background: white;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .print-btn { width: 100%; }
        .new-sale-btn { width: 100%; height: var(--btn-height-primary); font-size: 1rem; }
        
        .reprint-link {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
