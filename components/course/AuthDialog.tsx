"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";

function supa() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export default function AuthDialog({ open, onOpenChange }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onClose = () => onOpenChange(false);

  const handleEmail = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const full_name = String(fd.get("full_name") || "");
    const phone = String(fd.get("phone") || "");
    const client = supa();

    try {
      if (mode === "signup") {
        const { error } = await client.auth.signUp({
          email,
          password,
          options: { data: { full_name, phone } },
        });
        if (error) throw error;
      } else {
        const { error } = await client.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      onClose();
      // Optionally redirect if already purchased (handled later via server check)
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const client = supa();
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <>
              <input
                name="full_name"
                placeholder="Full name"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            {loading
              ? "Please wait…"
              : mode === "signup"
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        <div className="my-3 text-center text-xs text-neutral-500">or</div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-lg border px-3 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          Continue with Google
        </button>

        <div className="mt-3 text-center text-xs">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-semibold text-purple-700"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-semibold text-purple-700"
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
