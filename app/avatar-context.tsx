"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AvatarContextType {
  avatars: string[];
  loading: boolean;
  refresh: () => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/avatars", {
        cache: "no-store",
      });
      const data = await res.json();
      setAvatars(data.avatars || []);
    } catch {
      setAvatars([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <AvatarContext.Provider value={{ avatars, loading, refresh: fetchAvatars }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatars() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatars must be used within AvatarProvider");
  return ctx;
}
