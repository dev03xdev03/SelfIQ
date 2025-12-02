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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import {
  getSubscriptionInfo,
  SubscriptionPlan,
} from '../hilfsmittel/abonnementSpeicher';

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
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('free');

  useEffect(() => {
    // Load subscription info
    const loadSubscriptionInfo = async () => {
      const info = await getSubscriptionInfo();
      setCurrentPlan(info.planType);
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

  const handleSubscribe = () => {
    // TODO: Echte Zahlungsabwicklung implementieren
    Alert.alert(
      'Abonnement aktivieren',
      'Payment-Integration folgt in Kürze!',
      [{ text: 'OK' }],
    );
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Premium',
      price: '5,99€',
      period: 'pro Monat',
      savings: null,
      features: [
        'Alle 25 Tests freischalten',
        'Detaillierte KI-Analysen',
        'Berufliche Empfehlungen',
        'Exportierbare PDF-Reports',
        'Jederzeit kündbar',
      ],
    },
    {
      id: 'yearly',
      name: 'Bildung Einzeln',
      price: '2,99€',
      period: 'pro Monat',
      savings: 'Für Lehrer & Berater',
      features: [
        'Alle Premium-Features',
        'Für Lehrer, Berater, Coaches',
        'Nutzung in Beratungsgesprächen',
        'Detaillierte Analysen',
        'PDF-Export für Gespräche',
      ],
    },
    {
      id: 'lifetime',
      name: 'Bildung Team',
      price: '9,99€',
      period: 'pro Monat',
      savings: 'Bis zu 5 Personen',
      features: [
        'Alle Premium-Features',
        'Bis zu 5 Personen',
        'Für Schulen, Unis, Behörden',
        'Zentrale Verwaltung',
        'Team-Reports & Vergleiche',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <AnimatedParticles />

      <View style={styles.darkOverlay} />

      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.content}>
        <AppHeader
          onBackPress={onClose}
          showBackButton={true}
          greetingText="Premium freischalten"
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Plan Badge */}
          <Animated.View
            style={[styles.currentPlanBadge, { opacity: fadeAnim }]}
          >
            <LinearGradient
              colors={
                currentPlan === 'free'
                  ? ['rgba(100, 100, 100, 0.3)', 'rgba(80, 80, 80, 0.3)']
                  : ['rgba(74, 222, 128, 0.3)', 'rgba(34, 197, 94, 0.3)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.currentPlanGradient}
            >
              <Ionicons
                name={
                  currentPlan === 'free' ? 'gift-outline' : 'checkmark-circle'
                }
                size={20}
                color="#fff"
              />
              <Text style={styles.currentPlanText}>
                Aktuell:{' '}
                {currentPlan === 'free'
                  ? 'Kostenlos (4 Tests)'
                  : 'Premium Aktiv'}
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Ionicons name="diamond" size={48} color="#ff914d" />
            <Text style={styles.title}>Schalte alle Tests frei</Text>
            <Text style={styles.subtitle}>
              Zugang zu allen 25 Persönlichkeitstests mit detaillierten
              KI-Analysen
            </Text>
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
                        ? ['#ff3131', '#ff914d']
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
                            color="#ff914d"
                            style={styles.checkmarkIcon}
                          />
                        )}
                        <Text style={styles.planName}>{plan.name}</Text>
                      </View>
                    </View>

                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{plan.price}</Text>
                      <Text style={styles.period}>{plan.period}</Text>
                    </View>

                    <View style={styles.featuresContainer}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={
                              selectedPlan === plan.id ? '#ff914d' : '#ff3131'
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
          <TouchableOpacity
            style={styles.subscribeButton}
            activeOpacity={0.9}
            onPress={handleSubscribe}
          >
            <LinearGradient
              colors={['#ff3131', '#ff914d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscribeGradient}
            >
              <Text style={styles.subscribeText}>
                {selectedPlan === 'monthly'
                  ? 'Premium freischalten'
                  : selectedPlan === 'yearly'
                  ? 'Bildungs-Lizenz aktivieren'
                  : 'Team-Lizenz aktivieren'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerSmall}>
              Sicherer Checkout. Jederzeit kündbar.
            </Text>
          </View>
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
  currentPlanBadge: {
    marginBottom: 20,
    marginTop: 10,
  },
  currentPlanGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  currentPlanText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
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
    fontFamily: 'neosans',
  },
  subtitle: {
    fontSize: 16,
    color: '#b5c5c5',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'neosans',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  planCard: {
    borderRadius: 20,
    padding: 24,
    paddingTop: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 49, 49, 0.15)',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: '#ff914d',
    borderWidth: 4,
    shadowColor: '#ff914d',
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
    top: 8,
    right: 8,
    backgroundColor: '#ff3131',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
    shadowColor: '#ff3131',
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
    color: '#ff914d',
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
  footer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  footerSmall: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SubscriptionScreen;
