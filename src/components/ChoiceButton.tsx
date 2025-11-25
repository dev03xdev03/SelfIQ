import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ChoiceButtonProps {
  text: string;
  onPress: () => void;
  animation?: string;
  disabled?: boolean;
}

/**
 * Interaktiver Button für Story-Entscheidungen
 * Mit optionalen Animationen und Touch-Feedback
 */
const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  text,
  onPress,
  animation,
  disabled = false,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button];

    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    }

    // Animation-spezifische Styles
    if (animation === 'button_glow') {
      baseStyle.push(styles.glowButton);
    } else if (animation === 'button_shadow') {
      baseStyle.push(styles.shadowButton);
    }

    return baseStyle;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? ['#666666', '#999999'] : ['#004aad', '#5de0e6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, disabled && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{text}</Text>
          {animation === 'button_glow' && <View style={styles.glowEffect} />}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 60,
    marginVertical: 12,
  },
  touchable: {
    borderRadius: 20,
    shadowColor: '#004aad',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(93, 224, 230, 0.5)',
  },
  buttonDisabled: {
    opacity: 0.5,
    borderColor: 'rgba(150, 150, 150, 0.2)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(186, 85, 211, 0.15)',
  },
});

export default ChoiceButton;
