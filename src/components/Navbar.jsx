import './Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user profile from Firestore
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

  const handleNavClick = (role) => {
    if (user) {
      if (role === 'issuer') navigate('/issuer');
      else if (role === 'wallet') navigate('/wallet');
      else if (role === 'verifier') navigate('/verifier');
    } else {
      navigate('/auth', { state: { intendedRole: role } });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">EduChain <span className="navbar-logo-cm">CM</span></a>
      </div>
      <div className="navbar-links">
        <button
          className={location.pathname === '/issuer' ? 'active' : ''}
          onClick={() => handleNavClick('issuer')}
        >
          Issuer
        </button>
        <button
          className={location.pathname === '/wallet' ? 'active' : ''}
          onClick={() => handleNavClick('wallet')}
        >
          Wallet
        </button>
        <button
          className={location.pathname === '/verifier' ? 'active' : ''}
          onClick={() => handleNavClick('verifier')}
        >
          Verifier
        </button>
        {user && (
          <div className="navbar-user">
            <span className="navbar-user-avatar">
              {profile && profile.fullName ? profile.fullName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
            </span>
            <span className="navbar-user-name">
              {profile && profile.fullName ? profile.fullName : user.email}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
} 