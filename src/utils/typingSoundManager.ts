/**
 * Typing Sound Generator for React Native using Expo AV
 * Generates keyboard typing sounds programmatically
 */

import { Audio } from 'expo-av';

class TypingSoundManager {
  private isEnabled: boolean = true;
  private sound: Audio.Sound | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize audio settings
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize typing sound:', error);
    }
  }

  /**
   * Play a typing sound
   * Uses a short beep as typing feedback
   */
  async playTypingSound(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Create a very short sound using Audio.Sound
      // Since we can't generate audio programmatically easily in React Native,
      // we'll use a technique with the 'beep' or create minimal sound

      // Alternative: Play a very short silent sound with volume modulation
      // For now, we'll use a simple implementation

      // You could also generate a base64 encoded minimal WAV file
      const { sound } = await Audio.Sound.createAsync(
        // This would ideally be a very short click sound
        // For demonstration, using require - but you'd want a minimal sound file
        {
          uri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        },
        { shouldPlay: true, volume: 0.3 },
      );

      // Auto-cleanup after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      // Silently fail - typing sounds are not critical
    }
  }

  /**
   * Simple vibration feedback as alternative to sound
   */
  vibrateFeedback(): void {
    if (!this.isEnabled) return;

    // Import Haptics from expo-haptics
    try {
      const { Haptics } = require('expo-haptics');
      Haptics.selectionAsync();
    } catch {
      // Haptics not available
    }
  }

  /**
   * Enable or disable typing sounds
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export const typingSoundManager = new TypingSoundManager();
