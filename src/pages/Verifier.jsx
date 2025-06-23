import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import './Verifier.css';

export default function Verifier() {
  const [credentialHash, setCredentialHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Mock credential data
  const mockCredentials = [
    {
      hash: "abc123xyz",
      studentName: "Chris M.",
      degreeTitle: "B.Tech Computer Engineering",
      gpa: "3.8",
      issuedDate: "June 15, 2025"
    },
    {
      hash: "def456uvw",
      studentName: "Jane Doe",
      degreeTitle: "B.Sc Data Science",
      gpa: "3.7",
      issuedDate: "May 12, 2025"
    },
    {
      hash: "ghi789rst",
      studentName: "John Smith",
      degreeTitle: "M.Sc Artificial Intelligence",
      gpa: "3.9",
      issuedDate: "July 20, 2025"
    }
  ];

  const handleVerification = (e) => {
    e.preventDefault();
    
    if (!credentialHash.trim()) {
      alert('Please enter a credential hash or ID');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const foundCredential = mockCredentials.find(
        cred => cred.hash.toLowerCase() === credentialHash.toLowerCase()
      );
      
      setVerificationResult(foundCredential);
      setIsVerifying(false);
    }, 1000);
  };

  const handleTryAgain = () => {
    setCredentialHash('');
    setVerificationResult(null);
  };

  return (
    <div className="verifier-container">
      <div className="verifier-header">
        <div className="header-content">
          <div className="flag-corner">🇨🇲</div>
          <h1 className="verifier-title">Verify Academic Credential</h1>
          <p className="verifier-subtitle">
            Enter a credential hash or ID to verify its authenticity on the blockchain
          </p>
          <div className="blockchain-badge">
            <span className="badge-icon">🔗</span>
            Blockchain-secured verification
          </div>
          {user && (
            <div className="verifier-user-summary">
              <div className="verifier-avatar">
                {profile && profile.fullName ? profile.fullName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
              <div className="verifier-user-info">
                <span className="verifier-user-name">{profile && profile.fullName ? profile.fullName : user.email}</span>
                <span className="verifier-user-role">{profile && profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Verifier'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="verifier-content">
        <div className="verification-form-container">
          <form onSubmit={handleVerification} className="verification-form">
            <div className="form-group">
              <label htmlFor="credentialHash" className="form-label">
                Credential Hash or ID
              </label>
              <input
                type="text"
                id="credentialHash"
                value={credentialHash}
                onChange={(e) => setCredentialHash(e.target.value)}
                placeholder="Enter credential hash or ID"
                className="form-input"
                disabled={isVerifying}
              />
            </div>
            <button 
              type="submit" 
              className="verify-btn"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Credential'}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="result-container">
            <div className="credential-card">
              <div className="card-header">
                <div className="card-logo">🎓</div>
                <div className="card-status valid">Valid ✅</div>
              </div>
              <div className="card-content">
                <h3 className="student-name">{verificationResult.studentName}</h3>
                <div className="degree-info">
                  <p className="degree-title">{verificationResult.degreeTitle}</p>
                  <div className="gpa-info">
                    <span className="gpa-label">GPA:</span>
                    <span className="gpa-value">{verificationResult.gpa}</span>
                  </div>
                </div>
                <div className="issued-date">
                  <span className="date-label">Issued:</span>
                  <span className="date-value">{verificationResult.issuedDate}</span>
                </div>
                <div className="hash-info">
                  <span className="hash-label">Hash:</span>
                  <span className="hash-value">{verificationResult.hash}</span>
                </div>
              </div>
              <div className="verification-footer">
                <div className="verification-badge">
                  <span className="badge-icon">🔒</span>
                  Verified on EduChain CM Blockchain
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationResult === false && (
          <div className="result-container">
            <div className="error-card">
              <div className="error-icon">❌</div>
              <h3 className="error-title">Credential Not Found or Invalid</h3>
              <p className="error-message">
                The credential hash you entered could not be found in our blockchain records.
                Please verify the hash and try again.
              </p>
              <button onClick={handleTryAgain} className="try-again-btn">
                Try Another Hash
              </button>
            </div>
          </div>
        )}

        {/* Sample Hashes for Testing */}
        <div className="sample-hashes">
          <h3 className="sample-title">Sample Hashes for Testing:</h3>
          <div className="hash-list">
            {mockCredentials.map((cred, index) => (
              <div key={index} className="hash-item">
                <span className="hash-text">{cred.hash}</span>
                <span className="hash-desc">- {cred.studentName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="verifier-footer">
        <div className="footer-content">
          <p>🔒 Powered by EduChain CM - Secure blockchain verification</p>
          <p>🌍 Global credential verification network</p>
        </div>
      </div>
    </div>
  );
} 