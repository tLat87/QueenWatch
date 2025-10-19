import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false, 
  title = 'QUEEN WATCH', 
  subtitle = 'TAP AND REACT' 
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image source={require('../queenwatchphotos/back.png')} style={{width: 20, height: 30}} />
        </TouchableOpacity>
      )}
      
      <View style={styles.logoContainer}>
        <Image 
          source={require('../queenwatchphotos/log.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#F0EFF0',
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 200,
    height: 100,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
  },
});

export default Header;
