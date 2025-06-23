import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import './Issuer.css';

// Helper to check if a path matches the current route
const isActive = (path, currentPath) => {
  if (path === '/issuer') {
    return currentPath === path || currentPath.startsWith(path + '/');
  }
  return currentPath === path;
};

const IssuerDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
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

  return (
    <div className="issuer-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/src/assets/images/university-icon.svg" alt="Educhain" />
          <h2>Educhain Issuer</h2>
        </div>
        <nav>
          <ul>
            <li className={isActive('/issuer/dashboard', currentPath) ? 'active' : ''}>
              <Link to="/issuer/dashboard">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={isActive('/issuer/issue', currentPath) ? 'active' : ''}>
              <Link to="/issuer/issue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <span>Issue Credential</span>
              </Link>
            </li>
            <li className={isActive('/issuer/credentials', currentPath) ? 'active' : ''}>
              <Link to="/issuer/credentials">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>My Credentials</span>
              </Link>
            </li>
            <li className={isActive('/issuer/students', currentPath) ? 'active' : ''}>
              <Link to="/issuer/students">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Students</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-menu">
            <span>Welcome, {profile && profile.fullName ? profile.fullName : (user ? user.email : 'Admin')}</span>
            <div className="avatar">
              <img src="/src/assets/images/user-icon.svg" alt="User" />
            </div>
          </div>
        </header>
        
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default IssuerDashboard;
