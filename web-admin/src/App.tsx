import React, { useState, useEffect } from 'react';
import { Store, Users, Activity, Plus, X, Building, ShieldCheck } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

function App() {
  const [activeTab, setActiveTab] = useState('STORES');
  const [stores, setStores] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Forms
  const [storeForm, setStoreForm] = useState({ name: '', address: '', operatingRadiusKm: '5', bankAccountNumber: '', bankRoutingNumber: '', taxId: '' });
  const [vendorForm, setVendorForm] = useState({ name: '', email: '', phone: '', password: '', storeId: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'STORES') {
        const res = await fetch(`${API_BASE}/admin/stores`);
        setStores(await res.json());
      } else if (activeTab === 'VENDORS') {
        const res = await fetch(`${API_BASE}/admin/vendors`);
        setVendors(await res.json());
        // Also fetch stores for the dropdown if needed
        const sRes = await fetch(`${API_BASE}/admin/stores`);
        setStores(await sRes.json());
      } else if (activeTab === 'AUDIT') {
        const res = await fetch(`${API_BASE}/admin/audits`);
        setAudits(await res.json());
      }
    } catch(e) {
      console.error(e);
    }
  };

  const submitStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/admin/stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeForm)
      });
      setShowStoreModal(false);
      setStoreForm({ name: '', address: '', operatingRadiusKm: '5', bankAccountNumber: '', bankRoutingNumber: '', taxId: '' });
      fetchData();
    } catch(e) {
      console.error(e);
    }
  };

  const submitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/admin/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorForm)
      });
      setShowVendorModal(false);
      setVendorForm({ name: '', email: '', phone: '', password: '', storeId: '' });
      fetchData();
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <Building size={28} />
            Basko Admin
          </h1>
        </div>
        <nav className="nav-links">
          <button className={`nav-item ${activeTab === 'STORES' ? 'active' : ''}`} onClick={() => setActiveTab('STORES')}>
            <Store size={20} /> Stores Directory
          </button>
          <button className={`nav-item ${activeTab === 'VENDORS' ? 'active' : ''}`} onClick={() => setActiveTab('VENDORS')}>
            <Users size={20} /> Vendor Management
          </button>
          <button className={`nav-item ${activeTab === 'AUDIT' ? 'active' : ''}`} onClick={() => setActiveTab('AUDIT')}>
            <ShieldCheck size={20} /> Audit Trail
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* STORES VIEW */}
        {activeTab === 'STORES' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Stores Directory</h2>
              <button className="btn btn-primary" onClick={() => setShowStoreModal(true)}>
                <Plus size={18} /> Add New Store
              </button>
            </div>
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Address</th>
                    <th>Radius</th>
                    <th>Tax ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(store => (
                    <tr key={store.id}>
                      <td><strong>{store.name}</strong></td>
                      <td>{store.address}</td>
                      <td>{store.operatingRadiusKm} km</td>
                      <td>{store.taxId || 'N/A'}</td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                  ))}
                  {stores.length === 0 && (
                    <tr><td colSpan={5} style={{textAlign:'center', color: '#64748b'}}>No stores found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VENDORS VIEW */}
        {activeTab === 'VENDORS' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">Vendor Management</h2>
              <button className="btn btn-primary" onClick={() => setShowVendorModal(true)}>
                <Plus size={18} /> Onboard Vendor
              </button>
            </div>
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.email}</td>
                      <td>{v.phone}</td>
                      <td><span className="badge badge-success">Staff</span></td>
                    </tr>
                  ))}
                  {vendors.length === 0 && (
                    <tr><td colSpan={4} style={{textAlign:'center', color: '#64748b'}}>No vendors found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AUDIT VIEW */}
        {activeTab === 'AUDIT' && (
          <div>
            <div className="page-header">
              <h2 className="page-title">System Audit Trail</h2>
            </div>
            <div className="card">
              <div className="audit-feed">
                {audits.map(log => (
                  <div className="audit-item" key={log.id}>
                    <div className="audit-icon"><Activity size={20} /></div>
                    <div className="audit-details">
                      <h4>{log.details || log.action}</h4>
                      <span className="audit-time">
                        {new Date(log.createdAt).toLocaleString()} • {log.entityType} ({log.entityId})
                      </span>
                    </div>
                  </div>
                ))}
                {audits.length === 0 && <p style={{color: '#64748b'}}>No logs found.</p>}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* STORE MODAL */}
      {showStoreModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Onboard New Store</h3>
              <button className="close-btn" onClick={() => setShowStoreModal(false)}><X size={24}/></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitStore}>
                <div className="form-group">
                  <label>Store Name</label>
                  <input required className="form-control" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} placeholder="e.g. Basko Supermart" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input required className="form-control" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} placeholder="Full address" />
                </div>
                
                <h4 style={{marginTop: 30, marginBottom: 15, fontSize: 16}}>Payment Details (Banking)</h4>
                <div className="form-group">
                  <label>Bank Account Number</label>
                  <input required className="form-control" value={storeForm.bankAccountNumber} onChange={e => setStoreForm({...storeForm, bankAccountNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Bank Routing Number / IFSC</label>
                  <input required className="form-control" value={storeForm.bankRoutingNumber} onChange={e => setStoreForm({...storeForm, bankRoutingNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Tax ID / GSTIN</label>
                  <input required className="form-control" value={storeForm.taxId} onChange={e => setStoreForm({...storeForm, taxId: e.target.value})} />
                </div>

                <div style={{marginTop: 30, display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                  <button type="button" className="btn" style={{background: '#f1f5f9'}} onClick={() => setShowStoreModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Store</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR MODAL */}
      {showVendorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Onboard Vendor (Staff)</h3>
              <button className="close-btn" onClick={() => setShowVendorModal(false)}><X size={24}/></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitVendor}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input required className="form-control" value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input required type="email" className="form-control" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input required className="form-control" value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Temporary Password</label>
                  <input required type="password" className="form-control" value={vendorForm.password} onChange={e => setVendorForm({...vendorForm, password: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Assign to Store</label>
                  <select required className="form-control" value={vendorForm.storeId} onChange={e => setVendorForm({...vendorForm, storeId: e.target.value})}>
                    <option value="">Select a store...</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div style={{marginTop: 30, display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                  <button type="button" className="btn" style={{background: '#f1f5f9'}} onClick={() => setShowVendorModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Vendor</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
