import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Issuer.css';

const CredentialsList = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    sortBy: 'issueDate',
    sortOrder: 'desc',
  });

  useEffect(() => {
    // Simulate API call
    const fetchCredentials = async () => {
      setLoading(true);
      try {
        // TODO: Fetch credentials from blockchain/Firestore here
        setCredentials([]); // Start with empty
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return '⇅';
    return filters.sortOrder === 'asc' ? '↑' : '↓';
  };

  // Filter and sort credentials
  const filteredAndSortedCredentials = [...credentials]
    .filter(cred => {
      const matchesSearch = 
        cred.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.field.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || cred.status === filters.status;
      const matchesType = filters.type === 'all' || cred.type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === 'issueDate') {
        comparison = new Date(a.issueDate) - new Date(b.issueDate);
      } else if (filters.sortBy === 'studentName') {
        comparison = a.studentName.localeCompare(b.studentName);
      } else if (filters.sortBy === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (filters.sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge status-badge-success';
      case 'expired':
        return 'status-badge status-badge-warning';
      case 'revoked':
        return 'status-badge status-badge-danger';
      default:
        return 'status-badge';
    }
  };

  // Get unique credential types for filter dropdown
  const credentialTypes = [...new Set(credentials.map(cred => cred.type))];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Credentials</h1>
          <p>View and manage all issued academic credentials</p>
        </div>
        <Link to="/issuer/issue" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Issue New Credential
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-filter">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <div className="filters">
              <div className="filter-group">
                <label>Status:</label>
                <select 
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Type:</label>
                <select 
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  {credentialTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading credentials...</p>
          </div>
        ) : filteredAndSortedCredentials.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3>No credentials found</h3>
            <p>No credentials match your search criteria. Try adjusting your filters or issue a new credential.</p>
            <Link to="/issuer/issue" className="btn btn-primary mt-2">
              Issue New Credential
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('id')}
                  >
                    ID {getSortIcon('id')}
                  </th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('studentName')}
                  >
                    Student {getSortIcon('studentName')}
                  </th>
                  <th>Email</th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('type')}
                  >
                    Type {getSortIcon('type')}
                  </th>
                  <th>Field of Study</th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('issueDate')}
                  >
                    Issue Date {getSortIcon('issueDate')}
                  </th>
                  <th>Expiry Date</th>
                  <th 
                    className="sortable" 
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCredentials.map((credential) => (
                  <tr key={credential.id}>
                    <td>
                      <div className="font-mono text-sm">{credential.id}</div>
                    </td>
                    <td>
                      <div className="font-medium">{credential.studentName}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-600">{credential.studentEmail}</div>
                    </td>
                    <td>{credential.type}</td>
                    <td>{credential.field}</td>
                    <td>{new Date(credential.issueDate).toLocaleDateString()}</td>
                    <td>
                      {credential.expiryDate 
                        ? new Date(credential.expiryDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(credential.status)}>
                        {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn-icon" 
                          title="View Details"
                          onClick={() => console.log('View:', credential.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Download"
                          onClick={() => console.log('Download:', credential.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Revoke"
                          onClick={() => console.log('Revoke:', credential.id)}
                          disabled={credential.status === 'revoked'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredAndSortedCredentials.length > 0 && (
          <div className="table-footer">
            <div className="table-info">
              Showing {filteredAndSortedCredentials.length} of {credentials.length} credentials
            </div>
            <div className="pagination">
              <button className="btn-icon" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <span className="page-info">Page 1 of 1</span>
              <button className="btn-icon" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialsList;
