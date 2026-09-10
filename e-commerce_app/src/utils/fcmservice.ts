import {
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";

export const registerFCM = async () => {
  try {
    const messagingInstance = getMessaging();

    const authStatus = await requestPermission(messagingInstance);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("Notification permission not granted");
      return null;
    }

    const token = await getToken(messagingInstance);

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.log("FCM Registration Error:", error);
    return null;
  }
};