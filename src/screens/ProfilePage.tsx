import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { UserProfile, Win } from '../types';
import { Trophy, DollarSign, Settings, Edit2, Camera } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';
import * as ImagePicker from 'expo-image-picker';

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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photos to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onUpdateProfile({ avatar: result.assets[0].uri });
    }
  };

  const unlockedChallengesCount = wins.length > 0 
    ? 1 + (profile.streak >= 7 ? 1 : 0) + (profile.totalMoneySaved > 50 ? 1 : 0) 
    : 0;

  const memberSince = new Date().getFullYear();
  
  const primaryMotivation = Array.isArray(profile.onboardingAnswers?.motivation) 
    ? profile.onboardingAnswers.motivation[0] 
    : 'Weight Loss';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarEmoji}>👤</Text>
              )}
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.nameContainer}>
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput 
                  value={newName}
                  onChangeText={setNewName}
                  style={styles.nameInput}
                  maxLength={12}
                  autoFocus
                />
                <TouchableOpacity onPress={saveName}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{profile.name}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Edit2 size={16} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={styles.memberText}>Munchy Member since {memberSince}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.badgeCard}>
            <Trophy size={32} color={colors.yellow[600]} />
            <Text style={styles.statNumber}>{unlockedChallengesCount}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.savingsCard}>
            <DollarSign size={32} color={colors.green[600]} />
            <Text style={styles.statNumber}>${profile.totalMoneySaved.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
        </View>
        
        <View style={styles.goalsCard}>
          <View style={styles.goalsHeader}>
            <Settings size={18} color={colors.gray[800]} />
            <Text style={styles.goalsTitle}>Goals</Text>
          </View>
          
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Starting Weight</Text>
            <Text style={styles.goalValue}>{profile.startWeight} lbs</Text>
          </View>
          
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Goal Weight</Text>
            <Text style={[styles.goalValue, styles.goalValueOrange]}>{profile.goalWeight} lbs</Text>
          </View>
          
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Motivation</Text>
            <Text style={styles.goalValue}>{primaryMotivation}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 96,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gray[200],
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadows.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue[500],
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.lg,
  },
  nameContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    width: 128,
    padding: spacing.xs,
  },
  saveButton: {
    color: colors.green[600],
    fontWeight: '700',
    fontSize: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
  },
  memberText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: colors.yellow[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.yellow[100],
    alignItems: 'center',
  },
  savingsCard: {
    flex: 1,
    backgroundColor: colors.green[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.green[100],
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[800],
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  goalsCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  goalsTitle: {
    fontWeight: '700',
    color: colors.gray[800],
    fontSize: 16,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
  },
  goalLabel: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  goalValue: {
    fontWeight: '500',
    color: colors.gray[800],
    fontSize: 14,
  },
  goalValueOrange: {
    color: colors.primary,
  },
});
