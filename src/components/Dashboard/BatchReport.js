import React, { useState, useEffect } from 'react';
import './BatchReport.css';

const BatchReport = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [filters, setFilters] = useState({
    section: '',
    species: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const savedBatches = localStorage.getItem('batches');
    if (savedBatches) {
      const allBatches = JSON.parse(savedBatches);
      setBatches(allBatches);
      setFilteredBatches(allBatches);
    }
  }, []);

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filterValues) => {
    let filtered = [...batches];

    if (filterValues.section) {
      filtered = filtered.filter(b => b.section === filterValues.section);
    }

    if (filterValues.species) {
      filtered = filtered.filter(b => 
        b.species.toLowerCase().includes(filterValues.species.toLowerCase())
      );
    }

    if (filterValues.startDate) {
      filtered = filtered.filter(b => {
        if (!b.startDate) return false;
        return new Date(b.startDate) >= new Date(filterValues.startDate);
      });
    }

    if (filterValues.endDate) {
      filtered = filtered.filter(b => {
        if (!b.startDate) return false;
        return new Date(b.startDate) <= new Date(filterValues.endDate);
      });
    }

    setFilteredBatches(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      section: '',
      species: '',
      startDate: '',
      endDate: ''
    });
    setFilteredBatches(batches);
  };

  const handleGenerateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      totalBatches: filteredBatches.length,
      batches: filteredBatches,
      summary: {
        bySection: {},
        bySpecies: {},
        totalQuantity: 0
      }
    };

    filteredBatches.forEach(batch => {
      // Count by section
      reportData.summary.bySection[batch.section] = 
        (reportData.summary.bySection[batch.section] || 0) + 1;
      
      // Count by species
      reportData.summary.bySpecies[batch.species] = 
        (reportData.summary.bySpecies[batch.species] || 0) + 1;
      
      // Total quantity
      reportData.summary.totalQuantity += parseInt(batch.quantity) || 0;
    });

    // Create downloadable report
    const reportContent = generateReportText(reportData);
    downloadReport(reportContent, 'batch-report.txt');
  };

  const generateReportText = (data) => {
    let report = '='.repeat(60) + '\n';
    report += 'FISH FARM BATCH REPORT\n';
    report += '='.repeat(60) + '\n\n';
    report += `Generated: ${new Date(data.generatedAt).toLocaleString()}\n\n`;
    report += `Total Batches: ${data.totalBatches}\n`;
    report += `Total Quantity: ${data.summary.totalQuantity}\n\n`;
    
    report += 'SUMMARY BY SECTION\n';
    report += '-'.repeat(60) + '\n';
    Object.entries(data.summary.bySection).forEach(([section, count]) => {
      report += `${section}: ${count} batches\n`;
    });
    
    report += '\nSUMMARY BY SPECIES\n';
    report += '-'.repeat(60) + '\n';
    Object.entries(data.summary.bySpecies).forEach(([species, count]) => {
      report += `${species}: ${count} batches\n`;
    });
    
    report += '\n\nBATCH DETAILS\n';
    report += '='.repeat(60) + '\n';
    data.batches.forEach((batch, index) => {
      report += `\n${index + 1}. Batch ID: ${batch.batchId}\n`;
      report += `   Section: ${batch.section}\n`;
      report += `   Species: ${batch.species}\n`;
      report += `   Quantity: ${batch.quantity}\n`;
      if (batch.startDate) {
        report += `   Start Date: ${new Date(batch.startDate).toLocaleDateString()}\n`;
      }
      if (batch.notes) {
        report += `   Notes: ${batch.notes}\n`;
      }
      report += `   Status: ${batch.status}\n`;
    });
    
    return report;
  };

  const downloadReport = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="batch-report">
      <div className="report-header">
        <h1>Batch Reports</h1>
        <button onClick={handleGenerateReport} className="generate-btn" disabled={filteredBatches.length === 0}>
          Generate Report
        </button>
      </div>

      <div className="report-filters">
        <h2>Filter Batches</h2>
        <div className="filters-grid">
          <div className="form-group">
            <label htmlFor="section">Section</label>
            <select
              id="section"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
            >
              <option value="">All Sections</option>
              <option value="hatchery">Hatchery</option>
              <option value="pre-grow-out">Pre-Grow Out</option>
              <option value="grow-out">Grow-Out</option>
              <option value="puddling">Puddling</option>
              <option value="quarantine">Quarantine</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="species">Species</label>
            <input
              type="text"
              id="species"
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
              placeholder="Filter by species"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date (From)</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date (To)</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <button onClick={handleClearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      <div className="report-summary">
        <h2>Report Summary</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Batches</h3>
            <p className="summary-number">{filteredBatches.length}</p>
          </div>
          <div className="summary-card">
            <h3>Total Quantity</h3>
            <p className="summary-number">
              {filteredBatches.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="report-preview">
        <h2>Filtered Batches ({filteredBatches.length})</h2>
        {filteredBatches.length === 0 ? (
          <div className="empty-state">
            <p>No batches match the current filters.</p>
          </div>
        ) : (
          <div className="report-table">
            <table>
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Section</th>
                  <th>Species</th>
                  <th>Quantity</th>
                  <th>Start Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map(batch => (
                  <tr key={batch.id}>
                    <td>{batch.batchId}</td>
                    <td>{batch.section}</td>
                    <td>{batch.species}</td>
                    <td>{batch.quantity}</td>
                    <td>
                      {batch.startDate 
                        ? new Date(batch.startDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${batch.status}`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchReport;

