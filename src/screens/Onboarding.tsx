import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MunchyMascot } from '../components/MunchyMascot';
import { UserProfile } from '../types';
import { ArrowRight, CheckCircle } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface OnboardingProps {
  onComplete: (profileData: Partial<UserProfile>) => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = [
    { id: 'name', type: 'text', question: "Let's get started! What should Munchy call you?", placeholder: "Your Name (Max 12 chars)", maxLength: 12 },
    { id: 'currentWeight', type: 'number', question: "To track progress, what is your current weight (lbs)?", placeholder: "e.g. 180" },
    { id: 'goalWeight', type: 'number', question: "And what is your goal weight?", placeholder: "e.g. 150" },
    { id: 'motivation', type: 'multiselect', question: "What motivates you? (Select all that apply)", options: ["Weight Loss", "Saving Money", "Feeling Healthier", "Better Sleep", "More Energy"] },
    { id: 'vice', type: 'multiselect', question: "What are your biggest temptations? (Select all that apply)", options: ["Sugary Drinks", "Fast Food", "Sweets/Candy", "Late Night Snacking", "Alcohol", "Salty Snacks"] },
    { id: 'water', type: 'number', question: "How many glasses of water do you drink daily?", placeholder: "e.g. 4" },
    { id: 'activity', type: 'select', question: "How active are you?", options: ["Sedentary (Desk Job)", "Lightly Active", "Moderately Active", "Very Active"] },
    { id: 'cravings', type: 'multiselect', question: "When do cravings usually hit you? (Select all that apply)", options: ["Mid-Morning", "Afternoon Slump", "Evening/TV Time", "Late Night", "Stressful Moments"] },
    { id: 'cooking', type: 'select', question: "Do you cook at home?", options: ["Rarely", "Sometimes", "Often", "Always"] },
    { id: 'ready', type: 'info', question: "You're all set! Ready to crush your goals with Munchy?", buttonText: "Let's Go!" }
  ];

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [questions[step].id]: value });
  };

  const handleMultiSelect = (option: string) => {
    const current = (answers[questions[step].id] as string[]) || [];
    if (current.includes(option)) {
      setAnswers({ ...answers, [questions[step].id]: current.filter(i => i !== option) });
    } else {
      setAnswers({ ...answers, [questions[step].id]: [...current, option] });
    }
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        name: answers.name || 'Friend',
        startWeight: parseFloat(answers.currentWeight) || 0,
        goalWeight: parseFloat(answers.goalWeight) || 0,
        onboardingAnswers: answers,
        onboardingComplete: true
      });
    }
  };

  const currentQ = questions[step];
  const currentAnswer = answers[currentQ.id];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${((step + 1) / questions.length) * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {step + 1} of {questions.length}
          </Text>
        </View>

        <MunchyMascot mood="happy" size="md" />

        <Text style={styles.questionText}>
          {currentQ.question}
        </Text>

        <View style={styles.inputContainer}>
          {currentQ.type === 'text' && (
            <TextInput 
              style={styles.textInput}
              placeholder={currentQ.placeholder}
              placeholderTextColor={colors.text.secondary}
              onChangeText={(text) => handleAnswer(text)}
              value={currentAnswer || ''}
              maxLength={currentQ.maxLength}
              autoFocus
            />
          )}

          {currentQ.type === 'number' && (
            <TextInput 
              style={styles.textInput}
              placeholder={currentQ.placeholder}
              placeholderTextColor={colors.text.secondary}
              onChangeText={(text) => handleAnswer(text)}
              value={currentAnswer || ''}
              keyboardType="numeric"
              autoFocus
            />
          )}

          {currentQ.type === 'select' && currentQ.options?.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { handleAnswer(opt); setTimeout(nextStep, 200); }}
              style={[styles.selectButton, currentAnswer === opt && styles.selectButtonSelected]}
            >
              <Text style={[styles.selectButtonText, currentAnswer === opt && styles.selectButtonTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}

          {currentQ.type === 'multiselect' && (
            <View style={styles.optionsContainer}>
              {currentQ.options?.map((opt) => {
                const selected = (currentAnswer as string[])?.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleMultiSelect(opt)}
                    style={[styles.optionButton, selected && styles.optionButtonSelected]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {opt}
                    </Text>
                    {selected && <CheckCircle size={18} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {currentQ.type !== 'select' && (
            <TouchableOpacity 
              onPress={nextStep}
              disabled={currentQ.type !== 'info' && (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0))}
              style={[
                styles.nextButton,
                (currentQ.type !== 'info' && (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0))) && styles.nextButtonDisabled
              ]}
            >
              <Text style={styles.nextButtonText}>
                {currentQ.buttonText || "Next"}
              </Text>
              <ArrowRight size={18} color="white" />
            </TouchableOpacity>
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
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
    textAlign: 'center',
    lineHeight: 32,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  textInput: {
    width: '100%',
    padding: spacing.md,
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray[300],
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  infoContainer: {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  optionsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  optionButton: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    backgroundColor: colors.orange[50],
    borderColor: colors.primary,
  },
  optionText: {
    fontWeight: '500',
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  selectButton: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    marginVertical: spacing.sm,
  },
  selectButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange[50],
  },
  selectButtonText: {
    fontWeight: '500',
    textAlign: 'center',
    color: colors.text.secondary,
  },
  selectButtonTextSelected: {
    color: colors.primary,
  },
  nextButton: {
    width: '100%',
    backgroundColor: colors.gray[900],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
});
