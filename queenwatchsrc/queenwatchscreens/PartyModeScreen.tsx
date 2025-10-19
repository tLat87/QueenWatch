import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../queenwatchcomponents/Header';

type Player = {
  id: string;
  name: string;
  character?: string;
};

type Character = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

const characters: Character[] = [
  { id: 'fisherman', name: 'Fisherman', emoji: require('../queenwatchphotos/man.png'), description: 'Brown beard, green overalls' },
  { id: 'frog', name: 'Cool Frog', emoji: require('../queenwatchphotos/frog.png'), description: 'Sunglasses, ukulele' },
  { id: 'pharaoh', name: 'Pharaoh', emoji: require('../queenwatchphotos/blu.png'), description: 'Gold and blue attire' },
  { id: 'mariachi', name: 'Mariachi', emoji: require('../queenwatchphotos/yel.png'), description: 'Sombrero, guitar' },
];

const PartyModeScreen = () => {
  const navigation = useNavigation();
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '' },
    { id: '2', name: '' },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddPlayer = () => {
    if (players.length < 4) {
      const newPlayer: Player = {
        id: (players.length + 1).toString(),
        name: '',
      };
      setPlayers([...players, newPlayer]);
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    if (players.length > 2) {
      const updatedPlayers = players.filter(player => player.id !== playerId);
      setPlayers(updatedPlayers);
    }
  };

  const handleNameChange = (playerId: string, name: string) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, name } : player
    );
    setPlayers(updatedPlayers);
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const handleChooseCharacter = () => {
    if (selectedCharacter && currentPlayerIndex < players.length) {
      const updatedPlayers = players.map((player, index) =>
        index === currentPlayerIndex ? { ...player, character: selectedCharacter } : player
      );
      setPlayers(updatedPlayers);
      
      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setSelectedCharacter('');
      } else {
        // All players have selected characters, start the game
        startPartyGame();
      }
    }
  };

  const startPartyGame = () => {
    // Navigate to party game screen with players data
    (navigation as any).navigate('PartyGame', { players });
  };

  const renderPlayerInput = () => (
    <View style={styles.content}>
      <ScrollView style={styles.scrollView}>
        {players.map((player, index) => (
          <View key={player.id} style={styles.playerInputContainer}>
            <View style={styles.playerInput}>
             <Image source={require('../queenwatchphotos/oneMan.png')} style={{width: 20, height: 20, marginRight: 10}} />
              <TextInput
                style={styles.nameInput}
                placeholder={`Name ${index + 1}`}
                value={player.name}
                onChangeText={(text) => handleNameChange(player.id, text)}
                placeholderTextColor="#9CA3AF"
              />
              {players.length > 2 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemovePlayer(player.id)}
                >
                  <Icon name="close" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      
      {players.length < 4 && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlayer}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {canProceedToCharacterSelection() && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueToCharacters}>
          <Text style={styles.continueButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCharacterSelection = () => {
    const currentPlayer = players[currentPlayerIndex];
    
    return (
      <View style={styles.content}>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>
        
        <View style={styles.characterGrid}>
          {characters.map((character) => (
            <TouchableOpacity
              key={character.id}
              style={[
                styles.characterCard,
                selectedCharacter === character.id && styles.selectedCharacterCard
              ]}
              onPress={() => handleCharacterSelect(character.id)}
            >
              <Image source={character.emoji} style={{width: 100, height: 130}} />
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedCharacter && (
          <TouchableOpacity style={styles.chooseButton} onPress={handleChooseCharacter}>
            <Text style={styles.chooseButtonText}>Choose</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.backToNamesButton} onPress={() => setCurrentPlayerIndex(-1)}>
          <Text style={styles.backToNamesButtonText}>Back to Names</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const canProceedToCharacterSelection = () => {
    return players.every(player => player.name.trim() !== '');
  };

  const handleContinueToCharacters = () => {
    if (canProceedToCharacterSelection()) {
      setCurrentPlayerIndex(0);
    }
  };

  const renderContent = () => {
    if (currentPlayerIndex >= 0 && currentPlayerIndex < players.length) {
      return renderCharacterSelection();
    }
    return renderPlayerInput();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <Header showBackButton={true} />

      {/* Game Title */}
      <Text style={styles.gameTitle}>Party Mode</Text>

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
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  playerInputContainer: {
    marginBottom: 15,
  },
  playerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  playerIcon: {
    marginRight: 15,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToNamesButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  backToNamesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  characterCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedCharacterCard: {
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  characterEmoji: {
    fontSize: 40,
  },
  chooseButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
  },
  chooseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PartyModeScreen;

