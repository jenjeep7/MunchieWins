import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { UserProfile, Win, WeightEntry, CustomChallenge } from '../types';

// User Profile Operations
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, 'users', userId);
    const now = new Date().toISOString();
    const profile: any = {
      name: profileData.name || '',
      startWeight: profileData.startWeight || 0,
      goalWeight: profileData.goalWeight || 0,
      streak: profileData.streak || 0,
      lastLogDate: profileData.lastLogDate || new Date().toISOString().split('T')[0],
      totalMoneySaved: profileData.totalMoneySaved || 0,
      totalCaloriesSaved: profileData.totalCaloriesSaved || 0,
      onboardingComplete: profileData.onboardingComplete || false,
      onboardingAnswers: profileData.onboardingAnswers || {},
      customChallenges: profileData.customChallenges || [],
      createdAt: now,
      updatedAt: now,
    };
    
    // Only add avatar if it exists
    if (profileData.avatar) {
      profile.avatar = profileData.avatar;
    }
    
    await setDoc(docRef, profile);
    return profile as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, 'users', userId);
    
    // Filter out undefined values
    const cleanUpdates: any = {
      updatedAt: new Date().toISOString(),
    };
    
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });
    
    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Win Operations
export const addWin = async (userId: string, win: Win) => {
  try {
    const winsRef = collection(db, 'users', userId, 'wins');
    await addDoc(winsRef, {
      ...win,
      timestamp: win.timestamp,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding win:', error);
    throw error;
  }
};

export const getUserWins = async (userId: string): Promise<Win[]> => {
  try {
    const winsRef = collection(db, 'users', userId, 'wins');
    const q = query(winsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Win[];
  } catch (error) {
    console.error('Error getting wins:', error);
    throw error;
  }
};

export const deleteWin = async (userId: string, winId: string) => {
  try {
    const winRef = doc(db, 'users', userId, 'wins', winId);
    await deleteDoc(winRef);
  } catch (error) {
    console.error('Error deleting win:', error);
    throw error;
  }
};

// Weight Entry Operations
export const addWeightEntry = async (userId: string, entry: WeightEntry) => {
  try {
    const weightRef = collection(db, 'users', userId, 'weight');
    await addDoc(weightRef, {
      ...entry,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding weight entry:', error);
    throw error;
  }
};

export const getUserWeightHistory = async (userId: string): Promise<WeightEntry[]> => {
  try {
    const weightRef = collection(db, 'users', userId, 'weight');
    const q = query(weightRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data()
    })) as WeightEntry[];
  } catch (error) {
    console.error('Error getting weight history:', error);
    throw error;
  }
};

// Challenge Operations
export const addCustomChallenge = async (userId: string, challenge: CustomChallenge) => {
  try {
    const challengeRef = collection(db, 'users', userId, 'challenges');
    await addDoc(challengeRef, {
      ...challenge,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding challenge:', error);
    throw error;
  }
};

export const getUserChallenges = async (userId: string): Promise<CustomChallenge[]> => {
  try {
    const challengeRef = collection(db, 'users', userId, 'challenges');
    const querySnapshot = await getDocs(challengeRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CustomChallenge[];
  } catch (error) {
    console.error('Error getting challenges:', error);
    throw error;
  }
};

export const updateChallenge = async (userId: string, challengeId: string, updates: Partial<CustomChallenge>) => {
  try {
    const challengeRef = doc(db, 'users', userId, 'challenges', challengeId);
    await updateDoc(challengeRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
};

// Sync all data from Firestore
export const syncDataFromFirestore = async (userId: string) => {
  try {
    const [profile, wins, weightHistory] = await Promise.all([
      getUserProfile(userId),
      getUserWins(userId),
      getUserWeightHistory(userId)
    ]);
    
    return {
      profile,
      wins,
      weightHistory
    };
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
};
