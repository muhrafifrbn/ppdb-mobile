// context/AuthContext.tsx
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginPPDB, PPDBUser } from "../lib/api";

type AuthContextType = {
  user: PPDBUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (nomorFormulir: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PPDBUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user dari SecureStore saat app pertama dibuka
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync("ppdb_user");
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (nomorFormulir: string) => {
    setLoading(true);
    try {
      const userData = await loginPPDB(nomorFormulir);
      setUser(userData);
      await SecureStore.setItemAsync("ppdb_user", JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("ppdb_user");
    await SecureStore.deleteItemAsync("auth_token"); // kalau nanti kamu pakai token
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
