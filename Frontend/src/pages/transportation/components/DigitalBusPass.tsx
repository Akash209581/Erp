import React from 'react';
import '../styles/DigitalBusPass.css';

interface DigitalBusPassProps {
  studentName: string;
  registerno: string;
  busNumber: string;
  seatNumber: number;
  routeName: string;
  photoUrl?: string;
}

export function printBusPassOnly(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '800px';
  iframe.style.height = '600px';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  // Copy all stylesheets
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
      } catch { return ''; }
    })
    .join('\n');

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Bus Pass</title>
        <style>
          ${styles}
          body { margin: 0; padding: 20px; background: white; }
          .bus-pass-container { max-width: 500px; margin: 0 auto; }
        </style>
      </head>
      <body>${el.outerHTML}</body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 500);
}

const DigitalBusPass: React.FC<DigitalBusPassProps> = ({
  studentName,
  registerno,
  busNumber,
  seatNumber,
  routeName,
  photoUrl,
}) => {
  return (
    <div className="bus-pass-container" id="digital-bus-pass-card">
      <div className="bus-pass-card">
        <div className="bus-pass-header">
          <h2>VFSTR TRANSPORTATION</h2>
          <p>Digital Bus Pass 2026-27</p>
        </div>
        <div className="bus-pass-body">
          <div className="bus-pass-photo">
            {photoUrl ? (
              <img src={photoUrl} alt="Student" />
            ) : (
              <div className="placeholder-photo">{studentName.charAt(0)}</div>
            )}
          </div>
          <div className="bus-pass-details">
            <div className="detail-item">
              <span className="label">NAME:</span>
              <span className="value">{studentName}</span>
            </div>
            <div className="detail-item">
              <span className="label">REG NO:</span>
              <span className="value">{registerno}</span>
            </div>
            <div className="detail-item">
              <span className="label">BUS NO:</span>
              <span className="value highlighting">{busNumber}</span>
            </div>
            <div className="detail-item">
              <span className="label">SEAT NO:</span>
              <span className="value highlighting">{seatNumber}</span>
            </div>
            <div className="detail-item">
              <span className="label">ROUTE:</span>
              <span className="value">{routeName}</span>
            </div>
          </div>
        </div>
        <div className="bus-pass-footer">
          <div className="qr-code-placeholder">
            <img 
              src={`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=STUDENT:${registerno}:BUS:${busNumber}&choe=UTF-8`} 
              alt="QR Code" 
              className="real-qr"
            />
          </div>
          <div className="footer-meta">
            <div className="verified-badge">✓ VERIFIED BY VFSTR</div>
            <div className="validity">VALID UNTIL: MAY 2027</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBusPass;
