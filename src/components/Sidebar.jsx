import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sale', label: 'New Sale', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activePage, setActivePage, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">POS</span>
        <span className="logo-text">Guesthouse</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Cashier One'}</span>
            <span className="user-role">{user?.role || 'Senior Staff'}</span>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <style jsx="true">{`
        .sidebar {
          width: var(--sidebar-width);
          background: var(--sidebar-bg);
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .sidebar-logo {
          height: var(--header-height);
          padding: 0 var(--spacing-3);
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          color: white;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo-icon {
          background: var(--accent);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 0.75rem;
        }

        .logo-text {
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--spacing-2) 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          width: 100%;
          padding: 12px var(--spacing-3);
          justify-content: flex-start;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
          transition: all 0.2s;
          position: relative;
        }

        .nav-item:hover {
          color: white;
          background: rgba(255,255,255,0.05);
        }

        .nav-item.active {
          color: white;
          background: rgba(0, 168, 107, 0.15);
          border-left: 4px solid var(--accent);
          padding-left: calc(var(--spacing-3) - 4px);
        }

        .sidebar-footer {
          padding: var(--spacing-3);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          background: rgba(255,255,255,0.05);
          padding: var(--spacing-1) var(--spacing-2);
          border-radius: var(--radius-btn);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .user-role {
          color: rgba(255,255,255,0.5);
          font-size: 0.75rem;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          justify-content: center;
          color: #ff4d4d;
          font-size: 0.875rem;
          border-radius: var(--radius-btn);
        }

        .logout-btn:hover {
          background: rgba(255, 77, 77, 0.1);
        }
      `}</style>
    </aside>
  );
}
