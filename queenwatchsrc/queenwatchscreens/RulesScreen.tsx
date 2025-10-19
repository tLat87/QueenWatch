import React, { useState } from 'react';
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
import Share from 'react-native-share';
import Header from '../queenwatchcomponents/Header';

type GameMode = 'solo' | 'party';

const RulesScreen = () => {
  const [activeMode, setActiveMode] = useState<GameMode>('solo');

  const handleShare = async () => {
    try {
      const rulesText = activeMode === 'solo' 
        ? `QueenWatch Solo Mode Rules:

In QueenWatch solo mode, you play on your own reaction speed. A square appears on the screen and lights up at a random moment - your task is to click on it as quickly as possible. After each round, the game shows your reaction time so you can improve your skills.

Download QueenWatch and test your reaction speed!`
        : `QueenWatch Party Mode Rules:

In QueenWatch party mode, players compete against each other on a single reaction stage. Each player takes turns tapping a square when it lights up—the fastest player wins. After the round is over, the game displays the results of all participants and determines the Speed Queen.

Download QueenWatch and challenge your friends!`;

      const shareOptions = {
        title: 'QueenWatch Rules',
        message: rulesText,
        url: 'https://play.google.com/store/apps/details?id=com.queenwatch', // Replace with actual app store URL
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share rules. Please try again.');
    }
  };

  const renderSoloRules = () => (
    <View style={styles.rulesContainer}>
      <Text style={styles.rulesText}>
        In QueenWatch solo mode, you play on your own reaction speed. A square appears on the screen and lights up at a random moment - your task is to click on it as quickly as possible. After each round, the game shows your reaction time so you can improve your skills.
      </Text>
    </View>
  );

  const renderPartyRules = () => (
    <View style={styles.rulesContainer}>
      <Text style={styles.rulesText}>
        In QueenWatch party mode, players compete against each other on a single reaction stage. Each player takes turns tapping a square when it lights up—the fastest player wins. After the round is over, the game displays the results of all participants and determines the Speed Queen.
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (activeMode) {
      case 'solo':
        return renderSoloRules();
      case 'party':
        return renderPartyRules();
      default:
        return renderSoloRules();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header />

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Rules</Text>

      {/* Mode Selection Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeMode === 'solo' && styles.activeTab]}
          onPress={() => setActiveMode('solo')}
        >
          <Text style={[styles.tabText, activeMode === 'solo' && styles.activeTabText]}>
            Solo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeMode === 'party' && styles.activeTab]}
          onPress={() => setActiveMode('party')}
        >
          <Text style={[styles.tabText, activeMode === 'party' && styles.activeTabText]}>
            Party
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>

      {/* Share Button */}
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  },
  rulesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  rulesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'left',
  },
  shareButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  shareButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RulesScreen;
