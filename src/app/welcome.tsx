import React from "react";
import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

export default function Welcome() {
  const hour = new Date().getHours();

  let greeting = "Good Evening 🌙";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning ☀️";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon 🌤️";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening 🌇";
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.greeting}>
          {greeting}
        </Text>

        <Text style={styles.title}>
          Welcome to
        </Text>

        <Text style={styles.appName}>
          Timiza EduAnalytics
        </Text>

        <Text style={styles.subtitle}>
          Smart School Management Platform
        </Text>

        <Text style={styles.description}>
          Manage learning, academics, finance,
          communication and student success from
          one secure platform.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </TouchableOpacity>

      <Text style={styles.version}>
        Version 1.0.3
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1565C0",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 35,
  },

  content: {
    alignItems: "center",
    marginTop: 40,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 30,
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },

  title: {
    color: "#E3F2FD",
    fontSize: 22,
  },

  appName: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },

  subtitle: {
    color: "#BBDEFB",
    fontSize: 17,
    marginTop: 10,
    fontWeight: "500",
  },

  description: {
    color: "#E3F2FD",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 25,
    marginTop: 30,
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
  },

  buttonText: {
    color: "#1565C0",
    fontSize: 18,
    fontWeight: "bold",
  },

  version: {
    color: "#BBDEFB",
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
  },
});