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
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: [string, string];
  testCount: number;
  isLocked?: boolean;
}

interface KategorieUebersichtBildschirmProps {
  playerName: string;
  onCategorySelect: (categoryId: string) => void;
  onBack: () => void;
  onShowInfo: () => void;
}

const KategorieUebersichtBildschirm: React.FC<
  KategorieUebersichtBildschirmProps
> = ({ playerName, onCategorySelect, onBack, onShowInfo }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnims] = useState(
    Array.from({ length: 7 }, () => new Animated.Value(0.9)),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      ...scaleAnims.map((anim, index) =>
        Animated.spring(anim, {
          toValue: 1,
          delay: index * 100,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ),
    ]).start();
  }, []);

  const categories: Category[] = [
    {
      id: 'personality',
      name: 'Persönlichkeit',
      description: 'Big Five, Charakter & Selbstbild',
      icon: 'person',
      gradientColors: ['#ff3131', '#ff914d'],
      testCount: 3,
      isLocked: false,
    },
    {
      id: 'emotional',
      name: 'Emotionale Kompetenz',
      description: 'EQ, Empathie & Gefühlswelt',
      icon: 'heart',
      gradientColors: ['#ff6b6b', '#ff3131'],
      testCount: 1,
      isLocked: true,
    },
    {
      id: 'professional',
      name: 'Berufliches',
      description: 'Karriere, Führung & Arbeitsstil',
      icon: 'briefcase',
      gradientColors: ['#ff914d', '#ffb380'],
      testCount: 2,
      isLocked: true,
    },
    {
      id: 'mental',
      name: 'Mentale Stärke',
      description: 'Stress, Mindset & Resilienz',
      icon: 'fitness',
      gradientColors: ['#8b0000', '#ff3131'],
      testCount: 3,
      isLocked: true,
    },
    {
      id: 'social',
      name: 'Soziale Kompetenz',
      description: 'Kommunikation, Teamwork & Networking',
      icon: 'people',
      gradientColors: ['#ff914d', '#ff6b6b'],
      testCount: 2,
      isLocked: true,
    },
    {
      id: 'relationships',
      name: 'Beziehungen',
      description: 'Liebe, Bindung & Partnerschaft',
      icon: 'heart-circle',
      gradientColors: ['#ff3131', '#ff4d4d'],
      testCount: 1,
      isLocked: true,
    },
    {
      id: 'education',
      name: 'Schule & Ausbildung',
      description: 'Lernen, Studium & Entwicklung',
      icon: 'school',
      gradientColors: ['#ff914d', '#ffa64d'],
      testCount: 12,
      isLocked: true,
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);

    // Gesperrte Kategorien können nicht geöffnet werden
    if (category?.isLocked) {
      return;
    }

    const scaleAnim =
      scaleAnims[categories.findIndex((c) => c.id === categoryId)];
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => onCategorySelect(categoryId), 200);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <AnimatedParticles />

        <AppHeader
          onBackPress={onBack}
          showBackButton={true}
          greetingText={`Kategorien`}
          subtitleText="Wähle einen Themenbereich"
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[styles.headerContainer, { opacity: fadeAnim }]}
          >
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="albums" size={24} color="#ff914d" />
                <Text style={styles.statNumber}>{categories.length}</Text>
                <Text style={styles.statLabel}>Kategorien</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="checkmark-done" size={24} color="#4ade80" />
                <Text style={styles.statNumber}>37</Text>
                <Text style={styles.statLabel}>Tests</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                style={[
                  styles.categoryWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnims[index] }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={category.isLocked ? 1 : 0.9}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <LinearGradient
                    colors={[
                      ...category.gradientColors,
                      category.gradientColors[0],
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.categoryCard,
                      category.isLocked && styles.lockedCard,
                    ]}
                  >
                    {/* Locked Overlay */}
                    {category.isLocked && <View style={styles.lockedOverlay} />}

                    {/* Icon Badge */}
                    <View style={styles.iconBadge}>
                      <Ionicons
                        name={category.isLocked ? 'lock-closed' : category.icon}
                        size={32}
                        color={category.isLocked ? '#aaa' : '#fff'}
                      />
                    </View>

                    {/* Bald verfügbar Badge */}
                    {category.isLocked && (
                      <View style={styles.comingSoonBadge}>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color="#ffa64d"
                        />
                        <Text style={styles.comingSoonText}>
                          Bald verfügbar
                        </Text>
                      </View>
                    )}

                    {/* Category Info */}
                    <View style={styles.categoryInfo}>
                      <Text
                        style={[
                          styles.categoryName,
                          category.isLocked && styles.lockedText,
                        ]}
                      >
                        {category.name}
                      </Text>
                      <Text
                        style={[
                          styles.categoryDescription,
                          category.isLocked && styles.lockedText,
                        ]}
                      >
                        {category.description}
                      </Text>
                    </View>

                    {/* Test Count Badge */}
                    {!category.isLocked && (
                      <View style={styles.testCountBadge}>
                        <Ionicons name="list" size={14} color="#fff" />
                        <Text style={styles.testCountText}>
                          {category.testCount} Tests
                        </Text>
                      </View>
                    )}

                    {/* Arrow */}
                    {!category.isLocked && (
                      <View style={styles.arrowContainer}>
                        <Ionicons
                          name="chevron-forward"
                          size={24}
                          color="rgba(255, 255, 255, 0.8)"
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
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
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginTop: 8,
    fontFamily: 'neosans',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    fontFamily: 'neosans',
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryWrapper: {
    width: '100%',
  },
  categoryCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  categoryInfo: {
    marginTop: 16,
    paddingRight: 40,
  },
  categoryName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'neosans',
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  testCountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  testCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'neosans',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedCard: {
    opacity: 0.5,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffa64d',
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffa64d',
    fontFamily: 'neosans',
  },
});

export default KategorieUebersichtBildschirm;
