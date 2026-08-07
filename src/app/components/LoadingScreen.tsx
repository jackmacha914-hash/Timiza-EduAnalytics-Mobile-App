import React from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Timiza EduAnalytics
      </Text>

      <Text style={styles.subtitle}>
        School Management System
      </Text>

      <ActivityIndicator
        size="large"
        color="#1565C0"
      />

      <Text style={styles.loading}>
        Preparing your workspace...
      </Text>

      <Text style={styles.version}>
        Version 1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1565C0",
  },

  subtitle: {
    marginTop: 5,
    marginBottom: 30,
    color: "#666",
    fontSize: 16,
  },

  loading: {
    marginTop: 20,
    fontSize: 15,
    color: "#777",
  },

  version: {
    position: "absolute",
    bottom: 40,
    color: "#999",
    fontSize: 13,
  },
});