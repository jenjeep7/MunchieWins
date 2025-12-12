import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { UserProfile, WeightEntry } from '../types';
import { WeightChart } from '../components/WeightChart';
import { MunchyMascot } from '../components/MunchyMascot';
import { Scale } from 'lucide-react-native';

interface WeightPageProps {
  profile: UserProfile;
  weightHistory: WeightEntry[];
  onAddWeight: (w: number) => void;
}

export const WeightPage = ({ profile, weightHistory, onAddWeight }: WeightPageProps) => {
  const [newWeight, setNewWeight] = useState('');
  const [analysis, setAnalysis] = useState('');

  const handleWeightSubmit = async () => {
    const w = parseFloat(newWeight);
    if (w) {
      onAddWeight(w);
      setNewWeight('');
      setAnalysis("Great progress! Keep it up.");
    }
  };

  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : profile.startWeight;

  return (
    <ScrollView className="flex-1 bg-[#E5E7EB]">
      <View className="p-6 pb-24 pt-8">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Weight Tracker</Text>
            <Text className="text-xs text-gray-500">Keep it up!</Text>
          </View>
          <MunchyMascot mood="proud" size="sm" />
        </View>
        
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2">
              <Scale size={18} color="#374151" />
              <Text className="font-bold text-gray-700">Update Weight</Text>
            </View>
            <Text className="text-xs text-gray-400">Goal: {profile.goalWeight} lbs</Text>
          </View>
          
          <View className="flex-row gap-2">
            <TextInput 
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder={currentWeight.toString()}
              className="flex-1 p-3 bg-gray-50 rounded-xl"
            />
            <TouchableOpacity 
              onPress={handleWeightSubmit}
              className="bg-black px-6 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">Log</Text>
            </TouchableOpacity>
          </View>
          
          {analysis && (
            <View className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <Text className="text-sm text-gray-600 italic">"{analysis}"</Text>
            </View>
          )}
        </View>
        
        <WeightChart data={weightHistory} />
      </View>
    </ScrollView>
  );
};
