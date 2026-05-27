import React, { useEffect, useState } from 'react';
import '../styles/DocumentManagement.css';

const API = 'http://localhost:3000/transport';

interface DocumentType {
  id: number;
  name: string;
  description?: string;
}

interface Bus {
  bus_id: number;
  bus_number: string;
}

interface BusDocument {
  id: number;
  bus_id: number;
  document_type_id: number;
  expiry_date: string;
  document_number?: string;
  notes?: string;
  documentType?: DocumentType;
  bus?: Bus;
}

const DocumentManagement: React.FC<{ user: any }> = () => {
  const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [allDocuments, setAllDocuments] = useState<BusDocument[]>([]);

  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);
  const [busDocuments, setBusDocuments] = useState<BusDocument[]>([]);

  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedBusId) {
      fetchBusDocuments(selectedBusId);
    }
  }, [selectedBusId, docTypes]);

  const fetchAll = async () => {
    const [typesRes, busesRes, docsRes] = await Promise.all([
      fetch(`${API}/document-types`),
      fetch(`${API}/buses`),
      fetch(`${API}/documents`),
    ]);
    const [types, busesData, docsData] = await Promise.all([
      typesRes.json(),
      busesRes.json(),
      docsRes.json(),
    ]);
    setDocTypes(types.data || []);
    setBuses(busesData.data || []);
    setAllDocuments(docsData.data || []);
  };

  const fetchBusDocuments = async (busId: number) => {
    const res = await fetch(`${API}/documents/bus/${busId}`);
    const data = await res.json();
    setBusDocuments(data.data || []);
  };

  const addDocumentType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/document-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTypeName.trim(), description: newTypeDesc.trim() }),
      });
      setNewTypeName('');
      setNewTypeDesc('');
      showSuccess('Document type added!');
      await fetchAll();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteDocType = async (id: number) => {
    if (!confirm('Delete this document type? It will also remove all associated records.')) return;
    await fetch(`${API}/document-types/${id}`, { method: 'DELETE' });
    showSuccess('Document type deleted');
    await fetchAll();
  };

  const saveDocument = async (docTypeId: number, expiryDate: string, docNumber: string, notes: string) => {
    if (!selectedBusId || !expiryDate) return;
    setSaving(prev => ({ ...prev, [docTypeId]: true }));
    try {
      await fetch(`${API}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bus_id: selectedBusId,
          document_type_id: docTypeId,
          expiry_date: expiryDate,
          document_number: docNumber,
          notes,
        }),
      });
      showSuccess('Document saved!');
      await fetchBusDocuments(selectedBusId);
    } finally {
      setSaving(prev => ({ ...prev, [docTypeId]: false }));
    }
  };

  const deleteDocument = async (docId: number) => {
    await fetch(`${API}/documents/${docId}`, { method: 'DELETE' });
    showSuccess('Document removed');
    if (selectedBusId) fetchBusDocuments(selectedBusId);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getExistingDoc = (docTypeId: number): BusDocument | undefined =>
    busDocuments.find(d => d.document_type_id === docTypeId);

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const expiryBadge = (days: number) => {
    if (days < 0) return <span className="doc-badge expired">EXPIRED ({Math.abs(days)}d ago)</span>;
    if (days <= 5) return <span className="doc-badge critical">⚠ {days}d left</span>;
    if (days <= 15) return <span className="doc-badge warning">{days}d left</span>;
    return <span className="doc-badge ok">✓ {days}d left</span>;
  };

  return (
    <div className="doc-management">
      {successMsg && <div className="doc-success-toast">{successMsg}</div>}

      <h1>📄 Bus Document Management</h1>

      {/* SECTION 1: Global Document Types */}
      <div className="doc-section">
        <div className="doc-card">
          <div className="doc-card-header">
            <h2>📋 Document Types</h2>
            <p>Define the documents that every bus must maintain.</p>
          </div>
          <form className="add-type-form" onSubmit={addDocumentType}>
            <div className="form-row">
              <input
                type="text"
                className="doc-input"
                placeholder="Document Name (e.g. Fitness Certificate)"
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                required
              />
              <input
                type="text"
                className="doc-input"
                placeholder="Description (optional)"
                value={newTypeDesc}
                onChange={e => setNewTypeDesc(e.target.value)}
              />
              <button type="submit" className="doc-btn doc-btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : '+ Add Type'}
              </button>
            </div>
          </form>
          <div className="doc-type-list">
            {docTypes.length === 0 ? (
              <div className="doc-empty">No document types defined yet. Add one above.</div>
            ) : (
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Document Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {docTypes.map((dt, i) => (
                    <tr key={dt.id}>
                      <td>{i + 1}</td>
                      <td><strong>{dt.name}</strong></td>
                      <td>{dt.description || '—'}</td>
                      <td>
                        <button className="doc-btn doc-btn-danger-sm" onClick={() => deleteDocType(dt.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Per-Bus Document Entry */}
      <div className="doc-section">
        <div className="doc-card">
          <div className="doc-card-header">
            <h2>🚍 Bus Document Records</h2>
            <p>Select a bus to view and update its document expiry details.</p>
          </div>
          <div className="bus-selector-row">
            <label className="doc-label">Select Bus:</label>
            <select
              className="doc-select"
              value={selectedBusId || ''}
              onChange={e => setSelectedBusId(parseInt(e.target.value))}
            >
              <option value="">-- Select a Bus --</option>
              {buses.map(b => (
                <option key={b.bus_id} value={b.bus_id}>{b.bus_number}</option>
              ))}
            </select>
          </div>

          {selectedBusId && (
            <div className="bus-documents-grid">
              {docTypes.length === 0 ? (
                <div className="doc-empty">Please add Document Types first.</div>
              ) : (
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Doc. Number</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docTypes.map(dt => {
                      const existing = getExistingDoc(dt.id);
                      return (
                        <DocumentRow
                          key={dt.id}
                          docType={dt}
                          existing={existing}
                          saving={!!saving[dt.id]}
                          onSave={saveDocument}
                          onDelete={deleteDocument}
                          expiryBadge={expiryBadge}
                          getDaysUntilExpiry={getDaysUntilExpiry}
                        />
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: All Documents Overview */}
      <div className="doc-section">
        <div className="doc-card">
          <div className="doc-card-header">
            <h2>📊 All Documents Overview</h2>
          </div>
          <div className="doc-table-wrapper">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Document</th>
                  <th>Doc. Number</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allDocuments.length === 0 ? (
                  <tr><td colSpan={5} className="doc-empty">No documents recorded yet.</td></tr>
                ) : allDocuments.map(doc => {
                  const days = getDaysUntilExpiry(doc.expiry_date);
                  return (
                    <tr key={doc.id} className={days < 0 ? 'row-expired' : days <= 5 ? 'row-critical' : ''}>
                      <td><strong>{doc.bus?.bus_number || `Bus #${doc.bus_id}`}</strong></td>
                      <td>{doc.documentType?.name}</td>
                      <td>{doc.document_number || '—'}</td>
                      <td>{new Date(doc.expiry_date).toLocaleDateString('en-IN')}</td>
                      <td>{expiryBadge(days)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline editable row component for per-bus document management
const DocumentRow: React.FC<{
  docType: DocumentType;
  existing?: BusDocument;
  saving: boolean;
  onSave: (typeId: number, expiry: string, docNum: string, notes: string) => void;
  onDelete: (docId: number) => void;
  expiryBadge: (days: number) => React.ReactNode;
  getDaysUntilExpiry: (date: string) => number;
}> = ({ docType, existing, saving, onSave, onDelete, expiryBadge, getDaysUntilExpiry }) => {
  const [expiry, setExpiry] = useState(existing?.expiry_date ? existing.expiry_date.split('T')[0] : '');
  const [docNum, setDocNum] = useState(existing?.document_number || '');
  const [notes, setNotes] = useState(existing?.notes || '');

  return (
    <tr>
      <td><strong>{docType.name}</strong></td>
      <td>
        <input
          type="text"
          className="doc-input-sm"
          placeholder="Doc. No."
          value={docNum}
          onChange={e => setDocNum(e.target.value)}
        />
      </td>
      <td>
        <input
          type="date"
          className="doc-input-sm"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
        />
      </td>
      <td>
        {existing?.expiry_date ? expiryBadge(getDaysUntilExpiry(existing.expiry_date)) : <span className="doc-badge missing">Not Set</span>}
      </td>
      <td>
        <input
          type="text"
          className="doc-input-sm"
          placeholder="Notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </td>
      <td>
        <div className="doc-row-actions">
          <button
            className="doc-btn doc-btn-save"
            onClick={() => onSave(docType.id, expiry, docNum, notes)}
            disabled={saving || !expiry}
          >
            {saving ? '...' : '💾'}
          </button>
          {existing && (
            <button className="doc-btn doc-btn-danger-sm" onClick={() => onDelete(existing.id)}>🗑</button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DocumentManagement;
