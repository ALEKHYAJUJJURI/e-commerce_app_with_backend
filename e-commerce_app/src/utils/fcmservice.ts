import axios from "axios";
import {
  getMessaging,
  getToken,
  onMessage,
} from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "../types/constants";

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
    },
  );

  return unsubscribe;
};