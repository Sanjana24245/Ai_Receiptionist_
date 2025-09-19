import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const slideAnim = useState(new Animated.Value(-300))[0]; // animation state

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showProfile ? 0 : -300, // open → 0, close → -300
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [showProfile]);

  if (!user) return null;

  return (
    <View>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => setShowProfile(!showProfile)} // ✅ toggle open/close
            style={styles.iconButton}
          >
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Card */}
      {showProfile && (
        <Animated.View
          style={[
            styles.profileCard,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.logoutIcon}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={24} color="#E53935" />
          </TouchableOpacity>

          <Text style={styles.cardTitle}>Profile Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          {user.contactnumber && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>{user.contactnumber}</Text>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: "#6200EE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    elevation: 4,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  profileCard: {
    position: "absolute",
    top: 60,
    left: 15,
    right: 15,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    zIndex: 999,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#444",
  },
});

export default Navbar;
