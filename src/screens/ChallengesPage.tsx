import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { UserProfile, Win, CustomChallenge } from '../types';
import { Plus, X, Zap, Star, CheckCircle } from 'lucide-react-native';

interface ChallengesPageProps {
  profile: UserProfile;
  wins: Win[];
  onAddCustomChallenge: (c: CustomChallenge) => void;
  onUpdateCustomChallenge: (id: string) => void;
}

export const ChallengesPage = ({ 
  profile, 
  wins, 
  onAddCustomChallenge, 
  onUpdateCustomChallenge 
}: ChallengesPageProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customTarget, setCustomTarget] = useState('5');
  const [customUnit, setCustomUnit] = useState('times');

  const handleCreate = () => {
    if (!customTitle) return;
    onAddCustomChallenge({
      id: Date.now().toString(),
      title: customTitle,
      target: parseInt(customTarget) || 5,
      current: 0,
      unit: customUnit
    });
    setIsCreating(false);
    setCustomTitle('');
    setCustomTarget('5');
  };

  return (
    <ScrollView className="flex-1 bg-[#E5E7EB]">
      <View className="p-6 pb-24 pt-8">
        <View className="flex-row justify-between items-end mb-8">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Challenges</Text>
            <Text className="text-sm text-gray-500">Level up your habits</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setIsCreating(true)}
            className="bg-black px-4 py-2 rounded-xl flex-row items-center gap-2"
          >
            <Plus size={16} color="white" />
            <Text className="text-white text-xs font-bold">Custom</Text>
          </TouchableOpacity>
        </View>

        {profile.customChallenges && profile.customChallenges.length > 0 && (
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Zap size={14} color="#9CA3AF" />
              <Text className="font-bold text-gray-400 text-xs uppercase tracking-wider">
                Active Goals
              </Text>
            </View>
            {profile.customChallenges.map(c => (
              <View key={c.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-bold text-lg text-gray-800 flex-1">{c.title}</Text>
                  <View className="bg-orange-50 px-2 py-1 rounded-lg">
                    <Text className="text-[#FF8C42] text-xs font-bold">
                      {c.current.toFixed(0)} / {c.target} {c.unit}
                    </Text>
                  </View>
                </View>
                
                <View className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden">
                  <View 
                    className="bg-[#FF8C42] h-full rounded-full"
                    style={{ width: `${Math.min((c.current / c.target) * 100, 100)}%` }}
                  />
                </View>
                
                {c.current >= c.target ? (
                  <View className="w-full py-3 bg-green-500 rounded-xl flex-row items-center justify-center gap-2">
                    <CheckCircle size={18} color="white" />
                    <Text className="text-white font-bold text-sm">Completed!</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={() => onUpdateCustomChallenge(c.id)}
                    className="w-full py-3 bg-gray-900 rounded-xl"
                  >
                    <Text className="text-white font-bold text-sm text-center">+ Log Progress</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {(!profile.customChallenges || profile.customChallenges.length === 0) && (
          <View className="py-12 items-center">
            <Text className="text-gray-400">No active challenges. Create one!</Text>
          </View>
        )}
      </View>

      {/* Create Modal */}
      <Modal
        visible={isCreating}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCreating(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className="bg-white w-full max-w-sm rounded-3xl overflow-hidden">
            <View className="p-6 border-b border-gray-100 flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">Create Goal</Text>
              <TouchableOpacity onPress={() => setIsCreating(false)}>
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <View className="p-6">
              <View className="mb-5">
                <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Goal Name / Behavior</Text>
                <TextInput 
                  className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-800 border-2 border-transparent"
                  placeholder="e.g. No Snacking After 8PM"
                  value={customTitle}
                  onChangeText={setCustomTitle}
                />
              </View>
              
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Target</Text>
                  <TextInput 
                    keyboardType="numeric"
                    className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-800 border-2 border-transparent text-center"
                    value={customTarget}
                    onChangeText={setCustomTarget}
                  />
                </View>
                <View className="flex-[1.5]">
                  <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Unit</Text>
                  <View className="w-full p-4 bg-gray-50 rounded-xl">
                    <Text className="font-bold text-gray-800">{customUnit}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View className="p-6 border-t border-gray-100 bg-gray-50">
              <TouchableOpacity 
                onPress={handleCreate}
                disabled={!customTitle}
                className={`w-full bg-black py-4 rounded-xl ${!customTitle ? 'opacity-50' : ''}`}
              >
                <Text className="text-white font-bold text-center">Create Challenge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
