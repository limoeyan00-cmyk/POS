import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { db } from '../services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { ProductModal } from '../components/ProductModal';

export function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStock, setFilterStock] = useState('All');

  const products = useLiveQuery(
    async () => {
      let collection = db.products.where('name').startsWithIgnoreCase(searchQuery);
      let results = await collection.toArray();
      
      if (filterCategory !== 'All') {
        results = results.filter(p => p.category === filterCategory);
      }
      
      if (filterStock === 'Low Stock') {
        results = results.filter(p => p.stockQuantity <= (p.lowStockThreshold || 10));
      } else if (filterStock === 'Out of Stock') {
        results = results.filter(p => p.stockQuantity === 0);
      }
      
      return results;
    },
    [searchQuery, filterCategory, filterStock]
  ) || [];

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product? This cannot be undone.')) {
      await db.products.delete(id);
    }
  };

  return (
    <div className="inventory-view">
      <div className="view-header">
        <div className="header-title">
          <h1>Inventory Management</h1>
          <p>Track stock levels and manage product pricing</p>
        </div>
        <button className="primary-btn" onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="filter-bar card">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option>All Categories</option>
              <option>Groceries</option>
              <option>Electronics</option>
              <option>Household</option>
              <option>Beverages</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
              <option>All Stock Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th className="num">Buying (KES)</th>
              <th className="num">Selling (KES)</th>
              <th className="num">Stock</th>
              <th>Unit</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLowStock = p.stockQuantity <= (p.lowStockThreshold || 10);
              return (
                <tr key={p.id} className={isLowStock ? 'low-stock-row' : ''}>
                  <td>
                    <div className="p-cell">
                      <span className="p-name">{p.name}</span>
                      <span className="p-sku">{p.sku || 'No SKU'}</span>
                    </div>
                  </td>
                  <td><span className="badge-tag">{p.category}</span></td>
                  <td className="num">{p.buyingPrice?.toLocaleString()}</td>
                  <td className="num font-bold">{p.sellingPrice?.toLocaleString()}</td>
                  <td className="num">
                    <div className="stock-cell">
                      {isLowStock && <AlertTriangle size={14} className="text-warning" />}
                      <span className={isLowStock ? 'text-warning font-bold' : ''}>
                        {p.stockQuantity}
                      </span>
                    </div>
                  </td>
                  <td>{p.unit}</td>
                  <td className="actions">
                    <div className="action-buttons">
                      <button className="icon-btn edit" onClick={() => handleEdit(p)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="empty-table">
            <p>No products found matching your filters</p>
          </div>
        )}

        <div className="pagination">
          <span className="page-info">Showing {products.length} products</span>
          <div className="page-controls">
            <button className="icon-btn" disabled><ChevronLeft size={18} /></button>
            <button className="page-num active">1</button>
            <button className="icon-btn" disabled><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct} 
      />

      <style jsx="true">{`
        .inventory-view {
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-2) var(--spacing-3);
        }

        .search-input {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          max-width: 400px;
        }

        .search-input input {
          width: 100%;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.9375rem;
        }

        .filters {
          display: flex;
          gap: var(--spacing-2);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--background);
          padding: 0 12px;
          border-radius: 8px;
          height: 40px;
          color: var(--text-secondary);
        }

        .filter-group select {
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--primary);
        }

        .table-container {
          padding: 0;
          overflow: hidden;
        }

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
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .inventory-table td {
          padding: 12px 20px;
          border-bottom: 1px solid var(--border);
          font-size: 0.9375rem;
          height: var(--row-height);
        }

        .num { text-align: right; }
        .font-bold { font-weight: 700; }
        .text-warning { color: var(--warning); }

        .low-stock-row {
          background: #fffbeb;
        }

        .low-stock-row td {
          border-bottom-color: #fde68a;
        }

        .low-stock-row td:first-child {
          border-left: 4px solid var(--warning);
        }

        .p-cell {
          display: flex;
          flex-direction: column;
        }

        .p-name {
          font-weight: 700;
          color: var(--primary);
        }

        .p-sku {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .badge-tag {
          background: var(--background);
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .stock-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .actions {
          width: 100px;
        }

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

        .icon-btn:hover {
          background: var(--background);
        }

        .icon-btn.edit:hover { color: var(--accent); border-color: var(--accent); }
        .icon-btn.delete:hover { color: var(--danger); border-color: var(--danger); }

        .empty-table {
          padding: var(--spacing-6);
          text-align: center;
          color: var(--text-secondary);
        }

        .pagination {
          padding: var(--spacing-3) var(--spacing-4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .page-info {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .page-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-num {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
          border-radius: 6px;
        }

        .page-num.active {
          background: var(--primary);
          color: white;
        }
      `}</style>
    </div>
  );
}
