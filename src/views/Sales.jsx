import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Banknote,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { db } from '../services/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function Sales({ onComplete }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, mpesa, card
  const [amountReceived, setAmountReceived] = useState('');

  const products = useLiveQuery(
    () => db.products.where('name').startsWithIgnoreCase(searchQuery).toArray(),
    [searchQuery]
  ) || [];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
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
  const discount = 0; // Future feature
  const total = subtotal - discount;
  const changeDue = amountReceived ? parseFloat(amountReceived) - total : 0;

  return (
    <div className="sales-screen">
      {/* Left Panel: Product Selection */}
      <div className="product-selection">
        <div className="search-bar card">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name or scan barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <button key={p.id} className="product-card card" onClick={() => addToCart(p)}>
              <div className="p-image">
                {p.name.charAt(0)}
              </div>
              <div className="p-details">
                <span className="p-name">{p.name}</span>
                <span className="p-price">KES {p.sellingPrice?.toLocaleString()}</span>
                <span className={`p-stock ${p.stockQuantity <= (p.lowStockThreshold || 10) ? 'low' : ''}`}>
                  {p.stockQuantity} in stock
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Cart & Checkout */}
      <div className="cart-panel card">
        <div className="cart-header">
          <h3>Current Cart</h3>
          <span className="item-count">{cart.length} items</span>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingCart size={48} />
              <p>Your cart is empty</p>
              <span>Tap products on the left to add them here</span>
            </div>
          ) : (
            <div className="items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">KES {item.sellingPrice?.toLocaleString()}</span>
                  </div>
                  <div className="item-controls">
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                    </div>
                    <span className="item-total">KES {(item.sellingPrice * item.quantity).toLocaleString()}</span>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-footer">
          <div className="totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>Discount</span>
              <span>- KES {discount.toLocaleString()}</span>
            </div>
            <div className="total-row grand-total">
              <span>TOTAL</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="payment-methods">
            <button
              className={`method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <Banknote size={20} />
              <span>Cash</span>
            </button>
            <button
              className={`method-btn ${paymentMethod === 'mpesa' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('mpesa')}
            >
              <Smartphone size={20} />
              <span>M-Pesa</span>
            </button>
            <button
              className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={20} />
              <span>Credit</span>
            </button>
          </div>

          {paymentMethod === 'cash' && (
            <div className="cash-inputs">
              <div className="input-group">
                <label>Amount Received</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                />
              </div>
              <div className="change-display">
                <label>Change Due</label>
                <span className={changeDue < 0 ? 'negative' : ''}>
                  KES {changeDue.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'mpesa' && (
            <div className="mpesa-inputs">
              <div className="input-group">
                <label>M-Pesa Reference</label>
                <input type="text" placeholder="Enter Ref Number" />
              </div>
            </div>
          )}

          <button className="primary-btn complete-btn" disabled={cart.length === 0}>
            Complete Sale — KES {total.toLocaleString()}
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .sales-screen {
          display: grid;
          grid-template-columns: 58% 42%;
          gap: var(--spacing-3);
          height: calc(100vh - var(--header-height) - (var(--spacing-3) * 2));
          overflow: hidden;
        }

        .product-selection {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
          overflow: hidden;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: 0 var(--spacing-3);
          height: 56px;
          flex-shrink: 0;
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.125rem;
          font-family: inherit;
        }

        .search-icon {
          color: var(--text-secondary);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-2);
          overflow-y: auto;
          padding-bottom: var(--spacing-3);
        }

        .product-card {
          display: flex;
          flex-direction: column;
          padding: var(--spacing-2);
          text-align: left;
          height: 180px;
          transition: all 0.2s;
        }

        .product-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .p-image {
          height: 80px;
          background: var(--background);
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .p-details {
          display: flex;
          flex-direction: column;
        }

        .p-name {
          font-weight: 700;
          color: var(--primary);
          font-size: 0.9375rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .p-price {
          color: var(--accent);
          font-weight: 800;
          font-size: 1.125rem;
        }

        .p-stock {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .p-stock.low {
          color: var(--danger);
        }

        .cart-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          padding: 0;
        }

        .cart-header {
          padding: var(--spacing-3);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-count {
          background: var(--primary);
          color: white;
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-2);
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          text-align: center;
          gap: var(--spacing-2);
          padding: var(--spacing-6);
          background: rgba(10, 37, 64, 0.02);
          border-radius: 12px;
          margin: var(--spacing-3);
          border: 2px dashed var(--border);
        }

        .empty-state svg {
          color: var(--border);
          margin-bottom: var(--spacing-1);
        }

        .empty-state p {
          font-weight: 700;
          color: var(--primary);
          font-size: 1.125rem;
          margin: 0;
        }

        .empty-state span {
          font-size: 0.875rem;
          max-width: 200px;
          line-height: 1.4;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cart-item {
          padding: 12px;
          background: var(--background);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .item-name {
          font-weight: 700;
          color: var(--primary);
        }

        .item-price {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .qty-picker {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
        }

        .qty-picker button {
          padding: 6px 10px;
          background: white;
        }

        .qty-picker button:hover {
          background: var(--background);
        }

        .qty-picker span {
          width: 32px;
          text-align: center;
          font-weight: 700;
        }

        .item-total {
          font-weight: 800;
          color: var(--primary);
        }

        .remove-btn {
          color: var(--text-secondary);
          padding: 4px;
        }

        .remove-btn:hover {
          color: var(--danger);
        }

        .cart-footer {
          padding: var(--spacing-3);
          border-top: 1px solid var(--border);
          background: white;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .totals {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: var(--spacing-2);
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .grand-total {
          color: var(--primary);
          font-size: 1.5rem;
          font-weight: 800;
          margin-top: 4px;
          padding-top: 4px;
          border-top: 2px solid var(--border);
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .method-btn {
          flex-direction: column;
          height: 72px;
          border: 2px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          gap: 4px;
        }

        .method-btn.active {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(0, 168, 107, 0.05);
        }

        .cash-inputs, .mpesa-inputs {
          padding: 12px;
          background: var(--background);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .input-group input {
          height: 44px;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0 12px;
          font-size: 1.125rem;
          font-weight: 700;
          font-family: inherit;
        }

        .change-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .change-display label {
          font-weight: 700;
          color: var(--primary);
        }

        .change-display span {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--accent);
        }

        .change-display span.negative {
          color: var(--danger);
        }

        .complete-btn {
          width: 100%;
          font-size: 1.125rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .complete-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
