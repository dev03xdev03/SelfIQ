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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { detectGender } from '../hilfsmittel/geschlechtErkennung';
import { signInAsGuest } from '../dienste/authentifizierungDienst';
import {
  signInWithApple,
  isAppleAuthAvailable,
  updateUserName,
} from '../dienste/appleAuthDienst';
import {
  acceptTermsAndPrivacy,
  updateBackgroundActivityConsent,
  hasBackgroundActivityConsent,
} from '../dienste/einwilligungDienst';
import AppFooter from '../components/AppFooter';
import AGBBildschirm from './AGBBildschirm';
import DatenschutzBildschirm from './DatenschutzBildschirm';

const { width, height } = Dimensions.get('window');

interface IntroScreenProps {
  onStart: (playerName: string) => void;
  onShowInfo?: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, onShowInfo }) => {
  const [authState, setAuthState] = useState<
    'login' | 'personalize' | 'complete'
  >('login');
  const [isGuest, setIsGuest] = useState(false);
  const [appleUser, setAppleUser] = useState<any>(null);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [detectedGender, setDetectedGender] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAGB, setShowAGB] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [logoAnim] = useState(new Animated.Value(0));
  const [inputAnim] = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(0));
  const borderBeamAnim = useRef(new Animated.Value(0)).current;
  const beamRotation = useRef(new Animated.Value(0)).current;
  const buttonClickAnim = useRef(new Animated.Value(1)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;
  const loadingSpinAnim = useRef(new Animated.Value(0)).current;

  // Particle animations
  const particles = useRef(
    Array.from({ length: 50 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.6 + 0.3),
      scale: new Animated.Value(Math.random() * 1 + 0.8),
    })),
  ).current;

  useEffect(() => {
    // Prüfe Apple Authentication Verfügbarkeit
    const checkAppleAuth = async () => {
      const available = await isAppleAuthAvailable();
      setIsAppleAvailable(available);
    };
    checkAppleAuth();

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

  // Glow Animation for Button when enabled
  useEffect(() => {
    if (playerName.trim().length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGlowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      buttonGlowAnim.setValue(0);
    }
  }, [playerName]);

  // Particle animations
  useEffect(() => {
    particles.forEach((particle, index) => {
      const animateParticle = () => {
        const duration = 8000 + Math.random() * 6000;
        const toX = Math.random() * width;
        const toY = Math.random() * height;

        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: toX,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: toY,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: 0.7,
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0.2,
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
          ),
        ]).start(({ finished }) => {
          if (finished) {
            animateParticle();
          }
        });
      };

      setTimeout(() => animateParticle(), index * 300);
    });
  }, []);

  const requestBackgroundPermissions = async (userId: string) => {
    try {
      // Prüfe ob bereits erlaubt
      const alreadyGranted = await hasBackgroundActivityConsent();
      if (alreadyGranted) {
        console.log('Hintergrundaktivität bereits gewährt');
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
              console.log('Hintergrund-Berechtigungen gewährt');
              await updateBackgroundActivityConsent(userId, true);
            },
          },
        ],
      );
    } catch (error) {
      console.error('Fehler bei Hintergrund-Berechtigungen:', error);
    }
  };

  const handleAppleSignIn = async () => {
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

    try {
      const { user, error, isNewUser } = await signInWithApple();

      if (error) {
        console.error('Apple Sign In Error:', error);
        Alert.alert(
          'Apple Sign In Fehler',
          `${error}\n\nHinweis: Apple Sign In funktioniert nur in Production Builds (TestFlight/App Store), nicht im Development Modus.`,
        );
        setIsLoading(false);
        return;
      }

      if (user) {
        console.log('Apple Anmeldung erfolgreich:', user.username);
        setAppleUser(user);

        // AGB und Datenschutz akzeptieren
        await acceptTermsAndPrivacy(user.id);

        // Background-Berechtigung anfragen
        await requestBackgroundPermissions(user.id);

        // Wenn neuer User und kein Name vorhanden, zeige Personalisierung
        if (
          isNewUser &&
          (!user.display_name || user.display_name.trim() === '')
        ) {
          setAuthState('personalize');
          setIsLoading(false);
        } else {
          // Direkt zum Hauptmenü
          setAuthState('complete');
          loadingSpinAnim.stopAnimation();
          onStart(user.display_name || user.username);
        }
      }
    } catch (err) {
      console.error('Ausnahme während Apple Anmeldung:', err);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      setIsLoading(false);
    }
  };

  const handlePersonalizationComplete = async () => {
    if (!appleUser) return;

    if (playerName.trim().length > 0) {
      setIsLoading(true);

      // Detect gender
      const gender = detectGender(playerName.trim());
      const genderCode =
        gender === 'male' ? 'm' : gender === 'female' ? 'w' : 'n';

      // Update User Name
      await updateUserName(appleUser.id, playerName.trim(), genderCode);

      // Weiter zum Hauptmenü
      setAuthState('complete');
      loadingSpinAnim.stopAnimation();
      onStart(playerName.trim());
    } else {
      // Ohne Namen weiter
      setAuthState('complete');
      loadingSpinAnim.stopAnimation();
      onStart(appleUser.display_name || appleUser.username);
    }
  };

  const handleGuestStart = async () => {
    console.log('[EinstiegsBildschirm] handleGuestStart called');
    setIsLoading(true);

    try {
      // Einfache Animation - nur native driver
      Animated.parallel([
        Animated.timing(buttonClickAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(buttonClickAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          setIsLoading(false);
          setIsGuest(true);
          console.log('[EinstiegsBildschirm] Calling onStart with empty name');
          // Gast ohne Namen - Name wird später erfragt
          onStart('');
        });
      });
    } catch (error) {
      console.error('[EinstiegsBildschirm] Error in handleGuestStart:', error);
      setIsLoading(false);
    }
  };

  // Update detected gender when name changes
  useEffect(() => {
    if (playerName.trim().length > 0) {
      const gender = detectGender(playerName.trim());
      const genderText =
        gender === 'male' ? 'M' : gender === 'female' ? 'W' : '?';
      setDetectedGender(genderText);
    } else {
      setDetectedGender('');
    }
  }, [playerName]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Animated Particles */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {particles.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.darkOverlay} />

      <StatusBar barStyle="light-content" />

      {/* Info Button */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={onShowInfo ? onShowInfo : () => setShowInfo(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="information-circle" size={28} color="#ff914d" />
      </TouchableOpacity>

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
            source={require('../../assets/selfiqlogo.png')}
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
          <Text style={styles.tagline}>Deine Reise zu Dir</Text>
          <Text style={styles.welcomeText}>
            Wissenschaftlich validierte Tests
          </Text>

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={styles.professionalBadge}>
              <Ionicons name="hardware-chip" size={18} color="#ff914d" />
              <Text style={styles.badgeText}>KI-basiert</Text>
            </View>

            <View style={styles.satisfactionBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
              <Text style={styles.satisfactionText}>98% Präzision</Text>
            </View>
          </View>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="analytics" size={24} color="#ff3131" />
              </View>
              <Text style={styles.featureTitle}>Präzise</Text>
              <Text style={styles.featureDescription}>Echte Insights</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#ff914d" />
              </View>
              <Text style={styles.featureTitle}>Anonym</Text>
              <Text style={styles.featureDescription}>Privatsphäre</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="checkmark-done" size={24} color="#ff3131" />
              </View>
              <Text style={styles.featureTitle}>Validiert</Text>
              <Text style={styles.featureDescription}>Von Experten</Text>
            </View>
          </View>
        </Animated.View>

        {/* Name Input - nur bei Personalisierung */}
        {authState === 'personalize' && (
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
            <Text style={styles.label}>
              Wie sollen wir Dich nennen? (optional)
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Bitte deinen Namen eingeben"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={playerName}
                onChangeText={setPlayerName}
                maxLength={20}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handlePersonalizationComplete}
              />
            </View>
          </Animated.View>
        )}

        {/* Apple Sign In Button - nur bei login State */}
        {authState === 'login' && isAppleAvailable && (
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
            <View style={styles.appleButtonWrapper}>
              {/* Realistischer Glow-Effekt */}
              <View style={styles.appleButtonGlow} />

              <TouchableOpacity
                style={styles.customAppleButton}
                onPress={handleAppleSignIn}
                activeOpacity={0.8}
              >
                <View style={styles.appleButtonContent}>
                  <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
                  <Text style={styles.appleButtonText}>
                    Mit Apple fortfahren
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.orText}>oder</Text>
          </Animated.View>
        )}

        {/* Start Button - zeige basierend auf authState */}
        {(authState === 'login' || authState === 'personalize') && (
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
                  shadowColor: '#ff3131',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: buttonGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.9],
                  }),
                  shadowRadius: buttonGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 35],
                  }),
                  elevation: buttonGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 30],
                  }),
                }}
              >
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={
                    authState === 'personalize'
                      ? handlePersonalizationComplete
                      : handleGuestStart
                  }
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#ff3131', '#ff914d']}
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
                      <Text style={styles.startButtonText}>
                        {authState === 'personalize'
                          ? playerName.trim().length > 0
                            ? 'Weiter'
                            : 'Überspringen'
                          : 'Als Gast fortfahren'}
                      </Text>
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
                color="#ff914d"
                style={styles.headphonesIcon}
              />
              <Text style={styles.headphonesText}>
                Tipp: Sei ehrlich für präzise Ergebnisse
              </Text>
            </Animated.View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footerWrapper}>
        <AppFooter />
      </View>

      {/* AGB Modal */}
      <Modal
        visible={showAGB}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AGBBildschirm onClose={() => setShowAGB(false)} />
      </Modal>

      {/* Datenschutz Modal */}
      <Modal
        visible={showDatenschutz}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <DatenschutzBildschirm onClose={() => setShowDatenschutz(false)} />
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={showInfo}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <TouchableOpacity
              style={styles.infoCloseButton}
              onPress={() => setShowInfo(false)}
            >
              <Ionicons name="close-circle" size={32} color="#ff914d" />
            </TouchableOpacity>

            <Ionicons
              name="bulb"
              size={48}
              color="#ff914d"
              style={styles.infoIcon}
            />

            <Text style={styles.infoTitle}>KI-gestützte Analyse</Text>

            <Text style={styles.infoText}>
              Deine Testergebnisse werden auf Grundlage deiner Angaben durch
              mehrere hochentwickelte KI-Modelle analysiert und ausgewertet.
            </Text>

            <Text style={styles.infoText}>
              Diese automatisierte Auswertung basiert auf etablierten
              psychologischen Testverfahren und liefert dir detaillierte
              Persönlichkeitsprofile.
            </Text>

            <Text style={styles.infoDisclaimer}>
              Hinweis: Dies ist keine medizinische oder therapeutische Diagnose.
            </Text>

            <TouchableOpacity
              style={styles.infoOkButton}
              onPress={() => setShowInfo(false)}
            >
              <LinearGradient
                colors={['#ff3131', '#ff914d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoOkGradient}
              >
                <Text style={styles.infoOkText}>Verstanden</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 15,
  },
  logo: {
    width: 280,
    height: 100,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff914d',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontFamily: 'neosans',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
    paddingHorizontal: 20,
    fontFamily: 'neosans',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  professionalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 145, 77, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    color: '#ff914d',
    fontWeight: '700',
    fontFamily: 'neosans',
  },
  satisfactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    gap: 6,
  },
  satisfactionText: {
    fontSize: 12,
    color: '#4ade80',
    fontWeight: '600',
    fontFamily: 'neosans',
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 49, 49, 0.2)',
    minHeight: 105,
  },
  featureIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 49, 49, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'neosans',
  },
  featureDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 15,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    color: '#a0b0c0',
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#c5d5d5',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'neosans',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 49, 49, 0.4)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'left',
    fontWeight: '500',
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
    shadowColor: '#ff3131',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 24,
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 70,
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
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    fontFamily: 'neosans',
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
    color: 'rgba(255, 145, 77, 0.8)',
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
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff914d',
    shadowColor: '#ff914d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  infoButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 145, 77, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.4)',
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModalContent: {
    backgroundColor: '#1a0a0a',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: 'rgba(255, 49, 49, 0.3)',
  },
  appleButton: {
    width: width * 0.85,
    height: 60,
    marginBottom: 10,
  },
  appleButtonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  appleButtonGlow: {
    position: 'absolute',
    width: width * 0.85,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#ff3131',
    opacity: 0.6,
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 25,
  },
  customAppleButton: {
    width: width * 0.85,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  appleButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'neosans',
    letterSpacing: 0.5,
  },
  orText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 15,
    fontWeight: '600',
  },
  infoCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  infoIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff914d',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'neosans',
  },
  infoText: {
    fontSize: 15,
    color: '#e0e0e0',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoDisclaimer: {
    fontSize: 12,
    color: 'rgba(255, 145, 77, 0.8)',
    lineHeight: 18,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoOkButton: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoOkGradient: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  infoOkText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'neosans',
  },
});

export default IntroScreen;
