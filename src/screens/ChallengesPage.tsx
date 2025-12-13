import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet } from 'react-native';
import { UserProfile, Win, CustomChallenge } from '../types';
import { Plus, X, Star, Zap, CheckCircle } from 'lucide-react-native';
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
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);

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

  const handleStartChallenge = (challenge: any) => {
    onAddCustomChallenge({
      id: Date.now().toString(),
      title: challenge.title,
      target: challenge.target || 7,
      current: 0,
      unit: challenge.unit || 'days'
    });
    setSelectedChallenge(null);
  };

  const recommendedChallenges = [
    { 
      emoji: '🥤', 
      title: 'No Soda Streak', 
      description: 'Avoid all sugary carbonated dri...', 
      fullDescription: 'Avoid all sugary carbonated drinks for 7 consecutive days. Stay hydrated with water instead!',
      target: 7,
      unit: 'days'
    },
    { 
      emoji: '🍳', 
      title: 'Home Cooking Hero', 
      description: 'Cook dinner at home instead of...', 
      fullDescription: 'Cook dinner at home instead of ordering out. Save money and eat healthier!',
      target: 10,
      unit: 'meals'
    },
    { 
      emoji: '🍭', 
      title: 'Sugar Detox', 
      description: 'Skip dessert or candy.', 
      fullDescription: 'Skip dessert or candy for a full week. Your body will thank you!',
      target: 7,
      unit: 'days'
    },
    { 
      emoji: '👟', 
      title: 'Step It Up', 
      description: 'Go for a walk instead of snacki...', 
      fullDescription: 'Go for a walk instead of snacking when you feel bored. Get moving!',
      target: 5,
      unit: 'walks'
    },
  ];

  const exploreChallenges = [
    { emoji: '🍷', title: 'Dry Week', fullDescription: 'Avoid alcohol for 7 days straight.', target: 7, unit: 'days' },
    { emoji: '💧', title: 'Hydration Champion', fullDescription: 'Drink 8 glasses of water every day for a week.', target: 56, unit: 'glasses' },
    { emoji: '🥦', title: 'Eat Your Greens', fullDescription: 'Have a serving of vegetables with every meal.', target: 21, unit: 'servings' },
    { emoji: '💰', title: 'Wallet Warrior', fullDescription: 'Save $100 by avoiding impulse purchases.', target: 100, unit: 'dollars' },
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

        {profile.customChallenges && profile.customChallenges.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={16} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>ACTIVE CHALLENGES</Text>
            </View>
            
            {profile.customChallenges.map(challenge => (
              <View key={challenge.id} style={styles.activeChallengeCard}>
                <View style={styles.activeChallengeHeader}>
                  <Text style={styles.activeChallengeTitle}>{challenge.title}</Text>
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressBadgeText}>
                      {challenge.current} / {challenge.target}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }
                    ]}
                  />
                </View>
                
                {challenge.current >= challenge.target ? (
                  <View style={styles.completedButton}>
                    <CheckCircle size={18} color={colors.surface} />
                    <Text style={styles.completedButtonText}>Completed!</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={() => onUpdateCustomChallenge(challenge.id)}
                    style={styles.logProgressButton}
                  >
                    <Text style={styles.logProgressButtonText}>+ Log Progress</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

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
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => setSelectedChallenge(challenge)}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLORE MORE</Text>
          
          <View style={styles.exploreGrid}>
            {exploreChallenges.map((challenge, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.exploreCard}
                onPress={() => setSelectedChallenge(challenge)}
              >
                <Text style={styles.exploreEmoji}>{challenge.emoji}</Text>
                <Text style={styles.exploreTitle}>{challenge.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Challenge Detail Modal */}
      <Modal
        visible={selectedChallenge !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedChallenge(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.challengeModalHeader}>
                <Text style={styles.challengeModalEmoji}>{selectedChallenge?.emoji}</Text>
                <Text style={styles.modalTitle}>{selectedChallenge?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedChallenge(null)}>
                <X size={24} color={colors.gray[400]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.challengeModalDescription}>
                {selectedChallenge?.fullDescription}
              </Text>
              
              <View style={styles.challengeGoalBox}>
                <Text style={styles.challengeGoalLabel}>Goal</Text>
                <Text style={styles.challengeGoalValue}>
                  {selectedChallenge?.target} {selectedChallenge?.unit}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                onPress={() => handleStartChallenge(selectedChallenge)}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Start Challenge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    marginBottom: spacing.md,
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
    justifyContent: 'space-between',
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
    marginBottom: spacing.md,
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
  challengeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  challengeModalEmoji: {
    fontSize: 32,
  },
  challengeModalDescription: {
    fontSize: 16,
    color: colors.gray[800],
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  challengeGoalBox: {
    backgroundColor: colors.primary + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  challengeGoalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  challengeGoalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  startButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  activeChallengeCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  activeChallengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  activeChallengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    flex: 1,
  },
  progressBadge: {
    backgroundColor: colors.orange[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  progressBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  logProgressButton: {
    width: '100%',
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[900],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  logProgressButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 14,
  },
  completedButton: {
    width: '100%',
    paddingVertical: spacing.sm,
    backgroundColor: colors.green[500],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  completedButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 14,
  },
});
