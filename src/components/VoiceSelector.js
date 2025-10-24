import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { COLORS, ELEVEN_LABS_VOICES } from '../constants/config';

export default function VoiceSelector({ visible, onClose, selectedVoice, onSelectVoice }) {
  const voices = Object.values(ELEVEN_LABS_VOICES);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Voice</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.voiceList}>
            {voices.map((voice) => (
              <TouchableOpacity
                key={voice.id}
                style={[
                  styles.voiceItem,
                  selectedVoice === voice.id && styles.voiceItemSelected,
                ]}
                onPress={() => {
                  onSelectVoice(voice.id);
                  onClose();
                }}
              >
                <View style={styles.voiceInfo}>
                  <Text
                    style={[
                      styles.voiceName,
                      selectedVoice === voice.id && styles.voiceNameSelected,
                    ]}
                  >
                    {voice.name}
                  </Text>
                  <Text style={styles.voiceDescription}>{voice.description}</Text>
                </View>
                {selectedVoice === voice.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Text style={styles.footerNote}>
              These are premium Eleven Labs voices optimized for Bible reading
            </Text>
          </View>
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
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
  voiceList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  voiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceItemSelected: {
    backgroundColor: '#F3E8FF',
    borderColor: COLORS.accent,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  voiceNameSelected: {
    color: COLORS.accent,
  },
  voiceDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: '700',
    marginLeft: 10,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerNote: {
    fontSize: 12,
    color: COLORS.text.light,
    textAlign: 'center',
  },
});
