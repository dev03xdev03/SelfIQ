import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasAccessToLockedContent,
  getSubscriptionInfo,
} from '../hilfsmittel/abonnementSpeicher';
import {
  loadAllProgress,
  EpisodeProgress,
} from '../hilfsmittel/fortschrittSpeicher';
import AnimatedParticles from '../components/AnimatedParticles';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

const { width, height } = Dimensions.get('window');

export type TestCategory =
  | 'Persönlichkeitstyp'
  | 'Emotionale Intelligenz'
  | 'Führungsqualitäten'
  | 'Stressresistenz'
  | 'Kommunikationsstil'
  | 'Beziehungspersönlichkeit'
  | 'Berufungsfinder'
  | 'Kreativitätsindex'
  | 'Dark Triad'
  | 'Growth vs Fixed Mindset'
  | 'Soziale Kompetenz'
  | 'Entscheidungsmacher'
  | 'Konfliktlösung'
  | 'Intuitions-Score'
  | 'Selbstbewusstsein'
  | 'Zeitmanagement'
  | 'Risikoverhalten'
  | 'Empathie-Level'
  | 'Perfektionismus'
  | 'Optimismus-Index'
  | 'Teamfähigkeit'
  | 'Durchsetzungskraft'
  | 'Lerntyp'
  | 'Motivations-Profil'
  | 'Wertekompass';

interface TestOption {
  id: string;
  testId: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: [string, string];
  totalQuestions: number;
  isLocked: boolean;
  duration: number; // in Minuten
  category: string;
}

interface CategorySelectionScreenProps {
  playerName: string;
  categoryId?: string;
  onCategorySelect: (
    testId: string,
    testName: string,
    gradientColors: [string, string],
  ) => void;
  onBack: () => void;
  onShowInfo: () => void;
}

