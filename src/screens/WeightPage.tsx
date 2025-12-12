import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { UserProfile, WeightEntry } from '../types';
import { WeightChart } from '../components/WeightChart';
import { MunchyMascot } from '../components/MunchyMascot';
import { Scale } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface WeightPageProps {
  profile: UserProfile;
  weightHistory: WeightEntry[];
  onAddWeight: (w: number) => void;
}

export const WeightPage = ({ profile, weightHistory, onAddWeight }: WeightPageProps) => {
  const [newWeight, setNewWeight] = useState('');

  const handleWeightSubmit = async () => {
    const w = parseFloat(newWeight);
    if (w) {
      onAddWeight(w);
      setNewWeight('');
    }
  };

  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : profile.startWeight;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Weight Tracker</Text>
            <Text style={styles.subtitle}>Keep it up!</Text>
          </View>
          <MunchyMascot mood="proud" size="sm" />
        </View>
        
        <View style={styles.updateCard}>
          <View style={styles.updateHeader}>
            <View style={styles.updateTitleRow}>
              <Scale size={18} color={colors.gray[800]} />
              <Text style={styles.updateTitle}>Update Weight</Text>
            </View>
            <Text style={styles.goalText}>Goal: {profile.goalWeight} lbs</Text>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput 
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder={currentWeight.toString()}
              placeholderTextColor={colors.gray[400]}
              style={styles.input}
            />
            <TouchableOpacity 
              onPress={handleWeightSubmit}
              style={styles.logButton}
            >
              <Text style={styles.logButtonText}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.chartCard}>
          {weightHistory.length === 0 ? (
            <Text style={styles.emptyText}>Log your weight to see the graph!</Text>
          ) : (
            <WeightChart data={weightHistory} />
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.gray[800],
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  updateCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
    marginBottom: spacing.lg,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  updateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  updateTitle: {
    fontWeight: '700',
    color: colors.gray[800],
    fontSize: 16,
  },
  goalText: {
    fontSize: 14,
    color: colors.gray[400],
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    fontSize: 16,
    color: colors.gray[800],
  },
  logButton: {
    backgroundColor: colors.gray[900],
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  chartCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.gray[400],
    fontSize: 16,
    textAlign: 'center',
  },
});
