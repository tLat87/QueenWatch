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
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../queenwatchcomponents/Header';

interface UserProfile {
  name: string;
  age: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  goals: string[];
  notifications: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
}

interface AppSettings {
  autoSave: boolean;
  cloudSync: boolean;
  analyticsEnabled: boolean;
  crashReporting: boolean;
  betaFeatures: boolean;
  debugMode: boolean;
  performanceMode: 'balanced' | 'performance' | 'battery';
  dataRetention: number; // days
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const SettingsScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    skillLevel: 'beginner',
    goals: [],
    notifications: true,
    soundEnabled: true,
    hapticEnabled: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    autoSave: true,
    cloudSync: false,
    analyticsEnabled: true,
    crashReporting: true,
    betaFeatures: false,
    debugMode: false,
    performanceMode: 'balanced',
    dataRetention: 365,
    backupFrequency: 'weekly',
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      const savedSettings = await AsyncStorage.getItem('appSettings');
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
      if (savedSettings) {
        setAppSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      await AsyncStorage.setItem('appSettings', JSON.stringify(appSettings));
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const exportData = async () => {
    try {
      const soloResults = await AsyncStorage.getItem('soloResults');
      const partyResults = await AsyncStorage.getItem('partyResults');
      const trainingHistory = await AsyncStorage.getItem('trainingHistory');
      
      const exportData = {
        userProfile,
        appSettings,
        gameData: {
          soloResults: soloResults ? JSON.parse(soloResults) : {},
          partyResults: partyResults ? JSON.parse(partyResults) : {},
          trainingHistory: trainingHistory ? JSON.parse(trainingHistory) : [],
        },
        exportDate: new Date().toISOString(),
        appVersion: '1.3',
      };
      
      Alert.alert(
        'Data Export',
        `Your data has been prepared for export. Total size: ${JSON.stringify(exportData).length} characters.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your game data, training history, and achievements. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'soloResults',
                'partyResults',
                'trainingHistory',
                'dailyChallenges',
                'achievements',
                'userProfile',
                'appSettings',
              ]);
              Alert.alert('Success', 'All data has been cleared');
              loadSettings();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const renderProfileSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👤 User Profile</Text>
      <TouchableOpacity style={styles.profileCard} onPress={() => setShowProfileModal(true)}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name || 'Tap to set up profile'}</Text>
          <Text style={styles.profileDetails}>
            {userProfile.age} years old • {userProfile.skillLevel} level
          </Text>
        </View>
        <Text style={styles.editIcon}>✏️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⚙️ App Settings</Text>
      <View style={styles.settingsContainer}>
        {renderSettingRow(
          'Auto Save',
          'Automatically save progress',
          appSettings.autoSave,
          (value) => setAppSettings({...appSettings, autoSave: value}),
          '💾'
        )}
        {renderSettingRow(
          'Cloud Sync',
          'Sync data across devices',
          appSettings.cloudSync,
          (value) => setAppSettings({...appSettings, cloudSync: value}),
          '☁️'
        )}
        {renderSettingRow(
          'Analytics',
          'Help improve the app',
          appSettings.analyticsEnabled,
          (value) => setAppSettings({...appSettings, analyticsEnabled: value}),
          '📊'
        )}
        {renderSettingRow(
          'Crash Reporting',
          'Send crash reports',
          appSettings.crashReporting,
          (value) => setAppSettings({...appSettings, crashReporting: value}),
          '🐛'
        )}
        {renderSettingRow(
          'Beta Features',
          'Enable experimental features',
          appSettings.betaFeatures,
          (value) => setAppSettings({...appSettings, betaFeatures: value}),
          '🧪'
        )}
        {renderSettingRow(
          'Debug Mode',
          'Enable debug information',
          appSettings.debugMode,
          (value) => setAppSettings({...appSettings, debugMode: value}),
          '🔧'
        )}
      </View>
    </View>
  );

  const renderDataSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📁 Data Management</Text>
      <View style={styles.dataContainer}>
        <TouchableOpacity style={styles.dataButton} onPress={exportData}>
          <Text style={styles.dataButtonIcon}>📤</Text>
          <View style={styles.dataButtonInfo}>
            <Text style={styles.dataButtonTitle}>Export Data</Text>
            <Text style={styles.dataButtonDesc}>Download your progress</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dataButton} onPress={() => setShowDataModal(true)}>
          <Text style={styles.dataButtonIcon}>📥</Text>
          <View style={styles.dataButtonInfo}>
            <Text style={styles.dataButtonTitle}>Import Data</Text>
            <Text style={styles.dataButtonDesc}>Restore from backup</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dataButton} onPress={clearAllData}>
          <Text style={styles.dataButtonIcon}>🗑️</Text>
          <View style={styles.dataButtonInfo}>
            <Text style={styles.dataButtonTitle}>Clear All Data</Text>
            <Text style={styles.dataButtonDesc}>Reset everything</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHelpSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>❓ Help & Support</Text>
      <View style={styles.helpContainer}>
        {/* <TouchableOpacity style={styles.helpButton} onPress={() => setShowHelpModal(true)}>
          <Text style={styles.helpButtonIcon}>📖</Text>
          <Text style={styles.helpButtonText}>User Guide</Text>
        </TouchableOpacity> */}
        
        <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert('FAQ', 'Frequently Asked Questions:\n\nQ: How do I improve my reaction time?\nA: Practice regularly with different training modes.\n\nQ: Can I sync my data?\nA: Yes, enable Cloud Sync in settings.\n\nQ: How do achievements work?\nA: Complete specific goals to unlock achievements.')}>
          <Text style={styles.helpButtonIcon}>❓</Text>
          <Text style={styles.helpButtonText}>FAQ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert('Contact', 'Need help? Contact us at:\n\nEmail: support@queenwatch.app\nWebsite: www.queenwatch.app\n\nWe respond within 24 hours!')}>
          <Text style={styles.helpButtonIcon}>📧</Text>
          <Text style={styles.helpButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingRow = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  const renderProfileModal = () => (
    <Modal visible={showProfileModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={() => setShowProfileModal(false)}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={userProfile.name}
              onChangeText={(text) => setUserProfile({...userProfile, name: text})}
              placeholder="Enter your name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              value={userProfile.age.toString()}
              onChangeText={(text) => setUserProfile({...userProfile, age: parseInt(text) || 25})}
              keyboardType="numeric"
              placeholder="25"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Skill Level</Text>
            <View style={styles.skillButtons}>
              {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.skillButton,
                    userProfile.skillLevel === level && styles.selectedSkillButton,
                  ]}
                  onPress={() => setUserProfile({...userProfile, skillLevel: level})}
                >
                  <Text style={[
                    styles.skillButtonText,
                    userProfile.skillLevel === level && styles.selectedSkillButtonText,
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.saveButton} onPress={() => {
            setShowProfileModal(false);
            saveSettings();
          }}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileSection()}
        {renderSettingsSection()}
        {renderDataSection()}
        {renderHelpSection()}
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={saveSettings}>
            <Text style={styles.actionButtonText}>💾 Save All Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {renderProfileModal()}
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
  profileCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  profileDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  editIcon: {
    fontSize: 20,
  },
  settingsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  dataContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 20,
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dataButtonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  dataButtonInfo: {
    flex: 1,
  },
  dataButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  dataButtonDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  helpButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    minWidth: 80,
  },
  helpButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  helpButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  actionContainer: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalClose: {
    fontSize: 24,
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  skillButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSkillButton: {
    backgroundColor: '#8B5CF6',
  },
  skillButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  selectedSkillButtonText: {
    color: '#FFFFFF',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
