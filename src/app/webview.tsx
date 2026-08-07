import React, { useRef, useState } from "react";

import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
} from "react-native";

import {
  useLocalSearchParams,
} from "expo-router";

import { WebView } from "react-native-webview";

import LoadingScreen from "../components/LoadingScreen";
import OfflineScreen from "../components/OfflineScreen";

import useInternet from "../hooks/useInternet";


const BASE_URL =
  "https://timiza-saas.onrender.com";


const MODULES: Record<string, string> = {

  // ADMIN

  "registration-section":
    "/index.html?tab=registration-section",

  "student-management-section":
    "/index.html?tab=student-management-section",

  "user-management-section":
    "/index.html?tab=user-management-section",

  "accountant-section":
    "/index.html?tab=accountant-section",

  "library-section":
    "/index.html?tab=library-section",

  "clubs-section":
    "/index.html?tab=clubs-section",

  "financial-analytics.html":
    "/financial-analytics.html",

  "academic-management.html":
    "/academic-management.html",

  "backup-section":
    "/index.html?tab=backup-section",

  "role-management-section":
    "/index.html?tab=role-management-section",

  "quizzes.html":
    "/quizzes.html",


  // TEACHER

  "profile-section":
    "/index.html?tab=profile-section",

  "class-management-section":
    "/index.html?tab=class-management-section",

  "homework-section":
    "/index.html?tab=homework-section",

  "timetable-section":
    "/index.html?tab=timetable-section",

  "report-cards-section":
    "/index.html?tab=report-cards-section",

  "attendance-section":
    "/index.html?tab=attendance-section",

  "announcements-section":
    "/index.html?tab=announcements-section",

  "resources-section":
    "/index.html?tab=resources-section",

  "communication-section":
    "/index.html?tab=communication-section",


  // STUDENT

  "dashboard-section":
    "/index.html?tab=dashboard-section",

  "academic-calendar-section":
    "/index.html?tab=academic-calendar-section",

  "assignments-section":
    "/index.html?tab=assignments-section",

  "fee-records-section":
    "/index.html?tab=fee-records-section",

};


export default function WebViewScreen() {

  const webViewRef = useRef<WebView>(null);

  const {
    page,
  } = useLocalSearchParams();


  const [loading,setLoading] =
    useState(true);


  const isConnected =
    useInternet();


  const module =
    String(page || "");


  const path =
    MODULES[module] ||
    "/index.html";


  const url =
    `${BASE_URL}${path}`;



  function handleLinks(request:any){

    const link =
      request.url;


    if(
      link.startsWith("tel:") ||
      link.startsWith("mailto:") ||
      link.startsWith("sms:") ||
      link.startsWith("whatsapp:") ||
      link.includes("maps.google") ||
      link.includes("play.google.com")
    ){

      Linking.openURL(link);

      return false;
    }


    return true;

  }



  if(!isConnected){

    return (
      <OfflineScreen
        onRetry={() =>
          setLoading(true)
        }
      />
    );

  }



  return (

    <SafeAreaView
      style={styles.container}
    >

      <WebView

        ref={webViewRef}

        source={{
          uri:url
        }}

        javaScriptEnabled

        domStorageEnabled

        cacheEnabled

        cacheMode="LOAD_DEFAULT"

        sharedCookiesEnabled

        thirdPartyCookiesEnabled

        originWhitelist={[
          "*"
        ]}

        pullToRefreshEnabled

        allowsInlineMediaPlayback

        allowsBackForwardNavigationGestures

        mediaPlaybackRequiresUserAction={false}

        setSupportMultipleWindows={false}

        mixedContentMode="always"

        applicationNameForUserAgent="TimizaEduAnalytics"

        androidLayerType="hardware"

        startInLoadingState

        scalesPageToFit={false}

        onShouldStartLoadWithRequest={
          handleLinks
        }

        onLoadStart={() =>
          setLoading(true)
        }

        onLoadEnd={() =>
          setLoading(false)
        }

        onError={() =>
          Alert.alert(
            "Connection Error",
            "Unable to connect to Timiza EduAnalytics."
          )
        }

        renderLoading={() =>
          <LoadingScreen />
        }

      />


      {
        loading &&
        <LoadingScreen />
      }


    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#ffffff",
  },

});