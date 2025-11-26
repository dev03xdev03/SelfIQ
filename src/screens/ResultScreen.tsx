import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  testResults: {
    testId: string;
    testName: string;
    scores: { [key: string]: number };
    percentage: number;
  };
  playerName: string;
  onRetake: () => void;
  onBackToMenu: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  testResults,
  playerName,
  onRetake,
  onBackToMenu,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const videoPlayer = useVideoPlayer(
    require('../assets/images/particlesbackground.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Persönlichkeitstyp basierend auf Scores bestimmen
  const determinePersonalityType = () => {
    const { scores } = testResults;
    const maxScore = Math.max(...Object.values(scores));
    const dominantTrait = Object.keys(scores).find(
      (key) => scores[key] === maxScore,
    );

    const personalityTypes: {
      [key: string]: { name: string; description: string };
    } = {
      extraversion: {
        name: 'Der Gesellige',
        description:
          'Du bist extrovertiert und liebst es, unter Menschen zu sein. Du gewinnst Energie aus sozialen Interaktionen.',
      },
      agreeableness: {
        name: 'Der Harmoniebedürftige',
        description:
          'Du bist empathisch und hilfsbereit. Harmonie und gute Beziehungen sind dir wichtig.',
      },
      conscientiousness: {
        name: 'Der Gewissenhafte',
        description:
          'Du bist organisiert und zuverlässig. Pflichtbewusstsein und Ordnung prägen dein Leben.',
      },
      neuroticism: {
        name: 'Der Sensible',
        description:
          'Du bist emotional und empfindlich. Du nimmst Dinge sehr persönlich und tief.',
      },
      openness: {
        name: 'Der Kreative',
        description:
          'Du bist aufgeschlossen und neugierig. Neue Erfahrungen und Ideen begeistern dich.',
      },
    };

    return (
      personalityTypes[dominantTrait || 'openness'] || personalityTypes.openness
    );
  };

  const personalityType = determinePersonalityType();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Ich habe den ${testResults.testName} gemacht und bin: ${personalityType.name}! 🎯\n\nProbier es auch aus!`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return '#5de0e6';
    if (score >= 3) return '#ffc837';
    if (score >= 0) return '#ff6b6b';
    return '#888';
  };

  const normalizeScore = (score: number, max: number = 10) => {
    return Math.max(0, Math.min(100, ((score + 5) / max) * 100));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Video Background */}
      <VideoView
        player={videoPlayer}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Ionicons name="checkmark-circle" size={80} color="#5de0e6" />
            <Text style={styles.headerTitle}>Test abgeschlossen!</Text>
            <Text style={styles.headerSubtitle}>
              Gut gemacht, {playerName}! 🎉
            </Text>
          </Animated.View>

          {/* Result Card */}
          <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['rgba(0, 74, 173, 0.3)', 'rgba(93, 224, 230, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.resultGradient}
            >
              <Text style={styles.resultLabel}>Dein Persönlichkeitstyp</Text>
              <Text style={styles.resultType}>{personalityType.name}</Text>
              <Text style={styles.resultDescription}>
                {personalityType.description}
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Scores */}
          <Animated.View style={[styles.scoresCard, { opacity: fadeAnim }]}>
            <Text style={styles.scoresTitle}>Deine Auswertung</Text>

            {Object.keys(testResults.scores).map((category, index) => {
              const score = testResults.scores[category];
              const normalizedScore = normalizeScore(score);
              const color = getScoreColor(score);

              const categoryNames: { [key: string]: string } = {
                extraversion: 'Extraversion',
                agreeableness: 'Verträglichkeit',
                conscientiousness: 'Gewissenhaftigkeit',
                neuroticism: 'Neurotizismus',
                openness: 'Offenheit',
              };

              return (
                <View key={category} style={styles.scoreItem}>
                  <View style={styles.scoreHeader}>
                    <Text style={styles.scoreLabel}>
                      {categoryNames[category] || category}
                    </Text>
                    <Text style={[styles.scoreValue, { color }]}>
                      {Math.round(normalizedScore)}%
                    </Text>
                  </View>
                  <View style={styles.scoreBarBackground}>
                    <Animated.View
                      style={[
                        styles.scoreBarFill,
                        {
                          width: `${normalizedScore}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            style={[styles.actionsContainer, { opacity: fadeAnim }]}
          >
            <TouchableOpacity onPress={handleShare} activeOpacity={0.8}>
              <LinearGradient
                colors={['#004aad', '#5de0e6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shareButton}
              >
                <Ionicons name="share-social" size={24} color="#fff" />
                <Text style={styles.buttonText}>Teilen</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onRetake} activeOpacity={0.8}>
              <View style={styles.retakeButton}>
                <Ionicons name="refresh" size={24} color="#5de0e6" />
                <Text style={styles.retakeButtonText}>Erneut testen</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onBackToMenu} activeOpacity={0.8}>
              <View style={styles.backButton}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="rgba(255,255,255,0.7)"
                />
                <Text style={styles.backButtonText}>Zurück zum Menü</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
  },
  resultCard: {
    marginBottom: 30,
  },
  resultGradient: {
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: 'rgba(93, 224, 230, 0.3)',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#5de0e6',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  resultType: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  scoresCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(93, 224, 230, 0.2)',
    marginBottom: 30,
  },
  scoresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  scoreItem: {
    marginBottom: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  actionsContainer: {
    gap: 15,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#5de0e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    backgroundColor: 'rgba(93, 224, 230, 0.1)',
    borderWidth: 2,
    borderColor: '#5de0e6',
  },
  retakeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5de0e6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ResultScreen;
