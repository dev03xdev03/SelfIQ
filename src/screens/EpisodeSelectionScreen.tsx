import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadAllProgress, EpisodeProgress } from '../utils/progressStorage';
import SubscriptionScreen from './SubscriptionScreen';
import type { StoryCategory } from './CategorySelectionScreen';

const { width, height } = Dimensions.get('window');

type EpisodeCategory = StoryCategory;

interface Episode {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  isCompleted: boolean;
  progress: number;
  category: EpisodeCategory;
  gradientColors: [string, string];
  icon: keyof typeof Ionicons.glyphMap;
  totalSubEpisodes?: number;
  unlockedSubEpisodes?: number;
}

interface EpisodeSelectionScreenProps {
  playerName: string;
  selectedCategory: StoryCategory;
  onEpisodeSelect: (episodeId: string) => void;
  onBack: () => void;
}

const EpisodeSelectionScreen: React.FC<EpisodeSelectionScreenProps> = ({
  playerName,
  selectedCategory,
  onEpisodeSelect,
  onBack,
}) => {
  const [filterMode, setFilterMode] = useState<'alle' | 'gratis' | 'premium'>(
    'alle',
  );
  const [progressData, setProgressData] = useState<{
    [episodeId: string]: EpisodeProgress;
  }>({});
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedEpisodeName, setSelectedEpisodeName] = useState<string>('');

  useEffect(() => {
    // Lade gespeicherten Fortschritt beim Mounten
    const loadProgress = async () => {
      const progress = await loadAllProgress();
      setProgressData(progress);
    };
    loadProgress();
  }, []);

  const videoPlayer = useVideoPlayer(
    require('../assets/images/particlesbackground.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

  // Test-Varianten: Verschiedene Versionen pro Testkategorie
  const episodes: Episode[] = [
    // Persönlichkeitstyp
    {
      id: 'pers_01',
      name: 'Klassischer Persönlichkeitstest',
      description:
        'Der umfassende Test für deinen Charaktertyp nach Myers-Briggs',
      isFree: true,
      isCompleted: progressData['pers_01']?.progress === 100,
      progress: progressData['pers_01']?.progress || 0,
      category: 'Persönlichkeitstyp',
      gradientColors: ['#4a0e4e', '#8e2de2'],
      icon: 'person',
      totalSubEpisodes: 25,
      unlockedSubEpisodes: 25,
    },

    // Emotionale Intelligenz
    {
      id: 'eq_01',
      name: 'EQ-Test Standard',
      description: 'Messe deine emotionale Intelligenz in 5 Bereichen',
      isFree: true,
      isCompleted: progressData['eq_01']?.progress === 100,
      progress: progressData['eq_01']?.progress || 0,
      category: 'Emotionale Intelligenz',
      gradientColors: ['#1a2a6c', '#b21f1f'],
      icon: 'heart',
      totalSubEpisodes: 20,
      unlockedSubEpisodes: 20,
    },

    // Führungsqualitäten
    {
      id: 'lead_01',
      name: 'Leadership-Analyse',
      description: 'Ermittle deinen Führungsstil und Führungspotenzial',
      isFree: true,
      isCompleted: progressData['lead_01']?.progress === 100,
      progress: progressData['lead_01']?.progress || 0,
      category: 'Führungsqualitäten',
      gradientColors: ['#134e5e', '#71b280'],
      icon: 'trophy',
      totalSubEpisodes: 18,
      unlockedSubEpisodes: 18,
    },

    // Stressresistenz
    {
      id: 'stress_01',
      name: 'Stress-Belastungstest',
      description: 'Wie gut hältst du extremem Druck stand?',
      isFree: false,
      isCompleted: progressData['stress_01']?.progress === 100,
      progress: progressData['stress_01']?.progress || 0,
      category: 'Stressresistenz',
      gradientColors: ['#2c1e31', '#8b0000'],
      icon: 'flame',
      totalSubEpisodes: 15,
      unlockedSubEpisodes: 15,
    },

    // Kommunikationsstil
    {
      id: 'comm_01',
      name: 'Kommunikationsanalyse',
      description: 'Entdecke deinen primären Kommunikationstyp',
      isFree: false,
      isCompleted: progressData['comm_01']?.progress === 100,
      progress: progressData['comm_01']?.progress || 0,
      category: 'Kommunikationsstil',
      gradientColors: ['#141e30', '#ff6b6b'],
      icon: 'chatbubbles',
      totalSubEpisodes: 16,
      unlockedSubEpisodes: 16,
    },

    // Beziehungspersönlichkeit
    {
      id: 'love_01',
      name: 'Beziehungstest Komplett',
      description: 'Deine Liebe, dein Stil, deine Erwartungen',
      isFree: false,
      isCompleted: progressData['love_01']?.progress === 100,
      progress: progressData['love_01']?.progress || 0,
      category: 'Beziehungspersönlichkeit',
      gradientColors: ['#ff6b9d', '#c44569'],
      icon: 'heart-circle',
      totalSubEpisodes: 22,
      unlockedSubEpisodes: 22,
    },

    // Berufungsfinder
    {
      id: 'career_01',
      name: 'Karriere-Match-Test',
      description: 'Welcher Beruf passt wirklich zu dir?',
      isFree: false,
      isCompleted: progressData['career_01']?.progress === 100,
      progress: progressData['career_01']?.progress || 0,
      category: 'Berufungsfinder',
      gradientColors: ['#0f2027', '#2c5364'],
      icon: 'briefcase',
      totalSubEpisodes: 24,
      unlockedSubEpisodes: 24,
    },

    // Kreativitätsindex
    {
      id: 'creative_01',
      name: 'Kreativitäts-Profil',
      description: 'Links- oder Rechtshirn-Dominanz?',
      isFree: false,
      isCompleted: progressData['creative_01']?.progress === 100,
      progress: progressData['creative_01']?.progress || 0,
      category: 'Kreativitätsindex',
      gradientColors: ['#f46b45', '#eea849'],
      icon: 'color-palette',
      totalSubEpisodes: 19,
      unlockedSubEpisodes: 19,
    },

    // Dark Triad
    {
      id: 'dark_01',
      name: 'Dark Triad Assessment',
      description: 'Narzissmus, Machiavellismus, Psychopathie',
      isFree: false,
      isCompleted: progressData['dark_01']?.progress === 100,
      progress: progressData['dark_01']?.progress || 0,
      category: 'Dark Triad',
      gradientColors: ['#3a1c71', '#d76d77'],
      icon: 'moon',
      totalSubEpisodes: 21,
      unlockedSubEpisodes: 21,
    },

    // Growth vs Fixed Mindset
    {
      id: 'mindset_01',
      name: 'Mindset-Analyse',
      description: 'Wachstumsdenken vs. Fixe Denkweise',
      isFree: false,
      isCompleted: progressData['mindset_01']?.progress === 100,
      progress: progressData['mindset_01']?.progress || 0,
      category: 'Growth vs Fixed Mindset',
      gradientColors: ['#000000', '#434343'],
      icon: 'trending-up',
      totalSubEpisodes: 17,
      unlockedSubEpisodes: 17,
    },

    // Soziale Kompetenz
    {
      id: 'social_01',
      name: 'Sozialkompetenz-Check',
      description: 'Deine Fähigkeiten im Umgang mit Menschen',
      isFree: false,
      isCompleted: progressData['social_01']?.progress === 100,
      progress: progressData['social_01']?.progress || 0,
      category: 'Soziale Kompetenz',
      gradientColors: ['#f093fb', '#f5576c'],
      icon: 'people',
      totalSubEpisodes: 20,
      unlockedSubEpisodes: 20,
    },

    // Entscheidungsmacher
    {
      id: 'decision_01',
      name: 'Entscheidungs-Profil',
      description: 'Wie du Entscheidungen triffst und warum',
      isFree: false,
      isCompleted: progressData['decision_01']?.progress === 100,
      progress: progressData['decision_01']?.progress || 0,
      category: 'Entscheidungsmacher',
      gradientColors: ['#4b6cb7', '#182848'],
      icon: 'git-branch',
      totalSubEpisodes: 18,
      unlockedSubEpisodes: 18,
    },

    // Konfliktlösung
    {
      id: 'conflict_01',
      name: 'Konflikt-Strategie-Test',
      description: 'Dein Verhalten in Konfliktsituationen',
      isFree: false,
      isCompleted: progressData['conflict_01']?.progress === 100,
      progress: progressData['conflict_01']?.progress || 0,
      category: 'Konfliktlösung',
      gradientColors: ['#2c3e50', '#fd746c'],
      icon: 'shield',
      totalSubEpisodes: 16,
      unlockedSubEpisodes: 16,
    },

    // Intuitions-Score
    {
      id: 'intuition_01',
      name: 'Intuitions-Test',
      description: 'Wie stark ist dein Bauchgefühl wirklich?',
      isFree: false,
      isCompleted: progressData['intuition_01']?.progress === 100,
      progress: progressData['intuition_01']?.progress || 0,
      category: 'Intuitions-Score',
      gradientColors: ['#5f2c82', '#49a09d'],
      icon: 'eye',
      totalSubEpisodes: 15,
      unlockedSubEpisodes: 15,
    },
  ];

  // Filter episodes by selected category
  const filteredEpisodes = episodes.filter((ep) => {
    // Filter by test category first
    if (ep.category !== selectedCategory) return false;

    // Then apply free/premium filter
    if (filterMode === 'gratis') return ep.isFree;
    if (filterMode === 'premium') return !ep.isFree;
    return true;
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={videoPlayer}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      <View style={styles.darkOverlay} />

      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>{selectedCategory}</Text>
            <Text style={styles.subText}>Wähle eine Test-Variante</Text>
          </View>
        </View>

        {/* Kategorie-Filter */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            onPress={() => setFilterMode('alle')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                filterMode === 'alle'
                  ? ['rgba(0, 74, 173, 0.95)', 'rgba(93, 224, 230, 0.95)']
                  : ['rgba(30, 30, 30, 0.8)', 'rgba(50, 50, 50, 0.8)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.categoryBadge}
            >
              <Ionicons
                name="apps"
                size={14}
                color={filterMode === 'alle' ? '#FFD700' : '#888'}
              />
              <Text
                style={[
                  styles.categoryText,
                  filterMode !== 'alle' && styles.categoryTextInactive,
                ]}
              >
                Alle
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterMode('gratis')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                filterMode === 'gratis'
                  ? ['rgba(0, 74, 173, 0.95)', 'rgba(93, 224, 230, 0.95)']
                  : ['rgba(30, 30, 30, 0.8)', 'rgba(50, 50, 50, 0.8)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.categoryBadge}
            >
              <Ionicons
                name="sparkles"
                size={14}
                color={filterMode === 'gratis' ? '#FFD700' : '#888'}
              />
              <Text
                style={[
                  styles.categoryText,
                  filterMode !== 'gratis' && styles.categoryTextInactive,
                ]}
              >
                Kostenlos
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterMode('premium')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                filterMode === 'premium'
                  ? ['rgba(0, 74, 173, 0.95)', 'rgba(93, 224, 230, 0.95)']
                  : ['rgba(30, 30, 30, 0.8)', 'rgba(50, 50, 50, 0.8)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.categoryBadge}
            >
              <Ionicons
                name="star"
                size={14}
                color={filterMode === 'premium' ? '#FFD700' : '#888'}
              />
              <Text
                style={[
                  styles.categoryText,
                  filterMode !== 'premium' && styles.categoryTextInactive,
                ]}
              >
                Premium
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Episoden-Liste */}
        <ScrollView
          style={styles.episodeList}
          showsVerticalScrollIndicator={false}
        >
          {filteredEpisodes.map((episode, index) => (
            <TouchableOpacity
              key={episode.id}
              onPress={() => {
                if (episode.isFree) {
                  onEpisodeSelect(episode.id);
                } else {
                  setSelectedEpisodeName(episode.name);
                  setShowSubscription(true);
                }
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  `${episode.gradientColors[0]}dd`,
                  `${episode.gradientColors[1]}dd`,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.episodeCard,
                  !episode.isFree && styles.episodeCardLocked,
                ]}
              >
                {/* Category Badge & Icon */}
                <View style={styles.categoryBadgeRow}>
                  <View
                    style={[
                      styles.categoryIconContainer,
                      {
                        backgroundColor: `${episode.gradientColors[0]}cc`,
                      },
                    ]}
                  >
                    <Ionicons name={episode.icon} size={20} color="#FFFFFF" />
                  </View>

                  {/* Zeige "Premium" Badge rechts, wenn nicht frei */}
                  {!episode.isFree ? (
                    <View
                      style={[
                        styles.comingSoonBadgeTop,
                        {
                          backgroundColor: `rgba(255, 215, 0, 0.25)`,
                        },
                      ]}
                    >
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.comingSoonTextTop}>Premium</Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.categoryTag,
                        {
                          backgroundColor: `${episode.gradientColors[1]}99`,
                        },
                      ]}
                    >
                      <Text style={styles.categoryTagText}>
                        {episode.category}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Episode Header */}
                <View style={styles.episodeHeader}>
                  <View style={styles.episodeTitleRow}>
                    <Text style={styles.episodeNumber}>Test #{index + 1}</Text>
                    {!episode.isFree && (
                      <Ionicons name="star" size={16} color="#FFD700" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.episodeName,
                      !episode.isFree && styles.episodeNameLocked,
                    ]}
                    numberOfLines={2}
                  >
                    {episode.name}
                  </Text>
                </View>

                {/* Episode Description */}
                <Text
                  style={[
                    styles.episodeDescription,
                    !episode.isFree && styles.episodeDescriptionLocked,
                  ]}
                  numberOfLines={2}
                >
                  {episode.description}
                </Text>

                {/* Sub-Episode Counter */}
                {episode.totalSubEpisodes && (
                  <View style={styles.subEpisodeCounter}>
                    <View
                      style={[
                        styles.subEpisodeIndicator,
                        {
                          backgroundColor: `${episode.gradientColors[0]}aa`,
                        },
                      ]}
                    >
                      <Ionicons name="help-circle" size={14} color="#FFFFFF" />
                      <Text style={styles.subEpisodeText}>
                        {episode.totalSubEpisodes} Fragen
                      </Text>
                    </View>
                  </View>
                )}

                {/* Progress Bar (wenn gestartet) */}
                {episode.progress > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <LinearGradient
                        colors={['#004aad', '#5de0e6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          styles.progressFill,
                          { width: `${episode.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {episode.progress}% abgeschlossen
                    </Text>
                  </View>
                )}

                {/* Premium Badge (bei gesperrten Tests) */}
                {!episode.isFree && episode.progress === 0 && (
                  <View style={styles.comingSoonBadge}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.comingSoonText}>
                      Premium freischalten
                    </Text>
                  </View>
                )}

                {/* Start Button */}
                <View style={styles.playButtonContainer}>
                  <Ionicons
                    name={
                      episode.progress > 0 ? 'checkmark-circle' : 'play-circle'
                    }
                    size={32}
                    color="#5de0e6"
                  />
                  <Text style={styles.playButtonText}>
                    {episode.progress > 0 ? 'Fortsetzen' : 'Test starten'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Subscription Modal */}
      <Modal
        visible={showSubscription}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SubscriptionScreen
          onClose={() => setShowSubscription(false)}
          episodeName={selectedEpisodeName}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#b5c5c5',
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#5de0e6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryTextInactive: {
    color: '#888888',
  },
  episodeList: {
    flex: 1,
  },
  episodeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(93, 224, 230, 0.3)',
    shadowColor: '#5de0e6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  episodeCardLocked: {
    borderColor: 'rgba(100, 100, 100, 0.2)',
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  episodeHeader: {
    marginBottom: 12,
    zIndex: 10,
  },
  episodeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  episodeNumber: {
    fontSize: 12,
    color: '#5de0e6',
    fontWeight: '600',
    letterSpacing: 1,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(93, 224, 230, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  freeBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
  },
  episodeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    zIndex: 10,
    flexShrink: 1,
    elevation: 10,
  },
  episodeNameLocked: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowRadius: 8,
  },
  episodeDescription: {
    fontSize: 14,
    color: '#b5c5c5',
    lineHeight: 20,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 10,
  },
  episodeDescriptionLocked: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  subEpisodeCounter: {
    marginBottom: 12,
  },
  subEpisodeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  subEpisodeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 11,
    color: '#5de0e6',
    fontWeight: '600',
  },
  playButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButtonText: {
    fontSize: 16,
    color: '#5de0e6',
    fontWeight: '600',
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  comingSoonBadgeTop: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '700',
  },
  comingSoonTextTop: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
});

export default EpisodeSelectionScreen;
