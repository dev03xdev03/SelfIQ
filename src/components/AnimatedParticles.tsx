import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const PARTICLE_COUNT = 50;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
}

const AnimatedParticles: React.FC = () => {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
    })),
  ).current;

  useEffect(() => {
    const animations = particles.map((particle) => {
      const moveX = Animated.loop(
        Animated.sequence([
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
        ]),
      );

      const moveY = Animated.loop(
        Animated.sequence([
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration: 12000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration: 12000 + Math.random() * 8000,
            useNativeDriver: true,
          }),
        ]),
      );

      const fade = Animated.loop(
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 0.7,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0.2,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]),
      );

      return Animated.parallel([moveX, moveY, fade]);
    });

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [particles]);

  return (
    <View style={styles.particleContainer} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3131',
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AnimatedParticles;
