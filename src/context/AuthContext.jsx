import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import db from '../firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [perfil,  setPerfil]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const snap = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
          setPerfil(snap.exists() ? snap.data() : null);
        } catch (e) {
          console.log('Erro carregando perfil:', e);
          setPerfil(null);
        }
      } else {
        setUser(null);
        setPerfil(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = perfil?.permissao === 'Admin';
  const logout  = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, perfil, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
