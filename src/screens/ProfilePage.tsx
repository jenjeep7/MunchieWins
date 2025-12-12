import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { UserProfile, Win } from '../types';
import { Trophy, DollarSign, Settings, Edit2, Camera } from 'lucide-react-native';

interface ProfilePageProps {
  profile: UserProfile;
  wins: Win[];
  onUpdateProfile: (p: Partial<UserProfile>) => void;
}

export const ProfilePage = ({ profile, wins, onUpdateProfile }: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  const saveName = () => {
    onUpdateProfile({ name: newName });
    setIsEditing(false);
  };

  const unlockedChallengesCount = wins.length > 0 
    ? 1 + (profile.streak >= 7 ? 1 : 0) + (profile.totalMoneySaved > 50 ? 1 : 0) 
    : 0;

  return (
    <ScrollView className="flex-1 bg-[#E5E7EB]">
      <View className="p-6 pb-24 pt-8">
        <View className="items-center justify-center mb-6">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md items-center justify-center">
              <Text className="text-4xl">👤</Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg">
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>

          <View className="mt-4 items-center">
            {isEditing ? (
              <View className="flex-row items-center gap-2">
                <TextInput 
                  value={newName}
                  onChangeText={setNewName}
                  className="border-b-2 border-[#FF8C42] text-xl font-bold text-center w-32"
                  maxLength={12}
                  autoFocus
                />
                <TouchableOpacity onPress={saveName}>
                  <Text className="text-green-600 font-bold text-sm">Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-gray-900">{profile.name}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Edit2 size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text className="text-sm text-gray-500 mt-1">Munchy Member since 2024</Text>
        </View>

        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-yellow-50 p-4 rounded-2xl border border-yellow-100 items-center">
            <Trophy size={24} color="#CA8A04" className="mb-2" />
            <Text className="text-2xl font-bold text-gray-800">{unlockedChallengesCount}</Text>
            <Text className="text-xs text-gray-500 font-medium">Badges Earned</Text>
          </View>
          <View className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100 items-center">
            <DollarSign size={24} color="#16A34A" className="mb-2" />
            <Text className="text-2xl font-bold text-gray-800">${profile.totalMoneySaved.toFixed(0)}</Text>
            <Text className="text-xs text-gray-500 font-medium">Total Saved</Text>
          </View>
        </View>
        
        <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4">
            <Settings size={18} color="#374151" />
            <Text className="font-bold text-gray-800">Goals</Text>
          </View>
          
          <View className="border-b border-gray-50 pb-2 mb-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Starting Weight</Text>
              <Text className="font-medium">{profile.startWeight} lbs</Text>
            </View>
          </View>
          
          <View className="border-b border-gray-50 pb-2 mb-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Goal Weight</Text>
              <Text className="font-medium text-[#FF8C42]">{profile.goalWeight} lbs</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Motivation</Text>
            <Text className="font-medium">
              {Array.isArray(profile.onboardingAnswers?.motivation) 
                ? profile.onboardingAnswers.motivation.join(", ") 
                : (profile.onboardingAnswers?.motivation || "Health")}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
