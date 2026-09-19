"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    city: "",
    institution: "",
    institutionType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          institutionType: form.institutionType || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (signInRes?.error) throw new Error("Account created — please log in.");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-3xl text-canopy-900">Join Saafnikk</h1>
      <p className="mt-2 text-sm text-canopy-900/60">
        Create your account to join drives, report spots, and share reels.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field
          label="Username"
          value={form.username}
          onChange={(v) => setForm({ ...form, username: v.toLowerCase() })}
          required
          hint="lowercase letters, numbers, . and _"
        />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required
          hint="at least 8 characters"
        />
        <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        <Field
          label="School / college (optional)"
          value={form.institution}
          onChange={(v) => setForm({ ...form, institution: v })}
        />

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-canopy-800 py-3 text-sm font-medium text-stone-50 hover:bg-canopy-700 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-canopy-900/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-canopy-800 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-canopy-900">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-canopy-200 bg-stone-50 px-3.5 py-2.5 text-sm text-canopy-900 outline-none focus:border-canopy-500"
      />
      {hint && <span className="mt-1 block text-xs text-canopy-900/45">{hint}</span>}
    </label>
  );
}
