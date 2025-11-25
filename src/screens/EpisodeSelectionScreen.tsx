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

  // Episoden-Daten: 1 Story pro Kategorie mit 30 Phasen
  const episodes: Episode[] = [
    // ALBTRAUM
    {
      id: 'alb_01',
      name: 'Lunas Albtraum',
      description:
        'Ein kleines MÃ¤dchen erwacht in einem geheimnisvollen Wald...',
      isFree: true,
      isCompleted: progressData['alb_01']?.progress === 100,
      progress: progressData['alb_01']?.progress || 0,
      category: 'Albtraum',
      gradientColors: ['#4a0e4e', '#8e2de2'],
      icon: 'moon',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // MYSTERY
    {
      id: 'mys_01',
      name: 'Die vergessene TÃ¼r',
      description: 'Hinter verschlossenen TÃ¼ren lauern Geheimnisse...',
      isFree: true,
      isCompleted: progressData['mys_01']?.progress === 100,
      progress: progressData['mys_01']?.progress || 0,
      category: 'Mystery',
      gradientColors: ['#1a2a6c', '#b21f1f'],
      icon: 'key',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // FANTASY
    {
      id: 'fan_01',
      name: 'Die vergessene Magie',
      description: 'Vergessene Zauber erwachen...',
      isFree: true,
      isCompleted: progressData['fan_01']?.progress === 100,
      progress: progressData['fan_01']?.progress || 0,
      category: 'Fantasy',
      gradientColors: ['#134e5e', '#71b280'],
      icon: 'sparkles',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // HORROR
    {
      id: 'hor_01',
      name: 'Die Geistervilla',
      description: 'Ein altes Haus mit dunklen Geheimnissen...',
      isFree: false,
      isCompleted: progressData['hor_01']?.progress === 100,
      progress: progressData['hor_01']?.progress || 0,
      category: 'Horror',
      gradientColors: ['#2c1e31', '#8b0000'],
      icon: 'skull',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // THRILLER
    {
      id: 'thr_01',
      name: 'Die Verfolgung',
      description: 'Spannung bis zum letzten Moment...',
      isFree: false,
      isCompleted: progressData['thr_01']?.progress === 100,
      progress: progressData['thr_01']?.progress || 0,
      category: 'Thriller',
      gradientColors: ['#141e30', '#ff6b6b'],
      icon: 'flash',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // ROMANCE
    {
      id: 'rom_01',
      name: 'Erste Liebe',
      description: 'Wenn Herzen sich finden...',
      isFree: false,
      isCompleted: progressData['rom_01']?.progress === 100,
      progress: progressData['rom_01']?.progress || 0,
      category: 'Romance',
      gradientColors: ['#ff6b9d', '#c44569'],
      icon: 'heart',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // SCI-FI
    {
      id: 'sci_01',
      name: 'Die Station',
      description: 'Allein im Weltraum...',
      isFree: false,
      isCompleted: progressData['sci_01']?.progress === 100,
      progress: progressData['sci_01']?.progress || 0,
      category: 'Sci-Fi',
      gradientColors: ['#0f2027', '#2c5364'],
      icon: 'planet',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // ADVENTURE
    {
      id: 'adv_01',
      name: 'Die Schatzinsel',
      description: 'Auf der Suche nach dem verlorenen Schatz...',
      isFree: false,
      isCompleted: progressData['adv_01']?.progress === 100,
      progress: progressData['adv_01']?.progress || 0,
      category: 'Adventure',
      gradientColors: ['#f46b45', '#eea849'],
      icon: 'compass',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // DARK FANTASY
    {
      id: 'daf_01',
      name: 'Der dunkle KÃ¶nig',
      description: 'In einer Welt voller Schatten...',
      isFree: false,
      isCompleted: progressData['daf_01']?.progress === 100,
      progress: progressData['daf_01']?.progress || 0,
      category: 'Dark Fantasy',
      gradientColors: ['#3a1c71', '#d76d77'],
      icon: 'flame',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // PSYCHO
    {
      id: 'psy_01',
      name: 'Stimmen im Kopf',
      description: 'RealitÃ¤t oder Wahnsinn?',
      isFree: false,
      isCompleted: progressData['psy_01']?.progress === 100,
      progress: progressData['psy_01']?.progress || 0,
      category: 'Psycho',
      gradientColors: ['#000000', '#434343'],
      icon: 'eye',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // COMEDY
    {
      id: 'com_01',
      name: 'Chaos im Alltag',
      description: 'Wenn alles schief geht...',
      isFree: false,
      isCompleted: progressData['com_01']?.progress === 100,
      progress: progressData['com_01']?.progress || 0,
      category: 'Comedy',
      gradientColors: ['#f093fb', '#f5576c'],
      icon: 'happy',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // DRAMA
    {
      id: 'dra_01',
      name: 'Abschied',
      description: 'Emotionale Tiefe und schwere Entscheidungen...',
      isFree: false,
      isCompleted: progressData['dra_01']?.progress === 100,
      progress: progressData['dra_01']?.progress || 0,
      category: 'Drama',
      gradientColors: ['#4b6cb7', '#182848'],
      icon: 'water',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // CRIME
    {
      id: 'cri_01',
      name: 'Der Fall',
      description: 'Ein Verbrechen, das gelÃ¶st werden muss...',
      isFree: false,
      isCompleted: progressData['cri_01']?.progress === 100,
      progress: progressData['cri_01']?.progress || 0,
      category: 'Crime',
      gradientColors: ['#2c3e50', '#fd746c'],
      icon: 'finger-print',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },

    // SUPERNATURAL
    {
      id: 'sup_01',
      name: 'Die Gabe',
      description: 'ÃœbernatÃ¼rliche KrÃ¤fte erwachen...',
      isFree: false,
      isCompleted: progressData['sup_01']?.progress === 100,
      progress: progressData['sup_01']?.progress || 0,
      category: 'Supernatural',
      gradientColors: ['#5f2c82', '#49a09d'],
      icon: 'prism',
      totalSubEpisodes: 30,
      unlockedSubEpisodes: 30,
    },
  ];

  // Filter episodes by selected category
  const filteredEpisodes = episodes.filter((ep) => {
    // Filter by story category first
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
            <Text style={styles.welcomeText}>
              Kategorie: {selectedCategory}
            </Text>
            <Text style={styles.subText}>WÃ¤hle dein Abenteuer</Text>
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
                FÃ¼r Neugierige
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
                name="lock-closed"
                size={14}
                color={filterMode === 'premium' ? '#FFD700' : '#888'}
              />
              <Text
                style={[
                  styles.categoryText,
                  filterMode !== 'premium' && styles.categoryTextInactive,
                ]}
              >
                Nur fÃ¼r Leseratten
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

                  {/* Zeige "Bald verfügbar" Badge rechts, wenn nicht frei */}
                  {!episode.isFree ? (
                    <View
                      style={[
                        styles.comingSoonBadgeTop,
                        {
                          backgroundColor: `rgba(255, 215, 0, 0.25)`,
                        },
                      ]}
                    >
                      <Ionicons name="lock-closed" size={12} color="#FFD700" />
                      <Text style={styles.comingSoonTextTop}>
                        Bald verfügbar
                      </Text>
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
                    <Text style={styles.episodeNumber}>Story {index + 1}</Text>
                    {!episode.isFree && (
                      <Ionicons name="lock-closed" size={16} color="#FFD700" />
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
                      <Ionicons name="layers" size={14} color="#FFFFFF" />
                      <Text style={styles.subEpisodeText}>
                        {episode.totalSubEpisodes} Phasen
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

                {/* Bald verfügbar Badge (bei gesperrten Episodes) */}
                {!episode.isFree && episode.progress === 0 && (
                  <View style={styles.comingSoonBadge}>
                    <Ionicons name="lock-closed" size={16} color="#FFD700" />
                    <Text style={styles.comingSoonText}>Bald verfügbar</Text>
                  </View>
                )}

                {/* Play Button */}
                <View style={styles.playButtonContainer}>
                  <Ionicons
                    name={episode.progress > 0 ? 'play-circle' : 'play-circle'}
                    size={32}
                    color="#5de0e6"
                  />
                  <Text style={styles.playButtonText}>
                    {episode.progress > 0 ? 'Fortsetzen' : 'Starten'}
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
