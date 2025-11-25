import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typewriter from 'react-native-typewriter';
import TypewriterWithSound from '../components/TypewriterWithSound';
import { LinearGradient } from 'expo-linear-gradient';
import { StoryEngine, Scene, StoryData } from '../engine/StoryEngine';
import LottieAnimation from '../components/LottieAnimation';
import ChoiceButton from '../components/ChoiceButton';
import storyDataJson from '../data/storyData.json';
import {
  saveEpisodeProgress,
  loadEpisodeProgress,
  calculateProgress,
} from '../utils/progressStorage';

const { width, height } = Dimensions.get('window');

interface StoryScreenProps {
  playerName: string;
  onBack?: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ playerName, onBack }) => {
  const [storyEngine] = useState(
    () => new StoryEngine(storyDataJson as any as StoryData),
  );
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [buttonFadeAnim] = useState(new Animated.Value(0));
  const [titleAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));
  const [bgScaleAnim] = useState(new Animated.Value(1.2));
  const [bgOpacityAnim] = useState(new Animated.Value(0));
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fogAnim = useRef(new Animated.Value(0)).current;
  const buttonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [completedScenes, setCompletedScenes] = useState<string[]>([]);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseMenuAnim = useRef(new Animated.Value(0)).current;

  // Explosive Bunte Partikel
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      anim: Animated.Value;
      velocityX: number;
      velocityY: number;
      size: number;
      rotation: Animated.Value;
      color: string;
    }>
  >([]);

  const videoPlayer = useVideoPlayer(
    require('../assets/images/darkforest.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

  const videoOpacity = useRef(new Animated.Value(1)).current;

  // Sanfter Loop-Übergang
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoPlayer.currentTime > 0) {
        const duration = videoPlayer.duration;
        const remaining = duration - videoPlayer.currentTime;

        if (remaining < 0.3 && remaining > 0) {
          Animated.timing(videoOpacity, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else if (videoPlayer.currentTime < 0.3) {
          Animated.timing(videoOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [videoPlayer]);

  const handleTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    // Bunte Farbpalette für mystische Partikel
    const colors = [
      '#3a6565', // Cyan/Teal
      '#5a8585', // Helles Petrol
      '#7da5a5', // Mintgrün
      '#4a7575', // Dunkles Cyan
      '#8ab5b5', // Hellblau
      '#2d5555', // Dunkles Teal
      '#65a585', // Grün-Cyan
      '#95c5c5', // Pastellblau
    ];

    // Erstelle 25 explosive Partikel pro Touch
    const newParticles = Array.from({ length: 25 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 150;
      const anim = new Animated.Value(0);
      const rotation = new Animated.Value(0);
      const id = Date.now() + i + Math.random();

      return {
        id,
        x: locationX,
        y: locationY,
        anim,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 30, // Leichte Aufwärtsbewegung
        size: 6 + Math.random() * 12,
        rotation,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Animiere jeden Partikel explosiv
    newParticles.forEach((particle) => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(particle.anim, {
            toValue: 1,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle.anim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(particle.rotation, {
          toValue: 2 + Math.random() * 2,
          duration: 1350,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setParticles((prev) => prev.filter((p) => p.id !== particle.id));
      });
    });
  };

  useEffect(() => {
    // Lade gespeicherten Fortschritt beim Start
    const loadProgress = async () => {
      const episodeId = (storyDataJson as any).episodeId;
      const progress = await loadEpisodeProgress(episodeId);

      if (progress && progress.currentScene) {
        // Fortschritt vorhanden - setze Story an letzte Position
        setCompletedScenes(progress.completedScenes);
        const scene = storyEngine.loadScene(progress.currentScene);
        setCurrentScene(scene);
      } else {
        // Kein Fortschritt - starte am Anfang
        const scene = storyEngine.getCurrentScene();
        setCurrentScene(scene);
      }

      setIsReady(true);
    };
    loadProgress(); // Sanfte Fade-In Animationen beim Öffnen
    Animated.stagger(200, [
      // Title sanft fade in
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Text sanft fade in
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Starte Typewriter nach allen Animationen
      setTimeout(() => {
        setShowTypewriter(true);
      }, 100);
    }); // Continuous pulse animation for mysterious effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Mysterious glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.bezier(0.42, 0, 0.58, 1),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Fog movement
    Animated.loop(
      Animated.timing(fogAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // Globaler Effect für Button-Sichtbarkeit nach Typewriter
  useEffect(() => {
    if (!currentScene || !showTypewriter) return;

    // Clear vorheriger Timer
    if (buttonTimerRef.current) {
      clearTimeout(buttonTimerRef.current);
    }

    // Verstecke Buttons erst mal
    buttonFadeAnim.setValue(0);

    // Berechne Typing-Dauer basierend auf Textlänge
    const textLength = currentScene.text.length;
    const typingSpeed = 1; // Matches typing={1}
    const charsPerMs = 1000 / 50; // ~20 chars per second bei typing={1}
    const typingDuration = (textLength / charsPerMs) * 1000; // In Millisekunden

    // Zeige Buttons nach Typing-Dauer + Buffer
    buttonTimerRef.current = setTimeout(() => {
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, typingDuration + 500);

    // Cleanup
    return () => {
      if (buttonTimerRef.current) {
        clearTimeout(buttonTimerRef.current);
      }
    };
  }, [currentScene, showTypewriter]);

  const handleChoice = useCallback(
    (choiceId: string) => {
      // Reset typewriter and buttons
      setShowTypewriter(false);
      buttonFadeAnim.setValue(0);

      // Dramatic exit animation
      Animated.parallel([
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(titleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Lade nächste Phase
        const nextScene = storyEngine.makeChoice(choiceId);
        setCurrentScene(nextScene);

        // Speichere Fortschritt
        if (nextScene) {
          const newCompletedScenes = [...completedScenes, nextScene.id];
          setCompletedScenes(newCompletedScenes);

          // Speichere in AsyncStorage
          const episodeId = (storyDataJson as any).episodeId;
          const totalScenes = 15; // Episode 1 hat 15 Phasen total
          const progress = calculateProgress(newCompletedScenes, totalScenes);

          saveEpisodeProgress({
            episodeId,
            completedScenes: newCompletedScenes,
            lastPlayedDate: new Date().toISOString(),
            currentScene: nextScene.id,
            progress,
          });
        }

        // Reset animations
        titleAnim.setValue(0);
        textAnim.setValue(0);

        // Sanfte Fade-In Animationen für neue Phase
        Animated.stagger(200, [
          Animated.timing(titleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Starte Typewriter nach Animation der neuen Phase
          setTimeout(() => {
            setShowTypewriter(true);
          }, 100);
        });
      });
    },
    [
      buttonFadeAnim,
      textAnim,
      titleAnim,
      bgOpacityAnim,
      storyEngine,
      completedScenes,
    ],
  );

  const handlePauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    Animated.timing(pauseMenuAnim, {
      toValue: isPaused ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isPaused, pauseMenuAnim]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    Animated.timing(pauseMenuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [pauseMenuAnim]);

  const handleExitStory = useCallback(async () => {
    // Speichere Fortschritt vor dem Verlassen
    if (currentScene) {
      const episodeId = (storyDataJson as any).episodeId;
      const totalScenes = 30;
      const progress = calculateProgress(completedScenes, totalScenes);

      await saveEpisodeProgress({
        episodeId,
        completedScenes,
        lastPlayedDate: new Date().toISOString(),
        currentScene: currentScene.id,
        progress,
      });
    }

    if (onBack) {
      onBack();
    }
  }, [currentScene, completedScenes, onBack]);

  if (!currentScene || !isReady) {
    return null;
  }

  // Background-Mapping - Bilder aus assets/images laden
  const getBackgroundSource = (backgroundName: string) => {
    try {
      const backgrounds: Record<string, any> = {
        darkwood: require('../assets/images/darkwood.png'),
        // Weitere Bilder hier hinzufügen wenn bereitgestellt
      };
      return backgrounds[backgroundName] || null;
    } catch (error) {
      // Fallback: Bild nicht gefunden, zeige Platzhalter
      return null;
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const fogTranslate = fogAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const titleTranslateY = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const textTranslateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{ ...StyleSheet.absoluteFillObject, opacity: videoOpacity }}
      >
        <VideoView
          player={videoPlayer}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      </Animated.View>

      <View style={styles.darkOverlay} />

      {/* Episode Badge */}
      <Animated.View
        style={[
          styles.episodeBadge,
          {
            opacity: buttonFadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(0, 74, 173, 0.9)', 'rgba(93, 224, 230, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badgeGradient}
        >
          <Text style={styles.episodeNumber}>Episode 1</Text>
          <Text style={styles.episodeName}>{currentScene.title}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Explosive Bunte Partikel */}
      {particles.map((particle) => {
        const translateX = particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, particle.velocityX],
        });
        const translateY = particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, particle.velocityY + 100], // Gravity-Effekt
        });
        const rotate = particle.rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '720deg'],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.anim.interpolate({
                  inputRange: [0, 0.15, 0.85, 1],
                  outputRange: [0, 1, 0.8, 0],
                }),
                transform: [
                  { translateX },
                  { translateY },
                  { rotate },
                  {
                    scale: particle.anim.interpolate({
                      inputRange: [0, 0.2, 1],
                      outputRange: [0.2, 1.5, 0.1],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}

      <StatusBar barStyle="light-content" />

      {/* Sound Mute Toggle Button - Top Left */}
      <TouchableOpacity
        style={styles.soundToggleButton}
        onPress={() => setIsSoundMuted(!isSoundMuted)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isSoundMuted ? 'volume-mute' : 'volume-medium'}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Pause Button - Top Right */}
      <TouchableOpacity
        style={styles.pauseButton}
        onPress={handlePauseToggle}
        activeOpacity={0.7}
      >
        <Ionicons name="pause" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Pause Menu Overlay */}
      {isPaused && (
        <Animated.View
          style={[
            styles.pauseOverlay,
            {
              opacity: pauseMenuAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.pauseOverlayTouchable}
            activeOpacity={1}
            onPress={handleResume}
          />
          <Animated.View
            style={[
              styles.pauseMenu,
              {
                transform: [
                  {
                    scale: pauseMenuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: pauseMenuAnim,
              },
            ]}
          >
            <View style={styles.pauseMenuHeader}>
              <Ionicons name="pause-circle" size={48} color="#8e2de2" />
              <Text style={styles.pauseMenuTitle}>Pause</Text>
            </View>

            <TouchableOpacity
              style={styles.pauseMenuButton}
              onPress={handleResume}
            >
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.pauseMenuButtonText}>Weiterspielen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pauseMenuButton, styles.pauseMenuButtonDanger]}
              onPress={handleExitStory}
            >
              <Ionicons name="exit-outline" size={24} color="#ff6b6b" />
              <Text
                style={[
                  styles.pauseMenuButtonText,
                  styles.pauseMenuButtonTextDanger,
                ]}
              >
                Story verlassen
              </Text>
            </TouchableOpacity>

            <Text style={styles.pauseMenuInfo}>
              Dein Fortschritt wird automatisch gespeichert
            </Text>
          </Animated.View>
        </Animated.View>
      )}

      {/* Story Content with staggered animations */}
      <View style={styles.contentContainer} pointerEvents="box-none">
        <View style={styles.scrollContent}>
          {/* Animated Title with slide-in */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleAnim,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Typewriter typing={0} style={styles.title}>
              {currentScene.title}
            </Typewriter>
          </Animated.View>

          {/* Animated Logo with slide-in */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: titleAnim,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Image
              source={require('../assets/images/dreamzlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            {/* Mysterious underline glow */}
            <Animated.View
              style={[
                styles.titleUnderline,
                {
                  opacity: glowOpacity,
                },
              ]}
            />
          </Animated.View>

          {/* Story Text with fade and slide */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textAnim,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            {showTypewriter && (
              <TypewriterWithSound
                text={currentScene.text.replaceAll('{playerName}', playerName)}
                style={styles.storyText}
                speed={20}
                enableSound={!isSoundMuted}
              />
            )}
          </Animated.View>

          {/* Choices with staggered entrance */}
          <Animated.View
            style={[
              styles.choicesContainer,
              {
                opacity: buttonFadeAnim,
              },
            ]}
          >
            {currentScene.choices.map((choice, index) => (
              <Animated.View
                key={choice.id}
                style={{
                  opacity: buttonFadeAnim,
                  transform: [
                    {
                      translateY: buttonFadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 + index * 10, 0],
                      }),
                    },
                  ],
                }}
              >
                <ChoiceButton
                  text={choice.text}
                  onPress={() => handleChoice(choice.id)}
                  animation={choice.animation}
                  disabled={
                    choice.requiresInventory &&
                    storyEngine.getStoryData().inventory.items.length === 0
                  }
                />
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

// Helper function für Background-Gradients (modern)
const getBackgroundColor = (sceneId: string) => {
  const colors: Record<string, any> = {
    intro: { backgroundColor: '#0f0a1f' },
    light_path: { backgroundColor: '#2d1b4e' },
    shadow_path: { backgroundColor: '#16213e' },
    guardian_meeting: { backgroundColor: '#1a1233' },
    wish_ceremony: { backgroundColor: '#2d1654' },
  };
  return colors[sceneId] || { backgroundColor: '#0f0a1f' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundPlaceholder: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(138, 43, 226, 0.08)',
  },
  fogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 200, 255, 0.02)',
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderWidth: 80,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
  characterContainer: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  characterPlaceholder: {
    width: 200,
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  characterName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  logoContainer: {
    marginTop: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 60,
  },
  titleContainer: {
    marginTop: 10,
    marginHorizontal: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#c5d5d5',
    textAlign: 'center',
    textShadowColor: 'rgba(45, 85, 85, 0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    letterSpacing: 3,
    fontFamily: 'momstypewriter',
  },
  titleUnderline: {
    width: 120,
    height: 4,
    backgroundColor: '#3a6565',
    marginTop: 12,
    borderRadius: 6,
    shadowColor: '#3a6565',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  textContainer: {
    backgroundColor: 'rgba(10, 15, 18, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(93, 224, 230, 0.3)',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#5de0e6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  storyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#e5f5f5',
    textAlign: 'left',
    fontWeight: '400',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'momstypewriter',
  },
  choicesContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(10, 15, 18, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(45, 74, 74, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  progressText: {
    color: '#b5c5c5',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    pointerEvents: 'none',
  },
  episodeBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#5de0e6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeGradient: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  episodeNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'momstypewriter',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  episodeName: {
    color: '#5de0e6',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
    fontFamily: 'momstypewriter',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  soundToggleButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  pauseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pauseOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pauseMenu: {
    backgroundColor: 'rgba(15, 20, 25, 0.98)',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: 'rgba(142, 45, 226, 0.4)',
    shadowColor: '#8e2de2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 20,
  },
  pauseMenuHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pauseMenuTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
    fontFamily: 'momstypewriter',
    letterSpacing: 1,
  },
  pauseMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(142, 45, 226, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(142, 45, 226, 0.5)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  pauseMenuButtonDanger: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  pauseMenuButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'momstypewriter',
    letterSpacing: 0.5,
  },
  pauseMenuButtonTextDanger: {
    color: '#ff6b6b',
  },
  pauseMenuInfo: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'momstypewriter',
  },
});

export default StoryScreen;
