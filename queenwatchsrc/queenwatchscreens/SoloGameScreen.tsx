import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../queenwatchcomponents/Header';

type GameState = 'start' | 'instructions' | 'waiting' | 'playing' | 'result';

const SoloGameScreen = () => {
  const navigation = useNavigation();
  const [gameState, setGameState] = useState<GameState>('start');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [waitTime, setWaitTime] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    setGameState('instructions');
  };

  const handleStartGame = () => {
    setGameState('waiting');
    // Random wait time between 1-5 seconds
    const randomWait = Math.random() * 4000 + 1000;
    setWaitTime(randomWait);
    
    setTimeout(() => {
      setGameState('playing');
      setStartTime(Date.now());
      setDisplayTime(0);
      
      // Update display time every millisecond
      intervalRef.current = setInterval(() => {
        setDisplayTime(Date.now() - startTime);
      }, 1);
    }, randomWait);
  };

  const handleTap = () => {
    if (gameState === 'playing') {
      const endTime = Date.now();
      const finalTime = endTime - startTime;
      setReactionTime(finalTime);
      setGameState('result');
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Save result to storage
      saveResult(finalTime);
    }
  };

  const saveResult = async (time: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Saving result for date:', today, 'time:', time);
      
      const existingData = await AsyncStorage.getItem('soloResults');
      const results = existingData ? JSON.parse(existingData) : {};
      
      if (!results[today]) {
        results[today] = [];
      }
      
      results[today].push(time);
      await AsyncStorage.setItem('soloResults', JSON.stringify(results));
      
      console.log('Result saved successfully:', results);
    } catch (error) {
      console.error('Error saving result:', error);
      Alert.alert('Error', 'Failed to save result. Please try again.');
    }
  };

  const handlePlayAgain = () => {
    setGameState('start');
    setReactionTime(0);
    setDisplayTime(0);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert('Share', `My reaction time: ${(reactionTime / 1000).toFixed(3)} seconds!`);
  };

  const formatTime = (time: number) => {
    return (time / 1000).toFixed(3) + ' sec.';
  };

  const renderStartScreen = () => (
    <View style={styles.content}>
      <Text style={styles.instructionText}>Press the button to start.</Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInstructionsScreen = () => (
    <View style={styles.content}>
      <Text style={styles.instructionText}>Wait until the green light turns on.</Text>
      <Text style={styles.subInstructionText}>You will need to press as quickly as possible.</Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>Ready</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWaitingScreen = () => (
    <View style={styles.content}>
      <Text style={styles.instructionText}>Get ready...</Text>
      <Text style={styles.subInstructionText}>Wait for the green light!</Text>
    </View>
  );

  const renderPlayingScreen = () => (
    <View style={styles.playingContent}>
      <TouchableOpacity style={styles.reactionButton} onPress={handleTap}>
        <Text style={styles.reactionButtonText}>H</Text>
      </TouchableOpacity>
      <Text style={styles.timerText}>{formatTime(displayTime)}</Text>
      <Text style={styles.tapInstruction}>Click the button!!!</Text>
    </View>
  );

  const renderResultScreen = () => (
    <View style={styles.resultContent}>
      <Text style={styles.resultLabel}>Your result:</Text>
      <Text style={styles.resultTime}>{formatTime(reactionTime)}</Text>
      <View style={styles.resultButtons}>
        <TouchableOpacity style={styles.shareResultButton} onPress={handleShare}>
          <Text style={styles.shareResultButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.playAgainButtonText}>Play again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return renderStartScreen();
      case 'instructions':
        return renderInstructionsScreen();
      case 'waiting':
        return renderWaitingScreen();
      case 'playing':
        return renderPlayingScreen();
      case 'result':
        return renderResultScreen();
      default:
        return renderStartScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header showBackButton={true} />

      {/* Game Title */}
      <Text style={styles.gameTitle}>Solo Mode</Text>

      {/* Content */}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  subInstructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  playingContent: {
    flex: 1,
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  reactionButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tapInstruction: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContent: {
    flex: 1,
    backgroundColor: '#6B46C1',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 30,
    justifyContent: 'center',
  },
  resultLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  resultTime: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareResultButton: {
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 0.45,
  },
  shareResultButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#6B46C1',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 0.45,
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SoloGameScreen;

