// src/services/authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const signUpUser = async ({ email, password, fullName, role, institutionName }) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Create user document in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        fullName,
        role: role || 'holder',
        institutionName: institutionName || '',
        createdAt: new Date().toISOString(),
      });
      console.log('User document created in Firestore');
    } catch (firestoreError) {
      console.error('Error creating user document in Firestore:', firestoreError);
      return { error: firestoreError, user: null };
    }
    return { error: null, user };
  } catch (error) {
    console.error('Error signing up user:', error);
    return { error, user: null };
  }
};

export async function loginUser({ email, password }) {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Fetch the user's profile from Firestore
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const profile = userDoc.data();
        return { user, role: profile.role, profile };
      } else {
        return { error: new Error('User profile not found in Firestore'), user: null };
      }
    } catch (firestoreError) {
      return { error: firestoreError, user: null };
    }
  } catch (error) {
    return { error, user: null };
  }
}
