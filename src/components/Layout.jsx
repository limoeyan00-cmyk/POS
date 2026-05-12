import React, { useState, useEffect, useRef } from 'react';
import { MinusSquare, XSquare, LogOut, Settings as SettingsIcon, Wrench, FileText } from 'lucide-react';
import { db } from '../services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { DeveloperPanel } from './DeveloperPanel';

export function Layout({ children, onNavigate, onLogout }) {
  const [dateStr, setDateStr] = useState('');
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const modeSetting = useLiveQuery(() => db.settings.get('businessMode'));
  const currentMode = modeSetting?.value || 'retail';
  
  useEffect(() => {
    const d = new Date();
    setDateStr(`${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`);
  }, []);

  const handleModeClick = () => {
    clickCount.current += 1;
    
    if (clickTimer.current) clearTimeout(clickTimer.current);
    
    if (clickCount.current >= 5) {
      setIsDevPanelOpen(true);
      clickCount.current = 0;
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1000);
    }
  };

  return (
    <div className="navi-app-shell">
      {/* Topmost OS-like bar */}
      <div className="navi-top-bar">
        <div className="top-bar-left">
          <div 
            className="retail-mode-badge" 
            onClick={handleModeClick}
            style={{ cursor: 'default', userSelect: 'none' }}
            title="Business Mode (Internal)"
          >
            {currentMode === 'restaurant' ? 'Restaurant Mode' : 'Retail Mode'}
          </div>
        </div>
        
        <div className="top-bar-center">
          <div className="transaction-date">
            <span>Transaction Date: </span>
            <span className="date-box">{dateStr}</span>
          </div>
        </div>
        
        <div className="top-bar-right">
          <div className="change-prev">
            <span className="icon-search">🔍</span>
            <span>Change from previous transaction: <strong className="text-danger">0</strong></span>
          </div>
          <div className="window-controls">
            <button className="win-btn"><MinusSquare size={16} /> Minimize</button>
            <button className="win-btn" onClick={onLogout}><LogOut size={16} /> Logout</button>
            <button className="win-btn text-danger"><XSquare size={16} /> Exit</button>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="navi-menu-bar">
        <button className="menu-item" onClick={() => onNavigate('sale')}>
          <FileText size={14} /> File
        </button>
        <button className="menu-item" onClick={() => onNavigate('inventory')}>
          <Wrench size={14} /> Tools
        </button>
        <button className="menu-item" onClick={() => onNavigate('settings')}>
          <SettingsIcon size={14} /> Settings
        </button>
      </div>

      <div className="navi-main-content">
        {children}
      </div>

      <DeveloperPanel 
        isOpen={isDevPanelOpen} 
        onClose={() => setIsDevPanelOpen(false)} 
        currentMode={currentMode}
      />

      <style jsx="true">{`
        .navi-app-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #f1f5f9;
        }

        .navi-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #e2e8f0;
          border-bottom: 1px solid #cbd5e1;
          padding: 4px 8px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .retail-mode-badge {
          background: white;
          border: 1px solid #cbd5e1;
          padding: 2px 12px;
          color: var(--primary);
          font-weight: 600;
        }

        .transaction-date {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .date-box {
          background: white;
          border: 1px solid #cbd5e1;
          padding: 2px 8px;
          font-weight: 600;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .change-prev {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .text-danger {
          color: var(--danger);
        }

        .window-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .win-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .win-btn:hover {
          color: var(--primary);
        }

        .navi-menu-bar {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #cbd5e1;
          padding: 2px 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          padding: 4px 12px;
          font-size: 0.8125rem;
          color: var(--primary);
          cursor: pointer;
        }

        .menu-item:hover {
          background: #e2e8f0;
        }

        .navi-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
