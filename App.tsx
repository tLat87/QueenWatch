import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, StyleSheet, View, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import OnboardingScreen from './queenwatchsrc/queenwatchscreens/OnboardingScreen';
import MainMenuScreen from './queenwatchsrc/queenwatchscreens/MainMenuScreen';
import SoloGameScreen from './queenwatchsrc/queenwatchscreens/SoloGameScreen';
import PartyModeScreen from './queenwatchsrc/queenwatchscreens/PartyModeScreen';
import PartyGameScreen from './queenwatchsrc/queenwatchscreens/PartyGameScreen';
import StatisticsScreen from './queenwatchsrc/queenwatchscreens/StatisticsScreen';
import RulesScreen from './queenwatchsrc/queenwatchscreens/RulesScreen';
import InfoScreen from './queenwatchsrc/queenwatchscreens/InfoScreen';
import TrainingModeScreen from './queenwatchsrc/queenwatchscreens/TrainingModeScreen';
import AchievementsScreen from './queenwatchsrc/queenwatchscreens/AchievementsScreen';
import DailyChallengesScreen from './queenwatchsrc/queenwatchscreens/DailyChallengesScreen';
import SettingsScreen from './queenwatchsrc/queenwatchscreens/SettingsScreen';
import HelpScreen from './queenwatchsrc/queenwatchscreens/HelpScreen';

// Tab icons with emojis
const TAB_ICONS = {
  Game: '🎮',
  Training: '💪',
  Challenges: '🏆',
  Settings: '⚙️',
  Help: '❓',
  Statistics: '📊',
  Info: 'ℹ️',
};

// Tab icons for active state (same emojis)
const TAB_ICONS_ACTIVE = {
  Game: '🎮',
  Training: '💪',
  Challenges: '🏆',
  Settings: '⚙️',
  Help: '❓',
  Statistics: '📊',
  Info: 'ℹ️',
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Icon Component
const TabIcon = ({ route, focused, size }: { route: any; focused: boolean; size: number }) => {
  const iconEmoji = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
  
  return (
    <View style={[
      styles.tabIconContainer,
      focused ? styles.tabIconContainerActive : styles.tabIconContainerInactive
    ]}>
      <Text style={styles.tabIconEmoji}>
        {iconEmoji}
      </Text>
    </View>
  );
};

// Main Stack Navigator for game flows
function GameStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="SoloGame" component={SoloGameScreen} />
      <Stack.Screen name="PartyMode" component={PartyModeScreen} />
      <Stack.Screen name="PartyGame" component={PartyGameScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => (
          <TabIcon route={route} focused={focused} size={size} />
        ),
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#E5E7EB',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          marginTop: -10,
          paddingHorizontal: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Game" component={GameStack} />
      <Tab.Screen name="Training" component={TrainingModeScreen} />
      <Tab.Screen name="Challenges" component={DailyChallengesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Info" component={InfoScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    // Always show onboarding
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    // Don't save to AsyncStorage - always show onboarding
    setShowOnboarding(false);
  };

  if (showOnboarding === null) {
    // Loading state
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CA3AF',
  },
  tabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: '#8B5CF6',
  },
  tabIconContainerInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  tabIconEmoji: {
    fontSize: 24,
  },
});

export default App;