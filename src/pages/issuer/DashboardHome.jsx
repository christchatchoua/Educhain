import React from 'react';
import { Link } from 'react-router-dom';
import './Issuer.css';

const DashboardHome = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    { title: 'Total Credentials Issued', value: '1,250', change: '+12%', trend: 'up' },
    { title: 'Active Students', value: '850', change: '+5%', trend: 'up' },
    { title: 'Pending Approvals', value: '24', change: '-3%', trend: 'down' },
    { title: 'Verification Rate', value: '98%', change: '+2%', trend: 'up' },
  ];

  const recentCredentials = [
    { id: 'EC20240001', student: 'John Doe', type: 'Bachelor Degree', date: '2024-06-15', status: 'Issued' },
    { id: 'EC20240002', student: 'Jane Smith', type: 'Master Degree', date: '2024-06-14', status: 'Pending' },
    { id: 'EC20240003', student: 'Alex Johnson', type: 'Certificate', date: '2024-06-12', status: 'Issued' },
    { id: 'EC20240004', student: 'Sarah Williams', type: 'Diploma', date: '2024-06-10', status: 'Issued' },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <Link to="/issuer/issue" className="btn-primary">
          <img src="/src/assets/images/plus-icon.svg" alt="Issue New" />
          Issue New Credential
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="stat-value">
              <span>{stat.value}</span>
              <span className={`trend ${stat.trend}`}>
                {stat.change}
                {stat.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <h2>Recent Credentials</h2>
          <Link to="/issuer/credentials" className="view-all">View All</Link>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Credential ID</th>
                <th>Student</th>
                <th>Type</th>
                <th>Date Issued</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentCredentials.map((cred, index) => (
                <tr key={index}>
                  <td>{cred.id}</td>
                  <td>{cred.student}</td>
                  <td>{cred.type}</td>
                  <td>{cred.date}</td>
                  <td>
                    <span className={`status-badge ${cred.status.toLowerCase()}`}>
                      {cred.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" title="View Details">
                      <img src="/src/assets/images/eye-icon.svg" alt="View" />
                    </button>
                    <button className="btn-icon" title="Download">
                      <img src="/src/assets/images/download-icon.svg" alt="Download" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/issuer/issue" className="action-card">
            <div className="action-icon">
              <img src="/src/assets/images/certificate-icon.svg" alt="Issue Credential" />
            </div>
            <h3>Issue New Credential</h3>
            <p>Create and issue a new academic credential to a student</p>
          </Link>
          
          <Link to="/issuer/students" className="action-card">
            <div className="action-icon">
              <img src="/src/assets/images/students-icon.svg" alt="Manage Students" />
            </div>
            <h3>Manage Students</h3>
            <p>View and manage student records and credentials</p>
          </Link>
          
          <Link to="/issuer/templates" className="action-card">
            <div className="action-icon">
              <img src="/src/assets/images/template-icon.svg" alt="Templates" />
            </div>
            <h3>Credential Templates</h3>
            <p>Create and manage credential templates</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