const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({
  playerName,
  categoryId,
  onCategorySelect,
  onBack,
  onShowInfo,
}) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<{
    [key: string]: { completed: number; total: number; percentage: number };
  }>({});
  const [userId, setUserId] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [guestCreatedAt, setGuestCreatedAt] = useState<string>('');
  const scaleAnims = React.useRef(
    Array.from({ length: 40 }, () => new Animated.Value(1)),
  ).current;

  // Refs for auto-scroll animations
  const scrollAnims = useRef<Animated.Value[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Load user data for guest timer
      try {
        const userDataString = await AsyncStorage.getItem('@selfiq_user');
        console.log(
          '[KategorieAuswahlBildschirm] Raw user data:',
          userDataString,
        );

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          console.log(
            '[KategorieAuswahlBildschirm] Parsed user data:',
            userData,
          );

          setUserId(userData.id || '');
          setIsGuest(userData.id?.startsWith('guest_') || false);
          setGuestCreatedAt(userData.created_at || '');

          console.log('[KategorieAuswahlBildschirm] State set:', {
            userId: userData.id,
            isGuest: userData.id?.startsWith('guest_'),
            guestCreatedAt: userData.created_at,
          });
        } else {
          console.log(
            '[KategorieAuswahlBildschirm] No user data in AsyncStorage',
          );
        }
      } catch (error) {
        console.error(
          '[KategorieAuswahlBildschirm] Fehler beim Laden der User-Daten:',
          error,
        );
      }

      const access = await hasAccessToLockedContent();
      setHasAccess(access);

      // Lade alle Progress-Daten
      const allProgress = await loadAllProgress();

      // Berechne Fortschritt pro Test
      const progress: {
        [key: string]: { completed: number; total: number; percentage: number };
      } = {};

      tests.forEach((test) => {
        const testProgressData = allProgress[test.testId];
        const totalQuestions = test.totalQuestions;
        const completedQuestions = testProgressData
          ? Math.round((testProgressData.progress / 100) * totalQuestions)
          : 0;
        const percentage = testProgressData ? testProgressData.progress : 0;

        progress[test.id] = {
          completed: completedQuestions,
          total: totalQuestions,
          percentage,
        };
      });

      setTestProgress(progress);
    };
    loadData();
  }, []);

  const tests: TestOption[] = useMemo(
    () => [
      {
        id: 'pers_01',
        testId: 'pers_01',
        name: 'Persönlichkeitstyp',
        description:
          'Entdecke deinen einzigartigen Charakter - Intro/Extro, Denker/Fühler',
        icon: 'person',
        gradientColors: ['#ff3131', '#ff914d'],
        totalQuestions: 25,
        isLocked: false,
        duration: 15,
        category: 'Persönlichkeit',
      },
      {
        id: 'eq_01',
        testId: 'eq_01',
        name: 'Emotionale Intelligenz',
        description: 'Wie gut verstehst du deine und fremde Emotionen?',
        icon: 'heart',
        gradientColors: ['#ff3131', '#ff6b6b'],
        totalQuestions: 20,
        isLocked: true,
        duration: 12,
        category: 'Emotionale Kompetenz',
      },
      {
        id: 'lead_01',
        testId: 'lead_01',
        name: 'Führungsqualitäten',
        description: 'Bist du geboren, um zu führen oder zu folgen?',
        icon: 'trophy',
        gradientColors: ['#ff914d', '#ffb380'],
        totalQuestions: 18,
        isLocked: true,
        duration: 10,
        category: 'Berufliches',
      },
      {
        id: 'stress_01',
        testId: 'stress_01',
        name: 'Stressresistenz',
        description: 'Wie gehst du mit Druck und schwierigen Situationen um?',
        icon: 'flame',
        gradientColors: ['#ff3131', '#8b0000'],
        totalQuestions: 15,
        isLocked: true,
        duration: 8,
        category: 'Mentale Stärke',
      },
      {
        id: 'comm_01',
        testId: 'comm_01',
        name: 'Kommunikationsstil',
        description: 'Direkt oder diplomatisch? Finde deinen Kommunikationstyp',
        icon: 'chatbubbles',
        gradientColors: ['#ff6b6b', '#ff914d'],
        totalQuestions: 16,
        isLocked: true,
        duration: 30,
        category: 'Soziale Kompetenz',
      },
      {
        id: 'love_01',
        testId: 'love_01',
        name: 'Beziehungspersönlichkeit',
        description:
          'Welcher Beziehungstyp bist du? Romantiker, Realist oder Pragmatiker?',
        icon: 'heart-circle',
        gradientColors: ['#ff914d', '#ff3131'],
        totalQuestions: 22,
        isLocked: true,
        duration: 30,
        category: 'Beziehungen',
      },
      {
        id: 'career_01',
        testId: 'career_01',
        name: 'Berufungsfinder',
        description:
          'Welcher Karriereweg passt wirklich zu deiner Persönlichkeit?',
        icon: 'briefcase',
        gradientColors: ['#ff3131', '#ff4d4d'],
        totalQuestions: 24,
        isLocked: true,
        duration: 30,
        category: 'Berufliches',
      },
      {
        id: 'creative_01',
        testId: 'creative_01',
        name: 'Kreativitätsindex',
        description:
          'Analytisch oder künstlerisch? Teste dein kreatives Potential',
        icon: 'color-palette',
        gradientColors: ['#ff914d', '#ffa64d'],
        totalQuestions: 19,
        isLocked: false,
        duration: 30,
        category: 'Persönlichkeit',
      },
      {
        id: 'dark_01',
        testId: 'dark_01',
        name: 'Dark Triad',
        description:
          'Wie ausgeprägt sind deine dunklen Persönlichkeitsaspekte?',
        icon: 'moon',
        gradientColors: ['#8b0000', '#ff3131'],
        totalQuestions: 21,
        isLocked: false,
        duration: 30,
        category: 'Persönlichkeit',
      },
      {
        id: 'mindset_01',
        testId: 'mindset_01',
        name: 'Growth vs Fixed Mindset',
        description: 'Glaubst du an Wachstum oder bleibst du in Mustern?',
        icon: 'trending-up',
        gradientColors: ['#2a0f0f', '#ff3131'],
        totalQuestions: 17,
        isLocked: true,
        duration: 30,
        category: 'Mentale Stärke',
      },
      {
        id: 'social_01',
        testId: 'social_01',
        name: 'Soziale Kompetenz',
        description:
          'Networking-Profi oder Einzelgänger? Teste deine sozialen Fähigkeiten',
        icon: 'people',
        gradientColors: ['#ff914d', '#ff6b6b'],
        totalQuestions: 20,
        isLocked: true,
        duration: 30,
        category: 'Soziale Kompetenz',
      },
      {
        id: 'decision_01',
        testId: 'decision_01',
        name: 'Entscheidungsmacher',
        description:
          'Rational oder impulsiv? Analysiere deinen Entscheidungsprozess',
        icon: 'git-branch',
        gradientColors: ['#ff3131', '#ff5050'],
        totalQuestions: 18,
        isLocked: true,
        duration: 30,
        category: 'Mentale Stärke',
      },
      {
        id: 'conflict_01',
        testId: 'conflict_01',
        name: 'Konfliktlösung',
        description: 'Kämpfer, Vermittler oder Flüchter? Dein Konflikttyp',
        icon: 'shield',
        gradientColors: ['#ff4d4d', '#ff914d'],
        totalQuestions: 16,
        isLocked: true,
        duration: 30,
        category: 'Soziale Kompetenz',
      },
      {
        id: 'intuition_01',
        testId: 'intuition_01',
        name: 'Intuitions-Score',
        description: 'Wie stark verlässt du dich auf dein Bauchgefühl?',
        icon: 'eye',
        gradientColors: ['#ff6666', '#ff914d'],
        totalQuestions: 15,
        isLocked: true,
        duration: 30,
        category: 'Mentale Stärke',
      },
      {
        id: 'confidence_01',
        testId: 'confidence_01',
        name: 'Selbstbewusstsein',
        description:
          'Wie sicher bist du in deinen Fähigkeiten und Entscheidungen?',
        icon: 'ribbon',
        gradientColors: ['#ff914d', '#ffd700'],
        totalQuestions: 18,
        isLocked: true,
        duration: 30,
        category: 'Persönlichkeit',
      },
      {
        id: 'time_01',
        testId: 'time_01',
        name: 'Zeitmanagement',
        description: 'Strukturiert oder spontan? Teste deine Zeitplanung',
        icon: 'time',
        gradientColors: ['#ff3131', '#ff7f50'],
        totalQuestions: 16,
        isLocked: true,
        duration: 30,
        category: 'Berufliches',
      },
      {
        id: 'risk_01',
        testId: 'risk_01',
        name: 'Risikoverhalten',
        description: 'Abenteurer oder Sicherheitsdenker? Dein Risikoprofil',
        icon: 'speedometer',
        gradientColors: ['#ff4500', '#ff914d'],
        totalQuestions: 17,
        isLocked: true,
        duration: 30,
        category: 'Persönlichkeit',
      },
      {
        id: 'empathy_01',
        testId: 'empathy_01',
        name: 'Empathie-Level',
        description: 'Wie gut kannst du dich in andere hineinversetzen?',
        icon: 'heart-half',
        gradientColors: ['#ff6b9d', '#ff914d'],
        totalQuestions: 19,
        isLocked: true,
        duration: 30,
        category: 'Emotionale Kompetenz',
      },
      {
        id: 'perfect_01',
        testId: 'perfect_01',
        name: 'Perfektionismus',
        description: 'Gesunder Ehrgeiz oder übertriebener Anspruch?',
        icon: 'star',
        gradientColors: ['#ff3131', '#ff69b4'],
        totalQuestions: 16,
        isLocked: true,
        duration: 30,
        category: 'Persönlichkeit',
      },
      {
        id: 'optimism_01',
        testId: 'optimism_01',
        name: 'Optimismus-Index',
        description: 'Positiv oder realistisch? Deine Lebenseinstellung',
        icon: 'sunny',
        gradientColors: ['#ff914d', '#ffb347'],
        totalQuestions: 15,
        isLocked: true,
        duration: 30,
        category: 'Mentale Stärke',
      },
      {
        id: 'team_01',
        testId: 'team_01',
        name: 'Teamfähigkeit',
        description: 'Teamplayer oder Einzelkämpfer? Deine Zusammenarbeit',
        icon: 'people-circle',
        gradientColors: ['#ff6347', '#ff914d'],
        totalQuestions: 18,
        isLocked: true,
        duration: 30,
        category: 'Soziale Kompetenz',
      },
      {
        id: 'assert_01',
        testId: 'assert_01',
        name: 'Durchsetzungskraft',
        description: 'Wie stark setzt du deine Interessen durch?',
        icon: 'pulse',
        gradientColors: ['#ff3131', '#dc143c'],
        totalQuestions: 17,
        isLocked: true,
        duration: 30,
        category: 'Berufliches',
      },
      {
        id: 'learn_01',
        testId: 'learn_01',
        name: 'Lerntyp',
        description:
          'Visuell, auditiv oder kinästhetisch? Dein optimaler Lernweg',
        icon: 'school',
        gradientColors: ['#ff914d', '#ff8c69'],
        totalQuestions: 20,
        isLocked: true,
        duration: 30,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'study_01',
        testId: 'study_01',
        name: 'Lernstrategie',
        description: 'Welche Lernmethoden passen optimal zu dir?',
        icon: 'book',
        gradientColors: ['#4a90e2', '#5dade2'],
        totalQuestions: 18,
        isLocked: true,
        duration: 25,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'focus_01',
        testId: 'focus_01',
        name: 'Konzentrationsfähigkeit',
        description: 'Wie gut kannst du dich auf Aufgaben fokussieren?',
        icon: 'eye-outline',
        gradientColors: ['#3498db', '#2980b9'],
        totalQuestions: 16,
        isLocked: true,
        duration: 20,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'exam_01',
        testId: 'exam_01',
        name: 'Prüfungsangst-Test',
        description: 'Wie gehst du mit Prüfungssituationen und Stress um?',
        icon: 'clipboard',
        gradientColors: ['#e74c3c', '#c0392b'],
        totalQuestions: 17,
        isLocked: true,
        duration: 22,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'career_student_01',
        testId: 'career_student_01',
        name: 'Berufsorientierung',
        description: 'Welche Ausbildung oder welches Studium passt zu dir?',
        icon: 'compass',
        gradientColors: ['#9b59b6', '#8e44ad'],
        totalQuestions: 22,
        isLocked: true,
        duration: 30,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'task_manage_01',
        testId: 'task_manage_01',
        name: 'Aufgabenorganisation',
        description: 'Wie planst und organisierst du deine Schulaufgaben?',
        icon: 'list',
        gradientColors: ['#16a085', '#1abc9c'],
        totalQuestions: 15,
        isLocked: true,
        duration: 18,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'group_work_01',
        testId: 'group_work_01',
        name: 'Gruppenarbeits-Typ',
        description: 'Welche Rolle übernimmst du in Gruppenarbeiten?',
        icon: 'people-outline',
        gradientColors: ['#f39c12', '#e67e22'],
        totalQuestions: 16,
        isLocked: true,
        duration: 20,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'math_anxiety_01',
        testId: 'math_anxiety_01',
        name: 'Mathe-Mindset',
        description: 'Deine Einstellung zu Mathematik und logischem Denken',
        icon: 'calculator',
        gradientColors: ['#2c3e50', '#34495e'],
        totalQuestions: 14,
        isLocked: true,
        duration: 18,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'teacher_relation_01',
        testId: 'teacher_relation_01',
        name: 'Lehrer-Schüler-Beziehung',
        description: 'Wie gehst du mit Lehrern und Ausbildern um?',
        icon: 'person-add',
        gradientColors: ['#27ae60', '#229954'],
        totalQuestions: 15,
        isLocked: true,
        duration: 20,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'presentation_01',
        testId: 'presentation_01',
        name: 'Präsentations-Kompetenz',
        description: 'Wie sicher fühlst du dich bei Referaten und Vorträgen?',
        icon: 'mic',
        gradientColors: ['#e67e22', '#d35400'],
        totalQuestions: 16,
        isLocked: true,
        duration: 22,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'vocational_01',
        testId: 'vocational_01',
        name: 'Ausbildungs-Fit',
        description: 'Bist du bereit für eine Ausbildung? Teste deine Reife',
        icon: 'build',
        gradientColors: ['#95a5a6', '#7f8c8d'],
        totalQuestions: 18,
        isLocked: true,
        duration: 25,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'homework_01',
        testId: 'homework_01',
        name: 'Hausaufgaben-Strategie',
        description: 'Wie effektiv erledigst du deine Hausaufgaben?',
        icon: 'home',
        gradientColors: ['#3498db', '#2471a3'],
        totalQuestions: 14,
        isLocked: true,
        duration: 18,
        category: 'Schule & Ausbildung',
      },
      {
        id: 'motiv_01',
        testId: 'motiv_01',
        name: 'Motivations-Profil',
        description: 'Was treibt dich wirklich an? Finde deine Antriebskraft',
        icon: 'rocket',
        gradientColors: ['#ff4500', '#ff914d'],
        totalQuestions: 19,
        isLocked: true,
        duration: 30,
        category: 'Persönlichkeit',
      },
      {
        id: 'values_01',
        testId: 'values_01',
        name: 'Wertekompass',
        description: 'Welche Werte leiten dein Leben und deine Entscheidungen?',
        icon: 'compass',
        gradientColors: ['#ff6b6b', '#ff914d'],
        totalQuestions: 21,
        isLocked: true,
        duration: 30,
        category: 'Persönlichkeit',
      },
    ],
    [],
  );

  // Gruppiere Stories in Reihen mit je 5 Cards
  const testRows = useMemo(() => {
    const rows: TestOption[][] = [];
    for (let i = 0; i < tests.length; i += 5) {
      rows.push(tests.slice(i, i + 5));
    }
    return rows;
  }, [tests]);

  // Gruppiere Tests nach Kategorien
  const testsByCategory = useMemo(() => {
    const grouped: { [key: string]: TestOption[] } = {};
    tests.forEach((test) => {
      if (!grouped[test.category]) {
        grouped[test.category] = [];
      }
      grouped[test.category].push(test);
    });
    return grouped;
  }, [tests]);

  // Sortiere Kategorien (freie Tests zuerst)
  const sortedCategories = useMemo(() => {
    return Object.keys(testsByCategory).sort((a, b) => {
      const aHasFree = testsByCategory[a].some((t) => !t.isLocked);
      const bHasFree = testsByCategory[b].some((t) => !t.isLocked);
      if (aHasFree && !bHasFree) return -1;
      if (!aHasFree && bHasFree) return 1;
      return a.localeCompare(b);
    });
  }, [testsByCategory]);

  // Initialize scroll animations for each row
  useEffect(() => {
    testRows.forEach((_, index) => {
      if (!scrollAnims.current[index]) {
        scrollAnims.current[index] = new Animated.Value(0);
      }
    });
  }, [testRows]);

  // Auto-scroll animation für jede Reihe
  useEffect(() => {
    const animations = testRows.map((row, rowIndex) => {
      const scrollAnim = scrollAnims.current[rowIndex] || new Animated.Value(0);
      const cardWidth = width * 0.8 + 15; // Card width + gap
      const totalWidth = row.length * cardWidth;
      const isEven = rowIndex % 2 === 0;

      return Animated.loop(
        Animated.sequence([
          Animated.timing(scrollAnim, {
            toValue: isEven ? -totalWidth : totalWidth,
            duration: 40000,
            useNativeDriver: true,
          }),
          Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [testRows]);

  const handleTestPress = useCallback(
    (test: TestOption, index: number) => {
      // Gesperrte Tests sind nicht anklickbar
      if (test.isLocked) {
        return;
      }

      setSelectedTest(test.id);

      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnims[index], {
          toValue: 0.95,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnims[index], {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();

      // Navigate to difficulty selector with test data
      setTimeout(() => {
        onCategorySelect(test.testId, test.name, test.gradientColors);
      }, 150);
    },
    [hasAccess, onCategorySelect, scaleAnims],
  );

  // Map categoryId to category name
  const categoryIdToName: { [key: string]: string } = {
    personality: 'Persönlichkeit',
    emotional: 'Emotionale Kompetenz',
    professional: 'Berufliches',
    mental: 'Mentale Stärke',
    social: 'Soziale Kompetenz',
    relationships: 'Beziehungen',
    education: 'Schule & Ausbildung',
  };

  // Filter tests by selected category
  const filteredTests = useMemo(() => {
    if (!categoryId) return tests;
    const categoryName = categoryIdToName[categoryId];
    if (!categoryName) return tests;
    return tests.filter((test) => test.category === categoryName);
  }, [categoryId, tests]);

  // Group filtered tests by category
  const filteredTestsByCategory = useMemo(() => {
    const grouped: { [key: string]: TestOption[] } = {};
    filteredTests.forEach((test) => {
      if (!grouped[test.category]) {
        grouped[test.category] = [];
      }
      grouped[test.category].push(test);
    });
    return grouped;
  }, [filteredTests]);

  // Sorted categories for filtered tests
  const filteredSortedCategories = useMemo(() => {
    return Object.keys(filteredTestsByCategory).sort((a, b) => {
      const aHasFree = filteredTestsByCategory[a].some((t) => !t.isLocked);
      const bHasFree = filteredTestsByCategory[b].some((t) => !t.isLocked);
      if (aHasFree && !bHasFree) return -1;
      if (!aHasFree && bHasFree) return 1;
      return a.localeCompare(b);
    });
  }, [filteredTestsByCategory]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AnimatedParticles />

      {/* Dark Overlay (no video background) */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          onBackPress={onBack}
          showBackButton={true}
          greetingText={`Hallo ${playerName}!`}
          subtitleText={
            categoryId
              ? categoryIdToName[categoryId] || 'Wähle einen Test'
              : 'Wähle einen Test'
          }
        />

        {/* Stories Vertical List with Horizontal Cards */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalScrollContent}
          style={styles.verticalScrollContainer}
        >
          {filteredSortedCategories.map((category) => (
            <View key={category} style={styles.categorySection}>
              {/* Kategorie Header */}
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeaderText}>{category}</Text>
                <View style={styles.categoryHeaderLine} />
              </View>

              {/* Tests in dieser Kategorie */}
              {filteredTestsByCategory[category].map((test) => {
                const globalIndex = filteredTests.findIndex(
                  (t) => t.id === test.id,
                );
                return (
                  <Animated.View
                    key={test.id}
                    style={[
                      styles.categoryWrapper,
                      { transform: [{ scale: scaleAnims[globalIndex] }] },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleTestPress(test, globalIndex)}
                    >
                      <LinearGradient
                        colors={test.gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.categoryCard,
                          selectedTest === test.id && styles.selectedCard,
                        ]}
                      >
                        {/* Top Row: Badges */}
                        <View style={styles.badgesRow}>
                          {/* Dauer Badge - Left */}
                          <View style={styles.fskBadge}>
                            <Ionicons
                              name="time-outline"
                              size={10}
                              color="#fff"
                            />
                            <Text style={styles.fskText}>
                              ~{test.duration} Min
                            </Text>
                          </View>

                          {/* Status Badge - Right */}
                          {!test.isLocked ? (
                            <View style={styles.unlockedBadge}>
                              <Ionicons
                                name="lock-open"
                                size={12}
                                color="#4ade80"
                              />
                              <Text style={styles.unlockedBadgeText}>
                                Freigeschaltet
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.premiumBadgeTop}>
                              <Ionicons name="star" size={12} color="#ff914d" />
                              <Text style={styles.premiumBadgeTopText}>
                                Freischalten
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Middle Row: Icon + Text */}
                        <View style={styles.cardContent}>
                          {/* Left Side: Icon */}
                          <LinearGradient
                            colors={test.gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconContainer}
                          >
                            <Ionicons name={test.icon} size={32} color="#fff" />
                          </LinearGradient>

                          {/* Right Side: Text + Badge */}
                          <View style={styles.textContainer}>
                            <Text style={styles.categoryName} numberOfLines={1}>
                              {test.name}
                            </Text>
                            <Text
                              style={styles.categoryDescription}
                              numberOfLines={2}
                            >
                              {test.description}
                            </Text>
                            {!test.isLocked && (
                              <View style={styles.questionBadge}>
                                <Ionicons
                                  name="help-circle-outline"
                                  size={14}
                                  color="#ff914d"
                                />
                                <Text style={styles.questionBadgeText}>
                                  {test.totalQuestions} Fragen
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Bottom Row: Progress Bar */}
                        {testProgress[test.id] && (
                          <View style={styles.progressBottomSection}>
                            <View style={styles.progressInfoRow}>
                              <Text style={styles.progressLabel}>
                                Fortschritt
                              </Text>
                              <Text style={styles.progressPercentageText}>
                                {Math.round(testProgress[test.id].percentage)}%
                              </Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                              <LinearGradient
                                colors={['#ff3131', '#ff914d']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                  styles.progressBarFill,
                                  {
                                    width: `${
                                      testProgress[test.id].percentage
                                    }%`,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        )}
                        {/* Glow Effect */}
                        {selectedTest === test.id && (
                          <View style={styles.glowEffect} />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          ))}
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
  videoBackgroundFullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
  verticalScrollContainer: {
    flex: 1,
  },
  verticalScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  categoryHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'neosans',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 14,
    minHeight: 160,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    minHeight: 26,
    gap: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  videoPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoBackground: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }, { scale: 1.5 }],
  },
  videoDarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  selectedCard: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: -1,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'neosans',
  },
  categoryDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 15,
    marginBottom: 6,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ff914d',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  questionBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ff914d',
    fontFamily: 'neosans',
  },
  progressBottomSection: {
    marginTop: 0,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'neosans',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressPercentageText: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'neosans',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fskBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fskText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  completedBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ade80',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: 0.2,
  },
  inProgressBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff914d',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  inProgressBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ff914d',
    letterSpacing: 0.2,
  },
  newBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff3131',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ff3131',
    letterSpacing: 0.2,
  },
  unlockedBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ade80',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  unlockedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: 0.2,
  },
  premiumBadgeTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff914d',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  premiumBadgeTopText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ff914d',
    letterSpacing: 0.2,
  },
  fskBadge6: {
    backgroundColor: 'rgba(34, 197, 94, 0.85)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  fskBadge12: {
    backgroundColor: 'rgba(59, 130, 246, 0.85)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  fskBadge16Plus: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  comingSoonBadgeBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff914d',
    letterSpacing: 0.3,
  },
  comingSoonTextBottom: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ff914d',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    minWidth: 32,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategorySelectionScreen;
