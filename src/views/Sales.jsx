import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Banknote,
  Smartphone,
  CreditCard,
  ScanLine,
  RefreshCcw,
  Percent,
  Tag,
  FilePlus,
  Edit,
  XCircle,
  PauseCircle,
  PlayCircle,
  CheckCircle
} from 'lucide-react';
import { db } from '../services/db';
import { CameraScanner } from '../components/CameraScanner';

export function Sales({ onComplete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, mpesa, card
  const [amountReceived, setAmountReceived] = useState('');
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [flashCart, setFlashCart] = useState(false);
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  // Input Row State
  const [inputState, setInputState] = useState({
    description: '',
    price: '',
    qty: 1,
    discAmt: 0,
    tax: 0
  });

  const handleBarcodeScan = async (barcode) => {
    if (!barcode.trim()) return;
    const product = await db.products.where('barcode').equals(barcode).first() 
      || await db.products.where('sku').equals(barcode).first();
    
    if (product) {
      addToCart(product);
      setSearchQuery('');
    } else {
      showToast('Product not found — please add it in settings');
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Attempt barcode match first
    const product = await db.products.where('barcode').equals(searchQuery).first() 
      || await db.products.where('sku').equals(searchQuery).first();
      
    if (product) {
      addToCart(product);
      setSearchQuery('');
      return;
    }

    // Try name match
    const byName = await db.products.where('name').startsWithIgnoreCase(searchQuery).first();
    if (byName) {
      addToCart(byName);
      setSearchQuery('');
    } else {
      showToast('Product not found.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime.current > 50) {
        barcodeBuffer.current = '';
      }
      
      lastKeyTime.current = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length > 2) {
          handleBarcodeScan(barcodeBuffer.current);
          barcodeBuffer.current = '';
        }
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    
    setFlashCart(true);
    setTimeout(() => setFlashCart(false), 300);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0), [cart]);
  const discount = 0; 
  const total = subtotal - discount;
  const changeDue = amountReceived ? parseFloat(amountReceived) - total : 0;

  return (
    <div className="navi-sales-screen">
      {/* Top Toolbar */}
      <div className="toolbar card">
        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => setIsScannerOpen(true)}>
            <ScanLine size={18} />
            <span>Search with barcode</span>
          </button>
          <button className="toolbar-btn" onClick={() => setCart([])}>
            <RefreshCcw size={18} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button className="toolbar-btn"><Percent size={18} /><span>Use % discount</span></button>
          <button className="toolbar-btn"><Tag size={18} /><span>Use Special Price</span></button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button className="toolbar-btn text-primary"><FilePlus size={18} /><span>Add</span></button>
          <button className="toolbar-btn text-warning"><Edit size={18} /><span>Edit</span></button>
          <button className="toolbar-btn text-danger" onClick={() => setCart([])}><XCircle size={18} /><span>Void</span></button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button className="toolbar-btn text-warning"><PauseCircle size={18} /><span>Hold</span></button>
          <button className="toolbar-btn text-success"><PlayCircle size={18} /><span>Recall</span></button>
        </div>
        <div className="toolbar-divider" />
        <div className="toolbar-group">
          <button 
            className="toolbar-btn text-accent action-complete"
            disabled={cart.length === 0}
            onClick={() => onComplete({
              items: cart,
              subtotal,
              discount,
              total,
              paymentMethod,
              amountReceived: parseFloat(amountReceived) || total,
              changeDue
            })}
          >
            <CheckCircle size={18} />
            <span>Complete transaction</span>
          </button>
        </div>
      </div>

      {/* Input Row */}
      <div className="input-row card">
        <form className="inline-form" onSubmit={handleSearchSubmit}>
          <div className="input-group">
            <label>Search:</label>
            <input 
              type="text" 
              placeholder="Barcode or Name" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="input-group flex-grow">
            <label>Description:</label>
            <input type="text" readOnly value={inputState.description} />
          </div>
          <div className="input-group narrow">
            <label>Price:</label>
            <input type="text" readOnly value={inputState.price} />
          </div>
          <div className="input-group narrow">
            <label>Qty:</label>
            <input type="number" value={inputState.qty} onChange={(e) => setInputState({...inputState, qty: parseInt(e.target.value) || 1})} />
          </div>
          <div className="input-group narrow">
            <label>Disc Amt:</label>
            <input type="text" readOnly value={inputState.discAmt} />
          </div>
          <div className="input-group narrow">
            <label>Tax:</label>
            <input type="text" readOnly value={inputState.tax} />
          </div>
          <div className="input-group subtotal-display">
            <label>Sub Total:</label>
            <span className="subtotal-val">0.00</span>
          </div>
          <div className="logo-placeholder">
            {/* Developer Logo goes here */}
            <div className="empty-logo-box"></div>
          </div>
          <button type="submit" style={{ display: 'none' }}>Submit</button>
        </form>
      </div>

      {/* Data Table */}
      <div className={`data-table-container card ${flashCart ? 'flash-success' : ''}`}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ItemCode</th>
              <th>Description</th>
              <th className="right-align">Price</th>
              <th className="center-align">Qty</th>
              <th className="right-align">Discount</th>
              <th className="right-align">Tax</th>
              <th className="right-align">SubTotal</th>
              <th className="center-align">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.barcode || item.sku || item.id}</td>
                <td className="font-bold">{item.name}</td>
                <td className="right-align">{item.sellingPrice?.toLocaleString()}</td>
                <td className="center-align">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                  </div>
                </td>
                <td className="right-align">0.00</td>
                <td className="right-align">0.00</td>
                <td className="right-align font-bold">{(item.sellingPrice * item.quantity).toLocaleString()}</td>
                <td className="center-align">
                  <button className="icon-btn text-danger" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-table-msg">
                  No items in cart. Scan a barcode or search to add items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar card">
        <div className="net-total">
          <span className="net-label">Net Total:</span>
          <span className="net-value">{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <CameraScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleBarcodeScan} 
      />

      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <style jsx="true">{`
        .navi-sales-screen {
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: calc(100vh - var(--header-height) - (var(--spacing-3) * 2));
          overflow: hidden;
          background: #f1f5f9;
        }

        .card {
          background: white;
          border-radius: 8px;
          border: 1px solid var(--border);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          gap: 12px;
          overflow-x: auto;
          flex-shrink: 0;
        }

        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: var(--border);
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toolbar-btn:hover:not(:disabled) {
          background: var(--background);
          color: var(--primary);
        }

        .toolbar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .text-primary { color: var(--primary) !important; }
        .text-warning { color: #d97706 !important; }
        .text-danger { color: var(--danger) !important; }
        .text-success { color: var(--accent) !important; }
        .text-accent { color: var(--accent) !important; }

        .action-complete {
          background: rgba(0, 168, 107, 0.1);
          border: 1px solid rgba(0, 168, 107, 0.2);
        }

        .action-complete:hover:not(:disabled) {
          background: rgba(0, 168, 107, 0.2);
        }

        /* Input Row */
        .input-row {
          padding: 12px;
          flex-shrink: 0;
        }

        .inline-form {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .input-group input {
          height: 36px;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0 10px;
          font-family: inherit;
          font-size: 0.875rem;
          outline: none;
        }

        .input-group input:focus {
          border-color: var(--accent);
        }

        .input-group input[readOnly] {
          background: #f8fafc;
          color: var(--text-secondary);
        }

        .flex-grow { flex: 1; }
        .narrow input { width: 80px; text-align: right; }

        .subtotal-display {
          min-width: 100px;
          align-items: flex-end;
        }

        .subtotal-val {
          font-size: 1.125rem;
          font-weight: 800;
          color: #6366f1;
          height: 36px;
          display: flex;
          align-items: center;
        }

        .logo-placeholder {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 56px;
        }

        .empty-logo-box {
          width: 120px;
          height: 36px;
          border: 1px dashed #cbd5e1;
          border-radius: 4px;
          background: rgba(248, 250, 252, 0.5);
        }

        /* Data Table */
        .data-table-container {
          flex: 1;
          overflow: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .data-table th {
          position: sticky;
          top: 0;
          background: #e2e8f0;
          padding: 6px 12px;
          text-align: left;
          font-weight: 700;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-bottom: 2px solid #94a3b8;
          z-index: 10;
        }

        .data-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .data-table tr:hover {
          background: #f8fafc;
        }

        .right-align { text-align: right !important; }
        .center-align { text-align: center !important; }
        .font-bold { font-weight: 700; color: var(--primary); }

        .qty-controls {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          background: white;
        }

        .qty-controls button {
          padding: 4px 6px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .qty-controls button:hover {
          background: var(--background);
        }

        .qty-controls span {
          width: 24px;
          text-align: center;
          font-weight: 600;
        }

        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .icon-btn:hover { background: var(--background); }

        .empty-table-msg {
          text-align: center;
          padding: 40px !important;
          color: var(--text-secondary);
          font-style: italic;
        }

        /* Bottom Bar */
        .bottom-bar {
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          background: white;
        }

        .net-total {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .net-label {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .net-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--danger); /* Red like in NaviPOS image */
        }

        .flash-success {
          animation: flashGreen 0.3s ease-out;
        }

        @keyframes flashGreen {
          0% { box-shadow: inset 0 0 0 2px var(--accent); background: rgba(0, 168, 107, 0.05); }
          100% { box-shadow: none; background: white; }
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9375rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 2000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
