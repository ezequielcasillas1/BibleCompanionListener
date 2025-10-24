import axios from 'axios';
import { Audio } from 'expo-av';
import {
  ELEVEN_LABS_API_KEY,
  ELEVEN_LABS_API_URL,
  ELEVEN_LABS_VOICES,
} from '../constants/config';

/**
 * Convert text to speech using Eleven Labs API
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The Eleven Labs voice ID
 * @returns {Promise<string>} - Base64 encoded audio data
 */
export const textToSpeech = async (text, voiceId = ELEVEN_LABS_VOICES.ADAM.id) => {
  try {
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('Eleven Labs API key not configured. Please add it to src/constants/config.js');
    }

    const response = await axios.post(
      `${ELEVEN_LABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    // Convert arraybuffer to base64
    const base64Audio = Buffer.from(response.data, 'binary').toString('base64');
    return `data:audio/mpeg;base64,${base64Audio}`;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
};

/**
 * Audio Player Class to manage playback
 */
export class AudioPlayer {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.isLoading = false;
  }

  /**
   * Initialize audio mode
   */
  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  /**
   * Load and play audio from Eleven Labs
   * @param {string} text - Text to convert to speech
   * @param {string} voiceId - Voice ID to use
   * @param {Function} onPlaybackStatusUpdate - Callback for playback updates
   */
  async playFromText(text, voiceId, onPlaybackStatusUpdate) {
    try {
      this.isLoading = true;

      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Convert text to speech
      const audioUri = await textToSpeech(text, voiceId);

      // Load the audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.isPlaying = true;
      this.isLoading = false;

      return sound;
    } catch (error) {
      this.isLoading = false;
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  /**
   * Play or resume audio
   */
  async play() {
    if (this.sound) {
      await this.sound.playAsync();
      this.isPlaying = true;
    }
  }

  /**
   * Pause audio
   */
  async pause() {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    }
  }

  /**
   * Stop and unload audio
   */
  async stop() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
      this.isPlaying = false;
    }
  }

  /**
   * Set playback position
   * @param {number} position - Position in milliseconds
   */
  async setPosition(position) {
    if (this.sound) {
      await this.sound.setPositionAsync(position);
    }
  }

  /**
   * Set playback rate (speed)
   * @param {number} rate - Playback rate (0.5 to 2.0)
   */
  async setRate(rate) {
    if (this.sound) {
      await this.sound.setRateAsync(rate, true);
    }
  }

  /**
   * Get playback status
   */
  async getStatus() {
    if (this.sound) {
      return await this.sound.getStatusAsync();
    }
    return null;
  }
}

/**
 * Get all available voices
 */
export const getAvailableVoices = () => {
  return Object.values(ELEVEN_LABS_VOICES);
};

/**
 * Get voice by ID
 */
export const getVoiceById = (voiceId) => {
  return Object.values(ELEVEN_LABS_VOICES).find(voice => voice.id === voiceId);
};

/**
 * Fetch voices from Eleven Labs API (if you want to get all available voices)
 */
export const fetchVoicesFromAPI = async () => {
  try {
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('Eleven Labs API key not configured');
    }

    const response = await axios.get(`${ELEVEN_LABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
    });

    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
};
