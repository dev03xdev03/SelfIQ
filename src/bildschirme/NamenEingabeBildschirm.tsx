import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedParticles from '../components/AnimatedParticles';
import AppFooter from '../components/AppFooter';
import { detectGender } from '../hilfsmittel/geschlechtErkennung';
import { signInAsGuest } from '../dienste/authentifizierungDienst';
import { acceptTermsAndPrivacy } from '../dienste/einwilligungDienst';

const { width } = Dimensions.get('window');

interface NamenEingabeBildschirmProps {
  onComplete: (name: string) => void;
}

const NamenEingabeBildschirm: React.FC<NamenEingabeBildschirmProps> = ({
  onComplete,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [detectedGender, setDetectedGender] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const loadingSpinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (playerName.trim().length > 0) {
      const gender = detectGender(playerName.trim());
      const genderText = gender === 'm' ? '♂' : gender === 'w' ? '♀' : '⚥';
      setDetectedGender(genderText);
    } else {
      setDetectedGender('');
    }
  }, [playerName]);

  const handleContinue = async () => {
    if (playerName.trim().length === 0) {
      // Nichts tun wenn kein Name
      return;
    }

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

    // Geschlecht erkennen
    const gender = detectGender(playerName.trim());
    const genderCode = gender; // gender ist bereits 'w' | 'm' | 'd'

    try {
      // Gast-Anmeldung mit Namen
      const { user, error, isExpired, wrongName, correctName } =
        await signInAsGuest(playerName.trim(), genderCode);

      if (wrongName && correctName) {
        console.log('Falscher Name eingegeben');
        loadingSpinAnim.stopAnimation();
        setIsLoading(false);

        Alert.alert(
          'Falscher Name',
          `Dieses Gerät wurde bereits mit dem Namen "${correctName}" registriert. Bitte verwende diesen Namen oder melde dich mit Apple an.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setPlayerName(correctName);
              },
            },
          ],
        );
        return;
      }

      if (isExpired) {
        console.log('Gast-Account abgelaufen - Apple Sign-In erforderlich');
        loadingSpinAnim.stopAnimation();
        setIsLoading(false);

        Alert.alert(
          '72-Stunden-Zeitraum abgelaufen',
          'Deine Gast-Testphase ist abgelaufen. Um die App weiterhin zu nutzen, melde dich bitte mit deiner Apple-ID an. Deine bisherigen Ergebnisse bleiben erhalten.',
          [
            {
              text: 'Zur Anmeldung',
              onPress: () => {
                // Zurück zum Einstiegsbildschirm für Apple Sign-In
                onComplete('');
              },
            },
          ],
          { cancelable: false },
        );
        return;
      }

      if (error) {
        console.error('Fehler bei Gast-Anmeldung:', error);
      } else if (user) {
        console.log('Gast-Anmeldung erfolgreich:', user.username);

        // Speichere User-Daten für Timer Badge
        await AsyncStorage.setItem('@selfiq_user', JSON.stringify(user));

        await acceptTermsAndPrivacy(user.id);
      }

      loadingSpinAnim.stopAnimation();
      onComplete(playerName.trim());
    } catch (err) {
      console.error('Ausnahme während Gast-Anmeldung:', err);
      loadingSpinAnim.stopAnimation();
      onComplete(playerName.trim());
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
          style={StyleSheet.absoluteFillObject}
        />

        <AnimatedParticles />

        <SafeAreaView style={styles.safeArea}>
          {/* Logo Header */}
          <View style={styles.logoHeader}>
            <Image
              source={require('../../assets/selfiqlogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            <Animated.View
              style={[
                styles.innerContent,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Ionicons
                name="person-circle-outline"
                size={80}
                color="#ff914d"
              />

              <Text style={styles.title}>Wie heißt du?</Text>
              <Text style={styles.subtitle}>
                Gib deinen Namen ein, um deine Ergebnisse zu personalisieren
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Dein Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={playerName}
                  onChangeText={setPlayerName}
                  maxLength={20}
                  autoCapitalize="words"
                  returnKeyType="done"
                  keyboardAppearance="dark"
                  onSubmitEditing={handleContinue}
                  blurOnSubmit={true}
                />
                {detectedGender && (
                  <Text style={styles.genderIndicator}>{detectedGender}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  playerName.trim().length === 0 &&
                    styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={isLoading || playerName.trim().length === 0}
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
                    <Text style={styles.buttonText}>Weiter</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>

          {/* Footer */}
          <View style={styles.footerWrapper}>
            <AppFooter />
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a0a',
  },
  safeArea: {
    flex: 1,
  },
  logoHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    zIndex: 200,
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    height: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  innerContent: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'neosans',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 49, 49, 0.4)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'neosans',
  },
  genderIndicator: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 24,
  },
  continueButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'neosans',
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
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default NamenEingabeBildschirm;
