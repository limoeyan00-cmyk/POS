import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { db } from '../services/db';

export function ProductModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      sku: formData.get('sku'),
      barcode: formData.get('barcode'),
      buyingPrice: parseFloat(formData.get('buyingPrice')),
      sellingPrice: parseFloat(formData.get('sellingPrice')),
      stockQuantity: parseInt(formData.get('stockQuantity')),
      unit: formData.get('unit'),
      lowStockThreshold: parseInt(formData.get('lowStockThreshold')) || 10
    };

    if (product) {
      await db.products.update(product.id, productData);
    } else {
      await db.products.add(productData);
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal card">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSave}>
          <div className="form-content">
            <div className="form-grid">
              <div className="form-group full">
                <label>Product Name</label>
                <input name="name" defaultValue={product?.name} required placeholder="e.g. Blue Band 500g" />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" defaultValue={product?.category || 'General'}>
                  <option>General</option>
                  <option>Groceries</option>
                  <option>Electronics</option>
                  <option>Household</option>
                  <option>Beverages</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unit</label>
                <select name="unit" defaultValue={product?.unit || 'pcs'}>
                  <option>pcs</option>
                  <option>kg</option>
                  <option>litres</option>
                  <option>box</option>
                </select>
              </div>

              <div className="form-group">
                <label>Buying Price (KES)</label>
                <input name="buyingPrice" type="number" step="0.01" defaultValue={product?.buyingPrice} required />
              </div>

              <div className="form-group">
                <label>Selling Price (KES)</label>
                <input name="sellingPrice" type="number" step="0.01" defaultValue={product?.sellingPrice} required />
              </div>

              <div className="form-group">
                <label>Current Stock</label>
                <input name="stockQuantity" type="number" defaultValue={product?.stockQuantity || 0} required />
              </div>

              <div className="form-group">
                <label>Low Stock Threshold</label>
                <input name="lowStockThreshold" type="number" defaultValue={product?.lowStockThreshold || 10} />
              </div>

              <div className="form-group full">
                <label>Barcode / SKU</label>
                <input name="barcode" defaultValue={product?.barcode || product?.sku} placeholder="Scan or enter barcode" />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn save-btn">Save Product</button>
          </div>
        </form>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 37, 64, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          width: 540px;
          max-height: 90vh;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: var(--spacing-3);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .form-content {
          padding: var(--spacing-4);
          overflow-y: auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-3);
        }

        .form-group.full {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary);
        }

        .form-group input, .form-group select {
          height: 44px;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0 12px;
          font-family: inherit;
          font-size: 0.9375rem;
          outline: none;
        }

        .form-group input:focus {
          border-color: var(--accent);
        }

        .modal-footer {
          padding: var(--spacing-3);
          border-top: 1px solid var(--border);
          background: #f8fafc;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .save-btn {
          min-width: 140px;
        }
      `}</style>
    </div>
  );
}
