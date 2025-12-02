import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { width, height } = Dimensions.get('window');

export type DifficultyLevel = 'Einsteiger' | 'Erfahren' | 'Experte';

interface DifficultyOption {
  id: DifficultyLevel;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: [string, string];
  questionCount: number;
  duration: number;
}

interface DifficultySelectorScreenProps {
  testName: string;
  testGradient: [string, string];
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
}

const DifficultySelectorScreen: React.FC<DifficultySelectorScreenProps> = ({
  testName,
  testGradient,
  onDifficultySelect,
  onBack,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel | null>(null);
  const scaleAnims = React.useRef(
    Array.from({ length: 3 }, () => new Animated.Value(1)),
  ).current;

  const difficulties: DifficultyOption[] = [
    {
      id: 'Einsteiger',
      name: 'Einsteiger',
      description: 'Schneller Überblick mit grundlegenden Fragen',
      icon: 'leaf-outline',
      gradientColors: ['#4ade80', '#22c55e'],
      questionCount: 15,
      duration: 5,
    },
    {
      id: 'Erfahren',
      name: 'Erfahren',
      description: 'Ausgewogener Test mit tieferen Einblicken',
      icon: 'pulse-outline',
      gradientColors: ['#ff914d', '#ff3131'],
      questionCount: 30,
      duration: 10,
    },
    {
      id: 'Experte',
      name: 'Experte',
      description: 'Umfassende Analyse für maximale Präzision',
      icon: 'trophy-outline',
      gradientColors: ['#8b5cf6', '#6366f1'],
      questionCount: 50,
      duration: 15,
    },
  ];

  const handleDifficultyPress = (
    difficulty: DifficultyLevel,
    index: number,
  ) => {
    setSelectedDifficulty(difficulty);

    // Animate card press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      onDifficultySelect(difficulty);
    }, 300);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <AnimatedParticles />

      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          onBackPress={onBack}
          showBackButton={true}
          greetingText={testName}
          subtitleText="Wähle deine Stufe"
        />

        {/* Difficulty Cards */}
        <View style={styles.cardsContainer}>
          {difficulties.map((difficulty, index) => (
            <Animated.View
              key={difficulty.id}
              style={[
                styles.cardWrapper,
                { transform: [{ scale: scaleAnims[index] }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleDifficultyPress(difficulty.id, index)}
              >
                <LinearGradient
                  colors={difficulty.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.difficultyCard,
                    selectedDifficulty === difficulty.id && styles.selectedCard,
                  ]}
                >
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <Ionicons name={difficulty.icon} size={48} color="#fff" />
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <Text style={styles.difficultyName}>{difficulty.name}</Text>
                    <Text style={styles.difficultyDescription}>
                      {difficulty.description}
                    </Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                      <View style={styles.statBadge}>
                        <Ionicons
                          name="help-circle-outline"
                          size={14}
                          color="#fff"
                        />
                        <Text style={styles.statText}>
                          {difficulty.questionCount} Fragen
                        </Text>
                      </View>
                      <View style={styles.statBadge}>
                        <Ionicons name="time-outline" size={14} color="#fff" />
                        <Text style={styles.statText}>
                          ~{difficulty.duration} Min
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Arrow */}
                  <View style={styles.arrowContainer}>
                    <Ionicons
                      name="chevron-forward"
                      size={28}
                      color="rgba(255, 255, 255, 0.8)"
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#ff914d"
          />
          <Text style={styles.infoText}>
            Alle Stufen analysieren denselben Test, unterscheiden sich aber in
            Tiefe und Dauer
          </Text>
        </View>

        <AppFooter />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  testName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'neosans',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'neosans',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  difficultyCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCard: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'neosans',
  },
  difficultyDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 145, 77, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
});

export default DifficultySelectorScreen;
