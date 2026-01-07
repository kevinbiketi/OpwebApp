import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Settings from './Settings';
import BatchManagement from './BatchManagement';
import BatchReport from './BatchReport';
import Hatchery from '../Sections/Hatchery';
import PreGrowOut from '../Sections/PreGrowOut';
import GrowOut from '../Sections/GrowOut';
import Puddling from '../Sections/Puddling';
import Quarantine from '../Sections/Quarantine';

const Dashboard = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [farmSettings, setFarmSettings] = useState({
    farmName: 'Fish Farm Management',
    logo: null
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('farmSettings');
    if (savedSettings) {
      setFarmSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingsUpdate = (newSettings) => {
    setFarmSettings(newSettings);
    localStorage.setItem('farmSettings', JSON.stringify(newSettings));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-header">
          {farmSettings.logo ? (
            <img src={farmSettings.logo} alt="Farm Logo" className="farm-logo" />
          ) : (
            <div className="farm-logo-placeholder">🐟</div>
          )}
          <h2 className="farm-name">{farmSettings.farmName}</h2>
        </div>
        <div className="nav-menu">
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') && location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/dashboard/hatchery" 
            className={`nav-item ${isActive('/dashboard/hatchery') ? 'active' : ''}`}
          >
            Hatchery
          </Link>
          <Link 
            to="/dashboard/pre-grow-out" 
            className={`nav-item ${isActive('/dashboard/pre-grow-out') ? 'active' : ''}`}
          >
            Pre-Grow Out
          </Link>
          <Link 
            to="/dashboard/grow-out" 
            className={`nav-item ${isActive('/dashboard/grow-out') ? 'active' : ''}`}
          >
            Grow-Out
          </Link>
          <Link 
            to="/dashboard/puddling" 
            className={`nav-item ${isActive('/dashboard/puddling') ? 'active' : ''}`}
          >
            Puddling
          </Link>
          <Link 
            to="/dashboard/quarantine" 
            className={`nav-item ${isActive('/dashboard/quarantine') ? 'active' : ''}`}
          >
            Quarantine
          </Link>
          <Link 
            to="/dashboard/batches" 
            className={`nav-item ${isActive('/dashboard/batches') ? 'active' : ''}`}
          >
            Batch Management
          </Link>
          <Link 
            to="/dashboard/reports" 
            className={`nav-item ${isActive('/dashboard/reports') ? 'active' : ''}`}
          >
            Reports
          </Link>
        </div>
        <div className="nav-footer">
          <Link to="/dashboard/settings" className="nav-item">
            ⚙️ Settings
          </Link>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
      <main className="dashboard-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route 
            path="/settings" 
            element={<Settings settings={farmSettings} onUpdate={handleSettingsUpdate} />} 
          />
          <Route path="/batches" element={<BatchManagement />} />
          <Route path="/reports" element={<BatchReport />} />
          <Route path="/hatchery" element={<Hatchery />} />
          <Route path="/pre-grow-out" element={<PreGrowOut />} />
          <Route path="/grow-out" element={<GrowOut />} />
          <Route path="/puddling" element={<Puddling />} />
          <Route path="/quarantine" element={<Quarantine />} />
        </Routes>
      </main>
    </div>
  );
};

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <h1>Welcome to Fish Farm Management</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Batches</h3>
          <p className="stat-number">
            {JSON.parse(localStorage.getItem('batches') || '[]').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Active Sections</h3>
          <p className="stat-number">5</p>
        </div>
        <div className="stat-card">
          <h3>System Status</h3>
          <p className="stat-number">✓ Operational</p>
        </div>
      </div>
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/dashboard/batches" className="action-card">
            <h3>Add New Batch</h3>
            <p>Create a new batch record</p>
          </Link>
          <Link to="/dashboard/reports" className="action-card">
            <h3>Generate Report</h3>
            <p>Create batch reports</p>
          </Link>
          <Link to="/dashboard/hatchery" className="action-card">
            <h3>Hatchery</h3>
            <p>Manage hatchery operations</p>
          </Link>
          <Link to="/dashboard/settings" className="action-card">
            <h3>Settings</h3>
            <p>Configure farm settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

