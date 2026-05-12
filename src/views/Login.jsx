import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-screen">
      <div className="login-card card">
        <div className="login-header">
          <div className="login-logo">POS</div>
          <h1>Welcome Back</h1>
          <p>Please sign in to your terminal</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="Enter username" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter password" 
                required 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="primary-btn login-btn">
            Login to Terminal
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .login-screen {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #0F2A43, #0A2540);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          padding: var(--spacing-6) var(--spacing-4);
          text-align: center;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .login-header {
          margin-bottom: var(--spacing-4);
        }

        .login-logo {
          width: 64px;
          height: 64px;
          background: var(--accent);
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.5rem;
          margin: 0 auto var(--spacing-3);
          box-shadow: 0 8px 16px rgba(0, 168, 107, 0.3);
        }

        .login-header h1 {
          font-size: 1.75rem;
          margin-bottom: 4px;
          color: var(--primary);
          letter-spacing: -0.5px;
        }

        .login-header p {
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .login-form {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-secondary);
        }

        .input-wrapper input {
          width: 100%;
          height: var(--input-height);
          padding: 0 14px 0 44px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-btn);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
          background: #fcfcfc;
        }

        .input-wrapper input:focus {
          border-color: var(--accent);
          background: white;
          box-shadow: 0 0 0 4px rgba(0, 168, 107, 0.1);
        }

        .toggle-password {
          position: absolute;
          right: 14px;
          color: var(--text-secondary);
          padding: 4px;
        }

        .login-btn {
          width: 100%;
          margin-top: var(--spacing-2);
          font-size: 1.125rem;
          box-shadow: 0 4px 12px rgba(0, 168, 107, 0.2);
        }
      `}</style>
    </div>
  );
}
