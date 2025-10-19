import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import Share from 'react-native-share';
import Header from '../queenwatchcomponents/Header';

const InfoScreen = () => {
  const handleShare = async () => {
    try {
      const shareText = `QueenWatch: Tap and React

A fast-paced reaction game that challenges your focus and reflexes. Tap the glowing square as quickly as possible and compete for the fastest time. Play solo to beat your own records or switch to party mode to challenge friends in real-time duels.

Track your stats, improve your speed, and prove you have the quickest reaction in the kingdom!

Download QueenWatch now!`;

      const shareOptions = {
        title: 'QueenWatch: Tap and React',
        message: shareText,
        url: 'https://play.google.com/store/apps/details?id=com.queenwatch', // Replace with actual app store URL
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share app. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Large Logo and Title */}
        <View style={styles.largeLogoContainer}>
           <Image source={require('../queenwatchphotos/log.png')} style={{width: 200, height: 100, alignSelf: 'center'}} />
        </View>

        {/* Game Description */}
        <Text style={styles.description}>
          QueenWatch: Tap and React is a fast-paced game of attention and speed where every moment counts. 
          Test your reflexes in solo mode or challenge your friends in a reaction duel to prove who the real 
          Queen of lightning-fast reactions is.
        </Text>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  largeLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginRight: 10,
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: -5,
  },
  crown: {
    fontSize: 24,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  largeLogoText: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: 'bold',
  },
  largeCrown: {
    position: 'absolute',
    top: -15,
    right: -10,
  },
  largeCrownText: {
    fontSize: 24,
  },
  largeTitleContainer: {
    flex: 1,
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  largeSubtitle: {
    fontSize: 16,
    color: '#000000',
  },
  description: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 30,
  },
  shareButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  shareButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InfoScreen;

