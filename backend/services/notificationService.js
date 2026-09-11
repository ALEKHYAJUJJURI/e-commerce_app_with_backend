const { firebaseMessaging } = require("../config/firebaseAdmin");

const sendNotification = async ({
  token,
  title,
  body,
  data = {},
}) => {
  try {
    if (!token) {
      throw new Error("FCM token is required");
    }

    const message = {
      token,

      notification: {
        title,
        body,
      },

      data: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    };

    const response = await firebaseMessaging.send(message);

    console.log("FCM notification sent successfully:", response);

    return response;
  } catch (error) {
    console.error("FCM notification error:", error);
    throw error;
  }
};

module.exports = {
  sendNotification,
};