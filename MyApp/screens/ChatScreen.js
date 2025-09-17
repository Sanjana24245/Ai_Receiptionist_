import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: aiResponse.needsHuman ? 'system' : 'ai',
        timestamp: new Date(),
        needsHuman: aiResponse.needsHuman
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (aiResponse.needsHuman) {
        setTimeout(() => {
          Alert.alert(
            'Transferring to Human Agent',
            'Our AI couldn\'t fully assist you. You\'re being connected to a human agent.',
            [{ text: 'OK' }]
          );
        }, 1000);
      }
    }, 2000);
  };

  const generateAIResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Simple AI logic - in real app, use actual AI service
    if (lowercaseInput.includes('complex') || 
        lowercaseInput.includes('complaint') || 
        lowercaseInput.includes('manager')) {
      return {
        text: "I understand this requires special attention. Let me connect you with a human agent who can better assist you.",
        needsHuman: true
      };
    }
    
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
      return {
        text: "Hello! I'm here to help. What can I assist you with today?",
        needsHuman: false
      };
    }
    
    if (lowercaseInput.includes('hours') || lowercaseInput.includes('timing')) {
      return {
        text: "We're available 24/7 through this chat system. For phone support, our hours are 9 AM to 6 PM.",
        needsHuman: false
      };
    }
    
    return {
      text: "I understand your query. Let me help you with that. If you need more detailed assistance, I can connect you with a human agent.",
      needsHuman: false
    };
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : 
      item.sender === 'system' ? styles.systemMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Text>
      {item.needsHuman && (
        <TouchableOpacity 
          style={styles.humanButton}
          onPress={() => Alert.alert('Human Agent', 'Connecting to human agent...')}
        >
          <Text style={styles.humanButtonText}>Connect to Human Agent</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Common Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Login/Register Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#6200EE',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#6200EE',
    fontSize: 14,
  },
  
  // Home Screen Styles
 
  
  // Chat Screen Styles
  messagesList: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200EE',
    borderRadius: 15,
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderBottomLeftRadius: 5,
    elevation: 1,
  },
  systemMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9800',
    borderRadius: 15,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    padding: 12,
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 12,
    paddingBottom: 8,
    alignSelf: 'flex-end',
  },
  humanButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  humanButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  typingIndicator: {
    padding: 15,
    alignItems: 'center',
  },
  typingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6200EE',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});