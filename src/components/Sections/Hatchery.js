import React, { useState, useEffect } from 'react';
import { sectionAPI } from '../../services/api';
import './Section.css';

const Hatchery = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    species: '',
    eggs_count: '',
    hatching_rate: '',
    water_temp: '',
    ph_level: '',
    notes: ''
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await sectionAPI.getAll('hatchery');
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sectionAPI.create('hatchery', formData);
      setFormData({
        date: '',
        species: '',
        eggs_count: '',
        hatching_rate: '',
        water_temp: '',
        ph_level: '',
        notes: ''
      });
      setShowForm(false);
      loadRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Failed to create record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      try {
        await sectionAPI.delete('hatchery', id);
        loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
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
                  name="eggs_count"
                  value={formData.eggs_count}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Hatching Rate (%)</label>
                <input
                  type="number"
                  name="hatching_rate"
                  value={formData.hatching_rate}
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
                  name="water_temp"
                  value={formData.water_temp}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>pH Level</label>
                <input
                  type="number"
                  name="ph_level"
                  value={formData.ph_level}
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
        {loading ? (
          <div className="empty-state">Loading records...</div>
        ) : records.length === 0 ? (
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
                  <p><strong>Eggs Count:</strong> {record.eggs_count || record.eggsCount}</p>
                  {(record.hatching_rate || record.hatchingRate) && <p><strong>Hatching Rate:</strong> {(record.hatching_rate || record.hatchingRate)}%</p>}
                  {(record.water_temp || record.waterTemp) && <p><strong>Water Temp:</strong> {(record.water_temp || record.waterTemp)}°C</p>}
                  {(record.ph_level || record.phLevel) && <p><strong>pH Level:</strong> {(record.ph_level || record.phLevel)}</p>}
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

