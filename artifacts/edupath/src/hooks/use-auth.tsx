import { createContext, useContext, useEffect, useState } from "react";
import { StudentProfile } from "@workspace/api-client-react";

interface AuthContextType {
  user: StudentProfile | null;
  login: (profile: StudentProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(() => {
    const savedUser = localStorage.getItem("edupath_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("edupath_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("edupath_user");
    }
  }, [user]);

  const login = (profile: StudentProfile) => setUser(profile);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
