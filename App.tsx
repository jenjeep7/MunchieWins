import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// import './global.css'; // Temporarily disabled

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { UserProfile, Win, WeightEntry, WinType, CustomChallenge } from './src/types';
import { AuthScreen } from './src/screens/AuthScreen';
import { Onboarding } from './src/screens/Onboarding';
import { Dashboard } from './src/screens/Dashboard';
import { TrackWin } from './src/screens/TrackWin';
import { WeightPage } from './src/screens/WeightPage';
import { SavingsPage } from './src/screens/SavingsPage';
import { ChallengesPage } from './src/screens/ChallengesPage';
import { ProfilePage } from './src/screens/ProfilePage';
import { Navigation } from './src/components/Navigation';
import { colors } from './src/styles/theme';

const STORAGE_KEYS = {
  PROFILE: 'munchy_profile_',
  WINS: 'munchy_wins_',
  WEIGHT: 'munchy_weight_',
};

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    startWeight: 0,
    goalWeight: 0,
    streak: 0,
    lastLogDate: '',
    totalMoneySaved: 0,
    totalCaloriesSaved: 0,
    onboardingComplete: false,
    onboardingAnswers: {}
  });

  const [wins, setWins] = useState<Win[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Persist data with user-specific keys
  useEffect(() => {
    if (!isLoading && user) {
      AsyncStorage.setItem(STORAGE_KEYS.PROFILE + user.uid, JSON.stringify(profile));
    }
  }, [profile, isLoading, user]);

  useEffect(() => {
    if (!isLoading && user) {
      AsyncStorage.setItem(STORAGE_KEYS.WINS + user.uid, JSON.stringify(wins));
    }
  }, [wins, isLoading, user]);

  useEffect(() => {
    if (!isLoading && user) {
      AsyncStorage.setItem(STORAGE_KEYS.WEIGHT + user.uid, JSON.stringify(weightHistory));
    }
  }, [weightHistory, isLoading, user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const profileData = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE + user.uid);
      const winsData = await AsyncStorage.getItem(STORAGE_KEYS.WINS + user.uid);
      const weightData = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT + user.uid);

      if (profileData) setProfile(JSON.parse(profileData));
      if (winsData) setWins(JSON.parse(winsData));
      if (weightData) setWeightHistory(JSON.parse(weightData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...data,
      onboardingComplete: true,
      lastLogDate: new Date().toISOString().split('T')[0]
    }));
  };

  const handleUpdateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const handleWinSave = (win: Win) => {
    setWins(prevWins => [win, ...prevWins]);
    
    // Update profile stats
    setProfile(prev => {
      const today = new Date().toISOString().split('T')[0];
      const isConsecutive = prev.lastLogDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = (today === prev.lastLogDate) ? prev.streak : (isConsecutive ? prev.streak + 1 : 1);

      return {
        ...prev,
        totalMoneySaved: prev.totalMoneySaved + win.moneySaved,
        totalCaloriesSaved: prev.totalCaloriesSaved + win.caloriesSaved,
        streak: newStreak,
        lastLogDate: today
      };
    });
    
    // Update custom challenges
    if (profile.customChallenges) {
      setProfile(prev => {
        const updatedChallenges = (prev.customChallenges || []).map(c => {
          if (c.unit === 'times') return { ...c, current: c.current + 1 };
          if (c.unit === 'dollars') return { ...c, current: c.current + (win.moneySaved > 0 ? win.moneySaved : 0) };
          return c;
        });
        return { ...prev, customChallenges: updatedChallenges };
      });
    }

    setShowTrackModal(false);
  };

  const handleAddWeight = (weight: number) => {
    const entry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      timestamp: Date.now(),
      userId: '', // Add proper user ID when auth is implemented
      note: ''
    };
    setWeightHistory(prev => [...prev, entry]);
  };

  const handleAddCustomChallenge = (challenge: CustomChallenge) => {
    setProfile(prev => ({
      ...prev,
      customChallenges: [...(prev.customChallenges || []), challenge]
    }));
  };

  const handleUpdateCustomChallenge = (id: string) => {
    setProfile(prev => ({
      ...prev,
      customChallenges: (prev.customChallenges || []).map(c => 
        c.id === id ? { ...c, current: c.current + 1 } : c
      )
    }));
  };

  // Show loading spinner while checking auth
  if (authLoading || isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  // Show auth screen if user is not logged in
  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthScreen />
      </SafeAreaProvider>
    );
  }

  // Show onboarding if not completed
  if (!profile.onboardingComplete) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Onboarding onComplete={handleOnboardingComplete} />
      </SafeAreaProvider>
    );
  }

  if (showTrackModal) {
    return (
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <TrackWin onSave={handleWinSave} onCancel={() => setShowTrackModal(false)} />
      </SafeAreaProvider>
    );
  }

  // Main app
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View className="flex-1 bg-[#E5E7EB]">
        {currentPage === 'dashboard' && (
          <Dashboard 
            profile={profile} 
            wins={wins} 
            onTrackClick={() => setShowTrackModal(true)} 
            onProfileClick={() => setCurrentPage('profile')}
          />
        )}
        
        {currentPage === 'weight' && (
          <WeightPage 
            profile={profile} 
            weightHistory={weightHistory} 
            onAddWeight={handleAddWeight}
          />
        )}

        {currentPage === 'savings' && (
          <SavingsPage profile={profile} wins={wins} />
        )}

        {currentPage === 'challenges' && (
          <ChallengesPage 
            profile={profile} 
            wins={wins} 
            onAddCustomChallenge={handleAddCustomChallenge}
            onUpdateCustomChallenge={handleUpdateCustomChallenge}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage 
            profile={profile} 
            wins={wins} 
            onUpdateProfile={handleUpdateProfile} 
          />
        )}

        <Navigation currentPage={currentPage} setPage={setCurrentPage} />
      </View>
    </SafeAreaProvider>
  );
}

// Wrap the app with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

