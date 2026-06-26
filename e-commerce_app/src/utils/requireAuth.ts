import { Alert } from "react-native";

export const requireAuth = (
  user: any,
  navigation: any,
  onAuthed: () => void
) => {
  if (user) {
    onAuthed();
    return;
  }
  Alert.alert(
    "Login required",
    "Please sign in to add items to your bag.",
    [
      { text: "Not now", style: "cancel" },
      { text: "Login", onPress: () => navigation.navigate("Login") },
    ]
  );
};