import React, { useState, useEffect } from 'react';
import { X, Code, Store, UtensilsCrossed } from 'lucide-react';
import { db } from '../services/db';

export function DeveloperPanel({ isOpen, onClose, currentMode }) {
  const [mode, setMode] = useState(currentMode || 'retail');

  useEffect(() => {
    if (currentMode) setMode(currentMode);
  }, [currentMode]);

  const handleSave = async () => {
    await db.settings.put({ key: 'businessMode', value: mode });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dev-panel-overlay">
      <div className="dev-panel card">
        <div className="panel-header">
          <div className="title">
            <Code size={20} color="var(--accent)" />
            <h3>Developer Configuration Panel</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="panel-body">
          <p className="warning-text">
            <strong>WARNING:</strong> This area is restricted to developers. Changing the business mode will drastically alter the system's UI and feature set.
          </p>

          <div className="mode-selector">
            <button 
              className={`mode-btn ${mode === 'retail' ? 'active' : ''}`}
              onClick={() => setMode('retail')}
            >
              <Store size={32} />
              <h4>Supermarket / Retail</h4>
              <p>Clean POS for fast checkout. Hides all restaurant features.</p>
            </button>

            <button 
              className={`mode-btn ${mode === 'restaurant' ? 'active' : ''}`}
              onClick={() => setMode('restaurant')}
            >
              <UtensilsCrossed size={32} />
              <h4>Restaurant & Hospitality</h4>
              <p>Full suite including table management, KDS, and waiter screens.</p>
            </button>
          </div>
        </div>

        <div className="panel-footer">
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={handleSave}>Apply Configuration</button>
        </div>
      </div>

      <style jsx="true">{`
        .dev-panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 42, 67, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .dev-panel {
          width: 560px;
          background: white;
          padding: 0;
          display: flex;
          flex-direction: column;
          border: 2px solid var(--accent);
          box-shadow: 0 24px 48px rgba(0,0,0,0.2);
        }

        .panel-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--primary);
        }

        .panel-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .warning-text {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .mode-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .mode-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          padding: 24px 16px;
          border: 2px solid var(--border);
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn p {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .mode-btn h4 {
          margin: 0;
          color: var(--primary);
        }

        .mode-btn.active {
          border-color: var(--accent);
          background: rgba(0, 168, 107, 0.05);
          box-shadow: 0 4px 12px rgba(0, 168, 107, 0.1);
        }

        .mode-btn.active * {
          color: var(--accent);
        }

        .panel-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          background: #f8fafc;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
