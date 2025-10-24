import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../constants/config';
import { EXAMPLE_PLANS, generateCustomPlan } from '../services/aiPlanService';

export default function CustomPlanModal({ visible, onClose, onPlanGenerated, version }) {
  const [customRequest, setCustomRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async (request) => {
    setIsGenerating(true);
    try {
      const plan = await generateCustomPlan(request || customRequest, version);
      onPlanGenerated(plan);
      setCustomRequest('');
      onClose();
    } catch (error) {
      Alert.alert(
        'Error Generating Plan',
        error.message || 'Failed to generate custom Bible plan. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleTap = (example) => {
    setCustomRequest(example.request);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🤖 AI Custom Bible Plan</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                Ask the AI to create a custom Bible reading plan!
              </Text>
              <Text style={styles.subDescription}>
                Examples: "Play only Jesus quotes", "Psalms about comfort", "Connect creation themes"
              </Text>
            </View>

            {/* Custom Request Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What would you like to listen to?</Text>
              <TextInput
                style={styles.input}
                placeholder="E.g., Play only Jesus quotes from the Gospels"
                placeholderTextColor={COLORS.text.light}
                value={customRequest}
                onChangeText={setCustomRequest}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  (!customRequest || isGenerating) && styles.generateButtonDisabled,
                ]}
                onPress={() => handleGeneratePlan(customRequest)}
                disabled={!customRequest || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <ActivityIndicator size="small" color={COLORS.white} />
                    <Text style={styles.generateButtonText}>  Generating...</Text>
                  </>
                ) : (
                  <Text style={styles.generateButtonText}>✨ Generate Plan</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Example Plans */}
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Or try these popular plans:</Text>
              <View style={styles.examplesGrid}>
                {EXAMPLE_PLANS.map((example, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exampleCard}
                    onPress={() => handleGeneratePlan(example.request)}
                    disabled={isGenerating}
                  >
                    <View style={styles.exampleIcon}>
                      <Text style={styles.exampleIconText}>{example.icon}</Text>
                    </View>
                    <Text style={styles.exampleTitle}>{example.title}</Text>
                    <Text style={styles.exampleDescription}>{example.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.text.secondary,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    paddingVertical: 20,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  subDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: COLORS.text.primary,
    borderWidth: 2,
    borderColor: COLORS.border,
    minHeight: 80,
    marginBottom: 15,
  },
  generateButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  examplesContainer: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 15,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exampleCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    width: '48%',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  exampleIcon: {
    marginBottom: 8,
  },
  exampleIconText: {
    fontSize: 28,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  exampleDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    lineHeight: 16,
  },
});
