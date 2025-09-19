import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../screens/Navbar'; // ✅ import your Navbar
import { AuthContext } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={{  backgroundColor: '#f5f5f5' }}>
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
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
  optionsContainer: {
    padding: 20,         // ❌ removed flex:1
     marginTop:100,      // ✅ optional: small space below Navbar
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
});
