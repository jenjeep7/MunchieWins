import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Win, WinType } from '../types';
import { ArrowRight } from 'lucide-react-native';
import { MunchyMascot } from '../components/MunchyMascot';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface TrackWinProps {
  onSave: (win: Win) => void;
  onCancel: () => void;
}

export const TrackWin = ({ onSave, onCancel }: TrackWinProps) => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState<WinType>(WinType.SKIP);
  const [category, setCategory] = useState<string>('');
  const [replacement, setReplacement] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimatedData, setEstimatedData] = useState<{calories: number, cost: number} | null>(null);

  const categories = ["Sugary Drinks", "Fast Food", "Sweets/Candy", "Alcohol", "Salty Snacks", "Carbs", "Other"];

  const handleEstimate = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    // Simplified estimation
    const estimatedCost = type === WinType.GAVE_IN ? 8 : 5;
    const estimatedCalories = type === WinType.GAVE_IN ? 0 : 300;
    setEstimatedData({ calories: estimatedCalories, cost: estimatedCost });
    setIsAnalyzing(false);
  };

  const handleSubmit = async () => {
    if (!description || !category) return;
    
    const costValue = estimatedData?.cost || 0;
    const finalMoneySaved = type === WinType.GAVE_IN ? -costValue : costValue;
    const finalCaloriesSaved = type === WinType.GAVE_IN ? 0 : (estimatedData?.calories || 0);

    const newWin: Win = {
      id: Date.now().toString(),
      item: description,
      category: category,
      replacement: type === WinType.SWAP ? replacement : undefined,
      caloriesSaved: finalCaloriesSaved,
      moneySaved: finalMoneySaved,
      timestamp: Date.now(),
      type: type,
      mascotMessage: "Great job!",
    };
    onSave(newWin);
  };

  useEffect(() => {
    setEstimatedData(null);
  }, [type]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log Activity</Text>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.typeSelectorContainer}>
          <TouchableOpacity 
            onPress={() => setType(WinType.SKIP)}
            style={[styles.typeButton, type === WinType.SKIP && styles.typeButtonActive]}
          >
            <Text style={[styles.typeButtonText, type === WinType.SKIP && styles.typeButtonTextSkip]}>
              Resisted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setType(WinType.SWAP)}
            style={[styles.typeButton, type === WinType.SWAP && styles.typeButtonActive]}
          >
            <Text style={[styles.typeButtonText, type === WinType.SWAP && styles.typeButtonTextSwap]}>
              Healthy Swap
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setType(WinType.GAVE_IN)}
            style={[styles.typeButton, type === WinType.GAVE_IN && styles.typeButtonActive]}
          >
            <Text style={[styles.typeButtonText, type === WinType.GAVE_IN && styles.typeButtonTextGaveIn]}>
              Gave In
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoriesRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                >
                  <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {type === WinType.GAVE_IN ? "What did you eat?" : type === WinType.SKIP ? "What did you avoid?" : "What did you swap out?"}
            </Text>
            <TextInput 
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Double Cheeseburger"
              placeholderTextColor={colors.text.secondary}
              style={styles.textInput}
            />
          </View>

          {type === WinType.SWAP && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>What did you have instead?</Text>
              <TextInput 
                value={replacement}
                onChangeText={setReplacement}
                placeholder="e.g., Grilled Chicken Salad"
                placeholderTextColor={colors.text.secondary}
                style={styles.textInput}
              />
            </View>
          )}

          {!estimatedData && (
            <TouchableOpacity 
              onPress={handleEstimate}
              disabled={!description || !category || isAnalyzing}
              style={[
                styles.estimateButton,
                type === WinType.GAVE_IN ? styles.estimateButtonGaveIn : styles.estimateButtonDefault,
                (!description || !category || isAnalyzing) && styles.estimateButtonDisabled
              ]}
            >
              <Text style={styles.estimateButtonText}>
                {isAnalyzing ? 'Munchy is calculating...' : type === WinType.GAVE_IN ? 'Estimate Cost' : 'Estimate Savings'}
              </Text>
              {!isAnalyzing && <ArrowRight size={18} color="white" />}
            </TouchableOpacity>
          )}

          {estimatedData && (
            <View style={[
              styles.estimateCard,
              type === WinType.GAVE_IN ? styles.estimateCardGaveIn : styles.estimateCardDefault
            ]}>
              <View style={styles.estimateHeader}>
                <MunchyMascot mood={type === WinType.GAVE_IN ? 'waiting' : 'excited'} size="sm" />
                <Text style={[
                  styles.estimateHeaderText,
                  type === WinType.GAVE_IN ? styles.estimateHeaderTextGaveIn : styles.estimateHeaderTextDefault
                ]}>
                  {type === WinType.GAVE_IN ? 'Confirm Cost (Amount Lost)' : 'Adjust Savings if needed'}
                </Text>
              </View>
              
              <View style={styles.estimateInputsRow}>
                <View style={styles.estimateInputContainer}>
                  <Text style={styles.estimateInputLabel}>
                    {type === WinType.GAVE_IN ? 'Cost ($)' : 'Money Saved ($)'}
                  </Text>
                  <TextInput 
                    keyboardType="numeric"
                    value={estimatedData.cost.toString()}
                    onChangeText={(text) => setEstimatedData({...estimatedData, cost: parseFloat(text) || 0})}
                    style={[
                      styles.estimateInput,
                      type === WinType.GAVE_IN ? styles.estimateInputGaveIn : styles.estimateInputSaved
                    ]}
                  />
                </View>
                {type !== WinType.GAVE_IN && (
                  <View style={styles.estimateInputContainer}>
                    <Text style={styles.estimateInputLabel}>Calories Saved</Text>
                    <TextInput 
                      keyboardType="numeric"
                      value={estimatedData.calories.toString()}
                      onChangeText={(text) => setEstimatedData({...estimatedData, calories: parseFloat(text) || 0})}
                      style={[styles.estimateInput, styles.estimateInputCalories]}
                    />
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                onPress={handleSubmit}
                style={[
                  styles.submitButton,
                  type === WinType.GAVE_IN ? styles.submitButtonGaveIn : styles.submitButtonDefault
                ]}
              >
                <Text style={styles.submitButtonText}>
                  {type === WinType.GAVE_IN ? 'Log Loss' : 'Confirm Win!'}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[800],
  },
  cancelButton: {
    color: colors.text.light,
    fontWeight: '500',
    fontSize: 14,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.gray[100],
    padding: 4,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  typeButtonActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text.secondary,
  },
  typeButtonTextSkip: {
    color: colors.yellow[600],
  },
  typeButtonTextSwap: {
    color: colors.green[600],
  },
  typeButtonTextGaveIn: {
    color: colors.red[500],
  },
  formContainer: {
    gap: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.surface,
  },
  categoryButtonActive: {
    backgroundColor: colors.gray[900],
    borderColor: colors.gray[900],
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  categoryButtonTextActive: {
    color: colors.surface,
  },
  textInput: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  estimateButton: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  estimateButtonDefault: {
    backgroundColor: colors.gray[900],
  },
  estimateButtonGaveIn: {
    backgroundColor: colors.red[500],
  },
  estimateButtonDisabled: {
    opacity: 0.5,
  },
  estimateButtonText: {
    color: colors.surface,
    fontWeight: '700',
  },
  estimateCard: {
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
  },
  estimateCardDefault: {
    backgroundColor: colors.orange[50],
    borderColor: colors.orange[100],
  },
  estimateCardGaveIn: {
    backgroundColor: colors.red[50],
    borderColor: colors.red[50],
  },
  estimateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  estimateHeaderText: {
    fontSize: 14,
    fontWeight: '700',
  },
  estimateHeaderTextDefault: {
    color: '#9A3412',
  },
  estimateHeaderTextGaveIn: {
    color: '#991B1B',
  },
  estimateInputsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  estimateInputContainer: {
    flex: 1,
  },
  estimateInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  estimateInput: {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    fontWeight: '700',
  },
  estimateInputSaved: {
    color: colors.green[600],
  },
  estimateInputGaveIn: {
    color: colors.red[600],
  },
  estimateInputCalories: {
    color: colors.blue[600],
  },
  submitButton: {
    width: '100%',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  submitButtonDefault: {
    backgroundColor: colors.primary,
  },
  submitButtonGaveIn: {
    backgroundColor: colors.red[600],
  },
  submitButtonText: {
    color: colors.surface,
    fontWeight: '700',
    textAlign: 'center',
  },
});
