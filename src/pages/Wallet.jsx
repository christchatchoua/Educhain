import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import './Wallet.css';

// CredentialCard Component
function CredentialCard({ studentName, degreeTitle, gpa, issuedDate }) {
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
      </div>
      <div className="card-actions">
        <button className="action-btn download-btn">
          📄 Download PDF
        </button>
        <button className="action-btn hash-btn">
          🔗 Show Credential Hash
        </button>
      </div>
    </div>
  );
}

export default function Wallet() {
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

  // Mock data for student credentials
  const credentials = [
    {
      id: 1,
      studentName: profile && profile.fullName ? profile.fullName : 'Your Name',
      degreeTitle: "B.Tech Computer Engineering",
      gpa: "3.8",
      issuedDate: "June 15, 2025"
    },
    {
      id: 2,
      studentName: profile && profile.fullName ? profile.fullName : 'Your Name',
      degreeTitle: "M.Sc. Data Science",
      gpa: "3.9",
      issuedDate: "August 20, 2025"
    },
    {
      id: 3,
      studentName: profile && profile.fullName ? profile.fullName : 'Your Name',
      degreeTitle: "Certification in Blockchain Development",
      gpa: "4.0",
      issuedDate: "September 10, 2025"
    }
  ];

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

        <div className="credentials-grid">
          {credentials.map(credential => (
            <CredentialCard
              key={credential.id}
              studentName={credential.studentName}
              degreeTitle={credential.degreeTitle}
              gpa={credential.gpa}
              issuedDate={credential.issuedDate}
            />
          ))}
        </div>
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