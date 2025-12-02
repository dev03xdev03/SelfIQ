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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { width, height } = Dimensions.get('window');

interface MainMenuScreenProps {
  playerName: string;
  onNavigate: (screen: 'categoryoverview' | 'info' | 'results') => void;
}

interface MenuCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: [string, string];
  screen: 'categoryoverview' | 'info' | 'results';
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  playerName,
  onNavigate,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnims] = useState(
    Array.from({ length: 4 }, () => new Animated.Value(1)),
  );
  const [userId, setUserId] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestCreatedAt, setGuestCreatedAt] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@selfiq_user');
        console.log('[HauptmenueBildschirm] Raw user data:', userDataString);

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log('[HauptmenueBildschirm] Parsed user data:', userData);

          setUserId(userData.id || '');
          setIsGuest(userData.id?.startsWith('guest_') || false);
          setGuestCreatedAt(userData.created_at || '');

          console.log('[HauptmenueBildschirm] State set:', {
            userId: userData.id,
            isGuest: userData.id?.startsWith('guest_'),
            guestCreatedAt: userData.created_at,
          });
        } else {
          console.log('[HauptmenueBildschirm] No user data in AsyncStorage');
        }
      } catch (error) {
        console.error(
          '[HauptmenueBildschirm] Fehler beim Laden der User-Daten:',
          error,
        );
      }
    };

    loadUserData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const menuCards: MenuCard[] = [
    {
      id: 'tests',
      title: 'Persönlichkeits-tests',
      subtitle: 'Starte einen der 37 Tests',
      icon: 'clipboard',
      gradientColors: ['rgba(255, 49, 49, 0.25)', 'rgba(255, 145, 77, 0.15)'],
      screen: 'categoryoverview',
    },
    {
      id: 'info',
      title: 'Über SelfIQ',
      subtitle: 'App-Infos & Kontakt',
      icon: 'information-circle',
      gradientColors: ['rgba(255, 145, 77, 0.25)', 'rgba(255, 49, 49, 0.15)'],
      screen: 'info',
    },
    {
      id: 'results',
      title: 'Meine Ergebnisse',
      subtitle: 'Test-Resultate ansehen',
      icon: 'trophy',
      gradientColors: ['rgba(255, 145, 77, 0.2)', 'rgba(255, 49, 49, 0.1)'],
      screen: 'results',
    },
  ];

  const handleCardPress = (card: MenuCard, index: number) => {
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
    ]).start(() => {
      onNavigate(card.screen);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AnimatedParticles />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          greetingText={`Willkommen zurück, ${playerName}!`}
          subtitleText="Erkunde deine Persönlichkeit mit KI-gestützten Tests"
        />

        {/* Menu Cards Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.cardsGrid, { opacity: fadeAnim }]}>
            {menuCards.map((card, index) => (
              <Animated.View
                key={card.id}
                style={[
                  styles.cardWrapper,
                  { transform: [{ scale: scaleAnims[index] }] },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleCardPress(card, index)}
                >
                  <LinearGradient
                    colors={card.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <View style={styles.card}>
                      <View>
                        <View style={styles.cardIconContainer}>
                          <Ionicons
                            name={card.icon}
                            size={32}
                            color="#ff914d"
                          />
                        </View>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                      </View>
                      <View style={styles.cardArrow}>
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color="rgba(255,145,77,0.8)"
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardWrapper: {
    width: (width - 56) / 2,
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 20,
    height: 180,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    height: 180,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'space-between',
  },
  cardIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 145, 77, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 20,
    height: 40,
  },
  cardSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 15,
  },
  cardArrow: {
    alignSelf: 'flex-end',
  },
});

export default MainMenuScreen;
