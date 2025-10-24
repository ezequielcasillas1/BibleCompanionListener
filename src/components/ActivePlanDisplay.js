import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../constants/config';

export default function ActivePlanDisplay({ plan, currentIndex, onItemPress, onClose }) {
  if (!plan || !plan.plan) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.planIcon}>🎯</Text>
          <View style={styles.planInfo}>
            <Text style={styles.planName} numberOfLines={1}>
              {plan.planName}
            </Text>
            <Text style={styles.planStats}>
              {currentIndex + 1} of {plan.totalItems} • {plan.version}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}
      >
        {plan.plan.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.planItem,
              index === currentIndex && styles.planItemActive,
              index < currentIndex && styles.planItemCompleted,
            ]}
            onPress={() => onItemPress(index)}
          >
            <Text style={[
              styles.itemNumber,
              index === currentIndex && styles.itemNumberActive,
              index < currentIndex && styles.itemNumberCompleted,
            ]}>
              {index < currentIndex ? '✓' : index + 1}
            </Text>
            <Text style={[
              styles.itemText,
              index === currentIndex && styles.itemTextActive,
            ]} numberOfLines={2}>
              {item.book} {item.chapter}:{item.startVerse}
              {item.endVerse !== item.startVerse && `-${item.endVerse}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  planStats: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.text.secondary,
  },
  itemsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 12,
    gap: 10,
  },
  planItem: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    minWidth: 120,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  planItemActive: {
    backgroundColor: '#F3E8FF',
    borderColor: COLORS.accent,
  },
  planItemCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  itemNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  itemNumberActive: {
    color: COLORS.accent,
  },
  itemNumberCompleted: {
    color: '#4CAF50',
  },
  itemText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  itemTextActive: {
    color: COLORS.accent,
  },
});
