import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Login } from './views/Login';
import { Sales } from './views/Sales';
import { Inventory } from './views/Inventory';
import { Settings } from './views/Settings';
import { ReceiptPanel } from './components/ReceiptPanel';
import './styles/theme.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('sale');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCompleteSale = (saleData) => {
    setLastSale(saleData);
    setIsReceiptOpen(true);
  };

  const renderView = () => {
    switch (activePage) {
      case 'sale':
        return <Sales onComplete={handleCompleteSale} />;
      case 'inventory':
        return <Inventory />;
      case 'settings':
        return <Settings />;
      default:
        return <Sales onComplete={handleCompleteSale} />;
    }
  };

  return (
    <>
      <Layout onNavigate={setActivePage} onLogout={handleLogout}>
        {renderView()}
      </Layout>

      {!isAuthenticated && (
        <div className="login-overlay-container">
          <Login onLogin={handleLogin} />
        </div>
      )}

      <ReceiptPanel 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        saleData={lastSale}
      />

      <style jsx="true">{`
        .login-overlay-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          /* The Login component already handles its own background if needed, 
             but we make sure the container sits on top */
        }
      `}</style>
    </>
  );
}
