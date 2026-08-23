import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { firebaseAuth } from "../config/firebase";

import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    "1051973612864-tn3pldc7mtpt14n9sehpj75bbf2k72o1.apps.googleusercontent.com",
});

export const signInWithGoogle = async () => {
  try {
    // Check Google Play Services
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Sign in with Google
    const response = await GoogleSignin.signIn();
console.log("Google Sign-In Response:", response);
    const googleIdToken = response.data?.idToken;
    console.log("Google ID Token:", googleIdToken);

    if (!googleIdToken) {
      throw new Error("Google ID token was not returned");
    }

    // Create Firebase credential
    const credential =
      GoogleAuthProvider.credential(
        googleIdToken
      );

    // Sign in to Firebase
    const result =
      await signInWithCredential(
        firebaseAuth,
        credential
      );

    // Get Firebase ID token
    const firebaseIdToken =
      await result.user.getIdToken();

    return {
      idToken: firebaseIdToken,
      user: result.user,
    };
  } catch (error) {
    console.log(
      "Google Login Error:",
      error
    );

    throw error;
  }
};