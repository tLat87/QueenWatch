import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../queenwatchcomponents/Header';

const MainMenuScreen = () => {
  const navigation = useNavigation();

  const handleSoloMode = () => {
    navigation.navigate('SoloGame' as never);
  };

  const handlePartyMode = () => {
    navigation.navigate('PartyMode' as never);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Large Logo */}
      

        {/* Game Description */}
        <Text style={styles.description}>
          QueenWatch: Tap and React is a fast-paced game of attention and speed where every moment counts. 
          Test your reflexes in solo mode or challenge your friends in a reaction duel to prove who the real 
          Queen of lightning-fast reactions is.
        </Text>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Selection Cards */}
      <View style={styles.modeSelection}>
        {/* Solo Mode Card */}
        <TouchableOpacity style={styles.modeCard} onPress={handleSoloMode}>
          <View style={styles.modeIcon}>
            <Image source={require('../queenwatchphotos/oneMan.png')} style={{width: 70, height: 70, alignSelf: 'center'}} />
          </View>
          <View style={styles.modeButton}>
            <Text style={styles.modeButtonText}>Solo</Text>
          </View>
        </TouchableOpacity>

        {/* Party Mode Card */}
        <TouchableOpacity style={styles.modeCard} onPress={handlePartyMode}>
          <View style={styles.modeIcon}>
            <Image source={require('../queenwatchphotos/two.png')} style={{width: 100, height: 70, alignSelf: 'center'}} />
          </View>
          <View style={styles.modeButton}>
            <Text style={styles.modeButtonText}>Party</Text>
          </View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    position: 'relative',
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
  shareButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modeSelection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modeCard: {
    backgroundColor: '#DAB0FE',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  modeIcon: {
    marginBottom: 15,
  },
  modeIconText: {
    fontSize: 40,
  },
  modeButton: {
    backgroundColor: '#D1D5DB',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainMenuScreen;

