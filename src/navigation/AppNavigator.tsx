import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EinstiegsBildschirm from '../bildschirme/EinstiegsBildschirm';
import NamenEingabeBildschirm from '../bildschirme/NamenEingabeBildschirm';
import HauptmenueBildschirm from '../bildschirme/HauptmenueBildschirm';
import KategorieUebersichtBildschirm from '../bildschirme/KategorieUebersichtBildschirm';
import KategorieAuswahlBildschirm from '../bildschirme/KategorieAuswahlBildschirm';
import TestBildschirm from '../bildschirme/TestBildschirm';
import ErgebnisBildschirm from '../bildschirme/ErgebnisBildschirm';
import InfoBildschirm from '../bildschirme/InfoBildschirm';
import GuestExpirationModal from '../components/GuestExpirationModal';
import { getSubscriptionInfo } from '../hilfsmittel/abonnementSpeicher';
import { checkGuestExpiration } from '../dienste/authentifizierungDienst';
import { signInWithApple } from '../dienste/appleAuthDienst';

const Stack = createStackNavigator();

type NavigationState =
  | 'intro'
  | 'nameinput'
  | 'mainmenu'
  | 'categoryoverview'
  | 'categories'
  | 'test'
  | 'results'
  | 'info';

interface AppNavigatorProps {
  isLoggedIn: boolean;
  userName: string;
}

const AppNavigator = ({ isLoggedIn, userName }: AppNavigatorProps) => {
  const [navigationState, setNavigationState] = useState<NavigationState>(
    isLoggedIn ? 'categoryoverview' : 'intro',
  );
  const [playerName, setPlayerName] = useState<string>(userName || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [selectedTestName, setSelectedTestName] = useState<string>('');
  const [selectedTestGradient, setSelectedTestGradient] = useState<
    [string, string]
  >(['#ff3131', '#ff914d']);
  const [testResults, setTestResults] = useState<any>(null);
  const [showGuestExpirationModal, setShowGuestExpirationModal] =
    useState(false);

  // Check für Gast-Expiration beim Start und bei Screen-Wechseln
  useEffect(() => {
    const checkExpiration = async () => {
      try {
        // Hole User ID aus AsyncStorage
        const userDataString = await AsyncStorage.getItem('@selfiq_user');
        if (!userDataString) return;

        const userData = JSON.parse(userDataString);

        // Prüfe nur wenn User ein Gast ist
        if (userData.id && userData.id.startsWith('guest_')) {
          const isExpired = await checkGuestExpiration(userData.id);
          if (isExpired) {
            setShowGuestExpirationModal(true);
          }
        }
      } catch (error) {
        console.error('[AppNavigator] Error checking guest expiration:', error);
      }
    };

    checkExpiration();
    // Prüfe alle 5 Minuten
    const interval = setInterval(checkExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [navigationState]);

  const handleStartJourney = (name: string) => {
    console.log('[AppNavigator] handleStartJourney called with name:', name);
    if (name === '') {
      // Gast ohne Namen - zeige Namenseingabe
      console.log('[AppNavigator] Navigating to nameinput');
      setNavigationState('nameinput');
    } else {
      console.log(
        '[AppNavigator] Navigating to categoryoverview with name:',
        name,
      );
      setPlayerName(name);
      setNavigationState('categoryoverview');
    }
  };

  const handleNameInputComplete = (name: string) => {
    console.log(
      '[AppNavigator] handleNameInputComplete called with name:',
      name,
    );
    setPlayerName(name || 'Gast');
    setNavigationState('categoryoverview');
  };

  const handleCategoryOverviewSelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setNavigationState('categories');
  };

  const handleCategorySelect = (
    testId: string,
    testName: string,
    gradientColors: [string, string],
  ) => {
    setSelectedTestId(testId);
    setSelectedTestName(testName);
    setSelectedTestGradient(gradientColors);
    setNavigationState('test');
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setNavigationState('results');
  };

  const handleStartTest = () => {
    setNavigationState('test');
  };

  const handleShowInfo = () => {
    setNavigationState('info');
  };

  const handleMainMenuNavigate = (
    screen: 'categoryoverview' | 'info' | 'results',
  ) => {
    setNavigationState(screen);
  };

  const handleCloseInfo = () => {
    setNavigationState('mainmenu');
  };

  const handleBackToCategories = () => {
    setNavigationState('categoryoverview');
  };

  const handleBackToCategoryOverview = () => {
    setNavigationState('categoryoverview');
  };

  const handleBackToIntro = () => {
    setNavigationState('intro');
  };

  const handleSignInWithApple = async () => {
    try {
      const result = await signInWithApple();
      if (result.user) {
        setShowGuestExpirationModal(false);
        // Optional: Navigiere zu Hauptmenü oder reload
        setNavigationState('categoryoverview');
      }
    } catch (error) {
      console.error('[AppNavigator] Apple Sign-In failed:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: ({ current, next }) => {
            return {
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: next
                      ? next.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.95],
                        })
                      : 1,
                  },
                ],
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              },
            },
          },
        }}
      >
        {navigationState === 'intro' ? (
          <Stack.Screen name="Intro">
            {(props) => (
              <EinstiegsBildschirm
                {...props}
                onStart={handleStartJourney}
                onShowInfo={handleShowInfo}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'nameinput' ? (
          <Stack.Screen name="NameInput">
            {(props) => (
              <NamenEingabeBildschirm
                {...props}
                onComplete={handleNameInputComplete}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'mainmenu' ? (
          <Stack.Screen name="MainMenu">
            {(props) => (
              <HauptmenueBildschirm
                {...props}
                playerName={playerName}
                onNavigate={handleMainMenuNavigate}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'categoryoverview' ? (
          <Stack.Screen name="CategoryOverview">
            {(props) => (
              <KategorieUebersichtBildschirm
                {...props}
                playerName={playerName}
                onCategorySelect={handleCategoryOverviewSelect}
                onBack={handleBackToIntro}
                onShowInfo={handleShowInfo}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'categories' ? (
          <Stack.Screen name="CategorySelection">
            {(props) => (
              <KategorieAuswahlBildschirm
                {...props}
                playerName={playerName}
                categoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
                onBack={handleBackToCategoryOverview}
                onShowInfo={handleShowInfo}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'test' ? (
          <Stack.Screen name="Test">
            {(props) => (
              <TestBildschirm
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
              <ErgebnisBildschirm
                {...props}
                testResults={testResults}
                playerName={playerName}
                onRetake={() => {
                  setNavigationState('test');
                }}
                onBackToMenu={handleBackToCategories}
              />
            )}
          </Stack.Screen>
        ) : navigationState === 'info' ? (
          <Stack.Screen name="Info">
            {(props) => <InfoBildschirm {...props} onClose={handleCloseInfo} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Story">
            {(props) => (
              <TestBildschirm
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

      {/* Guest Expiration Modal */}
      <GuestExpirationModal
        visible={showGuestExpirationModal}
        onSignInWithApple={handleSignInWithApple}
        onClose={() => setShowGuestExpirationModal(false)}
      />
    </NavigationContainer>
  );
};

export default AppNavigator;
