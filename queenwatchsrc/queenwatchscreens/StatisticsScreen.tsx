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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../queenwatchcomponents/Header';
import { debugAsyncStorage, testStorage } from '../queenwatchutils/storageDebug';

type GameResult = {
  date: string;
  times: number[];
};

const StatisticsScreen = () => {
  const [activeTab, setActiveTab] = useState<'solo' | 'party'>('solo');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [soloResults, setSoloResults] = useState<Record<string, number[]>>({});
  const [partyResults, setPartyResults] = useState<Record<string, number[]>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  // Reload results when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadResults();
    }, [])
  );

  const loadResults = async () => {
    try {
      console.log('Loading results from AsyncStorage...');
      const soloData = await AsyncStorage.getItem('soloResults');
      const partyData = await AsyncStorage.getItem('partyResults');
      
      console.log('Solo data from storage:', soloData);
      console.log('Party data from storage:', partyData);
      
      if (soloData) {
        const parsedSoloData = JSON.parse(soloData);
        setSoloResults(parsedSoloData);
        console.log('Parsed solo results:', parsedSoloData);
      }
      if (partyData) {
        const parsedPartyData = JSON.parse(partyData);
        setPartyResults(parsedPartyData);
        console.log('Parsed party results:', parsedPartyData);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      Alert.alert('Error', 'Failed to load statistics. Please try again.');
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getAvailableDates = () => {
    const results = activeTab === 'solo' ? soloResults : partyResults;
    return Object.keys(results).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  };

  const getAverageTime = (times: number[]) => {
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };

  const formatTime = (time: number) => {
    return (time / 1000).toFixed(3) + ' sec.';
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleShare = (time: number) => {
    Alert.alert('Share', `My reaction time: ${formatTime(time)}`);
  };

  const handleTestSave = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const testTime = Math.random() * 1000 + 100; // Random time between 100-1100ms
      
      const storageKey = activeTab === 'solo' ? 'soloResults' : 'partyResults';
      const existingData = await AsyncStorage.getItem(storageKey);
      const results = existingData ? JSON.parse(existingData) : {};
      
      if (!results[today]) {
        results[today] = [];
      }
      
      results[today].push(testTime);
      await AsyncStorage.setItem(storageKey, JSON.stringify(results));
      
      Alert.alert('Test', `Test ${activeTab} result saved: ${formatTime(testTime)}`);
      loadResults(); // Reload to show the new data
    } catch (error) {
      console.error('Error in test save:', error);
      Alert.alert('Error', 'Test save failed');
    }
  };

  const handleDebugStorage = async () => {
    await debugAsyncStorage();
    await testStorage();
    Alert.alert('Debug', 'Check console for storage debug info');
  };

  const renderDatePicker = () => {
    const availableDates = getAvailableDates();
    
    return (
      <View style={styles.datePickerContainer}>
        {availableDates.map((date) => (
          <TouchableOpacity
            key={date}
            style={styles.dateOption}
            onPress={() => handleDateSelect(date)}
          >
            <Text style={styles.dateOptionText}>{formatDate(date)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSoloStats = () => {
    const results = soloResults[selectedDate] || [];
    const averageTime = getAverageTime(results);
    const hasResults = Object.keys(soloResults).length > 0;

    if (!hasResults) {
      return (
        <View style={styles.noStatsContainer}>
          <Text style={styles.noStatsText}>You don't have any statistics yet.</Text>
          <TouchableOpacity style={styles.testButton} onPress={handleTestSave}>
            <Text style={styles.testButtonText}>Test Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.testButton, { backgroundColor: '#6B7280', marginTop: 10 }]} onPress={handleDebugStorage}>
            <Text style={styles.testButtonText}>Debug Storage</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!selectedDate) {
      return (
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>Average response time:</Text>
          <Text style={styles.statsValue}>{formatTime(averageTime)}</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateInputText}>Choose a date.</Text>
            <Icon name="keyboard-arrow-down" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      );
    }

    const selectedResults = soloResults[selectedDate] || [];
    const selectedAverage = getAverageTime(selectedResults);

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsLabel}>Average response time:</Text>
        <Text style={styles.statsValue}>{formatTime(selectedAverage)}</Text>
        
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateInputText}>{formatDate(selectedDate)}</Text>
          <Icon name="keyboard-arrow-down" size={24} color="#6B7280" />
        </TouchableOpacity>

        {selectedResults.length === 0 ? (
          <Text style={styles.noPlayText}>You didn't play today.</Text>
        ) : (
          <ScrollView style={styles.resultsList}>
            {selectedResults.map((time, index) => (
              <View key={index} style={styles.resultCard}>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultLabel}>Reaction time:</Text>
                  <Text style={styles.resultTime}>{formatTime(time)}</Text>
                </View>
                {index === 0 && (
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShare(time)}
                  >
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderPartyStats = () => {
    const results = partyResults[selectedDate] || [];
    const averageTime = getAverageTime(results);
    const hasResults = Object.keys(partyResults).length > 0;

    if (!hasResults) {
      return (
        <View style={styles.noStatsContainer}>
          <Text style={styles.noStatsText}>You don't have any party statistics yet.</Text>
          <TouchableOpacity style={styles.testButton} onPress={handleTestSave}>
            <Text style={styles.testButtonText}>Test Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.testButton, { backgroundColor: '#6B7280', marginTop: 10 }]} onPress={handleDebugStorage}>
            <Text style={styles.testButtonText}>Debug Storage</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!selectedDate) {
      return (
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>Average response time:</Text>
          <Text style={styles.statsValue}>{formatTime(averageTime)}</Text>
          
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>Select Date</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const selectedResults = partyResults[selectedDate] || [];
    const selectedAverage = getAverageTime(selectedResults);
    const bestTime = Math.min(...selectedResults);
    const worstTime = Math.max(...selectedResults);

    return (
      <ScrollView style={styles.statsContainer}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Party Statistics</Text>
          <Text style={styles.statsDate}>{formatDate(selectedDate)}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={styles.statValue}>{formatTime(selectedAverage)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Best</Text>
            <Text style={styles.statValue}>{formatTime(bestTime)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Worst</Text>
            <Text style={styles.statValue}>{formatTime(worstTime)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Games</Text>
            <Text style={styles.statValue}>{selectedResults.length}</Text>
          </View>
        </View>

        <View style={styles.resultsList}>
          <Text style={styles.resultsTitle}>All Results</Text>
          {selectedResults.map((time, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultIndex}>#{index + 1}</Text>
              <Text style={styles.resultTime}>{formatTime(time)}</Text>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => handleShare(time)}
              >
                <Icon name="share" size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>Change Date</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'solo' && styles.activeTab]}
          onPress={() => setActiveTab('solo')}
        >
          <Text style={[styles.tabText, activeTab === 'solo' && styles.activeTabText]}>
            Solo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'party' && styles.activeTab]}
          onPress={() => setActiveTab('party')}
        >
          <Text style={[styles.tabText, activeTab === 'party' && styles.activeTabText]}>
            Party
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {showDatePicker && (
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerModal}>
              <Text style={styles.datePickerTitle}>Select Date</Text>
              {renderDatePicker()}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {activeTab === 'solo' ? renderSoloStats() : renderPartyStats()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#8B5CF6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  noStatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStatsText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 10,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateInputText: {
    fontSize: 16,
    color: '#6B7280',
  },
  noPlayText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  resultsList: {
    flex: 1,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E5E7EB',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  resultTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  shareButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContainer: {
    maxHeight: 300,
  },
  dateOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  statsDate: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultIndex: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default StatisticsScreen;

