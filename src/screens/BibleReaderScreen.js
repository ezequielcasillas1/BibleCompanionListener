import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { fetchChapter, BIBLE_BOOKS, BIBLE_VERSIONS } from '../services/bibleApi';
import { COLORS } from '../constants/config';

export default function BibleReaderScreen() {
  const [version, setVersion] = useState(BIBLE_VERSIONS.ESV);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [bibleText, setBibleText] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentBook = BIBLE_BOOKS[currentBookIndex];

  // Load initial chapter
  useEffect(() => {
    loadChapter();
  }, [currentBookIndex, currentChapter, version]);

  const loadChapter = async () => {
    setLoading(true);
    try {
      const data = await fetchChapter(version, currentBook.abbr, currentChapter);
      setBibleText(data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load Bible text. Please check your connection and try again.'
      );
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter(currentChapter + 1);
    } else if (currentBookIndex < BIBLE_BOOKS.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1);
      setCurrentChapter(1);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1);
      const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
      setCurrentChapter(prevBook.chapters);
    }
  };

  const toggleVersion = () => {
    setVersion(version === BIBLE_VERSIONS.ESV ? BIBLE_VERSIONS.NKJV : BIBLE_VERSIONS.ESV);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appTitle}>Bible Companion Listener</Text>
          <TouchableOpacity onPress={toggleVersion} style={styles.versionButton}>
            <Text style={styles.versionButtonText}>{version}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.referenceContainer}>
          <Text style={styles.referenceText}>
            {currentBook.name} {currentChapter}
          </Text>
          <Text style={styles.chapterInfo}>
            Chapter {currentChapter} of {currentBook.chapters}
          </Text>
        </View>
      </View>

      {/* Bible Text */}
      <ScrollView style={styles.textContainer} contentContainerStyle={styles.textContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View>
            {bibleText && (
              <View>
                <Text style={styles.chapterTitle}>
                  {bibleText.reference || `${currentBook.name} ${currentChapter}`}
                </Text>
                <Text style={styles.verseText}>{bibleText.text}</Text>
                {bibleText.translation && (
                  <Text style={styles.translationText}>
                    - {bibleText.translation.name}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Audio Player Placeholder */}
      <View style={styles.audioPlayerContainer}>
        <Text style={styles.audioPlaceholderText}>
          Audio player will be added here (Eleven Labs integration)
        </Text>
        <View style={styles.audioControlsPlaceholder}>
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioButtonText}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.audioButton, styles.playButton]}>
            <Text style={styles.playButtonText}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioButtonText}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={goToPreviousChapter}
          style={[
            styles.navButton,
            currentBookIndex === 0 && currentChapter === 1 && styles.navButtonDisabled,
          ]}
          disabled={currentBookIndex === 0 && currentChapter === 1}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <View style={styles.chapterIndicator}>
          <Text style={styles.chapterIndicatorText}>
            {currentChapter} / {currentBook.chapters}
          </Text>
        </View>

        <TouchableOpacity
          onPress={goToNextChapter}
          style={[
            styles.navButton,
            currentBookIndex === BIBLE_BOOKS.length - 1 &&
              currentChapter === currentBook.chapters &&
              styles.navButtonDisabled,
          ]}
          disabled={
            currentBookIndex === BIBLE_BOOKS.length - 1 &&
            currentChapter === currentBook.chapters
          }
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  versionButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  versionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  referenceContainer: {
    alignItems: 'center',
  },
  referenceText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  chapterInfo: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  textContainer: {
    flex: 1,
  },
  textContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  verseText: {
    fontSize: 18,
    lineHeight: 32,
    color: COLORS.text.primary,
    textAlign: 'justify',
  },
  translationText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'right',
  },
  audioPlayerContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  audioPlaceholderText: {
    fontSize: 12,
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: 15,
  },
  audioControlsPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  audioButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
  },
  audioButtonText: {
    fontSize: 20,
    color: COLORS.text.secondary,
  },
  playButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  chapterIndicator: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chapterIndicatorText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
