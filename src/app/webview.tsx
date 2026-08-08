import React, { useRef, useState } from "react";

import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { WebView } from "react-native-webview";

import LoadingScreen from "./components/LoadingScreen";
import OfflineScreen from "./components/OfflineScreen";
import useInternet from "./hooks/useInternet";

const BASE_URL =
  "https://timiza-saas.onrender.com";

const MODULES: Record<string, string> = {

  // ============================================================
  // ADMIN
  // ============================================================

  "admin-registration":
    "/index.html?tab=registration-section",

  "admin-students":
    "/index.html?tab=student-management-section",

  "admin-users":
    "/index.html?tab=user-management-section",

  "admin-finance":
    "/index.html?tab=accountant-section",

  "admin-library":
    "/index.html?tab=library-section",

  "admin-clubs":
    "/index.html?tab=clubs-section",

  "admin-financial-analytics":
    "/financial-analytics.html",

  "admin-academic":
    "/academic-management.html",

  "admin-backup":
    "/index.html?tab=backup-section",

  "admin-roles":
    "/index.html?tab=role-management-section",

  "admin-quizzes":
    "/quizzes.html",

  // ============================================================
  // TEACHER
  // ============================================================

  "teacher-profile":
    "/teacher.html?tab=profile-section",

  "teacher-class-management":
    "/teacher.html?tab=class-management-section",

  "teacher-homework":
    "/teacher.html?tab=homework-section",

  "teacher-timetable":
    "/teacher.html?tab=timetable-section",

  "teacher-report-cards":
    "/teacher.html?tab=reportcard-section",

  "teacher-attendance":
    "/teacher.html?tab=attendance-section",

  "teacher-announcements":
    "/teacher.html?tab=announcements-section",

  "teacher-resources":
    "/teacher.html?tab=resources-section",

  "teacher-quizzes":
    "/manage-quizzes.html",

  "teacher-communication":
    "/teacher.html?tab=communication-section",

  // ============================================================
  // STUDENT
  // ============================================================

  "student-dashboard":
    "/student.html?tab=dashboard-section",

  "student-profile":
    "/student.html?tab=profile-section",

  "student-calendar":
    "/student.html?tab=calendar-section",

  "student-announcements":
    "/student.html?tab=announcements-section",

  "student-assignments":
    "/student.html?tab=assignments-section",

  "student-homework":
    "/student.html?tab=homework-section",

  "student-resources":
    "/student.html?tab=resources-section",

  "student-quizzes":
    "/quizzes.html",

  "student-fees":
    "/student.html?tab=fee-records-section",

  "student-library":
    "/student.html?tab=library-section",

  "student-report-cards":
    "/student.html?tab=report-cards-section",
};

// ============================================================
// WEBVIEW SCREEN
// ============================================================

