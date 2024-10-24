import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Create the context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUserData = async (currentUser) => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            ...currentUser,
            role: userData.isWorker ? 'worker' : userData.isAdmin ? 'admin' : 'none',
            branchId: userData.branchId || null, // Include branch ID for worker
          });
        }
        setLoading(false);
      };
  
      // Listen to auth state changes
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          fetchUserData(currentUser);
        } else {
          setUser(null);
          setLoading(false);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };