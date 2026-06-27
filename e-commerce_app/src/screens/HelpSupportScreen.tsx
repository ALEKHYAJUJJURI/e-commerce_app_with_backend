import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Shadow, Spacing } from "../types/theme";

const HelpSupportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Help & Support</Text>

        <Text style={styles.subtitle}>
          Need assistance? We're here to help.
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL("mailto:support@shopease.com")}
          >
            <Ionicons
              name="mail-outline"
              size={22}
              color={Colors.accent}
            />
            <View style={styles.info}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>support@shopease.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => Linking.openURL("tel:+911234567890")}
          >
            <Ionicons
              name="call-outline"
              size={22}
              color={Colors.accent}
            />
            <View style={styles.info}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>+91 12345 67890</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Linking.openURL("https://www.shopease.com")
            }
          >
            <Ionicons
              name="globe-outline"
              size={22}
              color={Colors.accent}
            />
            <View style={styles.info}>
              <Text style={styles.label}>Website</Text>
              <Text style={styles.value}>www.shopease.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqCard}>
          <Text style={styles.question}>
            How can I cancel an order?
          </Text>
          <Text style={styles.answer}>
            Orders can be cancelled before they are shipped from the Orders
            section.
          </Text>

          <Text style={styles.question}>
            How do I return a product?
          </Text>
          <Text style={styles.answer}>
            Open your order details and tap "Request Return".
          </Text>

          <Text style={styles.question}>
            How can I track my order?
          </Text>
          <Text style={styles.answer}>
            Go to My Orders and tap on the order to view its live status.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.ink,
  },
  subtitle: {
    color: Colors.inkMid,
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    ...Shadow.sm,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  info: {
    marginLeft: 16,
  },
  label: {
    fontWeight: "700",
    color: Colors.ink,
  },
  value: {
    color: Colors.inkMid,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.ink,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 18,
    ...Shadow.sm,
  },
  question: {
    fontWeight: "700",
    marginTop: 12,
    color: Colors.ink,
  },
  answer: {
    color: Colors.inkMid,
    marginTop: 4,
    lineHeight: 22,
  },
});