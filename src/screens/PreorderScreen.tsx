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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface PreorderScreenProps {
  onClose: () => void;
  storyName: string;
  storyId: string;
  gradientColors?: [string, string];
}

const PreorderScreen: React.FC<PreorderScreenProps> = ({
  onClose,
  storyName,
  storyId,
  gradientColors = ['#5de0e6', '#2dd4bf'],
}) => {
  const [selectedOption, setSelectedOption] = useState<
    'preorder' | 'subscription'
  >('preorder');
  const [fadeAnim] = useState(new Animated.Value(0));
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Pulse animation for CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handlePurchase = () => {
    // TODO: Implement purchase logic
    console.log(`Purchasing ${selectedOption} for ${storyId}`);
    onClose();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          '#0a0f12',
          gradientColors[0] + '33',
          gradientColors[1] + '33',
          '#0a0f12',
        ]}
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Story freischalten</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Story Info */}
            <View
              style={[
                styles.storyInfoCard,
                { borderColor: gradientColors[0] + '4D' },
              ]}
            >
              <Ionicons name="book" size={40} color={gradientColors[0]} />
              <Text style={styles.storyTitle}>{storyName}</Text>
              <Text style={styles.storySubtitle}>
                Diese Geschichte ist noch nicht veröffentlicht
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Preorder Option */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedOption === 'preorder' && {
                    borderColor: gradientColors[0],
                    backgroundColor: gradientColors[0] + '33',
                    elevation: 8,
                    shadowColor: gradientColors[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    transform: [{ scale: 1.02 }],
                  },
                  selectedOption !== 'preorder' && {
                    opacity: 0.3,
                  },
                ]}
                onPress={() => setSelectedOption('preorder')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons
                    name={
                      selectedOption === 'preorder'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                    color={
                      selectedOption === 'preorder'
                        ? gradientColors[0]
                        : 'rgba(255, 255, 255, 0.4)'
                    }
                  />
                  <Text style={styles.optionTitle}>Einzelkauf</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.priceText}>0,99€</Text>
                  <Text style={styles.priceSubtext}>Einmalig</Text>
                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                      />
                      <Text style={styles.featureText}>
                        Storys 2 Tage vor Release verfügbar
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                      />
                      <Text style={styles.featureText}>
                        Lebenslanger Zugriff auf die Story
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Subscription Option */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedOption === 'subscription' && {
                    borderColor: gradientColors[0],
                    backgroundColor: gradientColors[0] + '33',
                    elevation: 8,
                    shadowColor: gradientColors[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    transform: [{ scale: 1.02 }],
                  },
                  selectedOption !== 'subscription' && {
                    opacity: 0.3,
                  },
                  styles.recommendedCard,
                ]}
                onPress={() => setSelectedOption('subscription')}
              >
                <View
                  style={[
                    styles.recommendedBadge,
                    { backgroundColor: '#ff4444' },
                  ]}
                >
                  <Text style={styles.recommendedText}>EMPFOHLEN</Text>
                </View>
                <View style={styles.optionHeader}>
                  <Ionicons
                    name={
                      selectedOption === 'subscription'
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={24}
                    color={
                      selectedOption === 'subscription'
                        ? gradientColors[0]
                        : 'rgba(255, 255, 255, 0.4)'
                    }
                  />
                  <Text style={styles.optionTitle}>Leseratten-Abo</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.priceText}>7,99€</Text>
                  <Text style={styles.priceSubtext}>pro Monat</Text>
                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                      />
                      <Text style={styles.featureText}>
                        Alle Geschichten freigeschaltet
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                      />
                      <Text style={styles.featureText}>
                        Früher Zugang zu neuen Stories
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                      />
                      <Text style={styles.featureText}>
                        Exklusive Bonus-Inhalte
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4ade80"
                      />
                      <Text style={styles.featureText}>Jederzeit kündbar</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* CTA Button */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={handlePurchase}
              >
                <LinearGradient
                  colors={[gradientColors[0], gradientColors[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.purchaseButtonGradient}
                >
                  <Text style={styles.purchaseButtonText}>
                    {selectedOption === 'preorder'
                      ? 'Jetzt vorbestellen - 0,99€'
                      : 'Abo starten - 7,99€/Monat'}
                  </Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Info Text */}
            <Text style={styles.infoText}>
              {selectedOption === 'preorder'
                ? 'Du wirst benachrichtigt, sobald die Geschichte verfügbar ist.'
                : 'Teste das Abo 3 Tage kostenlos. Danach 7,99€ pro Monat.'}
            </Text>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginRight: 48,
  },
  scrollContent: {
    padding: 16,
  },
  storyInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(93, 224, 230, 0.3)',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  storySubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  optionCardSelected: {
    borderColor: '#5de0e6',
    backgroundColor: 'rgba(93, 224, 230, 0.1)',
  },
  recommendedCard: {
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendedBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionContent: {
    marginLeft: 28,
  },
  priceText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  purchaseButton: {
    marginBottom: 10,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 14,
    borderRadius: 16,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PreorderScreen;
