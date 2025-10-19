import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugAsyncStorage = async () => {
  try {
    console.log('=== AsyncStorage Debug ===');
    
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    console.log('All keys:', keys);
    
    // Get solo results
    const soloResults = await AsyncStorage.getItem('soloResults');
    console.log('Solo results:', soloResults);
    
    // Get party results
    const partyResults = await AsyncStorage.getItem('partyResults');
    console.log('Party results:', partyResults);
    
    // Get onboarding status
    const onboardingStatus = await AsyncStorage.getItem('onboardingCompleted');
    console.log('Onboarding status:', onboardingStatus);
    
    console.log('=== End Debug ===');
  } catch (error) {
    console.error('Error debugging AsyncStorage:', error);
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

export const testStorage = async () => {
  try {
    const testKey = 'test_key';
    const testValue = 'test_value';
    
    await AsyncStorage.setItem(testKey, testValue);
    const retrievedValue = await AsyncStorage.getItem(testKey);
    
    console.log('Storage test:', {
      set: testValue,
      retrieved: retrievedValue,
      success: testValue === retrievedValue
    });
    
    await AsyncStorage.removeItem(testKey);
  } catch (error) {
    console.error('Storage test failed:', error);
  }
};
