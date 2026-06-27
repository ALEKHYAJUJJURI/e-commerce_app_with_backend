import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Colors,
  Radius,
  Shadow,
  Spacing,
} from "../types/theme";

const TermsPrivacyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Terms & Privacy Policy
        </Text>

        <Text style={styles.updated}>
          Last Updated: June 2026
        </Text>

        <Text style={styles.heading}>
          1. Acceptance of Terms
        </Text>

        <Text style={styles.text}>
          By using ShopEase, you agree to these Terms and Conditions. Please
          read them carefully before using our services.
        </Text>

        <Text style={styles.heading}>
          2. Account Responsibility
        </Text>

        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your
          account credentials and all activities performed using your account.
        </Text>

        <Text style={styles.heading}>
          3. Orders & Payments
        </Text>

        <Text style={styles.text}>
          All orders are subject to product availability and payment
          confirmation. Prices may change without prior notice.
        </Text>

        <Text style={styles.heading}>
          4. Returns & Refunds
        </Text>

        <Text style={styles.text}>
          Eligible products may be returned according to our return policy.
          Refunds are processed after inspection of the returned product.
        </Text>

        <Text style={styles.heading}>
          5. Privacy Policy
        </Text>

        <Text style={styles.text}>
          We collect only the information necessary to provide our services,
          improve your shopping experience, and process your orders securely.
        </Text>

        <Text style={styles.heading}>
          6. Data Security
        </Text>

        <Text style={styles.text}>
          Your personal information is protected using industry-standard
          security practices. We never sell your personal data.
        </Text>

        <Text style={styles.heading}>
          7. Contact
        </Text>

        <Text style={styles.text}>
          For any questions regarding these Terms or our Privacy Policy,
          contact us at support@shopease.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsPrivacyScreen;

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
    marginBottom: 8,
  },
  updated: {
    color: Colors.inkLight,
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.ink,
    marginBottom: 8,
    marginTop: 18,
  },
  text: {
    fontSize: 15,
    color: Colors.inkMid,
    lineHeight: 24,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radius.md,
    ...Shadow.xs,
  },
});