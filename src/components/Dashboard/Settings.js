import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ settings, onUpdate }) => {
  const [farmName, setFarmName] = useState(settings.farmName || '');
  const [logo, setLogo] = useState(settings.logo || null);
  const [message, setMessage] = useState('');

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

  const handleSave = () => {
    const newSettings = {
      farmName: farmName || 'Fish Farm Management',
      logo: logo
    };
    onUpdate(newSettings);
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoFile(null);
  };

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

