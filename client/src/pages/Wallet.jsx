import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
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
function CredentialCard({ studentName, degreeTitle, gpa, issuedDate, credentialId, specialty, institutionName, studentId, graduationDate, issuer }) {
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
          <div className="specialty-info">
            <span className="specialty-label">Specialty:</span>
            <span className="specialty-value">{specialty || '-'}</span>
          </div>
          <div className="institution-info">
            <span className="institution-label">Institution:</span>
            <span className="institution-value">{institutionName || '-'}</span>
          </div>
        </div>
        <div className="student-id-info">
          <span className="student-id-label">Student ID:</span>
          <span className="student-id-value">{studentId}</span>
        </div>
        <div className="graduation-date-info">
          <span className="graduation-date-label">Graduation Date:</span>
          <span className="graduation-date-value">{graduationDate}</span>
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
        <div className="issuer-info">
          <span className="issuer-label">Issuer:</span>
          <span className="issuer-value">{issuer}</span>
        </div>
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
  // Student ID search state
  const [studentId, setStudentId] = useState('');
  const [searchedCredential, setSearchedCredential] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

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

  // Fetch credentials from Firestore by connected wallet address
  useEffect(() => {
    async function fetchCredentials() {
      setLoading(true);
      setErrorMsg('');
      try {
        if (!window.ethereum) throw new Error('MetaMask is not installed');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        // Query Firestore for credentials with walletAddress
        const querySnapshot = await import('firebase/firestore').then(({ collection, query, where, getDocs }) =>
          getDocs(query(collection(db, 'credentials'), where('walletAddress', '==', walletAddress)))
        );
        const creds = [];
        querySnapshot.forEach(doc => creds.push(doc.data()));
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

      {/* Student ID Search Section */}
      <div className="student-id-search-section" style={{margin:'2rem 0',padding:'1.5rem',background:'#f9f9f9',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <h2 style={{marginBottom:'1rem'}}>Find Credential by Student ID</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSearchLoading(true);
            setSearchError('');
            setSearchedCredential(null);
            try {
              const { collection, query, where, getDocs } = await import('firebase/firestore');
              const q = query(collection(db, 'credentials'), where('studentId', '==', studentId.trim()));
              const snapshot = await getDocs(q);
              if (snapshot.empty) {
                setSearchError('No credential found for this Student ID.');
                setSearchedCredential(null);
              } else {
                // Assume only one credential per studentId
                setSearchedCredential(snapshot.docs[0].data());
              }
            } catch (err) {
              setSearchError('Error searching for credential.');
            } finally {
              setSearchLoading(false);
            }
          }}
          style={{display:'flex',gap:'1rem',alignItems:'center'}}
        >
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            style={{padding:'0.7rem',borderRadius:'6px',border:'1px solid #ccc',fontSize:'1rem',minWidth:'200px'}}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={searchLoading} style={{padding:'0.7rem 1.5rem',fontWeight:'bold'}}>
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {searchError && <div className="error-message" style={{marginTop:'1rem'}}>{searchError}</div>}
        {searchedCredential && (
          <div style={{marginTop:'2rem'}}>
            <CredentialCard
              studentName={searchedCredential.studentName}
              degreeTitle={searchedCredential.degreeTitle || searchedCredential.field}
              gpa={searchedCredential.GPA || searchedCredential.gpa || '-'}
              issuedDate={searchedCredential.timestamp ? new Date(searchedCredential.timestamp * 1000).toLocaleDateString() : '-'}
              credentialId={searchedCredential.credentialId}
              specialty={searchedCredential.specialty || searchedCredential.field || '-'}
              institutionName={searchedCredential.institutionName || searchedCredential.institution || '-'}
              studentId={searchedCredential.studentId}
              graduationDate={searchedCredential.graduationDate}
              issuer={searchedCredential.issuedBy}
            />
            <div className="success-message" style={{marginTop:'1rem', color: 'green', fontWeight: 'bold'}}>Credential found.</div>
          </div>
        )}
        {!searchedCredential && !searchLoading && !searchError && studentId && (
          <div className="error-message" style={{marginTop:'1rem'}}>No credential found.</div>
        )}
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
        ) : credentials.length > 0 ? (
          <div className="credentials-grid">
            {credentials.map((credential, idx) => (
              <CredentialCard
                key={credential.credentialId || idx}
                studentName={credential.studentName || (profile && profile.fullName ? profile.fullName : 'Your Name')}
                degreeTitle={credential.degreeTitle || credential.field}
                gpa={credential.GPA || credential.gpa || '-'}
                issuedDate={credential.timestamp ? new Date(credential.timestamp * 1000).toLocaleDateString() : '-'}
                credentialId={credential.credentialId}
                specialty={credential.specialty || credential.field || '-'}
                institutionName={credential.institutionName || credential.institution || '-'}
                studentId={credential.studentId}
                graduationDate={credential.graduationDate}
                issuer={credential.issuedBy}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="wallet-footer">
        <div className="footer-info">
          <p>🔒 Your credentials are securely stored and verifiable</p>
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