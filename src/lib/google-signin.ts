"use client";

import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

/**
 * Runs the Firebase Google popup, gets an ID token, and exchanges it for a
 * NextAuth session via the "firebase" credentials provider.
 *
 * Returns true on success. The caller handles redirect/refresh.
 */
export async function signInWithGoogle(callbackUrl: string): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    toast.error("Google sign-in is not configured yet.");
    return false;
  }

  try {
    const { signInWithPopup } = await import("firebase/auth");
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await signIn("firebase", {
      idToken,
      redirect: false,
      callbackUrl,
    });

    if (res?.error) {
      toast.error("Could not complete sign-in. Please try again.");
      return false;
    }
    return true;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      // User closed the popup — not an error worth shouting about
      return false;
    }
    if (code === "auth/popup-blocked") {
      toast.error("Popup blocked. Please allow popups and try again.");
      return false;
    }
    console.error("Google sign-in failed:", err);
    toast.error("Google sign-in failed. Please try again.");
    return false;
  }
}
