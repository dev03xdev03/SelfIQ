import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IntroScreen from '../screens/IntroScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import EpisodeSelectionScreen from '../screens/EpisodeSelectionScreen';
import StoryScreen from '../screens/StoryScreen';
import PreorderScreen from '../screens/PreorderScreen';
import type { StoryCategory } from '../screens/CategorySelectionScreen';

const Stack = createStackNavigator();

type NavigationState =
  | 'intro'
  | 'categories'
  | 'episodes'
  | 'story'
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
    useState<StoryCategory>('Albtraum');
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>('');
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
    // Direkt zur Story springen - Episode-ID basierend auf Kategorie
    const episodeId =
      category === 'Albtraum'
        ? 'alb_01'
        : category === 'Mystery'
        ? 'mys_01'
        : category === 'Fantasy'
        ? 'fan_01'
        : category === 'Horror'
        ? 'hor_01'
        : category === 'Thriller'
        ? 'thr_01'
        : category === 'Romance'
        ? 'rom_01'
        : category === 'Sci-Fi'
        ? 'sci_01'
        : category === 'Adventure'
        ? 'adv_01'
        : category === 'Dark Fantasy'
        ? 'daf_01'
        : category === 'Psycho'
        ? 'psy_01'
        : category === 'Comedy'
        ? 'com_01'
        : category === 'Drama'
        ? 'dra_01'
        : category === 'Crime'
        ? 'cri_01'
        : 'sup_01';
    setSelectedEpisodeId(episodeId);
    setNavigationState('story');
  };

  const handleEpisodeSelect = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    setNavigationState('story');
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
                onEpisodeSelect={handleEpisodeSelect}
                onBack={handleBackToCategories}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Story">
            {(props) => (
              <StoryScreen
                {...props}
                playerName={playerName}
                episodeId={selectedEpisodeId}
                onBack={handleBackToCategories}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
