import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import {
  generateSummary,
  type TestSummary,
  type ProfileResult,
} from '../utils/ergebnisBerechnung';
import categoryNamesData from '../daten/categoryNames.json';
import { isGuestMode } from '../hilfsmittel/abonnementSpeicher';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  testResults: {
    testId: string;
    testName: string;
    scores: { [key: string]: number };
    percentage: number;
  };
  playerName: string;
  onRetake: () => void;
  onBackToMenu: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  testResults,
  playerName,
  onRetake,
  onBackToMenu,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [isSharing, setIsSharing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const checkGuestStatus = async () => {
      const guestStatus = await isGuestMode();
      setIsGuest(guestStatus);
      if (guestStatus) {
        // Zeige Paywall für Gäste
        setShowPaywall(true);
      } else {
        // Normale Animation für Premium-User
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };
    checkGuestStatus();
  }, []);

  // Prüfe ob testResults vorhanden ist
  if (!testResults || !testResults.scores) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.safeArea}>
          <AppHeader
            onBackPress={onBackToMenu}
            showBackButton={true}
            greetingText="Ergebnisse"
            subtitleText={`Gut gemacht, ${playerName}!`}
          />
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>
              Keine Testergebnisse verfügbar
            </Text>
            <TouchableOpacity
              onPress={onBackToMenu}
              style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: '#ff3131',
                borderRadius: 10,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>
                Zurück zum Menü
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Berechne detaillierte Profile für alle Dimensionen
  const summary: TestSummary = generateSummary(testResults.scores);
  const primaryProfile = summary.primaryPersonality;
  const secondaryProfile = summary.secondaryPersonality;

  // Dynamische Kategorie-Namen
  const categoryNames = categoryNamesData.categoryNames as {
    [key: string]: string;
  };

  // Legacy-Funktion für Kompatibilität (kann später entfernt werden)
  const determinePersonalityType = () => {
    const { scores } = testResults;
    const maxScore = Math.max(...Object.values(scores));
    const dominantTrait = Object.keys(scores).find(
      (key) => scores[key] === maxScore,
    );

    const personalityTypes: {
      [key: string]: {
        name: string;
        description: string;
        strengths: string[];
        professional: string;
        keywords: string[];
      };
    } = {
      extraversion: {
        name: 'Der Gesellige Netzwerker',
        description:
          'Du bist extrovertiert und gewinnst Energie aus sozialen Interaktionen. Menschen fühlen sich in deiner Gegenwart wohl und du kannst andere leicht motivieren.',
        strengths: [
          'Ausgezeichnete Kommunikationsfähigkeiten',
          'Teamplayer und Motivator',
          'Schnelle Netzwerkbildung',
          'Präsentationsstärke',
        ],
        professional:
          'Ideal für Vertrieb, Kundenbetreuung, Teamleitung, Marketing, PR und alle Bereiche mit hohem Kundenkontakt.',
        keywords: [
          'Kommunikationsstark',
          'Teamfähig',
          'Motivierend',
          'Präsentationssicher',
        ],
      },
      agreeableness: {
        name: 'Der Empathische Vermittler',
        description:
          'Du bist empathisch, hilfsbereit und konfliktlösend. Harmonie und konstruktive Zusammenarbeit sind deine Stärken.',
        strengths: [
          'Hohe emotionale Intelligenz',
          'Konfliktlösungskompetenz',
          'Teamharmonie fördern',
          'Verlässlicher Partner',
        ],
        professional:
          'Perfekt für HR, Mediation, Sozialarbeit, Pflege, Kundenservice und alle vermittelnden Tätigkeiten.',
        keywords: [
          'Empathisch',
          'Konfliktlösend',
          'Teamorientiert',
          'Zuverlässig',
        ],
      },
      conscientiousness: {
        name: 'Der Strukturierte Analytiker',
        description:
          'Du bist organisiert, zuverlässig und detailorientiert. Qualität und Genauigkeit haben für dich höchste Priorität.',
        strengths: [
          'Exzellente Planungsfähigkeit',
          'Hohe Zuverlässigkeit',
          'Qualitätsbewusstsein',
          'Strukturiertes Arbeiten',
        ],
        professional:
          'Hervorragend für Projektmanagement, Qualitätssicherung, Finanzen, Verwaltung und alle prozessorientierten Bereiche.',
        keywords: [
          'Organisiert',
          'Gewissenhaft',
          'Detailgenau',
          'Prozessorientiert',
        ],
      },
      neuroticism: {
        name: 'Der Sensible Perfektionist',
        description:
          'Du bist emotional intelligent und achtsam. Deine Sensibilität ermöglicht dir, Nuancen wahrzunehmen, die anderen entgehen.',
        strengths: [
          'Hohe Aufmerksamkeit für Details',
          'Risikobewusstsein',
          'Qualitätsorientierung',
          'Emotionale Tiefe',
        ],
        professional:
          'Geeignet für Qualitätskontrolle, Beratung, kreative Berufe, Forschung und alle Bereiche, die Sorgfalt erfordern.',
        keywords: [
          'Aufmerksam',
          'Sorgfältig',
          'Reflektiert',
          'Qualitätsbewusst',
        ],
      },
      openness: {
        name: 'Der Kreative Innovator',
        description:
          'Du bist aufgeschlossen, neugierig und innovativ. Neue Ideen und unkonventionelle Lösungen sind deine Stärke.',
        strengths: [
          'Kreatives Problemlösen',
          'Innovationskraft',
          'Schnelle Anpassungsfähigkeit',
          'Visionäres Denken',
        ],
        professional:
          'Ideal für Innovation, Design, Produktentwicklung, Forschung, Start-ups und alle kreativen Branchen.',
        keywords: ['Kreativ', 'Innovativ', 'Flexibel', 'Visionär'],
      },
    };

    return (
      personalityTypes[dominantTrait || 'openness'] || personalityTypes.openness
    );
  };

  const personalityType = determinePersonalityType();

  const handleShare = async () => {
    try {
      setIsSharing(true);

      // Professional share text for applications
      const professionalText =
        `📊 Mein Persönlichkeitsprofil\n\n` +
        `✦ Primäres Profil: ${primaryProfile.title} (${primaryProfile.percentage}%)\n` +
        `${primaryProfile.shortDescription}\n\n` +
        `✦ Sekundäres Profil: ${secondaryProfile.title} (${secondaryProfile.percentage}%)\n\n` +
        `🎯 Kernkompetenzen:\n${summary.combinedKeywords
          .map((k) => `• ${k}`)
          .join('\n')}\n\n` +
        `💼 Berufliche Stärken:\n${primaryProfile.strengths
          .slice(0, 3)
          .map((s) => `• ${s}`)
          .join('\n')}\n\n` +
        `📈 Entwicklungspotenzial:\n${primaryProfile.developmentTips
          .slice(0, 2)
          .map((t) => `• ${t}`)
          .join('\n')}\n\n` +
        `🔗 Erstellt mit SelfIQ - Wissenschaftlich fundierte Persönlichkeitsanalyse`;

      await Share.share({
        message: professionalText,
        message: professionalText,
      });
    } catch (error) {
      console.log('Share error:', error);

      // Fallback to text sharing if image fails
      try {
        const fallbackText =
          `📊 Mein Persönlichkeitsprofil\n\n` +
          `✦ Primäres Profil: ${primaryProfile.title} (${primaryProfile.percentage}%)\n` +
          `${primaryProfile.shortDescription}\n\n` +
          `✦ Sekundäres Profil: ${secondaryProfile.title} (${secondaryProfile.percentage}%)\n\n` +
          `🎯 Kernkompetenzen:\n${summary.combinedKeywords
            .map((k) => `• ${k}`)
            .join('\n')}\n\n` +
          `💼 Berufliche Stärken:\n${primaryProfile.strengths
            .slice(0, 3)
            .map((s) => `• ${s}`)
            .join('\n')}\n\n` +
          `🔗 Erstellt mit SelfIQ`;

        await Share.share({
          message: fallbackText,
        });
      } catch (fallbackError) {
        console.log('Fallback share error:', fallbackError);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleUnlockResults = () => {
    Alert.alert(
      'Ergebnisse freischalten',
      'Schalte deine detaillierten Testergebnisse für nur 0,99€ frei und erhalte Zugang zu allen weiteren Tests!',
      [
        {
          text: 'Später',
          style: 'cancel',
        },
        {
          text: 'Für 0,99€ freischalten',
          onPress: () => {
            // TODO: Implementiere In-App-Purchase
            Alert.alert('Coming Soon', 'Payment-Integration folgt in Kürze!');
          },
        },
      ],
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return '#ff914d';
    if (score >= 3) return '#ff6b6b';
    if (score >= 0) return '#ff3131';
    return '#888';
  };

  const normalizeScore = (score: number, max: number = 10) => {
    return Math.max(0, Math.min(100, ((score + 5) / max) * 100));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <AnimatedParticles />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          onBackPress={onBackToMenu}
          showBackButton={true}
          greetingText="Ergebnisse"
          subtitleText={`Gut gemacht, ${playerName}!`}
        />

        {showPaywall ? (
          /* Paywall für Gäste */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.paywallContainer}
          >
            <Animated.View
              style={[
                styles.paywallCard,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 49, 49, 0.4)', 'rgba(255, 145, 77, 0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.paywallGradient}
              >
                <Ionicons
                  name="lock-closed"
                  size={80}
                  color="#ff914d"
                  style={styles.lockIcon}
                />
                <Text style={styles.paywallTitle}>Test abgeschlossen! 🎉</Text>
                <Text style={styles.paywallDescription}>
                  Du hast den Test erfolgreich beendet. Um deine detaillierten
                  Ergebnisse zu sehen, schalte sie jetzt frei.
                </Text>

                <View style={styles.paywallFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#ff914d"
                    />
                    <Text style={styles.featureText}>
                      Detaillierte Persönlichkeitsanalyse
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#ff914d"
                    />
                    <Text style={styles.featureText}>
                      Stärken & Entwicklungstipps
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#ff914d"
                    />
                    <Text style={styles.featureText}>
                      Berufliche Empfehlungen
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#ff914d"
                    />
                    <Text style={styles.featureText}>
                      Zugang zu allen weiteren Tests
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleUnlockResults}
                  activeOpacity={0.8}
                  style={styles.unlockButtonWrapper}
                >
                  <LinearGradient
                    colors={['#ff3131', '#ff914d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.unlockButton}
                  >
                    <Ionicons name="lock-open" size={24} color="#fff" />
                    <Text style={styles.unlockButtonText}>
                      Für 0,99€ freischalten
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onBackToMenu}
                  activeOpacity={0.8}
                  style={styles.laterButton}
                >
                  <Text style={styles.laterButtonText}>Vielleicht später</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </ScrollView>
        ) : (
          /* Normale Ergebnisse für Premium-User */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header wird entfernt, da bereits im AppHeader */}

            {/* Wrapper for content */}
            <View collapsable={false} style={styles.captureWrapper}>
              {/* Overall Summary */}
              <Animated.View
                style={[styles.summaryCard, { opacity: fadeAnim }]}
              >
                <LinearGradient
                  colors={['rgba(255, 49, 49, 0.3)', 'rgba(255, 145, 77, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resultGradient}
                >
                  <Text style={styles.summaryLabel}>
                    Deine Gesamtpersönlichkeit
                  </Text>
                  <Text style={styles.summaryDescription}>
                    {summary.overallDescription}
                  </Text>
                </LinearGradient>
              </Animated.View>

              {/* Primary Personality */}
              <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={[
                    'rgba(255, 49, 49, 0.35)',
                    'rgba(255, 145, 77, 0.25)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resultGradient}
                >
                  <View style={styles.profileBadge}>
                    <Text style={styles.profileBadgeText}>
                      Primär · {primaryProfile.percentage}%
                    </Text>
                  </View>
                  <Text style={styles.resultLabel}>
                    {primaryProfile.dimension}
                  </Text>
                  <Text style={styles.resultType}>{primaryProfile.title}</Text>
                  <Text style={styles.resultDescription}>
                    {primaryProfile.detailedDescription}
                  </Text>

                  {/* Stärken */}
                  <View style={styles.strengthsContainer}>
                    <Text style={styles.strengthsTitle}>Deine Stärken:</Text>
                    {primaryProfile.strengths.map((strength, index) => (
                      <View key={index} style={styles.strengthItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#ff914d"
                        />
                        <Text style={styles.strengthText}>{strength}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Herausforderungen */}
                  <View style={styles.challengesContainer}>
                    <Text style={styles.challengesTitle}>
                      Herausforderungen:
                    </Text>
                    {primaryProfile.challenges.map((challenge, index) => (
                      <View key={index} style={styles.challengeItem}>
                        <Text style={styles.challengeText}>• {challenge}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Berufliche Eignung */}
                  <View style={styles.professionalContainer}>
                    <Text style={styles.professionalTitle}>
                      Berufliche Eignung:
                    </Text>
                    <Text style={styles.professionalText}>
                      {primaryProfile.professionalSuitability}
                    </Text>
                  </View>

                  {/* Keywords für Bewerbungen */}
                  <View style={styles.keywordsContainer}>
                    <Text style={styles.keywordsTitle}>
                      Keywords für Bewerbungen:
                    </Text>
                    <View style={styles.keywordsList}>
                      {primaryProfile.keywords.map((keyword, index) => (
                        <View key={index} style={styles.keywordBadge}>
                          <Text style={styles.keywordText}>{keyword}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Entwicklungstipps */}
                  <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>Entwicklungstipps:</Text>
                    {primaryProfile.developmentTips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <Text style={styles.tipText}>→ {tip}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Secondary Personality */}
              <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={[
                    'rgba(255, 145, 77, 0.25)',
                    'rgba(255, 49, 49, 0.15)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resultGradient}
                >
                  <View
                    style={[styles.profileBadge, styles.profileBadgeSecondary]}
                  >
                    <Text style={styles.profileBadgeText}>
                      Sekundär · {secondaryProfile.percentage}%
                    </Text>
                  </View>
                  <Text style={styles.resultLabel}>
                    {secondaryProfile.dimension}
                  </Text>
                  <Text style={styles.resultType}>
                    {secondaryProfile.title}
                  </Text>
                  <Text style={styles.resultDescription}>
                    {secondaryProfile.shortDescription}
                  </Text>

                  {/* Top Stärken */}
                  <View style={styles.strengthsContainer}>
                    <Text style={styles.strengthsTitle}>
                      Zusätzliche Stärken:
                    </Text>
                    {secondaryProfile.strengths
                      .slice(0, 3)
                      .map((strength, index) => (
                        <View key={index} style={styles.strengthItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#ff914d"
                          />
                          <Text style={styles.strengthText}>{strength}</Text>
                        </View>
                      ))}
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Scores */}
              {/* Scores with Interactive Bar Chart */}
              <Animated.View style={[styles.scoresCard, { opacity: fadeAnim }]}>
                <Text style={styles.scoresTitle}>Deine Auswertung</Text>

                {/* Interactive Bar Chart */}
                <View style={styles.chartContainer}>
                  {Object.keys(testResults.scores).map((category, index) => {
                    const score = testResults.scores[category];
                    const normalizedScore = normalizeScore(score);
                    const color = getScoreColor(score);

                    return (
                      <View key={category} style={styles.chartBar}>
                        <Text style={styles.chartLabel}>
                          {categoryNames[category] || category}
                        </Text>
                        <View style={styles.chartBarContainer}>
                          <Animated.View
                            style={[
                              styles.chartBarFill,
                              {
                                width: `${normalizedScore}%`,
                                backgroundColor: color,
                              },
                            ]}
                          />
                          <Text style={[styles.chartPercentage, { color }]}>
                            {Math.round(normalizedScore)}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                <Text style={styles.detailedScoresTitle}>
                  Detaillierte Werte
                </Text>

                {Object.keys(testResults.scores).map((category, index) => {
                  const score = testResults.scores[category];
                  const normalizedScore = normalizeScore(score);
                  const color = getScoreColor(score);

                  return (
                    <View key={category} style={styles.scoreItem}>
                      <View style={styles.scoreHeader}>
                        <Text style={styles.scoreLabel}>
                          {categoryNames[category] || category}
                        </Text>
                        <Text style={[styles.scoreValue, { color }]}>
                          {Math.round(normalizedScore)}%
                        </Text>
                      </View>
                      <View style={styles.scoreBarBackground}>
                        <Animated.View
                          style={[
                            styles.scoreBarFill,
                            {
                              width: `${normalizedScore}%`,
                              backgroundColor: color,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  );
                })}
              </Animated.View>
            </View>
            {/* End of capture wrapper */}

            {/* Action Buttons */}
            <Animated.View
              style={[styles.actionsContainer, { opacity: fadeAnim }]}
            >
              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.8}
                disabled={isSharing}
              >
                <LinearGradient
                  colors={['#ff3131', '#ff914d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.shareButton}
                >
                  {isSharing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="share-social" size={24} color="#fff" />
                      <Text style={styles.buttonText}>Teilen</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onRetake} activeOpacity={0.8}>
                <View style={styles.retakeButton}>
                  <Ionicons name="refresh" size={24} color="#ff914d" />
                  <Text style={styles.retakeButtonText}>Erneut testen</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onBackToMenu} activeOpacity={0.8}>
                <View style={styles.backButton}>
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="rgba(255,255,255,0.7)"
                  />
                  <Text style={styles.backButtonText}>Zurück zum Menü</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        )}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginTop: 20,
    fontFamily: 'neosans',
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    fontFamily: 'neosans',
  },
  summaryCard: {
    marginBottom: 25,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#ff914d',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryDescription: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  profileBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 49, 49, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 145, 77, 0.8)',
    zIndex: 10,
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  profileBadgeSecondary: {
    backgroundColor: 'rgba(255, 145, 77, 0.9)',
    borderColor: 'rgba(255, 49, 49, 0.6)',
  },
  profileBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  challengesContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 145, 77, 0.3)',
  },
  challengesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 12,
    fontFamily: 'neosans',
  },
  challengeItem: {
    marginBottom: 6,
  },
  challengeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 20,
  },
  tipsContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 145, 77, 0.3)',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 12,
    fontFamily: 'neosans',
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
  },
  resultCard: {
    marginBottom: 30,
  },
  resultGradient: {
    borderRadius: 20,
    padding: 30,
    paddingTop: 55,
    borderWidth: 2,
    borderColor: 'rgba(255, 49, 49, 0.3)',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#ff914d',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  resultType: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  strengthsContainer: {
    width: '100%',
    marginTop: 15,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 145, 77, 0.3)',
  },
  strengthsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 12,
    fontFamily: 'neosans',
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  strengthText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  professionalContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 145, 77, 0.3)',
  },
  professionalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 10,
    fontFamily: 'neosans',
  },
  professionalText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    textAlign: 'left',
  },
  keywordsContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 145, 77, 0.3)',
  },
  keywordsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 12,
    fontFamily: 'neosans',
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordBadge: {
    backgroundColor: 'rgba(255, 145, 77, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.4)',
  },
  keywordText: {
    fontSize: 13,
    color: '#ff914d',
    fontWeight: '600',
  },
  scoresCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(93, 224, 230, 0.2)',
    marginBottom: 30,
  },
  chartContainer: {
    width: '100%',
    marginBottom: 30,
    gap: 16,
  },
  chartBar: {
    width: '100%',
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'neosans',
  },
  chartBarContainer: {
    position: 'relative',
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.2)',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 20,
    shadowColor: '#ff914d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  chartPercentage: {
    position: 'absolute',
    right: 12,
    top: 10,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'neosans',
  },
  detailedScoresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff914d',
    marginBottom: 16,
    marginTop: 10,
    fontFamily: 'neosans',
  },
  scoresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'neosans',
  },
  scoreItem: {
    marginBottom: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreBarBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  captureWrapper: {
    backgroundColor: 'transparent',
  },
  actionsContainer: {
    gap: 15,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 49, 49, 0.1)',
    borderWidth: 2,
    borderColor: '#ff3131',
  },
  retakeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff3131',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  paywallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  paywallCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 145, 77, 0.4)',
    overflow: 'hidden',
  },
  paywallGradient: {
    padding: 30,
    alignItems: 'center',
  },
  lockIcon: {
    marginBottom: 20,
  },
  paywallTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'neosans',
  },
  paywallDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  paywallFeatures: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    marginLeft: 12,
  },
  unlockButtonWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 15,
    shadowColor: '#ff914d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  unlockButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'neosans',
  },
  laterButton: {
    paddingVertical: 15,
  },
  laterButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textDecorationLine: 'underline',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ResultScreen;
