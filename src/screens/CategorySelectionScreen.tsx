import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hasAccessToLockedContent } from '../utils/subscriptionStorage';
import { loadAllProgress, EpisodeProgress } from '../utils/progressStorage';

const { width, height } = Dimensions.get('window');

export type StoryCategory =
  | 'Albtraum'
  | 'Mystery'
  | 'Fantasy'
  | 'Horror'
  | 'Thriller'
  | 'Romance'
  | 'Sci-Fi'
  | 'Adventure'
  | 'Dark Fantasy'
  | 'Psycho'
  | 'Comedy'
  | 'Drama'
  | 'Crime'
  | 'Supernatural';

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
        id: 'alb_01',
        storyId: 'alb_01',
        name: 'Die Nacht ohne Ende',
        description:
          'Wenn die Dunkelheit lebendig wird und es kein Erwachen gibt...',
        icon: 'moon',
        gradientColors: ['#4a0e4e', '#8e2de2'],
        totalPhases: 30,
        isLocked: false,
        ageRating: 12,
      },
      {
        id: 'mys_01',
        storyId: 'mys_01',
        name: 'Das Echo der Verschwundenen',
        description: 'Sie verschwinden spurlos, doch ihre Stimmen bleiben...',
        icon: 'key',
        gradientColors: ['#1a2a6c', '#b21f1f'],
        totalPhases: 30,
        isLocked: false,
        ageRating: 12,
      },
      {
        id: 'fan_01',
        storyId: 'fan_01',
        name: 'Chroniken des Verlorenen Reichs',
        description: 'Wenn das letzte Kapitel die Welt auslöschen könnte...',
        icon: 'sparkles',
        gradientColors: ['#134e5e', '#71b280'],
        totalPhases: 30,
        isLocked: false,
        ageRating: 6,
      },
      {
        id: 'hor_01',
        storyId: 'hor_01',
        name: 'Raum 237: Niemals Verlassen',
        description: 'Wer eintritt, gehört dem Haus. Für immer...',
        icon: 'skull',
        gradientColors: ['#2c1e31', '#8b0000'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 16,
      },
      {
        id: 'thr_01',
        storyId: 'thr_01',
        name: '72 Stunden bis Mitternacht',
        description:
          'Die Uhr tickt. Jede Entscheidung zählt. Jeder Fehler tötet...',
        icon: 'flash',
        gradientColors: ['#141e30', '#ff6b6b'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 16,
      },
      {
        id: 'rom_01',
        storyId: 'rom_01',
        name: 'Zwischen Herzschlag und Ewigkeit',
        description:
          'Eine Liebe, die die Zeit überwindet. Ein Preis, der alles kostet...',
        icon: 'heart',
        gradientColors: ['#ff6b9d', '#c44569'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 12,
      },
      {
        id: 'sci_01',
        storyId: 'sci_01',
        name: 'Omega Protokoll: Signal Null',
        description: 'Die Menschheit ist tot. Du bist die letzte KI. Was nun?',
        icon: 'planet',
        gradientColors: ['#0f2027', '#2c5364'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 12,
      },
      {
        id: 'adv_01',
        storyId: 'adv_01',
        name: 'Das Vermächtnis der Sieben Meere',
        description:
          'Ein Schatz, der Könige zu Sklaven macht. Eine Karte aus Blut...',
        icon: 'compass',
        gradientColors: ['#f46b45', '#eea849'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 6,
      },
      {
        id: 'daf_01',
        storyId: 'daf_01',
        name: 'Thron der zerbrochenen Seelen',
        description: 'Um zu herrschen, musst du deine Menschlichkeit opfern...',
        icon: 'flame',
        gradientColors: ['#3a1c71', '#d76d77'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 16,
      },
      {
        id: 'psy_01',
        storyId: 'psy_01',
        name: 'Ich bin du bist wir',
        description: 'Wenn deine Gedanken nicht mehr dir gehören...',
        icon: 'eye',
        gradientColors: ['#000000', '#434343'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 16,
      },
      {
        id: 'com_01',
        storyId: 'com_01',
        name: 'Murphy hatte Recht',
        description:
          'Alles was schiefgehen kann, wird schiefgehen. Heute. Gleichzeitig...',
        icon: 'happy',
        gradientColors: ['#f093fb', '#f5576c'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 0,
      },
      {
        id: 'dra_01',
        storyId: 'dra_01',
        name: 'Die letzten Worte an dich',
        description:
          'Ein Brief. Eine Wahrheit. Ein Leben, das nie mehr dasselbe sein wird...',
        icon: 'water',
        gradientColors: ['#4b6cb7', '#182848'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 12,
      },
      {
        id: 'cri_01',
        storyId: 'cri_01',
        name: 'Akte Blutmond: Ungelöst',
        description: 'Drei Morde. Ein Muster. Du bist der nächste...',
        icon: 'finger-print',
        gradientColors: ['#2c3e50', '#fd746c'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 16,
      },
      {
        id: 'sup_01',
        storyId: 'sup_01',
        name: 'Berührt von der Anderen Seite',
        description:
          'Deine Gabe ist kein Geschenk. Es ist ein Fluch, der dich verfolgt...',
        icon: 'prism',
        gradientColors: ['#5f2c82', '#49a09d'],
        totalPhases: 30,
        isLocked: true,
        ageRating: 0,
      },
    ],
    [],
  );

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
            <Text style={styles.subtitle}>Wähle deine Geschichte</Text>
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
                  {/* Video Background - Only for unlocked stories */}
                  {!story.isLocked && (
                    <>
                      <View style={styles.videoContainer}>
                        <VideoView
                          player={
                            story.id === 'alb_01' && nightVideoPlayer
                              ? nightVideoPlayer
                              : story.id === 'mys_01' && echoVideoPlayer
                              ? echoVideoPlayer
                              : story.id === 'fan_01' && lostKingdomVideoPlayer
                              ? lostKingdomVideoPlayer
                              : nightVideoPlayer || videoPlayer
                          }
                          style={styles.videoBackground}
                          nativeControls={false}
                        />
                      </View>
                      <View style={styles.videoDarkOverlay} />
                    </>
                  )}

                  {/* FSK Badge - Top Left */}
                  <View
                    style={[
                      styles.fskBadge,
                      story.ageRating === 6 && styles.fskBadge6,
                      story.ageRating === 12 && styles.fskBadge12,
                      story.ageRating >= 16 && styles.fskBadge16Plus,
                    ]}
                  >
                    <Text style={styles.fskText}>FSK {story.ageRating}</Text>
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
                          <Ionicons name="layers" size={14} color="#fff" />
                          <Text style={styles.storyCountText}>
                            {story.totalPhases}
                          </Text>
                        </LinearGradient>
                      )}
                    </View>
                  </View>
                  {/* Progress Bar & Percentage - Bottom Right Corner */}
                  <View style={styles.progressBottomContainer}>
                    {/* Bald verfügbar Badge - links neben Progress */}
                    {story.isLocked && (
                      <View style={styles.comingSoonBadgeBottom}>
                        <Ionicons
                          name="lock-closed"
                          size={12}
                          color="#FFD700"
                        />
                        <Text style={styles.comingSoonTextBottom}>
                          Bald verfügbar
                        </Text>
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
