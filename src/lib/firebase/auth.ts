import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./client";

const provider = new GoogleAuthProvider();

/**
 * Only these Google accounts can access the admin panel.
 * Checked client-side after sign-in AND enforced server-side via
 * Firestore / Storage security rules.
 */
export const ALLOWED_EMAILS = [
  "jeremycampos2@gmail.com",
  "pblcuellar@gmail.com",
  "obedcs10@gmail.com",
] as const;

export function isAllowedEmail(email: string | null | undefined): boolean {
  return !!email && (ALLOWED_EMAILS as readonly string[]).includes(email);
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  if (!isAllowedEmail(result.user.email)) {
    await firebaseSignOut(auth);
    throw new Error("unauthorized");
  }
  return result.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
