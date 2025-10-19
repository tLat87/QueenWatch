import AsyncStorage from '@react-native-async-storage/async-storage';

export const formatTime = (time: number): string => {
  return (time / 1000).toFixed(3) + ' sec.';
};

export const getAverageTime = (times: number[]): number => {
  if (times.length === 0) return 0;
  return times.reduce((sum, time) => sum + time, 0) / times.length;
};

export const getRandomWaitTime = (min: number = 1000, max: number = 5000): number => {
  return Math.random() * (max - min) + min;
};

export const saveSoloResult = async (time: number): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingData = await AsyncStorage.getItem('soloResults');
    const results = existingData ? JSON.parse(existingData) : {};
    
    if (!results[today]) {
      results[today] = [];
    }
    
    results[today].push(time);
    await AsyncStorage.setItem('soloResults', JSON.stringify(results));
  } catch (error) {
    console.error('Error saving solo result:', error);
  }
};

export const loadSoloResults = async (): Promise<Record<string, number[]>> => {
  try {
    const data = await AsyncStorage.getItem('soloResults');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading solo results:', error);
    return {};
  }
};

export const savePartyResult = async (players: any[], results: number[]): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingData = await AsyncStorage.getItem('partyResults');
    const data = existingData ? JSON.parse(existingData) : {};
    
    if (!data[today]) {
      data[today] = [];
    }
    
    data[today].push({
      players,
      results,
      timestamp: Date.now(),
    });
    
    await AsyncStorage.setItem('partyResults', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving party result:', error);
  }
};

export const loadPartyResults = async (): Promise<Record<string, any[]>> => {
  try {
    const data = await AsyncStorage.getItem('partyResults');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading party results:', error);
    return {};
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(['soloResults', 'partyResults']);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

