import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, signOut } from 'firebase/auth';
import './Issuer.css';

function LogoutButton() {
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = '/auth';
  };
  return (
    <button className="logout-btn" onClick={handleLogout} style={{margin:'1rem 0',padding:'0.7rem 1.5rem',background:'#ce1126',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>Logout</button>
  );
}

export default function Issuer() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      studentId: 'STU001',
      name: 'John Doe',
      degree: 'Bachelor of Computer Science',
      gpa: '3.8',
      issuedDate: '2024-01-15'
    },
    {
      id: 2,
      studentId: 'STU002',
      name: 'Jane Smith',
      degree: 'Master of Business Administration',
      gpa: '3.9',
      issuedDate: '2024-01-20'
    }
  ]);
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    degreeTitle: '',
    gpa: '',
    graduationDate: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.studentName || !formData.studentId || !formData.degreeTitle || 
        !formData.gpa || !formData.graduationDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Add new credential
    const newCredential = {
      id: credentials.length + 1,
      studentId: formData.studentId,
      name: formData.studentName,
      degree: formData.degreeTitle,
      gpa: formData.gpa,
      issuedDate: new Date().toISOString().split('T')[0]
    };

    setCredentials(prev => [...prev, newCredential]);
    
    // Reset form
    setFormData({
      studentName: '',
      studentId: '',
      degreeTitle: '',
      gpa: '',
      graduationDate: ''
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderDashboard = () => (
    <div className="issuer-dashboard-content">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-number">{credentials.length}</div>
            <div className="stat-label">Total Credentials Issued</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <div className="stat-number">3</div>
            <div className="stat-label">Degree Types</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-number">2024</div>
            <div className="stat-label">Current Year</div>
          </div>
        </div>
      </div>
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <p>Welcome to EduChain CM Issuer Dashboard. Start by adding new credentials or view existing ones.</p>
      </div>
    </div>
  );

  const renderAddCredential = () => (
    <div className="issuer-add-credential">
      <h2>Add New Credential</h2>
      {showSuccess && (
        <div className="success-message">
          ✅ Credential added successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="credential-form">
        <div className="form-group">
          <label htmlFor="studentName">Student Full Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            required
            placeholder="Enter student's full name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="studentId">Student ID *</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            required
            placeholder="Enter student ID"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="degreeTitle">Degree Title *</label>
          <input
            type="text"
            id="degreeTitle"
            name="degreeTitle"
            value={formData.degreeTitle}
            onChange={handleInputChange}
            required
            placeholder="e.g., Bachelor of Computer Science"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gpa">GPA *</label>
          <input
            type="number"
            id="gpa"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
            required
            min="0"
            max="4"
            step="0.01"
            placeholder="Enter GPA (0.0 - 4.0)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="graduationDate">Graduation Date *</label>
          <input
            type="date"
            id="graduationDate"
            name="graduationDate"
            value={formData.graduationDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">
          Issue Credential
        </button>
      </form>
    </div>
  );

  const renderIssuedCredentials = () => (
    <div className="issuer-credentials">
      <h2>Issued Credentials</h2>
      <div className="credentials-table-container">
        <table className="credentials-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Degree</th>
              <th>GPA</th>
              <th>Issued Date</th>
            </tr>
          </thead>
          <tbody>
            {credentials.map(credential => (
              <tr key={credential.id}>
                <td>{credential.studentId}</td>
                <td>{credential.name}</td>
                <td>{credential.degree}</td>
                <td>{credential.gpa}</td>
                <td>{credential.issuedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'add-credential':
        return renderAddCredential();
      case 'issued-credentials':
        return renderIssuedCredentials();
      default:
        return renderDashboard();
    }
  };

  return (
    <ProtectedRoute requiredRole="issuer">
      <div>
        <LogoutButton />
        <div className="issuer-container">
          <div className="issuer-sidebar">
            <div className="sidebar-header">
              <h3>🎓 EduChain CM</h3>
              <p>Issuer Portal</p>
            </div>
            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </button>
              <button
                className={`nav-item ${activeTab === 'add-credential' ? 'active' : ''}`}
                onClick={() => setActiveTab('add-credential')}
              >
                <span className="nav-icon">➕</span>
                Add Credential
              </button>
              <button
                className={`nav-item ${activeTab === 'issued-credentials' ? 'active' : ''}`}
                onClick={() => setActiveTab('issued-credentials')}
              >
                <span className="nav-icon">📋</span>
                Issued Credentials
              </button>
            </nav>
          </div>
          <div className="issuer-main">
            {renderContent()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 