import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

const MENU = [
  {
    title: "Profile",
    subtitle: "Manage your profile",
    page: "teacher-profile",
    icon: "👤",
  },
  {
    title: "Class Management",
    subtitle: "Manage classes and students",
    page: "teacher-class-management",
    icon: "🏫",
  },
  {
    title: "Homework",
    subtitle: "Create and manage homework",
    page: "teacher-homework",
    icon: "📝",
  },
  {
    title: "Timetable",
    subtitle: "View teaching schedule",
    page: "teacher-timetable",
    icon: "📅",
  },
  {
    title: "Report Cards",
    subtitle: "Manage student reports",
    page: "teacher-report-cards",
    icon: "📄",
  },
  {
    title: "Attendance",
    subtitle: "Record student attendance",
    page: "teacher-attendance",
    icon: "✅",
  },
  {
    title: "Announcements",
    subtitle: "School announcements",
    page: "teacher-announcements",
    icon: "📢",
  },
  {
    title: "Resources",
    subtitle: "Teaching resources",
    page: "teacher-resources",
    icon: "📚",
  },
  {
    title: "Quizzes",
    subtitle: "Create and manage quizzes",
    page: "teacher-quizzes",
    icon: "❓",
  },
  {
    title: "Communication",
    subtitle: "Communicate with users",
    page: "teacher-communication",
    icon: "💬",
  },
];

export default function TeacherScreen() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  function openModule(page: string) {
    router.push({
      pathname: "/webview",
      params: {
        page: page,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting}
          </Text>

          <Text style={styles.name}>
            Teacher
          </Text>

          <Text style={styles.school}>
            Timiza EduAnalytics
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>
            Dashboard
          </Text>

          <Text style={styles.description}>
            Select a module to continue.
          </Text>

          {MENU.map((item) => (
            <TouchableOpacity
              key={item.page}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => openModule(item.page)}
            >
              <Text style={styles.icon}>
                {item.icon}
              </Text>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.cardSubtitle}>
                  {item.subtitle}
                </Text>
              </View>

              <Text style={styles.arrow}>
                ›
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.8}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Timiza EduAnalytics v1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#1565C0",
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  greeting: {
    color: "#BBDEFB",
    fontSize: 17,
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    marginTop: 5,
  },

  school: {
    color: "#E3F2FD",
    marginTop: 8,
    fontSize: 15,
  },

  content: {
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  description: {
    color: "#777",
    marginTop: 5,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  icon: {
    fontSize: 32,
    marginRight: 18,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  cardSubtitle: {
    marginTop: 3,
    color: "#777",
    fontSize: 14,
  },

  arrow: {
    fontSize: 28,
    color: "#1565C0",
    fontWeight: "bold",
  },

  logout: {
    backgroundColor: "#D32F2F",
    borderRadius: 15,
    padding: 18,
    marginTop: 25,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  footer: {
    textAlign: "center",
    marginVertical: 25,
    color: "#888",
  },
});

