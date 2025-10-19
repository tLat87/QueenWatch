import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

type OnboardingStep = 1 | 2 | 3;

// Пути к фоновым изображениям для каждого шага
// Вариант 1: URL изображений
const BACKGROUND_IMAGES = {
  step1: require('../queenwatchphotos/first/1.png'), // Замените на URL или путь к вашей картинке для шага 1
  step2: require('../queenwatchphotos/first/2.png'), // Замените на URL или путь к вашей картинке для шага 2
  step3: require('../queenwatchphotos/first/3.png'), // Замените на URL или путь к вашей картинке для шага 3
};

// Вариант 2: Локальные изображения (раскомментируйте и используйте вместо BACKGROUND_IMAGES выше)
// const BACKGROUND_IMAGES = {
//   step1: require('../assets/images/onboarding-step1.png'),
//   step2: require('../assets/images/onboarding-step2.png'),
//   step3: require('../assets/images/onboarding-step3.png'),
// };

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      onComplete();
    }
  };

  const renderStep1 = () => (
    <ImageBackground 
      source={typeof BACKGROUND_IMAGES.step1 === 'string' ? { uri: BACKGROUND_IMAGES.step1 } : BACKGROUND_IMAGES.step1}
      style={styles.stepContainer}
      resizeMode="cover"
    >

      <View style={styles.illustrationContainer}>
        
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Tap when the square lights up — but only when it does!</Text>
        <Text style={styles.description}>Every millisecond counts, prove your lightning-fast reflex.</Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const renderStep2 = () => (
    <ImageBackground 
      source={typeof BACKGROUND_IMAGES.step2 === 'string' ? { uri: BACKGROUND_IMAGES.step2 } : BACKGROUND_IMAGES.step2}
      style={styles.stepContainer}
      resizeMode="cover"
    >
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
       
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Challenge yourself or duel your friends.</Text>
        <Text style={styles.description}>Who reacts faster wins the crown!</Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Okay</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const renderStep3 = () => (
    <ImageBackground 
      source={typeof BACKGROUND_IMAGES.step3 === 'string' ? { uri: BACKGROUND_IMAGES.step3 } : BACKGROUND_IMAGES.step3}
      style={styles.stepContainer}
      resizeMode="cover"
    >
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>View your best scores, history, and victories.</Text>
        <Text style={styles.description}>Train your reflex, climb the QueenWatch ranks!</Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D1B69" />
      
      
      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B69',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    // margin: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
  },
  
  // Step 1 styles
  handContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hand: {
  
  },
  finger: {

  },
  lightningSquare: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: '#8B5CF6',
    borderRadius: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  lightning1: {
    position: 'absolute',
    top: -20,
    left: -10,
    width: 4,
    height: 30,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '45deg' }],
  },
  lightning2: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 4,
    height: 25,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '-45deg' }],
  },
  lightning3: {
    position: 'absolute',
    bottom: -20,
    left: 20,
    width: 4,
    height: 35,
    backgroundColor: '#A855F7',
    transform: [{ rotate: '30deg' }],
  },
  
  // Step 2 styles
  phonesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crown: {
    position: 'absolute',
    top: -40,
    zIndex: 10,
  },
  crownText: {
    fontSize: 40,
  },
  phoneLeft: {
    position: 'relative',
    marginRight: 20,
  },
  phoneRight: {
    position: 'relative',
  },
  phoneScreen: {
    width: 80,
    height: 120,
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneSquare: {
    width: 40,
    height: 40,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  phoneHand: {
    position: 'absolute',
    bottom: -30,
    right: -10,
    width: 20,
    height: 30,
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
  },
  
  // Step 3 styles
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbon: {
    width: 40,
    height: 40,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  phoneCenter: {
    position: 'relative',
  },
  chartContainer: {
    width: 60,
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chartBar1: {
    width: 8,
    height: 20,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 2,
  },
  chartBar2: {
    width: 8,
    height: 35,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 2,
  },
  chartBar3: {
    width: 8,
    height: 50,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 2,
  },
  chartLine: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#10B981',
  },
  crownRight: {
    marginLeft: 20,
  },
});

export default OnboardingScreen;
