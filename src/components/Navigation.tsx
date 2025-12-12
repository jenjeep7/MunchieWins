import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, User, Trophy, DollarSign, Scale } from 'lucide-react-native';
import { colors, spacing, shadows } from '../styles/theme';

interface NavigationProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export const Navigation = ({ currentPage, setPage }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'challenges', icon: Trophy, label: 'Challenges' },
    { id: 'savings', icon: DollarSign, label: 'Savings' },
    { id: 'weight', icon: Scale, label: 'Weight' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setPage(item.id)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                color={isActive ? colors.primary : colors.gray[400]}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.lg,
    zIndex: 50,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: spacing.sm,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: '20%',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.gray[400],
  },
  navLabelActive: {
    color: colors.primary,
  },
});
