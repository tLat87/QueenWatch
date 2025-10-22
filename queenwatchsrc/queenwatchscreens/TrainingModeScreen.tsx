import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../queenwatchcomponents/Header';

const { width, height } = Dimensions.get('window');

type TrainingType = 'focus' | 'speed' | 'endurance' | 'precision';
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface TrainingSession {
  type: TrainingType;
  difficulty: Difficulty;
  score: number;
  timeSpent: number;
  date: string;
}

const TrainingModeScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<TrainingType>('focus');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingScore, setTrainingScore] = useState(0);
  const [trainingTime, setTrainingTime] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [trainingHistory, setTrainingHistory] = useState<TrainingSession[]>([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadTrainingHistory();
  }, []);

  const loadTrainingHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('trainingHistory');
      if (history) {
        setTrainingHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading training history:', error);
    }
  };

  const saveTrainingSession = async (session: TrainingSession) => {
    try {
      const newHistory = [...trainingHistory, session];
      setTrainingHistory(newHistory);
      await AsyncStorage.setItem('trainingHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving training session:', error);
    }
  };

  const getTrainingDescription = (type: TrainingType) => {
    const descriptions = {
      focus: 'Improve your concentration and attention span with focused reaction exercises.',
      speed: 'Train for lightning-fast reflexes with rapid-fire challenges.',
      endurance: 'Build stamina for sustained high-performance reaction times.',
      precision: 'Develop accuracy and consistency in your reaction timing.',
    };
    return descriptions[type];
  };

  const getDifficultyMultiplier = (difficulty: Difficulty) => {
    const multipliers = {
      beginner: 1,
      intermediate: 1.5,
      advanced: 2,
      expert: 3,
    };
    return multipliers[difficulty];
  };

  const startTraining = () => {
    setIsTraining(true);
    setTrainingScore(0);
    setTrainingTime(0);
    setShowResults(false);
    
    // Animate the start
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate training session
    simulateTraining();
  };

  const simulateTraining = () => {
    const duration = 30000; // 30 seconds
    const interval = 1000; // Update every second
    let timeLeft = duration / 1000;
    
    const timer = setInterval(() => {
      timeLeft--;
      setTrainingTime((duration / 1000) - timeLeft);
      
      // Random score increase
      if (Math.random() > 0.3) {
        setTrainingScore(prev => prev + Math.floor(Math.random() * 10) + 1);
      }
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        finishTraining();
      }
    }, interval);
  };

  const finishTraining = () => {
    setIsTraining(false);
    setShowResults(true);
    
    const session: TrainingSession = {
      type: selectedType,
      difficulty: selectedDifficulty,
      score: trainingScore,
      timeSpent: trainingTime,
      date: new Date().toISOString(),
    };
    
    saveTrainingSession(session);
    
    // Animate results
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const resetTraining = () => {
    setShowResults(false);
    setTrainingScore(0);
    setTrainingTime(0);
    fadeAnim.setValue(1);
  };

  const getTrainingTypeIcon = (type: TrainingType) => {
    const icons = {
      focus: '🎯',
      speed: '⚡',
      endurance: '💪',
      precision: '🎪',
    };
    return icons[type];
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      beginner: '#10B981',
      intermediate: '#F59E0B',
      advanced: '#EF4444',
      expert: '#8B5CF6',
    };
    return colors[difficulty];
  };

  const renderTrainingTypes = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Training Types</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesContainer}>
        {(['focus', 'speed', 'endurance', 'precision'] as TrainingType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeCard,
              selectedType === type && styles.selectedTypeCard,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.typeIcon}>{getTrainingTypeIcon(type)}</Text>
            <Text style={[
              styles.typeTitle,
              selectedType === type && styles.selectedTypeTitle,
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
            <Text style={styles.typeDescription}>
              {getTrainingDescription(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDifficultySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Difficulty Level</Text>
      <View style={styles.difficultyContainer}>
        {(['beginner', 'intermediate', 'advanced', 'expert'] as Difficulty[]).map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.difficultyButton,
              { borderColor: getDifficultyColor(difficulty) },
              selectedDifficulty === difficulty && {
                backgroundColor: getDifficultyColor(difficulty),
              },
            ]}
            onPress={() => setSelectedDifficulty(difficulty)}
          >
            <Text style={[
              styles.difficultyText,
              selectedDifficulty === difficulty && styles.selectedDifficultyText,
            ]}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTrainingSession = () => (
    <View style={styles.trainingContainer}>
      <Text style={styles.trainingTitle}>
        {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Training
      </Text>
      <Text style={styles.trainingSubtitle}>
        {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Level
      </Text>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{trainingScore}</Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Time</Text>
        <Text style={styles.timeValue}>{trainingTime}s</Text>
      </View>
      
      <Animated.View style={[styles.progressBar, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.progressFill, { width: `${(trainingTime / 30) * 100}%` }]} />
      </Animated.View>
    </View>
  );

  const renderResults = () => (
    <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
      <Text style={styles.resultsTitle}>Training Complete!</Text>
      <View style={styles.resultsStats}>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Final Score</Text>
          <Text style={styles.resultValue}>{trainingScore}</Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Time</Text>
          <Text style={styles.resultValue}>{trainingTime}s</Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Type</Text>
          <Text style={styles.resultValue}>
            {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.resultsActions}>
        <TouchableOpacity style={styles.retryButton} onPress={resetTraining}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderTrainingHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
        {trainingHistory.slice(-5).reverse().map((session, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyType}>
                {getTrainingTypeIcon(session.type)} {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
              </Text>
              <Text style={styles.historyDate}>
                {new Date(session.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.historyStats}>
              <Text style={styles.historyScore}>Score: {session.score}</Text>
              <Text style={styles.historyTime}>Time: {session.timeSpent}s</Text>
              <Text style={[styles.historyDifficulty, { color: getDifficultyColor(session.difficulty) }]}>
                {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
              </Text>
            </View>
          </View>
        ))}
        {trainingHistory.length === 0 && (
          <Text style={styles.noHistoryText}>No training sessions yet. Start your first training!</Text>
        )}
      </ScrollView>
    </View>
  );

  if (isTraining) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Header />
        {renderTrainingSession()}
      </SafeAreaView>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Header />
        {renderResults()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTrainingTypes()}
        {renderDifficultySelector()}
        
        <View style={styles.startContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startTraining}>
            <Text style={styles.startButtonText}>Start Training</Text>
          </TouchableOpacity>
        </View>
        
        {renderTrainingHistory()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  typesContainer: {
    marginBottom: 10,
  },
  typeCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 200,
    alignItems: 'center',
  },
  selectedTypeCard: {
    backgroundColor: '#8B5CF6',
  },
  typeIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  selectedTypeTitle: {
    color: '#FFFFFF',
  },
  typeDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedDifficultyText: {
    color: '#FFFFFF',
  },
  startContainer: {
    alignItems: 'center',
    marginVertical: 30,
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
    fontWeight: 'bold',
  },
  trainingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  trainingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  trainingSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timeLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  resultsActions: {
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    maxHeight: 200,
  },
  historyItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyScore: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyDifficulty: {
    fontSize: 14,
    fontWeight: '600',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TrainingModeScreen;
