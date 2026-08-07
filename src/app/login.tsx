import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";

import { login } from "../services/auth";

export default function LoginScreen() {
  const [schoolCode, setSchoolCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    if (
      !schoolCode.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields."
      );
      return;
    }

    try {
      setLoading(true);

      const user = await login(
        schoolCode.trim().toUpperCase(),
        email.trim(),
        password
      );

      switch (user.role) {

        case "admin":
          router.replace("/admin");
          break;

        case "teacher":
          router.replace("/teacher");
          break;

        case "student":
          router.replace("/student");
          break;

        default:
          Alert.alert(
            "Unknown Role",
            "Your account has no assigned role."
          );
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Login to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="School Code"
        autoCapitalize="characters"
        value={schoolCode}
        onChangeText={setSchoolCode}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordBox}>
        <TextInput
          style={styles.password}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setShowPassword(!showPassword)
          }
        >
          <Text style={styles.show}>
            {showPassword
              ? "Hide"
              : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            color="#fff"
          />
        ) : (
          <Text style={styles.buttonText}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>
        Powered by Timiza Technologies
      </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 30,
  },

  logo: {
    width: 130,
    height: 130,
    alignSelf: "center",
    marginBottom: 30,
    resizeMode: "contain",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: "#1565C0",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    marginBottom: 35,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    fontSize: 16,
  },

  passwordBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 30,
  },

  password: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },

  show: {
    color: "#1565C0",
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#1565C0",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 35,
    alignSelf: "center",
    color: "#888",
    fontSize: 13,
  },

});