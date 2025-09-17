import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactnumber: "",   // ✅ added contact number
    password: "",
    rePassword: "",
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const emailOtpRefs = Array.from({ length: 6 }, () => useRef(null));
  const [otpToken, setOtpToken] = useState("");

  const canSendEmailOtp =
    form.email.trim().length > 7 && form.email.includes("@");
  const canVerifyEmailOtp = emailOtp.every((digit) => digit.length === 1);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...emailOtp];
    newOtp[index] = value;
    setEmailOtp(newOtp);
    if (value && index < emailOtpRefs.length - 1) {
      emailOtpRefs[index + 1].current.focus();
    }
  };

  const sendEmailOtp = async () => {
    if (!canSendEmailOtp) return;
    try {
      const res = await axios.post("http://192.168.1.49:8000/auth/send-otp", {
        email: form.email,
      });
      setEmailOtpSent(true);
      setOtpToken(res.data.otpToken);
     Alert.alert(
  "Success",
  Array.isArray(res.data.msg) ? res.data.msg.join(", ") : res.data.msg
);

    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.detail || "Failed to send email OTP"
      );
      setEmailOtpSent(false);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const res = await axios.post("http://192.168.1.49:8000/auth/verify-otp", {
        otpToken,
        otp: emailOtp.join(""),
      });
      setEmailVerified(true);
      Alert.alert("Success", res.data.msg);
    } catch (err) {
      Alert.alert(
  "Error",
  Array.isArray(err.response?.data?.detail)
    ? err.response.data.detail.join(", ")
    : err.response?.data?.detail || "Email OTP verification failed"
);

      setEmailVerified(false);
    }
  };

  const handleSubmit = async () => {
    if (!emailVerified) {
      Alert.alert("Error", "Please verify your Email OTP first.");
      return;
    }
    if (form.password !== form.rePassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://192.168.1.49:8000/auth/register", {
        username: `${form.firstName} ${form.lastName}`,
        email: form.email,
        contactnumber: form.contactnumber,   // ✅ send contact number to backend
        password: form.password,
        confirmPassword: form.rePassword,
      });

      Alert.alert(
  "Success",
  Array.isArray(res.data.msg) ? res.data.msg.join(", ") : res.data.msg
);

      navigation.navigate("Login");
    } catch (err) {
     Alert.alert(
  "Error",
  Array.isArray(err.response?.data?.detail)
    ? err.response.data.detail.join(", ")
    : err.response?.data?.detail || "Registration failed"
);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Register</Text>

      {/* First & Last Name */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          placeholder="First Name"
          value={form.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          placeholder="Last Name"
          value={form.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
        />
      </View>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        editable={!emailOtpSent}
        onChangeText={(text) => handleChange("email", text)}
      />
      {!emailOtpSent && (
        <TouchableOpacity
          style={[styles.button, !canSendEmailOtp && styles.disabledButton]}
          onPress={sendEmailOtp}
          disabled={!canSendEmailOtp}
        >
          <Text style={styles.buttonText}>Send Email OTP</Text>
        </TouchableOpacity>
      )}

      {emailOtpSent && !emailVerified && (
        <View style={styles.otpContainer}>
          {emailOtp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={emailOtpRefs[idx]}
              style={styles.otpInput}
              value={digit}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleOtpChange(idx, text)}
            />
          ))}
          <TouchableOpacity
            style={[styles.button, !canVerifyEmailOtp && styles.disabledButton]}
            onPress={verifyEmailOtp}
            disabled={!canVerifyEmailOtp}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
      {emailVerified && <Text style={styles.success}>Email verified ✓</Text>}

      {/* Contact Number */}
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        value={form.contactnumber}
        onChangeText={(text) => handleChange("contactnumber", text)}
      />

      {/* Passwords */}
      <TextInput
        style={[styles.input, !emailVerified && styles.disabledInput]}
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
        editable={emailVerified}
      />
      <TextInput
        style={[styles.input, !emailVerified && styles.disabledInput]}
        placeholder="Re-enter Password"
        value={form.rePassword}
        onChangeText={(text) => handleChange("rePassword", text)}
        secureTextEntry
        editable={emailVerified}
      />

      <TouchableOpacity
        style={[
          styles.button,
          (!emailVerified || !form.password || !form.rePassword) &&
            styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={!emailVerified || !form.password || !form.rePassword}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  disabledInput: { backgroundColor: "#eee" },
  button: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 8 },
  disabledButton: { backgroundColor: "#9ca3af" },
  buttonText: { color: "white", fontWeight: "bold" },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10, flexWrap: "wrap" },
  otpInput: { width: 40, height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, textAlign: "center", fontSize: 18, margin: 3 },
  success: { color: "green", fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  link: { color: "#2563eb", textAlign: "center", marginTop: 10, textDecorationLine: "underline" },
});
