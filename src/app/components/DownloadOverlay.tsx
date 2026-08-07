import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

export default function DownloadOverlay() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#1565C0"
      />

      <Text style={styles.text}>
        Downloading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#1565C0",
    fontWeight: "600",
  },
});