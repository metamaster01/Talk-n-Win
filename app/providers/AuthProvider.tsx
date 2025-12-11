"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase-course";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supa = supabaseBrowser();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Boot once
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      const { data, error } = await supa.auth.getSession();
      if (error) console.error("getSession error", error);

      if (!mounted) return;

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    // Subscribe to auth changes
    const { data: sub } = supa.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // manual refresh rarely needed
  const refreshUser = async () => {
    setLoading(true);
    const { data, error } = await supa.auth.getSession();
    if (error) console.error("refresh session error", error);
    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ user, session, loading, refreshUser }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
