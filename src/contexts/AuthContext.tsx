import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '../lib/firebase';
import { ref as dbRef, set, get, child } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

interface ClubData {
  clubName: string;
  logoUrl: string;
  createdAt: number;
  userId: string; // Add userId to track ownership
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clubData: ClubData | null;
  setupClub: (clubName: string, logoFile: File) => Promise<void>;
  refreshClubData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [clubData, setClubData] = useState<ClubData | null>(null);

  const fetchClubData = async (userId: string) => {
    try {
      // First check if this user is associated with any club
      const userClubRef = dbRef(db, `userClubs/${userId}`);
      const userClubSnapshot = await get(userClubRef);
      
      if (userClubSnapshot.exists()) {
        const clubId = userClubSnapshot.val();
        const clubSnapshot = await get(child(dbRef(db), `clubs/${clubId}`));
        
        if (clubSnapshot.exists()) {
          const data = clubSnapshot.val() as ClubData;
          // Refresh the logo URL from Storage
          const logoRef = storageRef(storage, `clubs/${clubId}/logo`);
          const freshLogoUrl = await getDownloadURL(logoRef);
          setClubData({ ...data, logoUrl: freshLogoUrl });
        }
      } else {
        setClubData(null);
      }
    } catch (error) {
      console.error('Error fetching club data:', error);
      setClubData(null);
    }
  };

  const refreshClubData = async () => {
    if (user) {
      await fetchClubData(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchClubData(user.uid);
      } else {
        setClubData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setupClub = async (clubName: string, logoFile: File) => {
    if (!user) return;

    try {
      // Check if user already has a club
      const userClubRef = dbRef(db, `userClubs/${user.uid}`);
      const userClubSnapshot = await get(userClubRef);
      
      if (userClubSnapshot.exists()) {
        throw new Error('You already have a registered club');
      }

      // Upload logo
      const fileRef = storageRef(storage, `clubs/${user.uid}/logo`);
      await uploadBytes(fileRef, logoFile);
      const logoUrl = await getDownloadURL(fileRef);

      const clubData: ClubData = {
        clubName,
        logoUrl,
        createdAt: Date.now(),
        userId: user.uid,
      };

      // Create club data
      await set(dbRef(db, `clubs/${user.uid}`), clubData);
      
      // Create user-club association
      await set(userClubRef, user.uid);

      setClubData(clubData);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to setup club');
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    clubData,
    setupClub,
    refreshClubData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};