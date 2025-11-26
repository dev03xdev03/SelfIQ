import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroScreen from '../screens/IntroScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import EpisodeSelectionScreen from '../screens/EpisodeSelectionScreen';
import TestScreen from '../screens/TestScreen';
import ResultScreen from '../screens/ResultScreen';
import PreorderScreen from '../screens/PreorderScreen';
import type { StoryCategory } from '../screens/CategorySelectionScreen';

const Stack = createStackNavigator();

type NavigationState =
  | 'intro'
  | 'categories'
  | 'episodes'
  | 'test'
  | 'results'
  | 'preorder';

interface AppNavigatorProps {
  isLoggedIn: boolean;
  userName: string;
}

const AppNavigator = ({ isLoggedIn, userName }: AppNavigatorProps) => {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    isLoggedIn ? 'categories' : 'intro',
  );
  const [playerName, setPlayerName] = useState<string>(userName || '');
  const [selectedCategory, setSelectedCategory] =
    useState<StoryCategory>('Persönlichkeitstyp');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [testResults, setTestResults] = useState<any>(null);
  const [preorderStoryId, setPreorderStoryId] = useState<string>('');
  const [preorderStoryName, setPreorderStoryName] = useState<string>('');
  const [preorderGradientColors, setPreorderGradientColors] = useState<
    [string, string]
  >(['#5de0e6', '#2dd4bf']);

  const handleStartJourney = (name: string) => {
    setPlayerName(name);
    setNavigationState('categories');
  };

  const handleShowPreorder = (
    storyId: string,
    storyName: string,
    gradientColors: [string, string],
  ) => {
    setPreorderStoryId(storyId);
    setPreorderStoryName(storyName);
    setPreorderGradientColors(gradientColors);
    setNavigationState('preorder');
  };

  const handleClosePreorder = () => {
    setNavigationState('categories');
  };

  const handleCategorySelect = (category: StoryCategory) => {
    setSelectedCategory(category);
    // Direkt zum Test springen - Test-ID basierend auf Kategorie
    const testId =
      category === 'Persönlichkeitstyp'
        ? 'pers_01'
        : category === 'Emotionale Intelligenz'
        ? 'eq_01'
        : category === 'Führungsqualitäten'
        ? 'lead_01'
        : category === 'Stressresistenz'
        ? 'stress_01'
        : category === 'Kommunikationsstil'
        ? 'komm_01'
        : category === 'Beziehungspersönlichkeit'
        ? 'bez_01'
        : category === 'Berufungsfinder'
        ? 'beruf_01'
        : category === 'Kreativitätsindex'
        ? 'krea_01'
        : category === 'Dark Triad'
        ? 'dark_01'
        : category === 'Growth vs Fixed Mindset'
        ? 'mind_01'
        : category === 'Soziale Kompetenz'
        ? 'soz_01'
        : category === 'Entscheidungsmacher'
        ? 'ent_01'
        : category === 'Konfliktlösung'
        ? 'konf_01'
        : 'int_01';
    setSelectedTestId(testId);
    setNavigationState('test');
  };

  const handleTestSelect = (testId: string) => {
    setSelectedTestId(testId);
    setNavigationState('test');
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setNavigationState('results');
  };

  const handleRetakeTest = () => {
    setNavigationState('test');
  };

  const handleBackToCategories = () => {
    setNavigationState('categories');
  };

  const handleBackToIntro = () => {
    setNavigationState('intro');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 0, 1],
                }),
                transform: [
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.5, 1],
                    }),
                  },
                ],
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 2000,
                easing: (t: number) => t * t * (3 - 2 * t), // Smooth easing
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 1000,
              },
            },
          },
        }}
      >
        {navigationState === 'intro' ? (
          <Stack.Screen name="Intro">
            {(props) => <IntroScreen {...props} onStart={handleStartJourney} />}
          </Stack.Screen>
        ) : navigationState === 'categories' ? (
          <Stack.Screen name="CategorySelection">
            {(props) => (
              <CategorySelectionScreen
                {...props}
                playerName={playerName}
                onCategorySelect={handleCategorySelect}
                onBack={handleBackToIntro}
                onShowPreorder={handleShowPreorder}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'preorder' ? (
          <Stack.Screen name="Preorder">
            {(props) => (
              <PreorderScreen
                {...props}
                storyId={preorderStoryId}
                storyName={preorderStoryName}
                gradientColors={preorderGradientColors}
                onClose={handleClosePreorder}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'episodes' ? (
          <Stack.Screen name="EpisodeSelection">
            {(props) => (
              <EpisodeSelectionScreen
                {...props}
                playerName={playerName}
                selectedCategory={selectedCategory}
                onEpisodeSelect={handleTestSelect}
                onBack={handleBackToCategories}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'test' ? (
          <Stack.Screen name="Test">
            {(props) => (
              <TestScreen
                {...props}
                playerName={playerName}
                testId={selectedTestId}
                onBack={handleBackToCategories}
                onComplete={handleTestComplete}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'results' ? (
          <Stack.Screen name="Results">
            {(props) => (
              <ResultScreen
                {...props}
                testResults={testResults}
                playerName={playerName}
                onRetake={handleRetakeTest}
                onBackToMenu={handleBackToCategories}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Story">
            {(props) => (
              <TestScreen
                {...props}
                playerName={playerName}
                testId={selectedTestId}
                onBack={handleBackToCategories}
                onComplete={handleTestComplete}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
