"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await login(email, password);
    if (ok) router.push("/");
    else setError("ایمیل یا رمز عبور اشتباه است.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="glassmorphism bg-white/60 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-pink-200 dark:border-indigo-900">
        <Image
          src="/logo-chatbot.svg"
          alt="Logo"
          width={60}
          height={60}
          className="mb-4 shadow-lg"
        />
        <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
          ورود به حساب کاربری
        </h2>
        <form
          className="w-full flex flex-col gap-5 mt-6"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="ایمیل"
            className="input input-bordered w-full rounded-xl px-4 py-3 text-lg border-2 border-indigo-200 focus:border-pink-400"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className="input input-bordered w-full rounded-xl px-4 py-3 text-lg border-2 border-indigo-200 focus:border-pink-400"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="btn bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-extrabold w-full mt-2 rounded-xl py-3 text-lg shadow-xl hover:scale-105 transition-transform"
          >
            ورود
          </button>
        </form>
        {error && (
          <div className="text-red-500 mt-4 text-base font-bold">{error}</div>
        )}
        <div className="flex justify-between w-full mt-6 text-base">
          <Link
            href="/signup"
            className="text-pink-600 hover:underline font-bold"
          >
            حساب ندارید؟ ثبت‌نام
          </Link>
          <Link href="/" className="text-indigo-500 hover:underline font-bold">
            بازگشت
          </Link>
        </div>
      </div>
      <style>{`
        .glassmorphism {
          backdrop-filter: blur(16px) saturate(180%);
          background: rgba(255,255,255,0.25);
        }
      `}</style>
    </div>
  );
}
