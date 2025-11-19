"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = supabaseBrowser();
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setMsg("Password updated. Redirecting to login…");
        setTimeout(() => router.push("/login?mode=login"), 1500);
      }
    } catch (err: any) {
      console.error("reset error:", err);
      setError(err?.message ?? "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-fuchsia-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-purple-100 px-6 py-8">
        <h1 className="text-xl font-semibold text-neutral-900">
          Set a new password
        </h1>
        <p className="mt-1 text-xs text-neutral-500">
          Enter a new password for your account.
        </p>

        {msg && (
          <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {msg}
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <label className="block">
            <span>New password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="block">
            <span>Confirm password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            )}
            Save password
          </button>
        </form>
      </div>
    </div>
  );
}
