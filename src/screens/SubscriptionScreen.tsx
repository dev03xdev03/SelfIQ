import React, { useState, useRef, useEffect } from 'react';
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
import { startTrial, getSubscriptionInfo } from '../utils/subscriptionStorage';

const { width, height } = Dimensions.get('window');

interface SubscriptionScreenProps {
  onClose: () => void;
  episodeName?: string;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  onClose,
  episodeName,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<
    'monthly' | 'yearly' | 'lifetime'
  >('yearly');
  const [fadeAnim] = useState(new Animated.Value(0));
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number>(3);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);

  const videoPlayer = useVideoPlayer(
    require('../assets/images/particlesbackground.mp4'),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    },
  );

  useEffect(() => {
    // Load subscription info
    const loadSubscriptionInfo = async () => {
      const info = await getSubscriptionInfo();
      setTrialDaysRemaining(info.daysRemaining);
      setIsTrialActive(info.isTrialActive);
    };
    loadSubscriptionInfo();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleStartTrial = async () => {
    await startTrial();
    const info = await getSubscriptionInfo();
    setTrialDaysRemaining(info.daysRemaining);
    setIsTrialActive(info.isTrialActive);
    onClose(); // Close subscription screen after starting trial
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monatlich',
      price: '7,99€',
      period: 'pro Monat',
      savings: null,
      features: [
        'Entscheide selbst bei 100+ Stories',
        'Deine Wahl bestimmt die Story',
        'Neue interaktive Stories jeden Monat',
        'Keine Werbung',
        'Jederzeit kündbar',
      ],
    },
    {
      id: 'yearly',
      name: 'Jährlich',
      price: '119,88€',
      pricePerMonth: '9,99€/Monat',
      period: 'pro Jahr',
      savings: 'Spare 33%',
      features: [
        'Entscheide selbst bei 100+ Stories',
        'Deine Wahl bestimmt die Story',
        'Neue interaktive Stories jeden Monat',
        'Keine Werbung',
        'Exklusive Bonus-Stories mit noch mehr Entscheidungen',
        'Früher Zugang zu neuen Inhalten',
      ],
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '49,99€',
      period: 'einmalig',
      savings: 'Spare 72%',
      features: [
        'Entscheide selbst bei 100+ Stories',
        'Deine Wahl bestimmt die Story',
        'ALLE zukünftigen interaktiven Stories inklusive',
        'Keine Werbung - niemals',
        'Exklusive Bonus-Stories mit noch mehr Entscheidungen',
        'Früher Zugang zu neuen Inhalten',
        'Einmalige Zahlung - für immer',
      ],
    },
  ];

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
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Ionicons name="sparkles" size={48} color="#FFD700" />
            <Text style={styles.title}>Werde zur Leseratte</Text>
            {episodeName && (
              <Text style={styles.subtitle}>
                Schalte "{episodeName}" und 90+ weitere Stories frei
              </Text>
            )}
            {!episodeName && (
              <Text style={styles.subtitle}>
                Entdecke über 100 mystische Stories
              </Text>
            )}
          </Animated.View>

          {/* Plans */}
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id as any)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    selectedPlan === plan.id && {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={
                      selectedPlan === plan.id
                        ? ['#004aad', '#5de0e6']
                        : ['rgba(30, 30, 30, 0.8)', 'rgba(50, 50, 50, 0.8)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.planCard,
                      selectedPlan === plan.id && styles.planCardSelected,
                    ]}
                  >
                    {plan.savings && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>{plan.savings}</Text>
                      </View>
                    )}

                    <View style={styles.planHeader}>
                      <View style={styles.planNameContainer}>
                        {selectedPlan === plan.id && (
                          <Ionicons
                            name="checkmark-circle"
                            size={22}
                            color="#FFD700"
                            style={styles.checkmarkIcon}
                          />
                        )}
                        <Text style={styles.planName}>{plan.name}</Text>
                      </View>
                    </View>

                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{plan.price}</Text>
                      <Text style={styles.period}>{plan.period}</Text>
                      {plan.pricePerMonth && (
                        <Text style={styles.pricePerMonth}>
                          {plan.pricePerMonth}
                        </Text>
                      )}
                    </View>

                    <View style={styles.featuresContainer}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={
                              selectedPlan === plan.id ? '#FFD700' : '#5de0e6'
                            }
                          />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.9}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscribeGradient}
            >
              <Text style={styles.subscribeText}>
                {selectedPlan === 'monthly'
                  ? 'Monatlich abonnieren'
                  : selectedPlan === 'yearly'
                  ? 'Jährlich abonnieren'
                  : 'Lifetime-Zugang freischalten'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            {!isTrialActive && (
              <>
                <TouchableOpacity
                  style={styles.trialButton}
                  activeOpacity={0.9}
                  onPress={handleStartTrial}
                >
                  <LinearGradient
                    colors={['#5de0e6', '#004aad']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.trialGradient}
                  >
                    <Ionicons name="gift" size={20} color="#fff" />
                    <Text style={styles.trialButtonText}>
                      3 Tage kostenlos testen
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                  • 3 Tage kostenlos testen • Jederzeit kündbar •
                </Text>
              </>
            )}
            {isTrialActive && (
              <Text style={styles.footerText}>
                • Testphase aktiv: Noch {trialDaysRemaining}{' '}
                {trialDaysRemaining === 1 ? 'Tag' : 'Tage'} •
              </Text>
            )}
            <Text style={styles.footerSmall}>
              Nach der kostenlosen Testphase wird dein Abo automatisch
              verlängert.
            </Text>
          </View>
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
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#b5c5c5',
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  planCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 3,
    borderColor: 'rgba(93, 224, 230, 0.15)',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: '#FFD700',
    borderWidth: 4,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  savingsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkmarkIcon: {
    marginRight: 4,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceContainer: {
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 14,
    color: '#b5c5c5',
    marginTop: 4,
  },
  pricePerMonth: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginTop: 8,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 20,
  },
  subscribeButton: {
    marginBottom: 24,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  trialButton: {
    marginBottom: 16,
    width: '100%',
  },
  trialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
  },
  trialButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  footerSmall: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SubscriptionScreen;
