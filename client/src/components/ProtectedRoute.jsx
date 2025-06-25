import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ProtectedRoute({ requiredRole, children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  const [profile, setProfile] = useState(undefined);
  const location = useLocation();
  const [error, setError] = useState("");

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

  if (user === undefined || profile === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location, error: 'Please log in to access this page.' }} replace />;
  }

  if (!profile || profile.role !== requiredRole) {
    return <Navigate to="/auth" state={{ from: location, error: 'Access denied. Please login as the correct role.' }} replace />;
  }

  return children;
} 