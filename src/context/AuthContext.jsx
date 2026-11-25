import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider, 
  signOut,
  reauthenticateWithPopup,
  deleteUser
} from 'firebase/auth';
import { auth } from '../firebase';
import { deleteUserData } from '../utils/deleteUserData';
import { setAccountDeletionInProgress } from '../utils/accountDeletion';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(auth, provider);
    } catch (err) {
      // If popup is blocked (common in Firefox), fall back to redirect
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
        return signInWithRedirect(auth, provider);
      }
      throw err;
    }
  }

  function logout() {
    return signOut(auth);
  }

  // Permanently delete the account and everything the app stores for it.
  // Firebase only allows this right after signing in, so we ask Google to confirm first.
  async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) return;
    await reauthenticateWithPopup(user, new GoogleAuthProvider());
    setAccountDeletionInProgress(true); // stop the app saving progress while we delete it
    try {
      await deleteUserData(user.uid);
      await deleteUser(user);
      localStorage.clear(); // progress and settings saved in this browser
    } finally {
      setAccountDeletionInProgress(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
