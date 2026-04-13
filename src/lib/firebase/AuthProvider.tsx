"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./client";
import { isAllowedEmail } from "./auth";

type AuthState = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && !isAllowedEmail(user.email)) {
        // User signed in but not in allowlist — treat as unauthenticated.
        setState({ user: null, loading: false });
      } else {
        setState({ user, loading: false });
      }
    });
    return unsub;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
