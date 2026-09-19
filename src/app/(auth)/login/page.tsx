"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl text-canopy-900">Welcome back</h1>
      <p className="mt-2 text-sm text-canopy-900/60">Log in to your Saafnikk account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-canopy-900">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-canopy-200 bg-stone-50 px-3.5 py-2.5 text-sm text-canopy-900 outline-none focus:border-canopy-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-canopy-900">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-canopy-200 bg-stone-50 px-3.5 py-2.5 text-sm text-canopy-900 outline-none focus:border-canopy-500"
          />
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-canopy-800 py-3 text-sm font-medium text-stone-50 hover:bg-canopy-700 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-canopy-900/60">
        New to Saafnikk?{" "}
        <Link href="/register" className="font-medium text-canopy-800 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
