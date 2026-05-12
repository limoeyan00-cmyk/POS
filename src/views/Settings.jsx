import React, { useState } from 'react';
import { 
  Building2, 
  Users2, 
  Settings2, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight,
  AlertCircle,
  Save,
  Upload,
  Printer
} from 'lucide-react';

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [kraEnabled, setKraEnabled] = useState(false);

  const sections = [
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'users', label: 'Users & Staff', icon: Users2 },
    { id: 'printer', label: 'Printer Settings', icon: Printer },
    { id: 'kra', label: 'KRA Integration', icon: ShieldCheck },
  ];

  return (
    <div className="settings-view">
      <div className="settings-container card">
        <aside className="settings-nav">
          {sections.map(s => (
            <button 
              key={s.id}
              className={`settings-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <s.icon size={18} />
              <span>{s.label}</span>
            </button>
          ))}
        </aside>

        <main className="settings-content">
          {activeSection === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Business Profile</h2>
                <p>Manage your business identity and receipt branding</p>
              </div>
              <div className="profile-form">
                <div className="logo-upload">
                  <div className="logo-preview">POS</div>
                  <button className="secondary-btn"><Upload size={16} /> Upload Logo</button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" defaultValue="POS Guesthouse" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" defaultValue="+254 700 000 000" />
                  </div>
                  <div className="form-group full">
                    <label>Address</label>
                    <input type="text" defaultValue="Mombasa Road, Nairobi, Kenya" />
                  </div>
                  <div className="form-group full">
                    <label>Receipt Footer Message</label>
                    <textarea defaultValue="Thank you for your business! Please come again." rows={3} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'kra' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>KRA eTIMS Integration</h2>
                <p>Connect your system to KRA for tax compliance</p>
              </div>

              <div className="kra-box">
                <div className="kra-toggle-row">
                  <div className="kra-label">
                    <h3>Enable KRA eTIMS Integration</h3>
                    <p>Default status: OFF</p>
                  </div>
                  <button 
                    className={`kra-toggle ${kraEnabled ? 'on' : 'off'}`}
                    onClick={() => setKraEnabled(!kraEnabled)}
                  >
                    {kraEnabled ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                  </button>
                </div>

                <div className="kra-alert">
                  <AlertCircle size={20} />
                  <p>
                    <strong>Important:</strong> This feature is currently inactive. Enable only when your business is ready for KRA eTIMS compliance. Enabling this will connect your system to KRA servers.
                  </p>
                </div>

                <div className={`kra-fields ${!kraEnabled ? 'disabled' : ''}`}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>KRA PIN</label>
                      <input type="text" placeholder="A00XXXXXXXX" disabled={!kraEnabled} />
                    </div>
                    <div className="form-group">
                      <label>Device ID</label>
                      <input type="text" placeholder="TIMS-XXXXX" disabled={!kraEnabled} />
                    </div>
                    <div className="form-group">
                      <label>Secret Key</label>
                      <input type="password" value="••••••••••••" disabled={!kraEnabled} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'printer' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Printer Settings</h2>
                <p>Configure thermal receipt printer and printing behavior</p>
              </div>

              <div className="profile-form">
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Default Printer Name</label>
                    <input type="text" placeholder="e.g. POS-80C" defaultValue="POS-80" />
                  </div>
                  
                  <div className="form-group">
                    <label>Paper Width</label>
                    <select defaultValue="80mm" style={{ height: '44px', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 12px' }}>
                      <option value="80mm">80mm (Standard)</option>
                      <option value="58mm">58mm (Narrow)</option>
                    </select>
                  </div>

                  <div className="form-group"></div>

                  <div className="form-group full" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" id="autoprint" defaultChecked style={{ width: '20px', height: '20px' }} />
                    <label htmlFor="autoprint" style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Auto-print receipt after sale</label>
                  </div>

                  <div className="form-group full" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" id="printcopy" style={{ width: '20px', height: '20px' }} />
                    <label htmlFor="printcopy" style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Print receipt copy (2 copies)</label>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button className="secondary-btn" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={16} />
                    Test Print
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users would go here - placeholder for brevity */}
          {activeSection === 'users' && (
            <div className="empty-settings">
              <Users2 size={48} className="text-muted" />
              <p>Settings section for {activeSection} coming soon.</p>
            </div>
          )}

          <div className="settings-footer">
            <button className="primary-btn"><Save size={18} /> Save Changes</button>
          </div>
        </main>
      </div>

      <style jsx="true">{`
        .settings-view { height: 100%; }
        
        .settings-container {
          display: flex;
          height: 100%;
          padding: 0;
          overflow: hidden;
        }

        .settings-nav {
          width: 240px;
          background: #f8fafc;
          border-right: 1px solid var(--border);
          padding: var(--spacing-3) var(--spacing-2);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .settings-nav-item {
          width: 100%;
          padding: 12px 16px;
          justify-content: flex-start;
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 600;
          transition: all 0.2s;
        }

        .settings-nav-item:hover { background: white; color: var(--primary); }
        .settings-nav-item.active { background: white; color: var(--accent); box-shadow: var(--shadow-main); }

        .settings-content {
          flex: 1;
          padding: var(--spacing-4) var(--spacing-6);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .section-header { margin-bottom: var(--spacing-4); }
        .section-header h2 { font-size: 1.5rem; margin-bottom: 4px; }
        .section-header p { color: var(--text-secondary); font-size: 0.875rem; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3); }
        .form-group.full { grid-column: span 2; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.875rem; font-weight: 700; color: var(--primary); }
        .form-group input, .form-group textarea {
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          font-family: inherit;
          font-size: 0.9375rem;
          outline: none;
        }

        .logo-upload {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          margin-bottom: var(--spacing-4);
          background: var(--background);
          padding: var(--spacing-2);
          border-radius: 12px;
        }

        .logo-preview {
          width: 64px;
          height: 64px;
          background: var(--accent);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .kra-box {
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: var(--spacing-4);
        }

        .kra-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-4);
        }

        .kra-label h3 { margin-bottom: 2px; }
        .kra-label p { font-size: 0.8125rem; color: var(--text-secondary); font-weight: 700; }

        .kra-toggle { color: var(--text-secondary); }
        .kra-toggle.on { color: var(--accent); }

        .kra-alert {
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
          color: #92400e;
          font-size: 0.875rem;
          margin-bottom: var(--spacing-4);
        }

        .kra-fields.disabled { opacity: 0.5; filter: grayscale(1); }

        .settings-footer {
          margin-top: auto;
          padding-top: var(--spacing-6);
          display: flex;
          justify-content: flex-end;
        }

        .empty-settings {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          gap: var(--spacing-2);
        }
      `}</style>
    </div>
  );
}
