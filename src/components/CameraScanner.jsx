import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

export function CameraScanner({ isOpen, onClose, onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
        onClose();
      },
      (error) => {
        // Ignore errors to not spam the console
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="scanner-overlay">
      <div className="scanner-modal card">
        <div className="modal-header">
          <h3>Scan Barcode</h3>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <div className="scanner-container">
          <div id="reader" ref={scannerRef}></div>
        </div>
      </div>
      <style jsx="true">{`
        .scanner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 37, 64, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .scanner-modal {
          width: 400px;
          background: white;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          padding: var(--spacing-3);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .scanner-container {
          padding: var(--spacing-3);
        }
        #reader {
          width: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
}
