import React, { useState, useEffect } from 'react';
import { batchesAPI } from '../../services/api';
import './BatchManagement.css';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    batchId: '',
    section: '',
    species: '',
    quantity: '',
    farmingSystem: 'semi-intensive',
    startDate: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await batchesAPI.getAll();
      setBatches(data);
    } catch (error) {
      console.error('Error loading batches:', error);
      setMessage('Failed to load batches');
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
    
    if (!formData.batchId || !formData.section || !formData.species || !formData.quantity) {
      setMessage('Please fill in all required fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await batchesAPI.create(formData);
      setFormData({
        batchId: '',
        section: '',
        species: '',
        quantity: '',
        farmingSystem: 'semi-intensive',
        startDate: '',
        notes: ''
      });
      setShowForm(false);
      setMessage('Batch added successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadBatches();
    } catch (error) {
      setMessage(error.message || 'Failed to add batch');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await batchesAPI.delete(id);
        setMessage('Batch deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        loadBatches();
      } catch (error) {
        setMessage(error.message || 'Failed to delete batch');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="batch-management">
      <div className="batch-header">
        <h1>Batch Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-batch-btn">
          {showForm ? 'Cancel' : '+ Add New Batch'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="batch-form-card">
          <h2>Add New Batch</h2>
          <form onSubmit={handleSubmit} className="batch-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="batchId">Batch ID *</label>
                <input
                  type="text"
                  id="batchId"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  placeholder="e.g., BATCH-001"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="section">Section *</label>
                <select
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="hatchery">Hatchery</option>
                  <option value="pre-grow-out">Pre-Grow Out</option>
                  <option value="grow-out">Grow-Out</option>
                  <option value="puddling">Puddling</option>
                  <option value="quarantine">Quarantine</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="species">Species *</label>
                <input
                  type="text"
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  placeholder="e.g., Tilapia, Salmon"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Number of fish"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="farmingSystem">Farming System *</label>
                <select
                  id="farmingSystem"
                  name="farmingSystem"
                  value={formData.farmingSystem}
                  onChange={handleChange}
                  required
                >
                  <option value="super-intensive">Super Intensive</option>
                  <option value="intensive">Intensive</option>
                  <option value="semi-intensive">Semi-Intensive</option>
                  <option value="extensive">Extensive</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional information about this batch"
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn">Add Batch</button>
          </form>
        </div>
      )}

      <div className="batches-list">
        <h2>All Batches ({batches.length})</h2>
        {loading ? (
          <div className="empty-state">
            <p>Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="empty-state">
            <p>No batches found. Add your first batch to get started.</p>
          </div>
        ) : (
          <div className="batches-grid">
            {batches.map(batch => (
              <div key={batch.id} className="batch-card">
                <div className="batch-card-header">
                  <h3>{batch.batchId}</h3>
                  <span className={`status-badge ${batch.status}`}>
                    {batch.status}
                  </span>
                </div>
                <div className="batch-details">
                  <div className="detail-item">
                    <span className="label">Section:</span>
                    <span className="value">{batch.section}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Species:</span>
                    <span className="value">{batch.species}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Quantity:</span>
                    <span className="value">{batch.quantity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Farming System:</span>
                    <span className={`value system-badge ${batch.farming_system || batch.farmingSystem}`}>
                      {batch.farming_system || batch.farmingSystem || 'semi-intensive'}
                    </span>
                  </div>
                  {batch.startDate && (
                    <div className="detail-item">
                      <span className="label">Start Date:</span>
                      <span className="value">
                        {new Date(batch.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {batch.notes && (
                    <div className="detail-item">
                      <span className="label">Notes:</span>
                      <span className="value">{batch.notes}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(batch.id)} 
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchManagement;

