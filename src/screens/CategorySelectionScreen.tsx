import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  FlatList,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hasAccessToLockedContent } from '../utils/subscriptionStorage';
import { loadAllProgress, EpisodeProgress } from '../utils/progressStorage';

const { width, height } = Dimensions.get('window');

export type StoryCategory =
  | 'Persönlichkeitstyp'
  | 'Emotionale Intelligenz'
  | 'Führungsqualitäten'
  | 'Stressresistenz'
  | 'Kommunikationsstil'
  | 'Beziehungspersönlichkeit'
  | 'Berufungsfinder'
  | 'Kreativitätsindex'
  | 'Dark Triad'
  | 'Growth vs Fixed Mindset'
  | 'Soziale Kompetenz'
  | 'Entscheidungsmacher'
  | 'Konfliktlösung'
  | 'Intuitions-Score';

interface StoryOption {
  id: string;
  storyId: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: [string, string];
  totalPhases: number;
  isLocked: boolean;
  ageRating: number;
}

interface CategorySelectionScreenProps {
  playerName: string;
  onCategorySelect: (storyId: string) => void;
  onBack: () => void;
  onShowPreorder?: (
    storyId: string,
    storyName: string,
    gradientColors: [string, string],
  ) => void;
}

const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({
  playerName,
  onCategorySelect,
  onBack,
  onShowPreorder,
}) => {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [storyProgress, setStoryProgress] = useState<{
    [key: string]: { completed: number; total: number; percentage: number };
  }>({});
  const scaleAnims = React.useRef(
    Array.from({ length: 14 }, () => new Animated.Value(1)),
  ).current;

  // Refs for auto-scroll animations
  const scrollAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    const loadData = async () => {
      const access = await hasAccessToLockedContent();
      setHasAccess(access);

      // Lade alle Progress-Daten
      const allProgress = await loadAllProgress();

      // Berechne Fortschritt pro Story (basierend auf 30 Phasen)
      const progress: {
        [key: string]: { completed: number; total: number; percentage: number };
      } = {};

      stories.forEach((story) => {
        const storyProgressData = allProgress[story.storyId];
        const totalPhases = 30;
        const completedPhases = storyProgressData
          ? Math.round((storyProgressData.progress / 100) * totalPhases)
          : 0;
        const percentage = storyProgressData ? storyProgressData.progress : 0;

        progress[story.id] = {
          completed: completedPhases,
          total: totalPhases,
          percentage,
        };
      });

      setStoryProgress(progress);
    };
    loadData();
  }, []);

  // Video Player für Fallback
  const videoPlayer = useVideoPlayer(
    require('../assets/images/particlesbackground.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

  // Video Player für "Die Nacht ohne Ende"
  const nightVideoPlayer = useVideoPlayer(
    require('../assets/images/nightwithoutend.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "Das Echo der Verschwundenen"
  const echoVideoPlayer = useVideoPlayer(
    require('../assets/images/echo.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "Chroniken des Verlorenen Reichs"
  const lostKingdomVideoPlayer = useVideoPlayer(
    require('../assets/images/lostkingdom.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "Raum 237: Niemals Verlassen"
  const secretRoomVideoPlayer = useVideoPlayer(
    require('../assets/images/secretroom.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "72 Stunden bis Mitternacht"
  const midnightVideoPlayer = useVideoPlayer(
    require('../assets/images/midnight.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "Zwischen Herzschlag und Ewigkeit"
  const pulseVideoPlayer = useVideoPlayer(
    require('../assets/images/pulse.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "Omega Protokoll: Signal Null"
  const protocolVideoPlayer = useVideoPlayer(
    require('../assets/images/protocol.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  // Video Player für "Das Vermächtnis der Sieben Meere"
  const oceanVideoPlayer = useVideoPlayer(
    require('../assets/images/7ocean.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.volume = 0;
      player.playbackRate = 1.0;
      player.play();
    },
  );

  const stories: StoryOption[] = useMemo(
    () => [
      {
        id: 'pers_01',
        storyId: 'pers_01',
        name: 'Persönlichkeitstyp',
        description:
          'Entdecke deinen einzigartigen Charakter - Intro/Extro, Denker/Fühler',
        icon: 'person',
        gradientColors: ['#4a0e4e', '#8e2de2'],
        totalPhases: 25,
        isLocked: false,
        ageRating: 0,
      },
      {
        id: 'eq_01',
        storyId: 'eq_01',
        name: 'Emotionale Intelligenz',
        description: 'Wie gut verstehst du deine und fremde Emotionen?',
        icon: 'heart',
        gradientColors: ['#1a2a6c', '#b21f1f'],
        totalPhases: 20,
        isLocked: false,
        ageRating: 0,
      },
      {
        id: 'lead_01',
        storyId: 'lead_01',
        name: 'Führungsqualitäten',
        description: 'Bist du geboren, um zu führen oder zu folgen?',
        icon: 'trophy',
        gradientColors: ['#134e5e', '#71b280'],
        totalPhases: 18,
        isLocked: false,
        ageRating: 0,
      },
      {
        id: 'stress_01',
        storyId: 'stress_01',
        name: 'Stressresistenz',
        description: 'Wie gehst du mit Druck und schwierigen Situationen um?',
        icon: 'flame',
        gradientColors: ['#2c1e31', '#8b0000'],
        totalPhases: 15,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'comm_01',
        storyId: 'comm_01',
        name: 'Kommunikationsstil',
        description: 'Direkt oder diplomatisch? Finde deinen Kommunikationstyp',
        icon: 'chatbubbles',
        gradientColors: ['#141e30', '#ff6b6b'],
        totalPhases: 16,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'love_01',
        storyId: 'love_01',
        name: 'Beziehungspersönlichkeit',
        description:
          'Welcher Beziehungstyp bist du? Romantiker, Realist oder Pragmatiker?',
        icon: 'heart-circle',
        gradientColors: ['#ff6b9d', '#c44569'],
        totalPhases: 22,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'career_01',
        storyId: 'career_01',
        name: 'Berufungsfinder',
        description:
          'Welcher Karriereweg passt wirklich zu deiner Persönlichkeit?',
        icon: 'briefcase',
        gradientColors: ['#0f2027', '#2c5364'],
        totalPhases: 24,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'creative_01',
        storyId: 'creative_01',
        name: 'Kreativitätsindex',
        description:
          'Analytisch oder künstlerisch? Teste dein kreatives Potential',
        icon: 'color-palette',
        gradientColors: ['#f46b45', '#eea849'],
        totalPhases: 19,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'dark_01',
        storyId: 'dark_01',
        name: 'Dark Triad',
        description:
          'Wie ausgeprägt sind deine dunklen Persönlichkeitsaspekte?',
        icon: 'moon',
        gradientColors: ['#3a1c71', '#d76d77'],
        totalPhases: 21,
        isLocked: true,
        ageRating: 16,
      },
      {
        id: 'mindset_01',
        storyId: 'mindset_01',
        name: 'Growth vs Fixed Mindset',
        description: 'Glaubst du an Wachstum oder bleibst du in Mustern?',
        icon: 'trending-up',
        gradientColors: ['#000000', '#434343'],
        totalPhases: 17,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'social_01',
        storyId: 'social_01',
        name: 'Soziale Kompetenz',
        description:
          'Networking-Profi oder Einzelgänger? Teste deine sozialen Fähigkeiten',
        icon: 'people',
        gradientColors: ['#f093fb', '#f5576c'],
        totalPhases: 20,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'decision_01',
        storyId: 'decision_01',
        name: 'Entscheidungsmacher',
        description:
          'Rational oder impulsiv? Analysiere deinen Entscheidungsprozess',
        icon: 'git-branch',
        gradientColors: ['#4b6cb7', '#182848'],
        totalPhases: 18,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'conflict_01',
        storyId: 'conflict_01',
        name: 'Konfliktlösung',
        description: 'Kämpfer, Vermittler oder Flüchter? Dein Konflikttyp',
        icon: 'shield',
        gradientColors: ['#2c3e50', '#fd746c'],
        totalPhases: 16,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'intuition_01',
        storyId: 'intuition_01',
        name: 'Intuitions-Score',
        description: 'Wie stark verlässt du dich auf dein Bauchgefühl?',
        icon: 'eye',
        gradientColors: ['#5f2c82', '#49a09d'],
        totalPhases: 15,
        isLocked: true,
        ageRating: 0,
      },
    ],
    [],
  );

  // Gruppiere Stories in Reihen mit je 5 Cards
  const storyRows = useMemo(() => {
    const rows: StoryOption[][] = [];
    for (let i = 0; i < stories.length; i += 5) {
      rows.push(stories.slice(i, i + 5));
    }
    return rows;
  }, [stories]);

  // Initialize scroll animations for each row
  useEffect(() => {
    storyRows.forEach((_, index) => {
      if (!scrollAnims[index]) {
        scrollAnims[index] = new Animated.Value(0);
      }
    });
  }, [storyRows]);

  // Auto-scroll animation für jede Reihe
  useEffect(() => {
    const animations = storyRows.map((row, rowIndex) => {
      const scrollAnim = scrollAnims[rowIndex] || new Animated.Value(0);
      const cardWidth = width * 0.8 + 15; // Card width + gap
      const totalWidth = row.length * cardWidth;
      const isEven = rowIndex % 2 === 0;

      return Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: isEven ? -totalWidth : totalWidth,
            duration: 40000,
            useNativeDriver: true,
          }),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [storyRows, scrollAnims]);

  const handleStoryPress = useCallback(
    (story: StoryOption, index: number) => {
      // Navigate locked stories to preorder screen
      if (story.isLocked) {
        if (onShowPreorder) {
          onShowPreorder(story.storyId, story.name, story.gradientColors);
        }
        return;
      }

      setSelectedStory(story.id);

      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnims[index], {
          toValue: 0.95,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnims[index], {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();

      // Navigate after animation
      setTimeout(() => {
        onCategorySelect(story.storyId);
      }, 150);
    },
    [hasAccess, onCategorySelect, onShowPreorder, scaleAnims],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Dark Overlay (no video background) */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Hallo {playerName}!</Text>
            <Text style={styles.subtitle}>Wähle einen Test</Text>
          </View>
        </View>

        {/* Stories Vertical List with Horizontal Cards */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalScrollContent}
          style={styles.verticalScrollContainer}
        >
          {stories.map((story, index) => (
            <Animated.View
              key={story.id}
              style={[
                styles.categoryWrapper,
                { transform: [{ scale: scaleAnims[index] }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleStoryPress(story, index)}
              >
                <LinearGradient
                  colors={story.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.categoryCard,
                    selectedStory === story.id && styles.selectedCard,
                  ]}
                >
                  {/* Video Background - Only for unlocked tests */}
                  {!story.isLocked &&
                    (story.id === 'pers_01' ||
                      story.id === 'eq_01' ||
                      story.id === 'lead_01') && (
                      <>
                        <View style={styles.videoContainer}>
                          <VideoView
                            player={
                              story.id === 'pers_01' && nightVideoPlayer
                                ? nightVideoPlayer
                                : story.id === 'eq_01' && echoVideoPlayer
                                ? echoVideoPlayer
                                : story.id === 'lead_01' &&
                                  lostKingdomVideoPlayer
                                ? lostKingdomVideoPlayer
                                : videoPlayer
                            }
                            style={styles.videoBackground}
                            nativeControls={false}
                          />
                        </View>
                        <View style={styles.videoDarkOverlay} />
                      </>
                    )}

                  {/* Dauer Badge - Top Left */}
                  <View style={styles.fskBadge}>
                    <Text style={styles.fskText}>
                      ~{Math.round(story.totalPhases * 1.5)} Min
                    </Text>
                  </View>

                  {/* Content Row */}
                  <View style={styles.cardContent}>
                    {/* Left Side: Icon */}
                    <LinearGradient
                      colors={story.gradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.iconContainer}
                    >
                      <View style={styles.iconInnerCircle}>
                        <Ionicons name={story.icon} size={48} color="#fff" />
                      </View>
                    </LinearGradient>

                    {/* Middle: Text */}
                    <View style={styles.textContainer}>
                      <Text style={styles.categoryName} numberOfLines={2}>
                        {story.name}
                      </Text>
                      <Text
                        style={styles.categoryDescription}
                        numberOfLines={1}
                      >
                        {story.description}
                      </Text>
                    </View>

                    {/* Right Side: Badges */}
                    <View style={styles.badgesContainer}>
                      {!story.isLocked && (
                        <LinearGradient
                          colors={story.gradientColors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.storyCountBadge}
                        >
                          <Ionicons name="help-circle" size={14} color="#fff" />
                          <Text style={styles.storyCountText}>
                            {story.totalPhases} Fragen
                          </Text>
                        </LinearGradient>
                      )}
                    </View>
                  </View>
                  {/* Progress Bar & Percentage - Bottom Right Corner */}
                  <View style={styles.progressBottomContainer}>
                    {/* Premium Badge - links neben Progress */}
                    {story.isLocked && (
                      <View style={styles.comingSoonBadgeBottom}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.comingSoonTextBottom}>Premium</Text>
                      </View>
                    )}

                    {/* Progress Bar - nur wenn Fortschritt vorhanden */}
                    {storyProgress[story.id] && (
                      <>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${storyProgress[story.id].percentage}%`,
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressPercentageText}>
                          {Math.round(storyProgress[story.id].percentage)}%
                        </Text>
                      </>
                    )}
                  </View>
                  {/* Glow Effect */}
                  {selectedStory === story.id && (
                    <View style={styles.glowEffect} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
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
  videoBackgroundFullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  safeArea: {
    flex: 1,
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
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  verticalScrollContainer: {
    flex: 1,
  },
  verticalScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  categoryWrapper: {
    width: '100%',
  },
  categoryCard: {
    borderRadius: 20,
    padding: 20,
    height: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  videoPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }, { scale: 1.5 }],
  },
  videoDarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  selectedCard: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: -1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  iconInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    flexShrink: 1,
  },
  categoryDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
    marginBottom: 8,
    flexShrink: 1,
  },
  storyCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  storyCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  progressBottomContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBarBackground: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 6,
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  progressPercentageContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressPercentageText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4ade80',
    minWidth: 35,
  },
  fskBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  fskBadge6: {
    backgroundColor: 'rgba(34, 197, 94, 0.85)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  fskBadge12: {
    backgroundColor: 'rgba(59, 130, 246, 0.85)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  fskBadge16Plus: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  fskText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  comingSoonBadgeBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.3,
  },
  comingSoonTextBottom: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    minWidth: 32,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategorySelectionScreen;
