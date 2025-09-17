
// import React, { useState, useRef } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Audio } from "expo-av";
// import * as FileSystem from "expo-file-system";

// export default function App() {
//   const [recording, setRecording] = useState(null);
//   const [result, setResult] = useState("");
//   const recordingRef = useRef(null);

//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const rec = new Audio.Recording();
//       await rec.prepareToRecordAsync({
//         android: {
//           extension: ".wav",
//           outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_LINEAR16,
//           audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
//           sampleRate: 16000,
//           numberOfChannels: 1,
//         },
//         ios: {
//           extension: ".wav",
//           audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
//           sampleRate: 16000,
//           numberOfChannels: 1,
//           linearPCMBitDepth: 16,
//           linearPCMIsBigEndian: false,
//           linearPCMIsFloat: false,
//         },
//       });

//       await rec.startAsync();
//       recordingRef.current = rec;
//       setRecording(rec);
//       setResult("🎙 Recording...");
//     } catch (err) {
//       console.error("Failed to start recording", err);
//       setResult("❌ Error starting recording");
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       await recordingRef.current.stopAndUnloadAsync();
//       const uri = recordingRef.current.getURI();
//       console.log("Recording URI:", uri);

//       const base64 = await FileSystem.readAsStringAsync(uri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       const res = await fetch("http://192.168.1.145:5000/speech-to-text", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ audioContent: base64 }),
//       });

//       const data = await res.json();
//       setResult(`🌐 Detected Language: ${data.detectedLanguage}`);
//     } catch (err) {
//       console.error(err);
//       setResult("❌ Error recognizing speech");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>🎤 Speech Language</Text>
//         <Text style={styles.subHeader}>Detector</Text>
//         <Text style={styles.description}>Tap to record and detect language</Text>
//       </View>

//       <View style={styles.buttonsContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.startButton]}
//           onPress={startRecording}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.buttonIcon}>🎙️</Text>
//           <Text style={styles.buttonText}>Start Recording</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.stopButton]}
//           onPress={stopRecording}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.buttonIcon}>⏹️</Text>
//           <Text style={styles.buttonText}>Stop & Detect</Text>
//         </TouchableOpacity>
//       </View>

//       {result ? (
//         <View style={styles.resultContainer}>
//           <View style={styles.resultBox}>
//             <Text style={styles.resultLabel}>Result:</Text>
//             <Text style={styles.resultText}>{result}</Text>
//           </View>
//         </View>
//       ) : (
//         <View style={styles.placeholderContainer}>
//           <Text style={styles.placeholderText}>No recording yet</Text>
//           <Text style={styles.placeholderSubText}>Press start to begin</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     padding: 20,
//     paddingTop: 80,
//   },
//   headerContainer: {
//     alignItems: "center",
//     marginBottom: 50,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#2c3e50",
//     textAlign: "center",
//   },
//   subHeader: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#3498db",
//     textAlign: "center",
//     marginTop: -5,
//   },
//   description: {
//     fontSize: 15,
//     color: "#7f8c8d",
//     textAlign: "center",
//     marginTop: 8,
//   },
//   buttonsContainer: {
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   button: {
//     width: "80%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   startButton: {
//     backgroundColor: "#2980b9",
//   },
//   stopButton: {
//     backgroundColor: "#34495e",
//   },
//   buttonIcon: {
//     fontSize: 18,
//     marginRight: 8,
//   },
//   buttonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   resultContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   resultBox: {
//     backgroundColor: "#f8f9fa",
//     padding: 20,
//     borderRadius: 12,
//     width: "90%",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   resultLabel: {
//     fontSize: 12,
//     color: "#6c757d",
//     marginBottom: 6,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   resultText: {
//     fontSize: 16,
//     color: "#2c3e50",
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: "#95a5a6",
//     textAlign: "center",
//   },
//   placeholderSubText: {
//     fontSize: 14,
//     color: "#bdc3c7",
//     textAlign: "center",
//     marginTop: 4,
//   },
// }); 
// App.js
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Import screens
// import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import HomeScreen from './screens/HomeScreen';
// import ChatScreen from './screens/ChatScreen';
// import CallScreen from './screens/CallScreen';

// const Stack = createStackNavigator();

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     try {
//       const userToken = await AsyncStorage.getItem('userToken');
//       setIsLoggedIn(!!userToken);
//     } catch (error) {
//       console.log('Error checking login status:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return null; // Add loading screen here if needed
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName={isLoggedIn ? "Home" : "Login"}
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#6200EE',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//           name="Register" 
//           component={RegisterScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//           name="Home" 
//           component={HomeScreen}
//           options={{ 
//             title: 'AI Receptionist',
//             headerLeft: null
//           }}
//         />
//         <Stack.Screen 
//           name="Chat" 
//           component={ChatScreen}
//           options={{ title: 'Chat Support' }}
//         />
//         <Stack.Screen 
//           name="Call" 
//           component={CallScreen}
//           options={{ title: 'Call Support' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, AuthContext } from "./contexts/AuthContext"; // ✅ import
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import CallScreen from "./screens/CallScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // loader screen if needed

  return (
    <Stack.Navigator
      initialRouteName={user ? "Home" : "Login"}
      screenOptions={{
        headerStyle: { backgroundColor: "#6200EE" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "AI Receptionist" }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat Support" }} />
          <Stack.Screen name="Call" component={CallScreen} options={{ title: "Call Support" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
