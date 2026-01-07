import React, { useState, useEffect } from 'react';
import './Section.css';

const Quarantine = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    batchId: '',
    species: '',
    quantity: '',
    reason: '',
    healthStatus: '',
    treatment: '',
    quarantineDays: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('quarantineRecords');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem('quarantineRecords', JSON.stringify(updated));
    setFormData({
      date: '',
      batchId: '',
      species: '',
      quantity: '',
      reason: '',
      healthStatus: '',
      treatment: '',
      quarantineDays: '',
      notes: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem('quarantineRecords', JSON.stringify(updated));
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Quarantine Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <div className="section-form-card">
          <h2>Add Quarantine Record</h2>
          <form onSubmit={handleSubmit} className="section-form">
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Batch ID *</label>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Species *</label>
                <input
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Reason for Quarantine *</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Reason</option>
                  <option value="disease">Disease</option>
                  <option value="new-arrival">New Arrival</option>
                  <option value="suspected-illness">Suspected Illness</option>
                  <option value="preventive">Preventive</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Health Status</label>
                <select
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="healthy">Healthy</option>
                  <option value="sick">Sick</option>
                  <option value="recovering">Recovering</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Treatment</label>
                <input
                  type="text"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Treatment details..."
                />
              </div>
              <div className="form-group">
                <label>Quarantine Days</label>
                <input
                  type="number"
                  name="quarantineDays"
                  value={formData.quarantineDays}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Additional notes..."
              />
            </div>

            <button type="submit" className="submit-btn">Add Record</button>
          </form>
        </div>
      )}

      <div className="records-list">
        <h2>Records ({records.length})</h2>
        {records.length === 0 ? (
          <div className="empty-state">No records found.</div>
        ) : (
          <div className="records-grid">
            {records.map(record => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <h3>{record.batchId}</h3>
                  <button onClick={() => handleDelete(record.id)} className="delete-btn">×</button>
                </div>
                <div className="record-details">
                  <p><strong>Date:</strong> {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Species:</strong> {record.species}</p>
                  <p><strong>Quantity:</strong> {record.quantity}</p>
                  {record.reason && <p><strong>Reason:</strong> {record.reason}</p>}
                  {record.healthStatus && <p><strong>Health Status:</strong> {record.healthStatus}</p>}
                  {record.treatment && <p><strong>Treatment:</strong> {record.treatment}</p>}
                  {record.quarantineDays && <p><strong>Quarantine Days:</strong> {record.quarantineDays}</p>}
                  {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quarantine;

