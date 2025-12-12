import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import { MunchyMascot } from '../components/MunchyMascot';
import { ActivityChart } from '../components/ActivityChart';
import { UserProfile, Win, WinType } from '../types';
import { 
  Plus, Settings, Trophy, X, 
  DollarSign, Moon, Activity, Flame,
  BicepsFlexed, CheckSquare, Frown, Camera
} from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface DashboardProps {
  profile: UserProfile;
  wins: Win[];
  onTrackClick: () => void;
  onProfileClick: () => void;
}

export const Dashboard = ({ profile, wins, onTrackClick, onProfileClick }: DashboardProps) => {
  const [selectedBucket, setSelectedBucket] = useState<WinType | null>(null);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  
  const vices = Array.isArray(profile.onboardingAnswers?.vice) 
    ? profile.onboardingAnswers.vice 
    : [profile.onboardingAnswers?.vice || "Snacks"];
  const mainVice = vices[0] || "Temptations";

  const getFocus = () => {
    const motivation = profile.onboardingAnswers?.motivation || [];
    if (motivation.includes("Saving Money")) return { icon: DollarSign, text: "Save $5 today by skipping that extra treat." };
    if (motivation.includes("Better Sleep")) return { icon: Moon, text: "No caffeine after 2 PM today!" };
    if (motivation.includes("Feeling Healthier")) return { icon: Activity, text: "Swap one processed snack for fruit." };
    return { icon: Flame, text: `Beat your temptation: ${mainVice}!` };
  };
  const focus = getFocus();
  const FocusIcon = focus.icon;

  const resistedWins = wins.filter(w => w.type === WinType.SKIP);
  const swappedWins = wins.filter(w => w.type === WinType.SWAP);
  const gaveInWins = wins.filter(w => w.type === WinType.GAVE_IN);

  const badges = [
    { 
      id: '1', title: 'First Step', icon: '🎯', 
      reward: 'Rookie Badge',
      isUnlocked: wins.length > 0
    },
    { 
      id: '2', title: 'Soda Slayer', icon: '🥤', 
      reward: 'No-Fizz Badge',
      isUnlocked: wins.filter(w => w.type === WinType.SKIP && /soda|coke|pepsi|drink/i.test(w.item)).length >= 3
    },
    { 
      id: '5', title: 'Money Bags', icon: '💰', 
      reward: 'Golden Piggy',
      isUnlocked: profile.totalMoneySaved >= 50
    },
    { 
      id: '6', title: 'Streak Master', icon: '🔥', 
      reward: 'Phoenix Flame',
      isUnlocked: profile.streak >= 7
    },
  ];
  const unlockedBadges = badges.filter(b => b.isUnlocked);

  const renderDetailModal = () => {
    if (!selectedBucket) return null;
    
    let title = "";
    let color = "";
    let data: Win[] = [];
    let Icon = null;

    if (selectedBucket === WinType.SKIP) {
        title = "Resisted Activity";
        color = "#EAB308";
        data = resistedWins;
        Icon = BicepsFlexed;
    } else if (selectedBucket === WinType.SWAP) {
        title = "Healthy Swaps";
        color = "#4CAF50";
        data = swappedWins;
        Icon = CheckSquare;
    } else {
        title = "Gave In";
        color = "#EF5350";
        data = gaveInWins;
        Icon = Frown;
    }

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedBucket(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              onPress={() => setSelectedBucket(null)} 
              style={styles.modalClose}
            >
              <X size={24} color={colors.gray[400]} />
            </TouchableOpacity>
            
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                {Icon && <Icon size={24} color={color} />}
              </View>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalSubtitle}>{data.length} total entries</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>Breakdown</Text>
              <ActivityChart data={data} color={color} />
            </View>

            <ScrollView style={styles.modalLogs}>
              <Text style={styles.modalSectionLabel}>Recent Logs</Text>
              {data.slice(0, 5).map(win => (
                <View key={win.id} style={styles.logItem}>
                  <View style={styles.logItemContent}>
                    <Text style={styles.logItemTitle}>{win.item}</Text>
                    {win.category && (
                      <Text style={styles.logItemCategory}>
                        {win.category}
                      </Text>
                    )}
                    <Text style={styles.logItemDate}>
                      {new Date(win.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  {win.moneySaved !== 0 && (
                    <Text style={[
                      styles.logItemAmount,
                      win.moneySaved < 0 ? styles.logItemAmountNegative : styles.logItemAmountPositive
                    ]}>
                      {win.moneySaved < 0 ? '-' : '+'}${Math.abs(win.moneySaved).toFixed(2)}
                    </Text>
                  )}
                </View>
              ))}
              {data.length === 0 && (
                <Text style={styles.logItemEmpty}>No logs yet.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderDetailModal()}
      
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
            <Text style={styles.greetingText} numberOfLines={1}>
              {greeting}, {profile.name.split(' ')[0]}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={onTrackClick}
              style={styles.addButton}
              activeOpacity={0.8}
            >
              <Plus size={24} color="white" strokeWidth={3} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onProfileClick} activeOpacity={0.8}>
              <View style={styles.avatarContainer}>
                {profile.avatar ? (
                  <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarEmoji}>👤</Text>
                  </View>
                )}
              </View>
              <View style={styles.avatarBadge} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Daily Focus */}
          <View style={styles.focusCard}>
            <View style={styles.focusIconContainer}>
              <FocusIcon size={24} color="#FED7AA" />
            </View>
            <View style={styles.focusTextContainer}>
              <Text style={styles.focusLabel}>Today's Mission</Text>
              <Text style={styles.focusText}>{focus.text}</Text>
            </View>
          </View>

          {/* Action Buckets */}
          <View style={styles.bucketsRow}>
            <TouchableOpacity 
              onPress={() => setSelectedBucket(WinType.SKIP)}
              style={styles.bucketCard}
              activeOpacity={0.8}
            >
              <View style={[styles.bucketIcon, { backgroundColor: colors.yellow[100] }]}>
                <BicepsFlexed size={16} color={colors.yellow[600]} />
              </View>
              <Text style={styles.bucketLabel}>Resisted</Text>
              <Text style={styles.bucketCount}>{resistedWins.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setSelectedBucket(WinType.SWAP)}
              style={styles.bucketCard}
              activeOpacity={0.8}
            >
              <View style={[styles.bucketIcon, { backgroundColor: colors.green[100] }]}>
                <CheckSquare size={16} color={colors.green[600]} />
              </View>
              <Text style={styles.bucketLabel}>Swapped</Text>
              <Text style={styles.bucketCount}>{swappedWins.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setSelectedBucket(WinType.GAVE_IN)}
              style={styles.bucketCard}
              activeOpacity={0.8}
            >
              <View style={[styles.bucketIcon, { backgroundColor: colors.red[50] }]}>
                <Frown size={16} color={colors.red[600]} />
              </View>
              <Text style={styles.bucketLabel}>Gave In</Text>
              <Text style={styles.bucketCount}>{gaveInWins.length}</Text>
            </TouchableOpacity>
          </View>

          {/* Mascot */}
          <View style={styles.mascotCard}>
            <MunchyMascot mood={wins.length > 0 ? "celebrate" : "waiting"} size="lg" />
            <Text style={styles.mascotMessage}>
              "{wins.length > 0 ? "You're crushing it today! Keep it up." : "I'm hungry for a win! Feed me a healthy choice."}"
            </Text>
          </View>

          {/* Badges */}
          <View style={styles.badgesCard}>
            <View style={styles.badgesHeader}>
              <View style={styles.badgesTitle}>
                <Trophy size={18} color={colors.yellow[600]} />
                <Text style={styles.badgesTitleText}>Badges</Text>
              </View>
              <Text style={styles.badgesCount}>{unlockedBadges.length} / {badges.length}</Text>
            </View>
            
            {unlockedBadges.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesList}>
                {unlockedBadges.map(badge => (
                  <View key={badge.id} style={styles.badgeItem}>
                    <View style={styles.badgeIconContainer}>
                      <Text style={styles.badgeIcon}>{badge.icon}</Text>
                    </View>
                    <Text style={styles.badgeLabel}>
                      {badge.reward}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.badgesEmpty}>
                <Text style={styles.badgesEmptyText}>No badges yet. Start logging wins!</Text>
              </View>
            )}
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
  mainContent: {
    paddingBottom: 96,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  dateText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.surface,
    ...shadows.sm,
    overflow: 'hidden',
    backgroundColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.green[500],
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  focusCard: {
    backgroundColor: colors.gray[900],
    padding: spacing.lg + 4,
    borderRadius: borderRadius.xl + 8,
    ...shadows.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  focusIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusTextContainer: {
    flex: 1,
  },
  focusLabel: {
    fontSize: 12,
    color: colors.gray[400],
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  focusText: {
    color: colors.surface,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
  },
  bucketsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  bucketCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[100],
    aspectRatio: 1,
  },
  bucketIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  bucketLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  bucketCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
  },
  mascotCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl + 8,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.gray[100],
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mascotMessage: {
    marginTop: spacing.md,
    color: colors.text.secondary,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  badgesCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl + 8,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.gray[100],
    marginBottom: spacing.lg,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badgesTitleText: {
    fontWeight: '700',
    color: colors.gray[800],
  },
  badgesCount: {
    fontSize: 12,
    color: colors.text.light,
  },
  badgesList: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: colors.yellow[50],
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: colors.yellow[100],
  },
  badgeIcon: {
    fontSize: 24,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.secondary,
    maxWidth: 60,
    textAlign: 'center',
  },
  badgesEmpty: {
    paddingVertical: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  badgesEmptyText: {
    fontSize: 14,
    color: colors.text.light,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 340,
    borderRadius: borderRadius.xl + 8,
    padding: spacing.lg,
    ...shadows.lg,
    maxHeight: '80%',
  },
  modalClose: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[50],
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.text.light,
    marginBottom: spacing.sm,
  },
  modalLogs: {
    maxHeight: 256,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[50],
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  logItemContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  logItemTitle: {
    fontWeight: '500',
    color: colors.gray[800],
  },
  logItemCategory: {
    fontSize: 10,
    color: colors.text.light,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  logItemDate: {
    fontSize: 12,
    color: colors.text.light,
  },
  logItemAmount: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logItemAmountNegative: {
    backgroundColor: colors.red[50],
    color: colors.red[500],
  },
  logItemAmountPositive: {
    backgroundColor: colors.green[50],
    color: colors.green[600],
  },
  logItemEmpty: {
    fontSize: 14,
    color: colors.text.light,
    fontStyle: 'italic',
  },
});
