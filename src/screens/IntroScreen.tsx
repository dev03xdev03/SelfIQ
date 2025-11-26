import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import Typewriter from 'react-native-typewriter';
import { Ionicons } from '@expo/vector-icons';
import { detectGender } from '../utils/genderDetection';
import { signInAsGuest } from '../services/authService';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import {
  acceptTermsAndPrivacy,
  updateBackgroundActivityConsent,
  hasBackgroundActivityConsent,
} from '../services/consentService';

const { width, height } = Dimensions.get('window');

interface IntroScreenProps {
  onStart: (playerName: string) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [detectedGender, setDetectedGender] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [logoAnim] = useState(new Animated.Value(0));
  const [inputAnim] = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(0));
  const videoOpacity = useRef(new Animated.Value(1)).current;
  const borderBeamAnim = useRef(new Animated.Value(0)).current;
  const beamRotation = useRef(new Animated.Value(0)).current;
  const buttonClickAnim = useRef(new Animated.Value(1)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;
  const loadingSpinAnim = useRef(new Animated.Value(0)).current;

  const videoPlayer = useVideoPlayer(
    require('../assets/images/particlesbackground.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

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

  useEffect(() => {
    // Staggered Entrance Animations
    Animated.stagger(300, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Border Beam Animation
    Animated.loop(
      Animated.timing(borderBeamAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // Rotating Beam Animation
    Animated.loop(
      Animated.timing(beamRotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const requestBackgroundPermissions = async (userId: string) => {
    try {
      // Prüfe ob bereits erlaubt
      const alreadyGranted = await hasBackgroundActivityConsent();
      if (alreadyGranted) {
        console.log('Background activity already granted');
        return;
      }

      Alert.alert(
        'Hintergrundaktivität',
        'Dreamz möchte deinen Fortschritt auch im Hintergrund synchronisieren. Erlaube Hintergrundaktivität?',
        [
          {
            text: 'Nicht jetzt',
            style: 'cancel',
            onPress: async () => {
              await updateBackgroundActivityConsent(userId, false);
            },
          },
          {
            text: 'Erlauben',
            onPress: async () => {
              console.log('Background permissions granted');
              await updateBackgroundActivityConsent(userId, true);
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error requesting background permissions:', error);
    }
  };

  const handleStart = async () => {
    if (playerName.trim().length > 0) {
      setIsLoading(true);

      // Starte Lade-Animation
      Animated.loop(
        Animated.timing(loadingSpinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();

      // Detect gender before starting
      const gender = detectGender(playerName.trim());
      console.log(`Detected gender for "${playerName}": ${gender}`);

      // Konvertiere gender zu m/w/n Format
      const genderCode =
        gender === 'male' ? 'm' : gender === 'female' ? 'w' : 'n';

      try {
        console.log('Starting guest login...');
        // Supabase Guest Login
        const { user, error } = await signInAsGuest(
          playerName.trim(),
          genderCode,
        );

        if (error) {
          console.error('Error signing in as guest:', error);
        } else if (user) {
          console.log('Guest login successful:', user.username);

          // AGB und Datenschutz akzeptieren (implizit durch Nutzung)
          await acceptTermsAndPrivacy(user.id);

          // Nach erfolgreichem Login: Background-Berechtigung anfragen
          await requestBackgroundPermissions(user.id);
        } else {
          console.warn('No user returned from signInAsGuest');
        }
      } catch (err) {
        console.error('Exception during guest login:', err);
      }

      // Mystery animation: pulsate and glow
      Animated.parallel([
        Animated.sequence([
          Animated.timing(buttonClickAnim, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(buttonClickAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(buttonClickAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(buttonGlowAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlowAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => {
        onStart(playerName.trim());
      });
    }
  };

  // Update detected gender when name changes
  useEffect(() => {
    if (playerName.trim().length > 0) {
      const gender = detectGender(playerName.trim());
      const genderText =
        gender === 'male' ? '♂️' : gender === 'female' ? '♀️' : '⚪';
      setDetectedGender(genderText);
    } else {
      setDetectedGender('');
    }
  }, [playerName]);

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

      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require('../assets/images/dreamzlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Welcome Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Typewriter typing={1} style={styles.welcomeText}>
            Bereit für Selbsterkenntnis?
          </Typewriter>
          <Typewriter typing={1} style={styles.subText}>
            Deine Persönlichkeit wartet darauf, entdeckt zu werden
          </Typewriter>
        </Animated.View>

        {/* Name Input */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: inputAnim,
              transform: [
                {
                  scale: inputAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.label}>Wie ist dein Name?</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Dein Name für authentische Ergebnisse..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleStart}
            />
            {detectedGender && (
              <Text style={styles.genderIndicator}>{detectedGender}</Text>
            )}
          </View>
        </Animated.View>

        {/* Start Button */}
        <Animated.View
          style={[
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.buttonWrapper}>
            <Animated.View
              style={{
                transform: [{ scale: buttonClickAnim }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.startButton,
                  playerName.trim().length === 0 && styles.startButtonDisabled,
                ]}
                onPress={handleStart}
                disabled={playerName.trim().length === 0 || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#004aad', '#5de0e6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                >
                  <View style={styles.buttonContent}>
                    {isLoading && (
                      <Animated.View
                        style={[
                          styles.loadingSpinner,
                          {
                            transform: [
                              {
                                rotate: loadingSpinAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0deg', '360deg'],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <View style={styles.spinnerCircle} />
                      </Animated.View>
                    )}
                    <Text style={styles.startButtonText}>Tests starten</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Headphones Hint */}
          <Animated.View
            style={[
              styles.headphonesHint,
              {
                opacity: buttonAnim,
              },
            ]}
          >
            <Ionicons
              name="bulb"
              size={16}
              color="#5de0e6"
              style={styles.headphonesIcon}
            />
            <Text style={styles.headphonesText}>
              Tipp: Sei ehrlich für präzise Ergebnisse
            </Text>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Copyright und AGB */}
      <View style={styles.legalContainer}>
        <Text style={styles.copyrightText}>
          © 2025 Dreamz. Alle Rechte vorbehalten.
        </Text>
        <Text style={styles.termsText}>
          Mit der Nutzung stimmst du den AGB und Datenschutzbestimmungen zu.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#e5f5f5',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 74, 173, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    fontFamily: 'momstypewriter',
  },
  subText: {
    fontSize: 16,
    color: '#b5c5c5',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'momstypewriter',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    color: '#c5d5d5',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(10, 15, 18, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(93, 224, 230, 0.5)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 60,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  genderIndicator: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 24,
  },
  buttonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#5de0e6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 20,
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
  },
  spinnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    borderRightColor: '#FFFFFF',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'momstypewriter',
  },
  headphonesHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 40,
  },
  headphonesIcon: {
    marginRight: 10,
  },
  headphonesText: {
    fontSize: 11,
    color: 'rgba(93, 224, 230, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  legalContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  copyrightText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginBottom: 4,
  },
  termsText: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.25)',
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default IntroScreen;
