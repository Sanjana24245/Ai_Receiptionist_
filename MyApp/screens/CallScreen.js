import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CallScreen({ navigation }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const startCall = () => {
    setIsCallActive(true);
    // Here you would integrate with a calling service like Twilio
    Alert.alert(
      'Call Started',
      'Connecting you with AI Receptionist...\n\n(This is a demo - integrate with actual calling service)'
    );
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    Alert.alert('Call Ended', 'Thank you for using AI Receptionist');
  };

  return (
    <View style={styles.container}>
      <View style={styles.callContainer}>
        <View style={styles.callStatus}>
          <Ionicons 
            name={isCallActive ? "call" : "call-outline"} 
            size={80} 
            color={isCallActive ? "#4CAF50" : "#6200EE"} 
          />
          <Text style={styles.callStatusText}>
            {isCallActive ? 'Connected to AI Receptionist' : 'Ready to Call'}
          </Text>
          {isCallActive && (
            <Text style={styles.durationText}>
              Duration: {Math.floor(callDuration / 60)}:
              {(callDuration % 60).toString().padStart(2, '0')}
            </Text>
          )}
        </View>
        
        <View style={styles.callControls}>
          {!isCallActive ? (
            <TouchableOpacity style={styles.callButton} onPress={startCall}>
              <Ionicons name="call" size={30} color="#fff" />
              <Text style={styles.callButtonText}>Start Call</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
              <Ionicons name="call" size={30} color="#fff" />
              <Text style={styles.callButtonText}>End Call</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            📞 Talk directly with our AI receptionist
          </Text>
          <Text style={styles.infoText}>
            🤖 Get instant answers to your questions
          </Text>
          <Text style={styles.infoText}>
            ⏰ Available 24/7
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Call Screen Styles
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callStatus: {
    alignItems: 'center',
    marginBottom: 50,
  },
  callStatusText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  durationText: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
  },
  callControls: {
    marginBottom: 50,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  endCallButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  }})