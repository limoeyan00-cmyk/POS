import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Sales } from './views/Sales';
import { Inventory } from './views/Inventory';
import { Customers } from './views/Customers';
import { Reports } from './views/Reports';
import { Settings } from './views/Settings';
import { ReceiptPanel } from './components/ReceiptPanel';
import './styles/theme.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleCompleteSale = (saleData) => {
    setLastSale(saleData);
    setIsReceiptOpen(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'sale':
        return <Sales onComplete={handleCompleteSale} />;
      case 'inventory':
        return <Inventory />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Business Overview',
      sale: 'Terminal / New Sale',
      inventory: 'Inventory Management',
      customers: 'Customer Directory',
      reports: 'Analytics & Reporting',
      settings: 'System Settings'
    };
    return titles[activePage] || 'POS Terminal';
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={setActivePage} 
      title={getPageTitle()}
    >
      {renderView()}

      <ReceiptPanel 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        saleData={lastSale}
      />
    </Layout>
  );
}
