import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Wifi, WifiOff, Clock } from 'lucide-react';

export function Layout({ children, activePage, setActivePage, title }) {
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="main-wrapper">
        <header className="header">
          <div className="header-left">
            <h2 className="page-title">{title}</h2>
          </div>
          
          <div className="header-center">
            <div className="user-status">
              <span className="user-pill">Admin Terminal</span>
            </div>
          </div>

          <div className="header-right">
            <div className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <div className="time-display">
              <Clock size={16} />
              <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>

      <style jsx="true">{`
        .app-shell {
          display: flex;
          min-height: 100vh;
        }

        .main-wrapper {
          flex: 1;
          margin-left: var(--sidebar-width);
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .header {
          height: var(--header-height);
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-3);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .page-title {
          font-size: 1.25rem;
          color: var(--primary);
        }

        .user-pill {
          background: var(--background);
          padding: 6px 12px;
          border-radius: var(--radius-badge);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: var(--radius-badge);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pill.online {
          background: #ecfdf5;
          color: #059669;
        }

        .status-pill.offline {
          background: #fef2f2;
          color: #dc2626;
        }

        .time-display {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          padding-left: var(--spacing-2);
          border-left: 1px solid var(--border);
        }

        .main-content {
          flex: 1;
          padding: var(--spacing-3);
          overflow-y: auto;
          background: var(--background);
        }
      `}</style>
    </div>
  );
}
