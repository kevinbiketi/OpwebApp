import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api';
import './Settings.css';

const Settings = ({ onUpdate }) => {
  const [farmName, setFarmName] = useState('');
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsAPI.get();
      setFarmName(settings.farm_name || settings.farmName || '');
      setLogo(settings.logo || null);
      if (onUpdate) {
        onUpdate({
          farmName: settings.farm_name || settings.farmName || 'Fish Farm Management',
          logo: settings.logo || null
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmNameChange = (e) => {
    setFarmName(e.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setMessage('');
      await settingsAPI.update(farmName || 'Fish Farm Management', logo);
      setMessage('Settings saved successfully!');
      if (onUpdate) {
        onUpdate({
          farmName: farmName || 'Fish Farm Management',
          logo: logo
        });
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to save settings');
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  if (loading) {
    return (
      <div className="settings-container">
        <h1>Farm Settings</h1>
        <div className="settings-card">
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1>Farm Settings</h1>
      <div className="settings-card">
        <h2>Farm Information</h2>
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="farmName">Farm Name</label>
          <input
            type="text"
            id="farmName"
            value={farmName}
            onChange={handleFarmNameChange}
            placeholder="Enter farm name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="logo">Farm Logo</label>
          <div className="logo-upload-section">
            {logo && (
              <div className="logo-preview">
                <img src={logo} alt="Farm Logo" />
                <button onClick={handleRemoveLogo} className="remove-logo-btn">
                  Remove
                </button>
              </div>
            )}
            <div className="file-input-wrapper">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="file-input"
              />
              <label htmlFor="logo" className="file-input-label">
                {logo ? 'Change Logo' : 'Upload Logo'}
              </label>
            </div>
          </div>
          <p className="help-text">Recommended size: 200x200px. Max size: 5MB</p>
        </div>

        <button onClick={handleSave} className="save-button">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;

