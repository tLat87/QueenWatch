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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../queenwatchcomponents/Header';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'speed' | 'accuracy' | 'endurance' | 'streak' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
  requirement: {
    value: number;
    unit: string;
  };
  current: number;
  completed: boolean;
  completedAt?: string;
  expiresAt: string;
  icon: string;
}

const DailyChallengesScreen = () => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'challenges' | 'achievements'>('challenges');

  useEffect(() => {
    generateDailyChallenges();
    loadUserProgress();
  }, []);

  const generateDailyChallenges = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const challengeTemplates = [
      {
        id: 'speed_demon_daily',
        title: 'Speed Demon',
        description: 'Achieve 5 reaction times under 300ms',
        type: 'speed' as const,
        difficulty: 'medium' as const,
        reward: { points: 50, badge: '⚡' },
        requirement: { value: 5, unit: 'fast reactions' },
        icon: '⚡',
      },
      {
        id: 'precision_master_daily',
        title: 'Precision Master',
        description: 'Complete 3 training sessions with 85%+ accuracy',
        type: 'accuracy' as const,
        difficulty: 'hard' as const,
        reward: { points: 75, badge: '🎯' },
        requirement: { value: 3, unit: 'accurate sessions' },
        icon: '🎯',
      },
      {
        id: 'endurance_warrior_daily',
        title: 'Endurance Warrior',
        description: 'Train for 15 minutes total',
        type: 'endurance' as const,
        difficulty: 'medium' as const,
        reward: { points: 60, badge: '💪' },
        requirement: { value: 15, unit: 'minutes' },
        icon: '💪',
      },
      {
        id: 'streak_keeper_daily',
        title: 'Streak Keeper',
        description: 'Maintain your training streak',
        type: 'streak' as const,
        difficulty: 'easy' as const,
        reward: { points: 25, badge: '🔥' },
        requirement: { value: 1, unit: 'day' },
        icon: '🔥',
      },
      {
        id: 'night_owl_daily',
        title: 'Night Owl',
        description: 'Train between 10 PM and 2 AM',
        type: 'special' as const,
        difficulty: 'hard' as const,
        reward: { points: 100, badge: '🦉', title: 'Night Owl' },
        requirement: { value: 1, unit: 'session' },
        icon: '🦉',
      },
      {
        id: 'early_bird_daily',
        title: 'Early Bird',
        description: 'Train between 5 AM and 8 AM',
        type: 'special' as const,
        difficulty: 'hard' as const,
        reward: { points: 100, badge: '🐦', title: 'Early Bird' },
        requirement: { value: 1, unit: 'session' },
        icon: '🐦',
      },
      {
        id: 'perfectionist_daily',
        title: 'Perfectionist',
        description: 'Achieve 100% accuracy in any training mode',
        type: 'accuracy' as const,
        difficulty: 'expert' as const,
        reward: { points: 150, badge: '💎', title: 'Perfectionist' },
        requirement: { value: 1, unit: 'perfect session' },
        icon: '💎',
      },
      {
        id: 'social_butterfly_daily',
        title: 'Social Butterfly',
        description: 'Share your results 3 times',
        type: 'special' as const,
        difficulty: 'easy' as const,
        reward: { points: 30, badge: '🦋' },
        requirement: { value: 3, unit: 'shares' },
        icon: '🦋',
      },
    ];

    // Select 3-4 random challenges for today
    const shuffled = challengeTemplates.sort(() => 0.5 - Math.random());
    const selectedChallenges = shuffled.slice(0, 4).map(template => ({
      ...template,
      current: 0,
      completed: false,
      expiresAt: tomorrow.toISOString(),
    }));

    setChallenges(selectedChallenges);
  };

  const loadUserProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedChallenges = await AsyncStorage.getItem(`dailyChallenges_${today}`);
      const userStreak = await AsyncStorage.getItem('dailyStreak') || '0';
      const userPoints = await AsyncStorage.getItem('totalPoints') || '0';
      const lastCompleted = await AsyncStorage.getItem('lastCompletedDate') || '';

      setStreak(parseInt(userStreak));
      setTotalPoints(parseInt(userPoints));
      setLastCompletedDate(lastCompleted);

      if (savedChallenges) {
        const parsedChallenges = JSON.parse(savedChallenges);
        setChallenges(parsedChallenges);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const saveUserProgress = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(challenges));
      await AsyncStorage.setItem('dailyStreak', streak.toString());
      await AsyncStorage.setItem('totalPoints', totalPoints.toString());
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  };

  const updateChallengeProgress = async (challengeId: string, increment: number = 1) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        const newCurrent = challenge.current + increment;
        const isCompleted = newCurrent >= challenge.requirement.value;
        
        if (isCompleted && !challenge.completed) {
          // Challenge just completed
          const newPoints = totalPoints + challenge.reward.points;
          setTotalPoints(newPoints);
          
          Alert.alert(
            'Challenge Completed! 🎉',
            `You earned ${challenge.reward.points} points!`,
            [{ text: 'Awesome!', style: 'default' }]
          );
          
          return {
            ...challenge,
            current: newCurrent,
            completed: true,
            completedAt: new Date().toISOString(),
          };
        }
        
        return {
          ...challenge,
          current: newCurrent,
        };
      }
      return challenge;
    });
    
    setChallenges(updatedChallenges);
    await saveUserProgress();
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#10B981',
      medium: '#F59E0B',
      hard: '#EF4444',
      expert: '#8B5CF6',
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      speed: '⚡',
      accuracy: '🎯',
      endurance: '💪',
      streak: '🔥',
      special: '⭐',
    };
    return icons[type as keyof typeof icons];
  };

  const getProgressPercentage = (challenge: DailyChallenge) => {
    return Math.min((challenge.current / challenge.requirement.value) * 100, 100);
  };

  const getTimeUntilExpiry = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const completedToday = challenges.filter(c => c.completed).length;
  const totalToday = challenges.length;

  const renderChallengeCard = (challenge: DailyChallenge) => {
    const progress = getProgressPercentage(challenge);
    const isExpired = new Date(challenge.expiresAt) < new Date();
    
    return (
      <View
        key={challenge.id}
        style={[
          styles.challengeCard,
          challenge.completed && styles.completedCard,
          isExpired && !challenge.completed && styles.expiredCard,
        ]}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeIconContainer}>
            <Text style={styles.challengeIcon}>{challenge.icon}</Text>
          </View>
          <View style={styles.challengeInfo}>
            <Text style={[
              styles.challengeTitle,
              challenge.completed && styles.completedTitle,
            ]}>
              {challenge.title}
            </Text>
            <Text style={styles.challengeDescription}>
              {challenge.description}
            </Text>
          </View>
          <View style={styles.challengeReward}>
            <Text style={styles.rewardPoints}>+{challenge.reward.points}</Text>
            {challenge.reward.badge && (
              <Text style={styles.rewardBadge}>{challenge.reward.badge}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.challengeProgress}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { 
                width: `${progress}%`,
                backgroundColor: challenge.completed ? '#10B981' : getDifficultyColor(challenge.difficulty),
              },
            ]} />
          </View>
          <Text style={styles.progressText}>
            {challenge.current}/{challenge.requirement.value} {challenge.requirement.unit}
          </Text>
        </View>
        
        <View style={styles.challengeFooter}>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(challenge.difficulty) },
          ]}>
            <Text style={styles.difficultyText}>
              {challenge.difficulty.toUpperCase()}
            </Text>
          </View>
          {challenge.completed && (
            <Text style={styles.completedText}>✅ Completed</Text>
          )}
          {isExpired && !challenge.completed && (
            <Text style={styles.expiredText}>⏰ Expired</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'challenges' && styles.activeTabButton]}
            onPress={() => setActiveTab('challenges')}
          >
            <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
              🏆 Challenges
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'achievements' && styles.activeTabButton]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              🏅 Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'challenges' ? (
          <>
            {/* Header Stats */}
            <View style={styles.headerStats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedToday}/{totalToday}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>
        
        {/* Time Remaining */}
        <View style={styles.timeRemaining}>
          <Text style={styles.timeRemainingText}>
            ⏰ {getTimeUntilExpiry()} until reset
          </Text>
        </View>
        
        {/* Daily Challenges */}
        <View style={styles.challengesSection}>
          <Text style={styles.sectionTitle}>Today's Challenges</Text>
          {challenges.map(renderChallengeCard)}
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // Simulate completing a challenge
              const incompleteChallenges = challenges.filter(c => !c.completed);
              if (incompleteChallenges.length > 0) {
                const randomChallenge = incompleteChallenges[Math.floor(Math.random() * incompleteChallenges.length)];
                updateChallengeProgress(randomChallenge.id, 1);
              }
            }}
          >
            <Text style={styles.actionButtonText}>🎮 Start Training</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              Alert.alert(
                'Share Progress',
                `I've completed ${completedToday}/${totalToday} daily challenges and have a ${streak} day streak! 🎉`,
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>📤 Share Progress</Text>
          </TouchableOpacity>
        </View>
          </>
        ) : (
          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>🏅 Your Achievements</Text>
            <View style={styles.achievementsGrid}>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>⚡</Text>
                <Text style={styles.achievementTitle}>Lightning Fast</Text>
                <Text style={styles.achievementDesc}>Achieve reaction time under 200ms</Text>
              </View>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>🎯</Text>
                <Text style={styles.achievementTitle}>Precision Master</Text>
                <Text style={styles.achievementDesc}>Complete 20 training sessions</Text>
              </View>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>🔥</Text>
                <Text style={styles.achievementTitle}>Streak Keeper</Text>
                <Text style={styles.achievementDesc}>Train for 7 consecutive days</Text>
              </View>
              <View style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>💪</Text>
                <Text style={styles.achievementTitle}>Marathon Runner</Text>
                <Text style={styles.achievementDesc}>Complete 100 training sessions</Text>
              </View>
            </View>
          </View>
        )}
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
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  timeRemaining: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeRemainingText: {
    fontSize: 16,
    color: '#92400E',
    fontWeight: '600',
  },
  challengesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  expiredCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  challengeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  challengeIcon: {
    fontSize: 24,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  completedTitle: {
    color: '#10B981',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  challengeReward: {
    alignItems: 'center',
  },
  rewardPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  rewardBadge: {
    fontSize: 20,
    marginTop: 5,
  },
  challengeProgress: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  expiredText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default DailyChallengesScreen;
