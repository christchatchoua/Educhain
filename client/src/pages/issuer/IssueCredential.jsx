import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Issuer.css';
import { db } from '../../services/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { issueCredential } from '../../services/eduChainContract';
import { ethers } from 'ethers';

const IssueCredential = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentWallet: '',
    specialty: '',
    level: '',
    institutionName: '',
    gpa: '',
    graduationDate: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Check for MetaMask
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask and refresh the page.');
      }
      // Prompt MetaMask connection
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No Ethereum accounts found. Please unlock MetaMask and try again.');
      }
      // Safely initialize ethers Web3Provider
      let provider;
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      } catch (err) {
        throw new Error('Failed to initialize Web3 provider.');
      }
      // Create signer
      let signer;
      try {
        signer = provider.getSigner();
      } catch (err) {
        throw new Error('Failed to get signer from provider.');
      }
      const issuerAddress = await signer.getAddress();
      const credentialId = crypto.randomUUID();
      const issueDate = Math.floor(Date.now() / 1000); // now, as UNIX timestamp
      const graduationTimestamp = formData.graduationDate ? Math.floor(new Date(formData.graduationDate).getTime() / 1000) : 0;
      // Use the signer to connect to the contract and call issueCredential
      const tx = await issueCredential({
        signer,
        holder: formData.studentWallet,
        degreeTitle: formData.specialty,
        institutionName: formData.institutionName,
        issueDate,
        credentialId
      });
      // Store in Firestore
      await setDoc(doc(db, 'credentials', credentialId), {
        credentialId,
        studentName: formData.studentName,
        specialty: formData.specialty,
        level: formData.level,
        institutionName: formData.institutionName,
        GPA: formData.gpa,
        graduationDate: formData.graduationDate,
        issuer: issuerAddress,
        holder: formData.studentWallet,
        issueDate,
        blockchainTx: tx.hash || '',
      });
      setSuccessMsg('Credential issued and saved successfully!');
      setFormData({ studentName: '', studentWallet: '', specialty: '', level: '', institutionName: '', gpa: '', graduationDate: '' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to issue credential.');
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
              <label>Student Name <span className="required">*</span></label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Student Wallet Address <span className="required">*</span></label>
              <input type="text" name="studentWallet" value={formData.studentWallet} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Specialty <span className="required">*</span></label>
              <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Level <span className="required">*</span></label>
              <select name="level" value={formData.level} onChange={handleChange} required>
                <option value="">Select Level</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Institution Name <span className="required">*</span></label>
              <input type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>GPA (optional)</label>
              <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Graduation Date <span className="required">*</span></label>
              <input type="date" name="graduationDate" value={formData.graduationDate} onChange={handleChange} required />
            </div>
          </div>
        </div>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {successMsg && <div className="success-message">{successMsg}</div>}
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
