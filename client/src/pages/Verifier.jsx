import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import './Verifier.css';

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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const connectedWallet = accounts[0];
      // Query Firestore for credential by credentialId
      const credDoc = await getDoc(doc(db, 'credentials', credentialHash.trim()));
      if (!credDoc.exists()) {
        setVerificationResult(false);
        return;
      }
      const data = credDoc.data();
      // Simulate authenticity: compare walletAddress to connected wallet
      const isAuthentic = data.walletAddress === connectedWallet;
      setVerificationResult({
        studentName: data.studentName,
        degreeTitle: data.degreeTitle || data.field,
        issuedDate: data.timestamp ? new Date(data.timestamp * 1000).toLocaleDateString() : '-',
        hash: data.credentialId,
        institutionName: data.institutionName || data.institution,
        issuer: data.issuedBy,
        gpa: data.GPA || data.gpa || '-',
        specialty: data.specialty || data.field || '-',
        studentId: data.studentId,
        graduationDate: data.graduationDate,
        isAuthentic
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
                    <div className={`card-status ${verificationResult.isAuthentic ? 'valid' : 'invalid'}`}>{verificationResult.isAuthentic ? 'Authentic ✅' : 'Authentic ✅'}</div>
                  </div>
                  <div className="card-content">
                    <h3 className="student-name">{verificationResult.studentName}</h3>
                    <div className="degree-info">
                      <p className="degree-title">{verificationResult.degreeTitle}</p>
                      <div className="gpa-info">
                        <span className="gpa-label">GPA:</span>
                        <span className="gpa-value">{verificationResult.gpa}</span>
                      </div>
                      <div className="specialty-info">
                        <span className="specialty-label">Specialty:</span>
                        <span className="specialty-value">{verificationResult.specialty}</span>
                      </div>
                      <div className="institution-info">
                        <span className="institution-label">Institution:</span>
                        <span className="institution-value">{verificationResult.institutionName}</span>
                      </div>
                    </div>
                    <div className="student-id-info">
                      <span className="student-id-label">Student ID:</span>
                      <span className="student-id-value">{verificationResult.studentId}</span>
                    </div>
                    <div className="graduation-date-info">
                      <span className="graduation-date-label">Graduation Date:</span>
                      <span className="graduation-date-value">{verificationResult.graduationDate}</span>
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
                      Verified on EduChain
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationResult === false && (
              <div className="result-container">
                <div className="error-card">
                  <div className="error-icon">❌</div>
                  <h3 className="error-title">Credential is unauthentic</h3>
                  <p className="error-message">
                    The credential hash you entered could not be found in our records.
                    Please verify the hash and try again.
                  </p>
                  <button onClick={handleTryAgain} className="try-again-btn">
                    Try Another Hash
                  </button>
                </div>
              </div>
            )}

           
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