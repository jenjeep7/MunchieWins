export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  note?: string;
}

export enum WinType {
  SKIP = 'SKIP',
  SWAP = 'SWAP',
  GAVE_IN = 'GAVE_IN'
}

export interface Win {
  id: string;
  item: string;
  category?: string;
  replacement?: string;
  caloriesSaved: number;
  moneySaved: number;
  timestamp: number;
  type: WinType;
  mascotMessage?: string;
}

export interface CustomChallenge {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface UserProfile {
  name: string;
  startWeight: number;
  goalWeight: number;
  streak: number;
  lastLogDate: string;
  totalMoneySaved: number;
  totalCaloriesSaved: number;
  onboardingComplete: boolean;
  onboardingAnswers: Record<string, any>;
  avatar?: string;
  customChallenges?: CustomChallenge[];
  createdAt?: string;
  updatedAt?: string;
}
