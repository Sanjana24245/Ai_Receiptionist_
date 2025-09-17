import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userEmail');
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to AI Receptionist</Text>
        <Text style={styles.subText}>How would you like to get assistance?</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionButton, styles.callButton]}
          onPress={() => navigation.navigate('Call')}
        >
          <Ionicons name="call" size={40} color="#fff" />
          <Text style={styles.optionText}>Call AI Receptionist</Text>
          <Text style={styles.optionSubText}>
            Talk directly with our AI assistant
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionButton, styles.chatButton]}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="chatbubbles" size={40} color="#fff" />
          <Text style={styles.optionText}>Chat Support</Text>
          <Text style={styles.optionSubText}>
            Start a chat with AI, escalate to human if needed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
   header: {
    backgroundColor: '#6200EE',
    padding: 30,
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  optionsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  optionButton: {
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  chatButton: {
    backgroundColor: '#2196F3',
  },
  optionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  optionSubText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
 
  })