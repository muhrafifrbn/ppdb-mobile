// context/AuthContext.tsx
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginPPDB } from "../lib/api";

type User = {
  noPendaftaran: string;
  nama: string;
  jurusan?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (noPendaftaran: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // load session dari SecureStore
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync("ppdb_user");
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (noPendaftaran: string) => {
    setLoading(true);
    try {
      const u = await loginPPDB(noPendaftaran);
      setUser(u);
      await SecureStore.setItemAsync("ppdb_user", JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("ppdb_user");
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
