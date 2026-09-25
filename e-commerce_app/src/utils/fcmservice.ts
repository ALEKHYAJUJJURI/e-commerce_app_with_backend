import axios from "axios";
import {
  getMessaging,
  getToken,
  onMessage,
} from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee, {
  AndroidImportance, AuthorizationStatus
} from "@notifee/react-native";
import { API_BASE_URL } from "../types/constants";


export const requestNotificationPermission = async () => {
  try {
    const settings = await notifee.requestPermission();

    if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    ) {
      console.log("✅ Notification permission granted");
      return true;
    }

    console.log("❌ Notification permission denied");
    return false;
  } catch (error) {
    console.log("Notification permission error:", error);
    return false;
  }
};

export const getFCMToken = async () => {
  try {
    const messagingInstance = getMessaging();

    const token = await getToken(messagingInstance);

    console.log("🔥 FCM Device Token:", token);

    return token;
  } catch (error) {
    console.log("FCM Token Error:", error);
    return null;
  }
};

export const registerFCMToken = async (authToken: string) => {
  try {
 // Ask for notification permission first
    const permissionGranted = await requestNotificationPermission();

    if (!permissionGranted) {
      console.log("⚠️ Notification permission not granted");
      return false;
    }

    const fcmToken = await getFCMToken();

    if (!fcmToken) {
      console.log("No FCM token available");
      return false;
    }

    await axios.post(
      `${API_BASE_URL}/api/notifications/register-token`,
      {
        token: fcmToken,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    console.log("✅ FCM token registered with backend");

    return true;
  } catch (error: any) {
    console.log(
      "❌ FCM token registration error:",
      error?.response?.data || error?.message || error,
    );

    return false;
  }
};

export const setupFCMListeners = () => {
  const messagingInstance = getMessaging();

  const unsubscribe = onMessage(
    messagingInstance,
    async remoteMessage => {
      console.log("📩 FCM MESSAGE RECEIVED:", remoteMessage);

      console.log(
        "🔔 Notification:",
        remoteMessage.notification
      );

      console.log(
        "📦 Data:",
        remoteMessage.data
      );

      const title =
        remoteMessage.notification?.title ||
        "E-Commerce App";

      const body =
        remoteMessage.notification?.body ||
        "You have a new notification.";

      // Create Android notification channel
      const channelId = await notifee.createChannel({
        id: "orders",
        name: "Orders",
        importance: AndroidImportance.HIGH,
      });

      // Display notification
      await notifee.displayNotification({
        title,
        body,
        data: remoteMessage.data,

        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: "default",
          },
        },
      });

      console.log("✅ Local notification displayed");
    },
  );

  return unsubscribe;
};