import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppHeaderProps {
  onMenuPress?: () => void;
  onBackPress?: () => void;
  showBackButton?: boolean;
  greetingText?: string;
  subtitleText?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuPress,
  onBackPress,
  showBackButton = false,
  greetingText,
  subtitleText,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestCreatedAt, setGuestCreatedAt] = useState<string>('');

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@selfiq_user');
        console.log('[AppHeader] Loading user data:', userDataString);

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log('[AppHeader] Parsed user data:', userData);

          setUserId(userData.id || '');
          setIsGuest(userData.id?.startsWith('guest_') || false);
          setGuestCreatedAt(userData.created_at || '');
        }
      } catch (error) {
        console.error('[AppHeader] Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Update timer
  useEffect(() => {
    console.log('[AppHeader] Guest check:', {
      isGuest,
      userId,
      guestCreatedAt,
    });

    if (!isGuest || !guestCreatedAt || !userId?.startsWith('guest_')) {
      console.log('[AppHeader] Timer not shown - conditions not met');
      return;
    }

    console.log('[AppHeader] Timer activated for guest');

    const updateTimer = () => {
      const now = new Date().getTime();
      const createdAt = new Date(guestCreatedAt).getTime();
      const hoursElapsed = (now - createdAt) / (1000 * 60 * 60);
      const hoursRemaining = Math.max(0, 72 - hoursElapsed);

      console.log('[AppHeader] Timer update:', {
        hoursRemaining,
        hoursElapsed,
      });

      if (hoursRemaining <= 0) {
        setTimeRemaining('Abgelaufen');
        return;
      }

      const hours = Math.floor(hoursRemaining);
      const minutes = Math.floor((hoursRemaining - hours) * 60);
      const timeString = `${hours}h ${minutes}m`;

      console.log('[AppHeader] Setting timer:', timeString);
      setTimeRemaining(timeString);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isGuest, guestCreatedAt, userId]);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {showBackButton && onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.menuButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/selfiqlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {isGuest && timeRemaining && (
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={12} color="#ff914d" />
              <Text style={styles.timerText}>{timeRemaining}</Text>
            </View>
          )}
        </View>
      </View>

      {(greetingText || subtitleText) && (
        <View style={styles.greetingContainer}>
          {greetingText && <Text style={styles.greeting}>{greetingText}</Text>}
          {subtitleText && <Text style={styles.subtitle}>{subtitleText}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 200,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'flex-end',
  },
  logo: {
    height: 32,
    width: 120,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 145, 77, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  timerText: {
    fontSize: 11,
    color: '#ff914d',
    fontWeight: '700',
    fontFamily: 'neosans',
  },
  greetingContainer: {
    paddingLeft: 59,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'neosans',
  },
});

export default AppHeader;
