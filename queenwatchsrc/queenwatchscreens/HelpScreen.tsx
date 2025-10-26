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
  Linking,
} from 'react-native';
import Header from '../queenwatchcomponents/Header';

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  expanded: boolean;
}

const HelpScreen = () => {
  const [helpSections, setHelpSections] = useState<HelpSection[]>([
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      content: `Welcome to QueenWatch! Here's how to get started:

1. **Choose Your Mode**: Start with Solo mode to practice your reaction time
2. **Complete Onboarding**: Follow the tutorial to learn the basics
3. **Set Your Profile**: Go to Settings to customize your experience
4. **Start Training**: Use the Training mode to improve your skills
5. **Track Progress**: Check Statistics to see your improvement

**Tips for Beginners:**
- Start with easier difficulty levels
- Practice regularly for best results
- Focus on consistency rather than speed initially
- Use Training mode to build muscle memory`,
      expanded: false,
    },
    {
      id: 'game-modes',
      title: 'Game Modes Explained',
      icon: '🎮',
      content: `QueenWatch offers several ways to play:

**Solo Mode:**
- Practice your reaction time alone
- Perfect for daily training
- Track your personal best times
- No pressure, just improvement

**Party Mode:**
- Compete with friends on the same device
- Great for social gatherings
- See who has the fastest reactions
- Fun competitive element

**Training Mode:**
- Structured practice sessions
- Different training types (Focus, Speed, Endurance, Precision)
- Multiple difficulty levels
- Detailed progress tracking

**Daily Challenges:**
- Fresh challenges every day
- Earn points and achievements
- Maintain streaks for rewards
- Variety keeps training interesting`,
      expanded: false,
    },
    {
      id: 'improving-skills',
      title: 'Improving Your Skills',
      icon: '💪',
      content: `Want to get faster? Here's how:

**Regular Practice:**
- Train daily for best results
- Even 5-10 minutes helps
- Consistency beats intensity

**Training Techniques:**
- Start with Focus training to improve concentration
- Use Speed training for quick reactions
- Try Endurance training for sustained performance
- Practice Precision training for accuracy

**Physical Tips:**
- Ensure good lighting
- Use a comfortable position
- Keep your device stable
- Take breaks to avoid fatigue

**Mental Preparation:**
- Stay relaxed and focused
- Don't overthink the timing
- Trust your instincts
- Celebrate small improvements

**Common Mistakes:**
- Anticipating instead of reacting
- Moving too early
- Getting frustrated with slow times
- Not practicing regularly`,
      expanded: false,
    },
    {
      id: 'achievements',
      title: 'Achievements & Rewards',
      icon: '🏆',
      content: `Earn achievements as you play:

**Speed Achievements:**
- Lightning Fast: Under 200ms reaction time
- Speed Demon: 10 fast reactions under 250ms
- Supersonic: 50 reactions under 300ms

**Accuracy Achievements:**
- Precision Master: 20 training sessions with 90%+ accuracy
- Bullseye: Perfect score in any training mode

**Endurance Achievements:**
- Marathon Runner: Complete 100 training sessions
- Iron Will: Train for 5 consecutive days
- Dedication: Train for 30 consecutive days

**Special Achievements:**
- First Steps: Complete your first training session
- Night Owl: Train between 11 PM and 5 AM
- Early Bird: Train between 5 AM and 8 AM
- Perfectionist: Achieve 100% accuracy in all training types

**How to Earn More:**
- Complete daily challenges
- Maintain training streaks
- Try different training modes
- Share your progress with friends`,
      expanded: false,
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      content: `Having issues? Here are common solutions:

**App Not Responding:**
- Close and restart the app
- Restart your device
- Check for app updates
- Clear app cache in Settings

**Inaccurate Timing:**
- Ensure good lighting conditions
- Keep device stable during gameplay
- Check screen sensitivity settings
- Try different training modes

**Data Not Saving:**
- Check internet connection
- Enable Auto Save in Settings
- Restart the app
- Contact support if issue persists

**Performance Issues:**
- Close other apps
- Restart your device
- Check available storage space
- Update to latest app version

**Can't Access Features:**
- Complete the onboarding tutorial
- Check if you're logged in
- Verify app permissions
- Update to latest version

**Still Having Problems?**
Contact our support team:
- Email: support@queenwatch.app
- Response time: Within 24 hours
- Include device model and app version`,
      expanded: false,
    },
    {
      id: 'privacy-safety',
      title: 'Privacy & Safety',
      icon: '🔒',
      content: `Your privacy and safety are important to us:

**Data Collection:**
- We only collect necessary data for app functionality
- Game scores and training data are stored locally
- No personal information is shared without consent
- Analytics data is anonymized

**Data Storage:**
- All data is stored securely on your device
- Optional cloud sync available in Settings
- You can export your data anytime
- Data is deleted when you uninstall the app

**Permissions:**
- Camera: Not required
- Location: Not required
- Contacts: Not required
- Photos: Only for sharing results (optional)

**Safety Features:**
- No inappropriate content
- Safe for all ages
- No in-app purchases
- No external links to unsafe sites

**Your Rights:**
- Request data deletion
- Export your data
- Opt out of analytics
- Contact us with concerns

**Contact Privacy Team:**
- Email: privacy@queenwatch.app
- We respond within 48 hours
- All requests are handled confidentially`,
      expanded: false,
    },
  ]);

  const toggleSection = (id: string) => {
    setHelpSections(sections =>
      sections.map(section =>
        section.id === id
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@queenwatch.app?subject=QueenWatch Support Request'),
        },
        {
          text: 'Website',
          onPress: () => Linking.openURL('https://www.queenwatch.app/support'),
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate QueenWatch',
      'Enjoying the app? Please rate us on the App Store!',
      [
        { text: 'Not Now', style: 'cancel' },
        {
          text: 'Rate App',
          onPress: () => Linking.openURL('https://apps.apple.com/app/queenwatch'),
        },
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share QueenWatch',
      'Help others discover QueenWatch by sharing it with your friends!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            // In a real app, you would use Share API here
            Alert.alert('Share', 'QueenWatch: Improve your reaction time with fun training games! Download now!');
          },
        },
      ]
    );
  };

  const renderHelpSection = (section: HelpSection) => (
    <View key={section.id} style={styles.helpSection}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(section.id)}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionIcon}>{section.icon}</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <Text style={styles.expandIcon}>
          {section.expanded ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {section.expanded && (
        <View style={styles.sectionContent}>
          <Text style={styles.sectionText}>{section.content}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to QueenWatch Help Center</Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions and learn how to get the most out of your reaction training experience.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleContactSupport}>
            <Text style={styles.quickActionIcon}>📧</Text>
            <Text style={styles.quickActionText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleRateApp}>
            <Text style={styles.quickActionIcon}>⭐</Text>
            <Text style={styles.quickActionText}>Rate App</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleShareApp}>
            <Text style={styles.quickActionIcon}>📤</Text>
            <Text style={styles.quickActionText}>Share App</Text>
          </TouchableOpacity>
        </View>

        {/* Help Sections */}
        <View style={styles.helpContainer}>
          {helpSections.map(renderHelpSection)}
        </View>

        {/* Additional Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          
          <TouchableOpacity style={styles.resourceButton}>
            <Text style={styles.resourceIcon}>📖</Text>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>User Manual</Text>
              <Text style={styles.resourceDesc}>Complete guide to all features</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceButton}>
            <Text style={styles.resourceIcon}>🎥</Text>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>Video Tutorials</Text>
              <Text style={styles.resourceDesc}>Watch step-by-step guides</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceButton}>
            <Text style={styles.resourceIcon}>💬</Text>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>Community Forum</Text>
              <Text style={styles.resourceDesc}>Connect with other players</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            QueenWatch v1.3 • Made with ❤️ for reaction training enthusiasts
          </Text>
          <Text style={styles.footerText}>
            Need more help? Contact us at support@queenwatch.app
          </Text>
        </View>
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
  welcomeSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  helpContainer: {
    marginBottom: 30,
  },
  helpSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  expandIcon: {
    fontSize: 20,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  resourcesSection: {
    marginBottom: 30,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  resourceIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  resourceDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default HelpScreen;
