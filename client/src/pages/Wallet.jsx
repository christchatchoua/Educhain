import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getMyCredentials } from '../services/eduChainContract';
import { ethers } from 'ethers';
import './Wallet.css';

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

// CredentialCard Component
function CredentialCard({ studentName, degreeTitle, gpa, issuedDate, credentialId }) {
  const [showHash, setShowHash] = useState(false);
  return (
    <div className="credential-card">
      <div className="card-header">
        <div className="card-logo">🎓</div>
        <div className="card-status">Verified</div>
      </div>
      <div className="card-content">
        <h3 className="student-name">{studentName}</h3>
        <div className="degree-info">
          <p className="degree-title">{degreeTitle}</p>
          <div className="gpa-info">
            <span className="gpa-label">GPA:</span>
            <span className="gpa-value">{gpa}</span>
          </div>
        </div>
        <div className="issued-date">
          <span className="date-label">Issued:</span>
          <span className="date-value">{issuedDate}</span>
        </div>
        {showHash && (
          <div className="hash-info">
            <span className="hash-label">Credential Hash:</span>
            <span className="hash-value">{credentialId}</span>
          </div>
        )}
      </div>
      <div className="card-actions">
        <button className="action-btn download-btn">
          📄 Download PDF
        </button>
        <button className="action-btn hash-btn" onClick={() => setShowHash((v) => !v)}>
          {showHash ? 'Hide Credential Hash' : 'Show Credential Hash'}
        </button>
      </div>
    </div>
  );
}

function WalletContent() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  // Fetch credentials from smart contract
  useEffect(() => {
    async function fetchCredentials() {
      setLoading(true);
      setErrorMsg('');
      try {
        if (!window.ethereum) throw new Error('MetaMask is not installed');
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const creds = await getMyCredentials(signer);
        setCredentials(creds);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to fetch credentials.');
      } finally {
        setLoading(false);
      }
    }
    fetchCredentials();
  }, [user]);

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <div className="welcome-section">
          <h1 className="wallet-title">Welcome to your EduChain Wallet</h1>
          <p className="wallet-subtitle">Manage and share your academic credentials securely</p>
        </div>
        <div className="avatar-section">
          <div className="student-avatar">
            {profile && profile.fullName ? profile.fullName.charAt(0).toUpperCase() : (user && user.email ? user.email.charAt(0).toUpperCase() : '👤')}
          </div>
          <div className="student-info">
            <span className="student-name">{profile && profile.fullName ? profile.fullName : (user ? user.email : 'Guest')}</span>
            <span className="student-id">{user ? user.uid : ''}</span>
          </div>
        </div>
      </div>

      <div className="credentials-section">
        <div className="credentials-header">
          <h2 className="section-title">Your Credentials</h2>
          <div className="credentials-count">
            {credentials.length} credential{credentials.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div>Loading credentials...</div>
        ) : errorMsg ? (
          <div className="error-message">❌ {errorMsg}</div>
        ) : credentials.length === 0 ? (
          <div>No credentials found.</div>
        ) : (
          <div className="credentials-grid">
            {credentials.map((credential, idx) => (
              <CredentialCard
                key={credential.credentialId || idx}
                studentName={profile && profile.fullName ? profile.fullName : 'Your Name'}
                degreeTitle={credential.degreeTitle}
                gpa={credential.gpa || '-'}
                issuedDate={new Date(credential.issueDate * 1000).toLocaleDateString()}
                credentialId={credential.credentialId}
              />
            ))}
          </div>
        )}
      </div>

      <div className="wallet-footer">
        <div className="footer-info">
          <p>🔒 Your credentials are securely stored on the blockchain</p>
          <p>🌍 Share them globally with employers and institutions</p>
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  return (
    <ProtectedRoute requiredRole="wallet">
      <div>
        <LogoutButton />
        <WalletContent />
      </div>
    </ProtectedRoute>
  );
} 