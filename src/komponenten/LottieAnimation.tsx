import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

interface LottieAnimationProps {
  source: string;
  position?: 'overlay' | 'background' | 'character' | 'center';
  loop?: boolean;
  autoPlay?: boolean;
  speed?: number;
  style?: ViewStyle;
}

/**
 * Wrapper-Komponente für Lottie-Animationen
 * Unterstützt verschiedene Positionen und Einstellungen
 */
const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  position = 'overlay',
  loop = true,
  autoPlay = true,
  speed = 1,
  style,
}) => {
  // Mapping für Animation-Namen zu Lottie-Files
  // In Produktion würdest du hier echte Lottie-Files laden
  const getAnimationSource = (sourceName: string) => {
    // Beispiel: require(`../../assets/lottie/${sourceName}.json`)
    // Für die Demo verwenden wir Platzhalter
    return null; // Wird später mit echten Lottie-Files ersetzt
  };

  const positionStyles = {
    overlay: styles.overlay,
    background: styles.background,
    character: styles.character,
    center: styles.center,
  };

  return (
    <View style={[positionStyles[position], style]}>
      {/* <LottieView
        source={getAnimationSource(source)}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={styles.animation}
      /> */}
      {/* Platzhalter für Lottie-Animation */}
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  character: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignSelf: 'center',
    top: '30%',
  },
  center: {
    position: 'absolute',
    width: 300,
    height: 300,
    alignSelf: 'center',
    top: '35%',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default LottieAnimation;
