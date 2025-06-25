import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import './Verifier.css';
import { verifyCredential } from '../services/eduChainContract';
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

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!credentialHash.trim()) {
      alert('Please enter a credential hash or ID');
      return;
    }
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Call smart contract
      const result = await verifyCredential(provider, credentialHash.trim());
      setVerificationResult({
        studentName: result.holder,
        degreeTitle: result.degreeTitle,
        issuedDate: new Date(result.issueDate * 1000).toLocaleDateString(),
        hash: credentialHash.trim(),
        institutionName: result.institutionName,
        issuer: result.issuer
      });
    } catch (err) {
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTryAgain = () => {
    setCredentialHash('');
    setVerificationResult(null);
  };

  return (
    <ProtectedRoute requiredRole="verifier">
      <div>
        <LogoutButton />
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
                        <span className="gpa-label">Institution:</span>
                        <span className="gpa-value">{verificationResult.institutionName}</span>
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
                    <div className="issuer-info">
                      <span className="issuer-label">Issuer:</span>
                      <span className="issuer-value">{verificationResult.issuer}</span>
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
                {/* mockCredentials.map((cred, index) => (
                  <div key={index} className="hash-item">
                    <span className="hash-text">{cred.hash}</span>
                    <span className="hash-desc">- {cred.studentName}</span>
                  </div>
                )) */}
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
      </div>
    </ProtectedRoute>
  );
} 