import React, { useState, useEffect } from 'react';
import './Section.css';

const GrowOut = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    batchId: '',
    species: '',
    quantity: '',
    avgWeight: '',
    feedAmount: '',
    mortality: '',
    waterTemp: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('growOutRecords');
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
    localStorage.setItem('growOutRecords', JSON.stringify(updated));
    setFormData({
      date: '',
      batchId: '',
      species: '',
      quantity: '',
      avgWeight: '',
      feedAmount: '',
      mortality: '',
      waterTemp: '',
      notes: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem('growOutRecords', JSON.stringify(updated));
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Grow-Out Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <div className="section-form-card">
          <h2>Add Grow-Out Record</h2>
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
                <label>Average Weight (g)</label>
                <input
                  type="number"
                  name="avgWeight"
                  value={formData.avgWeight}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Feed Amount (kg)</label>
                <input
                  type="number"
                  name="feedAmount"
                  value={formData.feedAmount}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mortality Count</label>
                <input
                  type="number"
                  name="mortality"
                  value={formData.mortality}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Water Temperature (°C)</label>
                <input
                  type="number"
                  name="waterTemp"
                  value={formData.waterTemp}
                  onChange={handleChange}
                  step="0.1"
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
                  {record.avgWeight && <p><strong>Avg Weight:</strong> {record.avgWeight}g</p>}
                  {record.feedAmount && <p><strong>Feed Amount:</strong> {record.feedAmount}kg</p>}
                  {record.mortality && <p><strong>Mortality:</strong> {record.mortality}</p>}
                  {record.waterTemp && <p><strong>Water Temp:</strong> {record.waterTemp}°C</p>}
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

export default GrowOut;

