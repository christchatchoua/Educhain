import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Issuer.css';

const IssueCredential = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    credentialType: 'degree',
    studentName: '',
    studentEmail: '',
    studentId: '',
    program: '',
    fieldOfStudy: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    description: '',
    additionalFields: []
  });

  const credentialTypes = [
    { value: 'degree', label: 'Degree' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'transcript', label: 'Transcript' },
    { value: 'other', label: 'Other' },
  ];

  const programs = [
    'Computer Science',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Law',
    'Arts',
    'Sciences',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddField = () => {
    setFormData(prev => ({
      ...prev,
      additionalFields: [
        ...prev.additionalFields,
        { name: '', value: '' }
      ]
    }));
  };

  const handleRemoveField = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalFields: prev.additionalFields.filter((_, i) => i !== index)
    }));
  };

  const handleAdditionalFieldChange = (index, field, value) => {
    const updatedFields = [...formData.additionalFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      additionalFields: updatedFields
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send the data to your backend/blockchain
      console.log('Issuing credential with data:', formData);
      
      // Show success message and redirect
      alert('Credential issued successfully!');
      navigate('/issuer/credentials');
    } catch (error) {
      console.error('Error issuing credential:', error);
      alert('Failed to issue credential. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Issue New Credential</h1>
        <p>Fill in the details below to issue a new academic credential.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="credential-form">
        <div className="form-section">
          <h3>Credential Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Credential Type <span className="required">*</span></label>
              <select
                name="credentialType"
                value={formData.credentialType}
                onChange={handleChange}
                required
              >
                {credentialTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Issue Date <span className="required">*</span></label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                min={formData.issueDate}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Student Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                placeholder="student@example.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Academic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Program <span className="required">*</span></label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
              >
                <option value="">Select a program</option>
                {programs.map(program => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Field of Study <span className="required">*</span></label>
              <input
                type="text"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                placeholder="e.g., Computer Science, Business Administration"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of this credential"
              rows="3"
            />
          </div>
        </div>
        
        <div className="form-section">
          <div className="section-header">
            <h3>Additional Fields</h3>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleAddField}
            >
              + Add Field
            </button>
          </div>
          
          {formData.additionalFields.length > 0 ? (
            <div className="additional-fields">
              {formData.additionalFields.map((field, index) => (
                <div key={index} className="form-row align-items-center">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) => handleAdditionalFieldChange(index, 'name', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleRemoveField(index)}
                    title="Remove field"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No additional fields added yet. Click "Add Field" to include custom information.</p>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/issuer/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Issuing...' : 'Issue Credential'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueCredential;
