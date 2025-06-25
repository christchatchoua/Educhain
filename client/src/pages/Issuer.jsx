import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, signOut } from 'firebase/auth';
import './Issuer.css';
import { issueCredential } from '../services/eduChainContract';
import { ethers } from 'ethers';

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
  // Restore form state for input fields
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    degreeTitle: '',
    gpa: '',
    graduationDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Restore input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Placeholder for submit handler (to be replaced with smart contract logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);
    try {
      // Request wallet connection
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // Prepare credential data
      const holder = await signer.getAddress(); // For demo, issuer issues to self; replace with real holder address
      const degreeTitle = formData.degreeTitle;
      const institutionName = 'Demo University'; // Replace with real institution name if available
      const issueDate = Math.floor(new Date(formData.graduationDate).getTime() / 1000); // Unix timestamp
      const credentialId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(holder + degreeTitle + institutionName + issueDate));
      // Call smart contract
      await issueCredential({ signer, holder, degreeTitle, institutionName, issueDate, credentialId });
      setSuccessMsg('Credential issued successfully!');
      setFormData({ studentName: '', studentId: '', degreeTitle: '', gpa: '', graduationDate: '' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to issue credential.');
    } finally {
      setLoading(false);
    }
  };

  // Dashboard stats (to be fetched from contract/Firestore in the future)
  const totalCredentialsIssued = 0;
  const degreeTypes = 0;
  const currentYear = new Date().getFullYear();

  const renderDashboard = () => (
    <div className="issuer-dashboard-content">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-number">{totalCredentialsIssued}</div>
            <div className="stat-label">Total Credentials Issued</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <div className="stat-number">{degreeTypes}</div>
            <div className="stat-label">Degree Types</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-number">{currentYear}</div>
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

  // Add Credential form (restored, but no mock data logic)
  const renderAddCredential = () => (
    <div className="issuer-add-credential">
      <h2>Add New Credential</h2>
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
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Issuing...' : 'Issue Credential'}
        </button>
        {successMsg && <div className="success-message">✅ {successMsg}</div>}
        {errorMsg && <div className="error-message">❌ {errorMsg}</div>}
      </form>
    </div>
  );

  // Issued Credentials table (empty for now)
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
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>No credentials issued yet.</td>
            </tr>
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