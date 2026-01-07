import React, { useState, useEffect } from 'react';
import './Section.css';

const Hatchery = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    species: '',
    eggsCount: '',
    hatchingRate: '',
    waterTemp: '',
    phLevel: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('hatcheryRecords');
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
    localStorage.setItem('hatcheryRecords', JSON.stringify(updated));
    setFormData({
      date: '',
      species: '',
      eggsCount: '',
      hatchingRate: '',
      waterTemp: '',
      phLevel: '',
      notes: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      localStorage.setItem('hatcheryRecords', JSON.stringify(updated));
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Hatchery Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <div className="section-form-card">
          <h2>Add Hatchery Record</h2>
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
                <label>Species *</label>
                <input
                  type="text"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  placeholder="e.g., Tilapia"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Eggs Count *</label>
                <input
                  type="number"
                  name="eggsCount"
                  value={formData.eggsCount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Hatching Rate (%)</label>
                <input
                  type="number"
                  name="hatchingRate"
                  value={formData.hatchingRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label>pH Level</label>
                <input
                  type="number"
                  name="phLevel"
                  value={formData.phLevel}
                  onChange={handleChange}
                  min="0"
                  max="14"
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
                  <h3>{record.species}</h3>
                  <button onClick={() => handleDelete(record.id)} className="delete-btn">×</button>
                </div>
                <div className="record-details">
                  <p><strong>Date:</strong> {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Eggs Count:</strong> {record.eggsCount}</p>
                  {record.hatchingRate && <p><strong>Hatching Rate:</strong> {record.hatchingRate}%</p>}
                  {record.waterTemp && <p><strong>Water Temp:</strong> {record.waterTemp}°C</p>}
                  {record.phLevel && <p><strong>pH Level:</strong> {record.phLevel}</p>}
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

export default Hatchery;

