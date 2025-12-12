import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { UserProfile, Win } from '../types';
import { DollarSign } from 'lucide-react-native';

interface SavingsPageProps {
  profile: UserProfile;
  wins: Win[];
}

export const SavingsPage = ({ profile, wins }: SavingsPageProps) => {
  return (
    <ScrollView className="flex-1 bg-[#E5E7EB]">
      <View className="p-6 pb-24 pt-8">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Savings</Text>
            <Text className="text-xs text-gray-500">Your healthy wallet</Text>
          </View>
          <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
            <DollarSign size={24} color="#16A34A" />
          </View>
        </View>
        
        <View className="bg-green-500 p-6 rounded-3xl shadow-lg items-center mb-6">
          <Text className="text-green-100 font-medium mb-1">Total Money Saved</Text>
          <Text className="text-5xl font-bold text-white">${profile.totalMoneySaved.toFixed(2)}</Text>
        </View>
        
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Text className="font-bold text-gray-800 mb-4">History</Text>
          {wins.filter(w => w.moneySaved !== 0).slice(0, 7).map(win => (
            <View key={win.id} className="flex-row justify-between items-center border-b border-gray-50 pb-2 mb-2">
              <Text className="font-medium text-gray-800 flex-1">{win.item}</Text>
              <Text className={`font-bold ${win.moneySaved > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {win.moneySaved > 0 ? '+' : '-'}${Math.abs(win.moneySaved).toFixed(2)}
              </Text>
            </View>
          ))}
          {wins.filter(w => w.moneySaved !== 0).length === 0 && (
            <Text className="text-center text-gray-400 text-sm">No savings data yet.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
