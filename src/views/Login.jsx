import React, { useState } from 'react';
import { User, KeyRound, CheckCircle2, XCircle } from 'lucide-react';

export function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('user');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-tabs">
          <button 
            className={`tab ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            <User size={14} className="tab-icon" />
            User Login
          </button>
          <button 
            className={`tab ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
          >
            <KeyRound size={14} className="tab-icon" />
            ScannerLogin
          </button>
        </div>

        <div className="login-body card">
          {activeTab === 'user' ? (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-content">
                <div className="avatar-section">
                  <div className="avatar-placeholder">
                    <User size={64} color="#94a3b8" />
                  </div>
                </div>

                <div className="fields-section">
                  <div className="form-group row">
                    <label>Username:</label>
                    <input type="text" defaultValue="admin" required />
                  </div>

                  <div className="form-group row">
                    <label>Password:</label>
                    <input type="password" defaultValue="•••••" required />
                  </div>

                  <div className="form-group row">
                    <label>Shift:</label>
                    <select defaultValue="Day">
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>

                  {isVerifying && (
                    <div className="verifying-status">
                      <div className="dots-loader"></div>
                      <span>Verifying...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="login-actions">
                <button type="submit" className="action-btn ok-btn" disabled={isVerifying}>
                  <CheckCircle2 size={16} color="var(--accent)" />
                  Ok
                </button>
                <button type="button" className="action-btn cancel-btn" disabled={isVerifying}>
                  <XCircle size={16} color="var(--danger)" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="scanner-login-placeholder">
              <KeyRound size={48} color="#cbd5e1" />
              <p>Please scan your ID card to login</p>
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .login-screen {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 42, 67, 0.4); /* Semi-transparent overlay */
          backdrop-filter: blur(2px);
        }

        .login-container {
          width: 480px;
          display: flex;
          flex-direction: column;
        }

        .login-tabs {
          display: flex;
          gap: 4px;
          padding-left: 8px;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-bottom: none;
          border-radius: 6px 6px 0 0;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }

        .tab.active {
          background: white;
          color: var(--primary);
          position: relative;
          z-index: 2;
        }

        .tab-icon {
          color: inherit;
        }

        .login-body {
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 1;
          margin-top: -1px;
        }

        .login-content {
          display: flex;
          gap: 32px;
          margin-bottom: 24px;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .fields-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group.row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-group.row label {
          width: 80px;
          text-align: right;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
        }

        .form-group.row input,
        .form-group.row select {
          flex: 1;
          height: 32px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 0.875rem;
          outline: none;
        }

        .form-group.row input:focus,
        .form-group.row select:focus {
          border-color: var(--accent);
        }

        .verifying-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-style: italic;
        }

        .dots-loader {
          width: 24px;
          height: 24px;
          border: 3px solid #e2e8f0;
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
          cursor: pointer;
        }

        .action-btn:hover:not(:disabled) {
          background: #f1f5f9;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .scanner-login-placeholder {
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
