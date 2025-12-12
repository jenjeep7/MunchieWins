import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet } from 'react-native';
import { UserProfile, Win, CustomChallenge } from '../types';
import { Plus, X, Star } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

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

  const recommendedChallenges = [
    { emoji: '🥤', title: 'No Soda Streak', description: 'Avoid all sugary carbonated dri...' },
    { emoji: '🍳', title: 'Home Cooking Hero', description: 'Cook dinner at home instead of...' },
    { emoji: '🍭', title: 'Sugar Detox', description: 'Skip dessert or candy.' },
    { emoji: '👟', title: 'Step It Up', description: 'Go for a walk instead of snacki...' },
  ];

  const exploreChallenges = [
    { emoji: '🍷', title: 'Dry Week' },
    { emoji: '💧', title: 'Hydration Champion' },
    { emoji: '🥦', title: 'Eat Your Greens' },
    { emoji: '💰', title: 'Wallet Warrior' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Challenges</Text>
            <Text style={styles.subtitle}>Level up your habits</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setIsCreating(true)}
            style={styles.customButton}
          >
            <Plus size={16} color="white" />
            <Text style={styles.customButtonText}>Custom</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={16} color={colors.gray[400]} />
            <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
          </View>
          
          {recommendedChallenges.map((challenge, index) => (
            <View key={index} style={styles.challengeCard}>
              <View style={styles.challengeIconContainer}>
                <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
              </View>
              <View style={styles.challengeContent}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLORE MORE</Text>
          
          <View style={styles.exploreGrid}>
            {exploreChallenges.map((challenge, index) => (
              <TouchableOpacity key={index} style={styles.exploreCard}>
                <Text style={styles.exploreEmoji}>{challenge.emoji}</Text>
                <Text style={styles.exploreTitle}>{challenge.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Create Modal */}
      <Modal
        visible={isCreating}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCreating(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Goal</Text>
              <TouchableOpacity onPress={() => setIsCreating(false)}>
                <X size={24} color={colors.gray[400]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Goal Name / Behavior</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="e.g. No Snacking After 8PM"
                  value={customTitle}
                  onChangeText={setCustomTitle}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={styles.inputGroupSmall}>
                  <Text style={styles.inputLabel}>Target</Text>
                  <TextInput 
                    keyboardType="numeric"
                    style={[styles.input, styles.inputCenter]}
                    value={customTarget}
                    onChangeText={setCustomTarget}
                  />
                </View>
                <View style={styles.inputGroupLarge}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <View style={styles.input}>
                    <Text style={styles.inputText}>{customUnit}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={handleCreate}
                disabled={!customTitle}
                style={[styles.createButton, !customTitle && styles.createButtonDisabled]}
              >
                <Text style={styles.createButtonText}>Create Challenge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.gray[800],
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  customButton: {
    backgroundColor: colors.gray[900],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  customButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[400],
    letterSpacing: 0.5,
  },
  challengeCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  challengeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeEmoji: {
    fontSize: 28,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  challengeDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  viewButton: {
    backgroundColor: colors.blue[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  viewButtonText: {
    color: colors.blue[500],
    fontSize: 14,
    fontWeight: '600',
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  exploreCard: {
    backgroundColor: colors.surface,
    width: '48%',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  exploreEmoji: {
    fontSize: 40,
  },
  exploreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.xl * 1.5,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
  },
  modalBody: {
    padding: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  input: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    fontWeight: '700',
    color: colors.gray[800],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputCenter: {
    textAlign: 'center',
  },
  inputText: {
    fontWeight: '700',
    color: colors.gray[800],
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputGroupSmall: {
    flex: 1,
  },
  inputGroupLarge: {
    flex: 1.5,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    backgroundColor: colors.gray[50],
  },
  createButton: {
    width: '100%',
    backgroundColor: colors.gray[900],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
});
