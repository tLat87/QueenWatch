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
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../queenwatchcomponents/Header';

type GameState = 'waiting' | 'playing' | 'result';
type Player = {
  id: string;
  name: string;
  character?: string;
  reactionTime?: number;
};

const PartyGameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [gameState, setGameState] = useState<GameState>('waiting');
  
  // Get players from navigation params or use default
  const routePlayers = (route.params as any)?.players;
  const [players, setPlayers] = useState<Player[]>(
    routePlayers || [
      { id: '1', name: 'Player 1', character: 'fisherman' },
      { id: '2', name: 'Player 2', character: 'frog' },
    ]
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [waitTime, setWaitTime] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStartGame = () => {
    setGameState('playing');
    // Random wait time between 1-5 seconds
    const randomWait = Math.random() * 4000 + 1000;
    setWaitTime(randomWait);
    
    setTimeout(() => {
      setStartTime(Date.now());
      setDisplayTime(0);
      
      // Update display time every millisecond
      intervalRef.current = setInterval(() => {
        setDisplayTime(Date.now() - startTime);
      }, 1);
    }, randomWait);
  };

  const handlePlayerTap = (playerId: string) => {
    if (gameState === 'playing') {
      const endTime = Date.now();
      const reactionTime = endTime - startTime;
      
      // Update player's reaction time
      const updatedPlayers = players.map(player =>
        player.id === playerId ? { ...player, reactionTime } : player
      );
      setPlayers(updatedPlayers);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Save results to storage
      savePartyResults(updatedPlayers);
      
      setGameState('result');
    }
  };

  const savePartyResults = async (playersWithResults: Player[]) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Saving party results for date:', today, 'players:', playersWithResults);
      
      const existingData = await AsyncStorage.getItem('partyResults');
      const results = existingData ? JSON.parse(existingData) : {};
      
      if (!results[today]) {
        results[today] = [];
      }
      
      // Save all players' reaction times
      const reactionTimes = playersWithResults
        .filter(player => player.reactionTime !== undefined)
        .map(player => player.reactionTime!);
      
      results[today].push(...reactionTimes);
      await AsyncStorage.setItem('partyResults', JSON.stringify(results));
      
      console.log('Party results saved successfully:', results);
    } catch (error) {
      console.error('Error saving party results:', error);
      Alert.alert('Error', 'Failed to save party results. Please try again.');
    }
  };

  const handlePlayAgain = () => {
    setGameState('waiting');
    setDisplayTime(0);
    setCurrentPlayerIndex(0);
    // Reset all players' reaction times
    const resetPlayers = players.map(player => ({ ...player, reactionTime: undefined }));
    setPlayers(resetPlayers);
  };

  const handleBackToSetup = () => {
    navigation.goBack();
  };

  const formatTime = (time: number) => {
    return (time / 1000).toFixed(3) + ' sec.';
  };

  const getCharacterEmoji = (characterId?: string) => {
    switch (characterId) {
      case 'fisherman': return '🎣';
      case 'frog': return '🐸';
      case 'pharaoh': return '👑';
      case 'mariachi': return '🎸';
      default: return '👤';
    }
  };

  const getWinner = () => {
    const playersWithTimes = players.filter(p => p.reactionTime !== undefined);
    if (playersWithTimes.length === 0) return null;
    
    return playersWithTimes.reduce((winner, player) => {
      if (!winner || (player.reactionTime && player.reactionTime < winner.reactionTime!)) {
        return player;
      }
      return winner;
    });
  };

  const renderWaitingScreen = () => (
    <View style={styles.content}>
      <Text style={styles.instructionText}>Get ready for the reaction game!</Text>
      <Text style={styles.subInstructionText}>All players should be ready to tap when the square lights up.</Text>
      
      <View style={styles.playersList}>
        {players.map((player) => (
          <View key={player.id} style={styles.playerItem}>
            <Text style={styles.playerEmoji}>{getCharacterEmoji(player.character)}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlayingScreen = () => (
    <View style={styles.playingContent}>
      <Text style={styles.tapInstruction}>TAP NOW!</Text>
      <Text style={styles.timerText}>{formatTime(displayTime)}</Text>
      
      <View style={styles.playersGrid}>
        {players.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={styles.playerButton}
            onPress={() => handlePlayerTap(player.id)}
          >
            <Text style={styles.playerEmojiLarge}>{getCharacterEmoji(player.character)}</Text>
            <Text style={styles.playerNameSmall}>{player.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderResultScreen = () => {
    const winner = getWinner();
    
    return (
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>Game Results</Text>
        
        {winner && (
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerText}>🏆 Winner: {winner.name} 🏆</Text>
            <Text style={styles.winnerTime}>{formatTime(winner.reactionTime!)}</Text>
          </View>
        )}
        
        <View style={styles.resultsList}>
          {players.map((player) => (
            <View key={player.id} style={styles.resultItem}>
              <Text style={styles.resultEmoji}>{getCharacterEmoji(player.character)}</Text>
              <Text style={styles.resultName}>{player.name}</Text>
              <Text style={styles.resultTime}>
                {player.reactionTime ? formatTime(player.reactionTime) : 'No tap'}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.resultButtons}>
          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToSetup}>
            <Text style={styles.backButtonText}>Back to Setup</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (gameState) {
      case 'waiting':
        return renderWaitingScreen();
      case 'playing':
        return renderPlayingScreen();
      case 'result':
        return renderResultScreen();
      default:
        return renderWaitingScreen();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header showBackButton={true} />

      {/* Game Title */}
      <Text style={styles.gameTitle}>Party Game</Text>

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
  playersList: {
    width: '100%',
    marginBottom: 30,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 10,
  },
  playerEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  playerName: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
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
  tapInstruction: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  playerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  playerEmojiLarge: {
    fontSize: 40,
    marginBottom: 10,
  },
  playerNameSmall: {
    fontSize: 14,
    color: '#000000',
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
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  winnerContainer: {
    backgroundColor: '#F59E0B',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  winnerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  winnerTime: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsList: {
    marginBottom: 30,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  resultEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  resultName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playAgainButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 0.45,
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 0.45,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PartyGameScreen;
