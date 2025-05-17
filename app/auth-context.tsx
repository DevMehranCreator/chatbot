"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    avatar: string
  ) => Promise<boolean>;
  logout: () => void;
  setAvatar: (avatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/route", {
      method: "POST",
      body: JSON.stringify({ type: "login", email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    avatar: string
  ) => {
    const res = await fetch("/api/auth/route", {
      method: "POST",
      body: JSON.stringify({ type: "signup", name, email, password, avatar }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Robust error handling for non-JSON responses
    let data;
    try {
      data = await res.json();
    } catch {
      return false;
    }
    if (data.success) {
      setUser({ name, email, avatar });
      localStorage.setItem("user", JSON.stringify({ name, email, avatar }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const setAvatar = (avatar: string) => {
    if (user) {
      setUser({ ...user, avatar });
      localStorage.setItem("user", JSON.stringify({ ...user, avatar }));
      fetch("/api/avatar/route", {
        method: "POST",
        body: JSON.stringify({ email: user.email, avatar }),
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
