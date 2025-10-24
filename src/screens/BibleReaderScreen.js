import React, { useState, useEffect, useRef } from 'react';
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
  Slider,
} from 'react-native';
import { fetchChapter, BIBLE_BOOKS, BIBLE_VERSIONS } from '../services/bibleApi';
import { AudioPlayer } from '../services/elevenLabs';
import VoiceSelector from '../components/VoiceSelector';
import { COLORS, ELEVEN_LABS_VOICES, ELEVEN_LABS_API_KEY } from '../constants/config';

export default function BibleReaderScreen() {
  const [version, setVersion] = useState(BIBLE_VERSIONS.ESV);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [bibleText, setBibleText] = useState(null);
  const [loading, setLoading] = useState(false);

  // Audio states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(ELEVEN_LABS_VOICES.ADAM.id);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioPlayer = useRef(new AudioPlayer()).current;

  const currentBook = BIBLE_BOOKS[currentBookIndex];

  // Initialize audio player
  useEffect(() => {
    audioPlayer.initialize();

    return () => {
      // Cleanup audio on unmount
      audioPlayer.stop();
    };
  }, []);

  // Load initial chapter
  useEffect(() => {
    loadChapter();
  }, [currentBookIndex, currentChapter, version]);

  const loadChapter = async () => {
    setLoading(true);
    // Stop any playing audio when loading new chapter
    if (isPlaying) {
      await handleStopAudio();
    }

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

  // Audio playback status update callback
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackPosition(0);
        // Auto-advance to next chapter
        goToNextChapter();
      }
    }
  };

  // Play/Pause audio
  const handlePlayPause = async () => {
    if (!ELEVEN_LABS_API_KEY) {
      Alert.alert(
        'API Key Required',
        'Please add your Eleven Labs API key to src/constants/config.js to use text-to-speech features.'
      );
      return;
    }

    if (!bibleText || !bibleText.text) {
      Alert.alert('Error', 'No Bible text available to play.');
      return;
    }

    try {
      if (isPlaying) {
        // Pause
        await audioPlayer.pause();
        setIsPlaying(false);
      } else if (audioPlayer.sound) {
        // Resume
        await audioPlayer.play();
        setIsPlaying(true);
      } else {
        // Start new playback
        setIsLoadingAudio(true);
        await audioPlayer.playFromText(
          bibleText.text,
          selectedVoice,
          onPlaybackStatusUpdate
        );
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }
    } catch (error) {
      setIsLoadingAudio(false);
      console.error('Error playing audio:', error);
      Alert.alert(
        'Audio Error',
        'Failed to play audio. Please check your Eleven Labs API key and try again.'
      );
    }
  };

  // Stop audio
  const handleStopAudio = async () => {
    await audioPlayer.stop();
    setIsPlaying(false);
    setPlaybackPosition(0);
  };

  // Change playback speed
  const handleSpeedChange = async (rate) => {
    setPlaybackRate(rate);
    if (audioPlayer.sound) {
      await audioPlayer.setRate(rate);
    }
  };

  // Format time for display
  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getSpeedLabel = () => {
    if (playbackRate === 0.75) return '0.75x';
    if (playbackRate === 1.0) return '1x';
    if (playbackRate === 1.25) return '1.25x';
    if (playbackRate === 1.5) return '1.5x';
    return `${playbackRate}x`;
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    handleSpeedChange(nextSpeed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appTitle}>Bible Companion Listener</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => setShowVoiceSelector(true)}
              style={styles.voiceButton}
            >
              <Text style={styles.voiceButtonText}>🎙</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleVersion} style={styles.versionButton}>
              <Text style={styles.versionButtonText}>{version}</Text>
            </TouchableOpacity>
          </View>
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

      {/* Audio Player */}
      <View style={styles.audioPlayerContainer}>
        {isLoadingAudio ? (
          <View style={styles.audioLoadingContainer}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.audioLoadingText}>Generating audio...</Text>
          </View>
        ) : (
          <>
            {/* Progress Bar */}
            {playbackDuration > 0 && (
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(playbackPosition)}</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${(playbackPosition / playbackDuration) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.timeText}>{formatTime(playbackDuration)}</Text>
              </View>
            )}

            {/* Audio Controls */}
            <View style={styles.audioControls}>
              <TouchableOpacity
                style={styles.audioButton}
                onPress={goToPreviousChapter}
                disabled={currentBookIndex === 0 && currentChapter === 1}
              >
                <Text style={styles.audioButtonText}>⏮</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.audioButton, styles.playButton]}
                onPress={handlePlayPause}
              >
                <Text style={styles.playButtonText}>
                  {isPlaying ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.audioButton}
                onPress={goToNextChapter}
                disabled={
                  currentBookIndex === BIBLE_BOOKS.length - 1 &&
                  currentChapter === currentBook.chapters
                }
              >
                <Text style={styles.audioButtonText}>⏭</Text>
              </TouchableOpacity>
            </View>

            {/* Speed Control */}
            <View style={styles.speedContainer}>
              <TouchableOpacity onPress={cycleSpeed} style={styles.speedButton}>
                <Text style={styles.speedButtonText}>Speed: {getSpeedLabel()}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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

      {/* Voice Selector Modal */}
      <VoiceSelector
        visible={showVoiceSelector}
        onClose={() => setShowVoiceSelector(false)}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
      />
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
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  voiceButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  voiceButtonText: {
    fontSize: 16,
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
  audioLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  audioLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    minWidth: 40,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
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
  speedContainer: {
    alignItems: 'center',
  },
  speedButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 15,
  },
  speedButtonText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
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
