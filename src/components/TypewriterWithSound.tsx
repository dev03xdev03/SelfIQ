/**
 * Custom Typewriter Component with Continuous Sound
 * Plays sound loop while typing and stops when done
 */

import React, { useState, useEffect, useRef } from 'react';
import { Text, TextStyle } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

interface TypewriterWithSoundProps {
  text: string;
  style?: TextStyle | TextStyle[];
  speed?: number;
  onComplete?: () => void;
  enableSound?: boolean;
}

const TypewriterWithSound: React.FC<TypewriterWithSoundProps> = ({
  text,
  style,
  speed = 30,
  onComplete,
  enableSound = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use expo-audio hook
  const player = useAudioPlayer(require('../assets/sounds/mobilewrite.mp3'));

  // Control sound based on typing state
  useEffect(() => {
    if (!player) {
      console.log('⚠️ Player not ready');
      return;
    }

    try {
      if (isTyping && enableSound) {
        console.log('▶️ Playing sound...');
        player.loop = true;
        player.volume = 1.0;
        player.play();
      } else {
        console.log('⏸️ Pausing sound...');
        player.pause();
      }
    } catch (error) {
      console.error('❌ Sound control error:', error);
    }
  }, [isTyping, enableSound, player]);

  useEffect(() => {
    if (currentIndex < text.length) {
      setIsTyping(true);
      const delay = 1000 / speed;

      intervalRef.current = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, delay);
    } else if (currentIndex === text.length) {
      setIsTyping(false);
      if (onComplete) {
        onComplete();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(false);
  }, [text]);

  return <Text style={style}>{displayedText}</Text>;
};

export default TypewriterWithSound;
