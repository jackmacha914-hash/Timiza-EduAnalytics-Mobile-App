import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";

import LoadingScreen from "./components/LoadingScreen";
import OfflineScreen from "./components/OfflineScreen";
import useInternet from "./hooks/useInternet";

import {
  getToken,
  getUser,
  getSchoolCode,
} from "../services/storage";

const BASE_URL = "https://timiza-saas.onrender.com";

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

"admin-meals-collections":
  "/index.html?tab=meals-collections-section",

"admin-attendance":
  "/index.html?tab=events-section",

"admin-transport":
  "/index.html?tab=transport-section",

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

type User = {
  role?: string;
  [key: string]: any;
} | null;

export default function WebViewScreen() {
  const router = useRouter();

  const webViewRef = useRef<WebView>(null);

  const { page } = useLocalSearchParams<{
    page?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const [token, setToken] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<User>(null);

  const [schoolCode, setSchoolCode] =
    useState<string | null>(null);

  const isConnected = useInternet();

  const module = String(page || "");

  const path =
    MODULES[module] || "/index.html";

  const url =
    `${BASE_URL}${path}`;

  // ============================================================
  // LOAD AUTHENTICATION
  // ============================================================

  useEffect(() => {
    let mounted = true;

    async function loadAuthentication() {
      try {
        const [
          savedToken,
          savedUser,
          savedSchoolCode,
        ] = await Promise.all([
          getToken(),
          getUser(),
          getSchoolCode(),
        ]);

        if (!mounted) {
          return;
        }

        console.log(
          "TIMIZA WEBVIEW AUTH:",
          {
            hasToken: !!savedToken,
            userRole: savedUser?.role,
            schoolCode: savedSchoolCode,
            module,
            url,
          }
        );

        setToken(
          savedToken || null
        );

        setUser(
          savedUser || null
        );

        setSchoolCode(
          savedSchoolCode || null
        );
      } catch (error) {
        console.error(
          "TIMIZA AUTH LOAD ERROR:",
          error
        );
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    }

    loadAuthentication();

    return () => {
      mounted = false;
    };
  }, [module, url]);

  // ============================================================
  // EXPECTED ROLE
  // ============================================================

  function getExpectedRole(): string | null {
    if (module.startsWith("admin-")) {
      return "admin";
    }

    if (module.startsWith("teacher-")) {
      return "teacher";
    }

    if (module.startsWith("student-")) {
      return "student";
    }

    return null;
  }

  // ============================================================
  // BUILD AUTHENTICATION DATA
  // ============================================================

  function getAuthenticationData() {
    const expectedRole =
      getExpectedRole();

    const finalRole =
      expectedRole ||
      user?.role ||
      "";

    const authUser = {
      ...(user || {}),
      role: finalRole,
    };

    return {
      token: token || "",
      schoolCode: schoolCode || "",
      user: authUser,
      role: finalRole,
    };
  }

  // ============================================================
  // BUILD AUTHENTICATION SCRIPT
  // ============================================================

  function buildAuthenticationScript(): string {
    const authData =
      getAuthenticationData();

    const safeAuthData =
      JSON.stringify(authData);

    return `
      (function () {
        try {

          var auth = ${safeAuthData};

          /*
           * LOCAL STORAGE
           */

          localStorage.setItem(
            "token",
            auth.token
          );

          localStorage.setItem(
            "authToken",
            auth.token
          );

          localStorage.setItem(
            "schoolCode",
            auth.schoolCode
          );

          localStorage.setItem(
            "school_code",
            auth.schoolCode
          );

          localStorage.setItem(
            "user",
            JSON.stringify(auth.user)
          );

          localStorage.setItem(
            "role",
            auth.role
          );

          /*
           * SESSION STORAGE
           */

          sessionStorage.setItem(
            "token",
            auth.token
          );

          sessionStorage.setItem(
            "authToken",
            auth.token
          );

          sessionStorage.setItem(
            "schoolCode",
            auth.schoolCode
          );

          sessionStorage.setItem(
            "school_code",
            auth.schoolCode
          );

          sessionStorage.setItem(
            "user",
            JSON.stringify(auth.user)
          );

          sessionStorage.setItem(
            "role",
            auth.role
          );

          console.log(
            "TIMIZA AUTH INJECTED",
            {
              hasToken: !!auth.token,
              role: auth.role,
              schoolCode: auth.schoolCode
            }
          );

        } catch (error) {

          console.error(
            "TIMIZA AUTH INJECTION ERROR:",
            error
          );

        }

        true;
      })();
    `;
  }

  // ============================================================
  // INJECT AUTHENTICATION
  // ============================================================

  function injectAuthentication() {
    if (!webViewRef.current) {
      return;
    }

    try {
      webViewRef.current.injectJavaScript(
        buildAuthenticationScript()
      );
    } catch (error) {
      console.error(
        "TIMIZA AUTH INJECTION FAILED:",
        error
      );
    }
  }

  // ============================================================
  // ACTIVATE REQUESTED TAB
  // ============================================================

  function activateTab() {
    if (!webViewRef.current) {
      return;
    }

    if (!path.includes("?tab=")) {
      return;
    }

    const query = path.split("?")[1];
    const tab = new URLSearchParams(query).get("tab");

    if (!tab) {
      return;
    }

    const safeTab = JSON.stringify(tab);

    /*
     * One injected script handles its own short retry cycle.
     * It stops immediately after finding the requested tab.
     */
    const script = `
      (function () {
        var targetTab = ${safeTab};
        var attempts = 0;
        var maxAttempts = 6;

        function activateTargetTab() {
          attempts++;

          var tabLink =
            document.querySelector(
              '.tab-link[data-tab="' +
              targetTab +
              '"]'
            );

          if (!tabLink) {
            tabLink =
              document.querySelector(
                '[data-tab="' +
                targetTab +
                '"]'
              );
          }

          if (tabLink) {
            tabLink.click();

            console.log(
              "TIMIZA TAB ACTIVATED:",
              targetTab
            );

            return true;
          }

          var section =
            document.getElementById(targetTab);

          if (section) {
            var sections =
              document.querySelectorAll(".tab-section");

            sections.forEach(function (element) {
              element.style.display = "none";
            });

            section.style.display = "block";

            console.log(
              "TIMIZA SECTION ACTIVATED:",
              targetTab
            );

            return true;
          }

          if (attempts < maxAttempts) {
            setTimeout(
              activateTargetTab,
              attempts === 1 ? 150 : 250
            );
          }

          return false;
        }

        activateTargetTab();

        true;
      })();
    `;

    try {
      webViewRef.current.injectJavaScript(script);
    } catch (error) {
      console.error(
        "TIMIZA TAB ACTIVATION ERROR:",
        error
      );
    }
  }
  // ============================================================
  // INITIALIZE WEBVIEW
  // ============================================================

 function initializeWebView() {
  console.log(
    "INITIALIZING TIMIZA WEBVIEW:",
    {
      module,
      path,
      url,
      userRole: user?.role,
      expectedRole: getExpectedRole(),
      hasToken: !!token,
      schoolCode,
    }
  );

  // Inject authentication once after the page is ready.
  injectAuthentication();

  // Activate the requested tab after the website's own
  // JavaScript has had a moment to initialize.
  if (path.includes("?tab=")) {
    setTimeout(() => {
      activateTab();
    }, 150);
  }
}
  // ============================================================
  // EXTERNAL LINKS
  // ============================================================

  function handleLinks(request: any) {
    const link =
      request.url;

    console.log(
      "TIMIZA WEBVIEW NAVIGATION:",
      link
    );

    const externalSchemes = [
      "tel:",
      "mailto:",
      "sms:",
      "whatsapp:",
    ];

    const isExternalScheme =
      externalSchemes.some(
        (scheme) =>
          link.startsWith(scheme)
      );

    const isExternalAppLink =
      link.includes("maps.google") ||
      link.includes("play.google.com");

    if (
      isExternalScheme ||
      isExternalAppLink
    ) {
      Linking.openURL(link).catch(
        () => {}
      );

      return false;
    }

    return true;
  }

  // ============================================================
  // OFFLINE
  // ============================================================

  if (!isConnected) {
    return (
      <OfflineScreen
        onRetry={() => {
          setLoading(true);
        }}
      />
    );
  }

  // ============================================================
  // WAIT FOR AUTH
  // ============================================================

  if (!authReady) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  // ============================================================
  // NO TOKEN
  // ============================================================

  if (!token) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={styles.authError}
        >
          <Text
            style={styles.authErrorTitle}
          >
            Session Expired
          </Text>

          <Text
            style={styles.authErrorText}
          >
            Please login again to
            continue.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              router.replace("/login")
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.loginButtonText
              }
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // EARLY AUTHENTICATION
  // ============================================================

  const earlyAuthData =
    JSON.stringify(
      getAuthenticationData()
    );

  // ============================================================
  // WEBVIEW
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

        javaScriptEnabled={true}

        domStorageEnabled={true}

        cacheEnabled={true}

        sharedCookiesEnabled={true}

        thirdPartyCookiesEnabled={true}

        originWhitelist={[
          "*",
        ]}

        pullToRefreshEnabled={true}

        allowsInlineMediaPlayback={true}

        allowsBackForwardNavigationGestures={
          true
        }

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

        startInLoadingState={true}

        scalesPageToFit={false}

        /*
         * IMPORTANT:
         * Put authentication into storage
         * before the website initializes.
         */

        injectedJavaScriptBeforeContentLoaded={`
          (function () {

            try {

              var auth =
                ${earlyAuthData};

              /*
               * LOCAL STORAGE
               */

              localStorage.setItem(
                "token",
                auth.token
              );

              localStorage.setItem(
                "authToken",
                auth.token
              );

              localStorage.setItem(
                "schoolCode",
                auth.schoolCode
              );

              localStorage.setItem(
                "school_code",
                auth.schoolCode
              );

              localStorage.setItem(
                "user",
                JSON.stringify(
                  auth.user
                )
              );

              localStorage.setItem(
                "role",
                auth.role
              );

              /*
               * SESSION STORAGE
               */

              sessionStorage.setItem(
                "token",
                auth.token
              );

              sessionStorage.setItem(
                "authToken",
                auth.token
              );

              sessionStorage.setItem(
                "schoolCode",
                auth.schoolCode
              );

              sessionStorage.setItem(
                "school_code",
                auth.schoolCode
              );

              sessionStorage.setItem(
                "user",
                JSON.stringify(
                  auth.user
                )
              );

              sessionStorage.setItem(
                "role",
                auth.role
              );

              console.log(
                "TIMIZA EARLY AUTH READY",
                {
                  hasToken:
                    !!auth.token,
                  role:
                    auth.role,
                  schoolCode:
                    auth.schoolCode
                }
              );

            } catch (error) {

              console.error(
                "TIMIZA EARLY AUTH ERROR:",
                error
              );

            }

            true;

          })();
        `}

        onNavigationStateChange={
          (navState) => {
            console.log(
              "TIMIZA WEBVIEW URL:",
              navState.url
            );
          }
        }

        onShouldStartLoadWithRequest={
          handleLinks
        }

        onLoadStart={() => {
          console.log(
            "TIMIZA WEBVIEW LOAD START:",
            url
          );

          setLoading(true);
        }}

       onLoadEnd={() => {
  console.log(
    "TIMIZA WEBVIEW LOAD END:",
    url
  );

  setLoading(false);
  initializeWebView();
}}

        onError={(event) => {
          console.error(
            "TIMIZA WEBVIEW ERROR:",
            event.nativeEvent
          );

          setLoading(false);

          Alert.alert(
            "WebView Error",
            event.nativeEvent
              .description ||
              "Unable to load the page."
          );
        }}

        onHttpError={(event) => {
          console.error(
            "TIMIZA HTTP ERROR:",
            event.nativeEvent
              .statusCode,
            event.nativeEvent
              .description
          );
        }}

        onRenderProcessGone={
          (event) => {
            console.error(
              "TIMIZA ANDROID WEBVIEW PROCESS CRASHED:",
              event.nativeEvent
            );

            setLoading(false);

            Alert.alert(
              "WebView Crashed",
              "The Android WebView process crashed while loading this page."
            );
          }
        }

        renderLoading={() => (
          <LoadingScreen />
        )}
      />

      {/* ======================================================
          LOADING OVERLAY
      ======================================================= */}

      {loading && (
        <View
          style={styles.loading}
          pointerEvents="none"
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

    authError: {
      flex: 1,
      alignItems:
        "center",
      justifyContent:
        "center",
      padding: 30,
    },

    authErrorTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#222222",
      marginBottom: 10,
    },

    authErrorText: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
      marginBottom: 25,
    },

    loginButton: {
      backgroundColor:
        "#1565C0",
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 12,
    },

    loginButtonText: {
      color: "#ffffff",
      fontSize: 17,
      fontWeight: "700",
    },

  });