export default function WebViewScreen() {

  const router = useRouter();

  const webViewRef =
    useRef<WebView>(null);

  const { page } =
    useLocalSearchParams();

  const [loading, setLoading] =
    useState(true);

  const isConnected =
    useInternet();

  // ============================================================
  // DETERMINE MODULE
  // ============================================================

  const module =
    String(page || "");

  const path =
    MODULES[module] ||
    "/index.html";

  const url =
    BASE_URL + path;

  // ============================================================
  // EXTERNAL LINKS
  // ============================================================

  function handleLinks(request: any) {

    const link =
      request.url;

    console.log(
      "WEBVIEW NAVIGATION:",
      link
    );

    if (
      link.startsWith("tel:") ||
      link.startsWith("mailto:") ||
      link.startsWith("sms:") ||
      link.startsWith("whatsapp:") ||
      link.includes("maps.google") ||
      link.includes("play.google.com")
    ) {

      Linking.openURL(link).catch(
        () => {}
      );

      return false;
    }

    return true;
  }

  // ============================================================
  // ACTIVATE WEBSITE TAB
  // ============================================================

  function activateTab() {

    if (!path.includes("?tab=")) {
      return;
    }

    const query =
      path.split("?")[1];

    const tab =
      new URLSearchParams(query).get(
        "tab"
      );

    if (!tab) {
      return;
    }

    console.log(
      "ACTIVATING TAB:",
      tab
    );

    const script = `
      (function () {

        console.log(
          "Timiza mobile activating tab: ${tab}"
        );

        var tabLink =
          document.querySelector(
            '.tab-link[data-tab="${tab}"]'
          );

        if (tabLink) {

          tabLink.click();

          console.log(
            "Tab clicked: ${tab}"
          );

        } else {

          console.log(
            "Tab not found: ${tab}"
          );

        }

        true;

      })();
    `;

    webViewRef.current?.injectJavaScript(
      script
    );
  }

  // ============================================================
  // OFFLINE
  // ============================================================

  if (!isConnected) {

    return (
      <OfflineScreen
        onRetry={() =>
          setLoading(true)
        }
      />
    );
  }

  // ============================================================
  // WEBVIEW SCREEN
  // ============================================================

  return (

    <SafeAreaView
      style={styles.container}
    >

      {/* ======================================================
          MOBILE TOP BAR
      ======================================================= */}

      <View
        style={styles.topBar}
      >

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
          activeOpacity={0.8}
        >

          <Text
            style={styles.backIcon}
          >
            ←
          </Text>

          <Text
            style={styles.backText}
          >
            Back to Menu
          </Text>

        </TouchableOpacity>

      </View>

      {/* ======================================================
          WEBVIEW
      ======================================================= */}

      <WebView

        ref={webViewRef}

        source={{
          uri: url,
        }}

        javaScriptEnabled

        domStorageEnabled

        cacheEnabled

        cacheMode="LOAD_DEFAULT"

        sharedCookiesEnabled

        thirdPartyCookiesEnabled

        originWhitelist={[
          "*",
        ]}

        pullToRefreshEnabled

        allowsInlineMediaPlayback

        allowsBackForwardNavigationGestures

        mediaPlaybackRequiresUserAction={
          false
        }

        setSupportMultipleWindows={
          false
        }

        mixedContentMode="always"

        applicationNameForUserAgent={
          "TimizaEduAnalytics"
        }

        androidLayerType="hardware"

        startInLoadingState

        scalesPageToFit={false}

        // ======================================================
        // NAVIGATION DEBUGGING
        // ======================================================

        onNavigationStateChange={(
          navState
        ) => {

          console.log(
            "WEBVIEW URL:",
            navState.url
          );

        }}

        // ======================================================
        // REQUEST HANDLER
        // ======================================================

        onShouldStartLoadWithRequest={
          handleLinks
        }

        // ======================================================
        // LOADING
        // ======================================================

        onLoadStart={() => {

          console.log(
            "WEBVIEW LOAD START"
          );

          setLoading(true);

        }}

        onLoadEnd={() => {

          console.log(
            "WEBVIEW LOAD END:",
            url
          );

          setLoading(false);

          // Allow website JavaScript
          // to initialize before selecting
          // the requested tab.

          setTimeout(() => {

            activateTab();

          }, 500);

        }}

        // ======================================================
        // WEBVIEW ERROR
        // ======================================================

        onError={(event) => {

          console.log(
            "WEBVIEW ERROR:",
            event.nativeEvent
          );

          setLoading(false);

          Alert.alert(
            "WebView Error",
            event.nativeEvent.description ||
              "Unable to load the page."
          );

        }}

        // ======================================================
        // HTTP ERROR
        // ======================================================

        onHttpError={(event) => {

          console.log(
            "HTTP ERROR:",
            event.nativeEvent.statusCode,
            event.nativeEvent.description
          );

        }}

        // ======================================================
        // ANDROID WEBVIEW PROCESS CRASH
        // ======================================================

        onRenderProcessGone={(event) => {

          console.log(
            "ANDROID WEBVIEW PROCESS CRASHED:",
            event.nativeEvent
          );

          setLoading(false);

          Alert.alert(
            "WebView Crashed",
            "The Android WebView process crashed while loading this page."
          );

        }}

        // ======================================================
        // LOADING COMPONENT
        // ======================================================

        renderLoading={() =>
          <LoadingScreen />
        }

      />

      {/* ======================================================
          LOADING OVERLAY
      ======================================================= */}

      {loading && (
        <View
          style={styles.loading}
        >

          <Text
            style={styles.loadingText}
          >
            Loading...
          </Text>

        </View>
      )}

    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#ffffff",
    },

    topBar: {
      height: 55,
      backgroundColor:
        "#1565C0",
      justifyContent:
        "center",
      paddingHorizontal: 10,
    },

    backButton: {
      flexDirection:
        "row",
      alignItems:
        "center",
      alignSelf:
        "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 10,
    },

    backIcon: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "700",
      marginRight: 6,
    },

    backText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },

    loading: {
      position: "absolute",
      top: 55,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor:
        "#ffffff",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    loadingText: {
      fontSize: 16,
      color: "#555555",
    },

  });

