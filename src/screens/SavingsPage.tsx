import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { UserProfile, Win } from '../types';
import { DollarSign } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface SavingsPageProps {
  profile: UserProfile;
  wins: Win[];
}

export const SavingsPage = ({ profile, wins }: SavingsPageProps) => {
  const savingsWins = wins.filter(w => w.moneySaved !== 0);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Savings</Text>
            <Text style={styles.subtitle}>Your healthy wallet</Text>
          </View>
          <View style={styles.iconCircle}>
            <DollarSign size={24} color={colors.green[600]} />
          </View>
        </View>
        
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Money Saved</Text>
          <Text style={styles.totalAmount}>${profile.totalMoneySaved.toFixed(2)}</Text>
        </View>
        
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>History</Text>
          {savingsWins.length === 0 ? (
            <Text style={styles.emptyText}>No savings data yet.</Text>
          ) : (
            savingsWins.slice(0, 7).map(win => (
              <View key={win.id} style={styles.historyRow}>
                <Text style={styles.itemText}>{win.item}</Text>
                <Text style={[
                  styles.amountText,
                  win.moneySaved > 0 ? styles.amountPositive : styles.amountNegative
                ]}>
                  {win.moneySaved > 0 ? '+' : '-'}${Math.abs(win.moneySaved).toFixed(2)}
                </Text>
              </View>
            ))
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
  iconCircle: {
    width: 56,
    height: 56,
    backgroundColor: colors.green[100],
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCard: {
    backgroundColor: colors.green[500],
    padding: spacing.xl,
    borderRadius: borderRadius.xl * 1.5,
    ...shadows.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  totalLabel: {
    color: colors.green[100],
    fontWeight: '500',
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  totalAmount: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.surface,
  },
  historyCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
  },
  historyTitle: {
    fontWeight: '700',
    color: colors.gray[800],
    fontSize: 18,
    marginBottom: spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemText: {
    fontWeight: '500',
    color: colors.gray[800],
    flex: 1,
    fontSize: 15,
  },
  amountText: {
    fontWeight: '700',
    fontSize: 15,
  },
  amountPositive: {
    color: colors.green[600],
  },
  amountNegative: {
    color: colors.red[500],
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    fontSize: 14,
    paddingVertical: spacing.xl,
  },
});
