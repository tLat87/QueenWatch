import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, StyleSheet, View, Image } from 'react-native';
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

// Tab icons
const TAB_ICONS = {
  Game: require('./queenwatchsrc/queenwatchphotos/board.png'),
  Statistics: require('./queenwatchsrc/queenwatchphotos/i.png'),
  Rules: require('./queenwatchsrc/queenwatchphotos/pric.png'),
  Info: require('./queenwatchsrc/queenwatchphotos/more.png'),
};

// Tab icons for active state
const TAB_ICONS_ACTIVE = {
  Game: require('./queenwatchsrc/queenwatchphotos/board.png'),
  Statistics: require('./queenwatchsrc/queenwatchphotos/i.png'),
  Rules: require('./queenwatchsrc/queenwatchphotos/pric.png'),
  Info: require('./queenwatchsrc/queenwatchphotos/more.png'),
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Icon Component
const TabIcon = ({ route, focused, size }: { route: any; focused: boolean; size: number }) => {
  const iconSource = focused ? TAB_ICONS_ACTIVE[route.name as keyof typeof TAB_ICONS_ACTIVE] : TAB_ICONS[route.name as keyof typeof TAB_ICONS];
  
  return (
    <View style={[
      styles.tabIconContainer,
      focused ? styles.tabIconContainerActive : styles.tabIconContainerInactive
    ]}>
      <Image
        source={iconSource}
        style={{
          width: size,
          height: size,
          tintColor: focused ? '#FFFFFF' : '#8B5CF6',
        }}
        resizeMode="contain"
      />
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
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Rules" component={RulesScreen} />
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
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      setShowOnboarding(onboardingCompleted !== 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
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
});

export default App;