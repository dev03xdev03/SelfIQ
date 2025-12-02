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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeader from '../components/AppHeader';
import { checkGuestExpiration } from '../dienste/authentifizierungDienst';
import {
  saveEpisodeProgress,
  loadEpisodeProgress,
} from '../hilfsmittel/fortschrittSpeicher';
import testDataJson from '../daten/testDaten.json';

const { width, height } = Dimensions.get('window');

interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  score: { [key: string]: number }; // z.B. { extraversion: 2, agreeableness: -1 }
}

interface TestData {
  testId: string;
  testName: string;
  questions: Question[];
  scoringCategories: string[];
}

interface TestScreenProps {
  playerName: string;
  testId: string;
  onBack: () => void;
  onComplete: (results: TestResults) => void;
}

interface TestResults {
  testId: string;
  testName: string;
  scores: { [key: string]: number };
  percentage: number;
  answers: { questionId: string; answerId: string }[];
}

const TestScreen: React.FC<TestScreenProps> = ({
  playerName,
  testId,
  onBack,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; answerId: string }[]
  >([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));

  // Lade Test-Daten aus JSON
  const testData: TestData =
    (testDataJson as any).tests.find((test: any) => test.testId === testId) ||
    (testDataJson as any).tests[0];

  const currentQuestion = testData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / testData.questions.length) * 100;

  useEffect(() => {
    // Prüfe Gast-Ablauf beim Test-Start
    const checkGuestBeforeTest = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@selfiq_user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);

          if (userData.id?.startsWith('guest_')) {
            const isExpired = await checkGuestExpiration(userData.id);

            if (isExpired) {
              Alert.alert(
                'Gast-Zeitraum abgelaufen',
                'Deine 72-Stunden-Testphase ist abgelaufen. Bitte melde dich mit Apple an, um Tests durchzuführen.',
                [
                  {
                    text: 'Zurück',
                    onPress: () => onBack(),
                  },
                ],
                { cancelable: false },
              );
              return;
            }
          }
        }
      } catch (error) {
        console.error(
          '[TestBildschirm] Error checking guest expiration:',
          error,
        );
      }
    };

    checkGuestBeforeTest();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    // Speichere Antwort
    const newAnswers = [
      ...answers,
      { questionId: currentQuestion.id, answerId: selectedAnswer },
    ];
    setAnswers(newAnswers);

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedAnswer(null);

      if (currentQuestionIndex < testData.questions.length - 1) {
        // Nächste Frage
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Test abgeschlossen - berechne Ergebnisse
        calculateResults(newAnswers);
      }
    });
  };

  const calculateResults = (
    finalAnswers: { questionId: string; answerId: string }[],
  ) => {
    const scores: { [key: string]: number } = {};
    testData.scoringCategories.forEach((cat) => (scores[cat] = 0));

    finalAnswers.forEach((answer) => {
      const question = testData.questions.find(
        (q) => q.id === answer.questionId,
      );
      const selectedAns = question?.answers.find(
        (a) => a.id === answer.answerId,
      );

      if (selectedAns) {
        Object.keys(selectedAns.score).forEach((category) => {
          scores[category] =
            (scores[category] || 0) + selectedAns.score[category];
        });
      }
    });

    const results: TestResults = {
      testId: testData.testId,
      testName: testData.testName,
      scores,
      percentage: progress,
      answers: finalAnswers,
    };

    // Speichere Fortschritt
    saveEpisodeProgress({
      episodeId: testData.testId,
      completedScenes: [],
      lastPlayedDate: new Date().toISOString(),
      currentScene: 'completed',
      progress: 100,
    });

    onComplete(results);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a0a0a', '#2a0f0f', '#1f0808']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader
          onBackPress={handleBack}
          showBackButton={true}
          subtitleText={testData.testName}
        />

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Frage {currentQuestionIndex + 1} von {testData.questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.questionNumber}>
              Frage {currentQuestionIndex + 1}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {/* Answers */}
            <View style={styles.answersContainer}>
              {currentQuestion.answers.map((answer, index) => (
                <TouchableOpacity
                  key={answer.id}
                  onPress={() => handleAnswerSelect(answer.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      selectedAnswer === answer.id
                        ? ['#ff3131', '#ff914d']
                        : [
                            'rgba(255, 255, 255, 0.1)',
                            'rgba(255, 255, 255, 0.05)',
                          ]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.answerButton,
                      selectedAnswer === answer.id &&
                        styles.answerButtonSelected,
                    ]}
                  >
                    <View style={styles.answerContent}>
                      <View
                        style={[
                          styles.radioCircle,
                          selectedAnswer === answer.id &&
                            styles.radioCircleSelected,
                        ]}
                      >
                        {selectedAnswer === answer.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.answerText,
                          selectedAnswer === answer.id &&
                            styles.answerTextSelected,
                        ]}
                      >
                        {answer.text}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedAnswer}
          activeOpacity={0.8}
          style={styles.nextButtonContainer}
        >
          <LinearGradient
            colors={
              selectedAnswer
                ? ['#ff3131', '#ff914d']
                : ['rgba(100, 100, 100, 0.5)', 'rgba(80, 80, 80, 0.5)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < testData.questions.length - 1
                ? 'Weiter'
                : 'Ergebnis anzeigen'}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ff914d',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  questionCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 145, 77, 0.3)',
  },
  questionNumber: {
    fontSize: 14,
    color: '#ff914d',
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
    lineHeight: 32,
  },
  answersContainer: {
    gap: 15,
  },
  answerButton: {
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  answerButtonSelected: {
    borderColor: '#ff914d',
    elevation: 8,
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#ff914d',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff914d',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  answerTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  nextButtonContainer: {
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#ff3131',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default TestScreen;
