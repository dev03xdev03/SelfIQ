/**
 * Typing Sound Generator using Web Audio API
 * Generates keyboard typing sounds without external audio files
 */

class TypingSoundGenerator {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Initialize Audio Context lazily
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a single typing sound
   * Creates a short percussive click sound similar to keyboard typing
   */
  playTypingSound = (): void => {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;

      // Create oscillator for the "click" sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Frequency variation for natural typing sound (adds randomness)
      const baseFrequency = 800;
      const randomVariation = Math.random() * 200 - 100; // -100 to +100 Hz
      oscillator.frequency.setValueAtTime(baseFrequency + randomVariation, now);

      // Quick frequency drop for percussive effect
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.01);

      // Use square wave for sharper "click"
      oscillator.type = 'square';

      // Volume envelope - very short attack and decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.001); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03); // Quick decay

      // Start and stop
      oscillator.start(now);
      oscillator.stop(now + 0.03);

      // Clean up
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn('Typing sound playback failed:', error);
    }
  };

  /**
   * Alternative: Softer typing sound (like phone keyboard)
   */
  playPhoneTypingSound = (): void => {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;

      // Create two oscillators for richer sound
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Two frequencies for "tap" sound
      const freq1 = 600 + Math.random() * 100;
      const freq2 = 1200 + Math.random() * 200;

      osc1.frequency.setValueAtTime(freq1, now);
      osc2.frequency.setValueAtTime(freq2, now);

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Softer volume envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

      // Start and stop
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.02);
      osc2.stop(now + 0.02);

      // Clean up
      const cleanup = () => {
        osc1.disconnect();
        osc2.disconnect();
        gainNode.disconnect();
      };
      osc1.onended = cleanup;
    } catch (error) {
      console.warn('Phone typing sound playback failed:', error);
    }
  };

  /**
   * Enable or disable typing sounds
   */
  setEnabled = (enabled: boolean): void => {
    this.isEnabled = enabled;
  };

  /**
   * Resume audio context (required for some browsers due to autoplay policy)
   */
  resume = async (): Promise<void> => {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  };
}

// Export singleton instance
export const typingSoundGenerator = new TypingSoundGenerator();
