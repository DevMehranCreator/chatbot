"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("/avatars/avatar1.png");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await signup(name, email, password, avatar);
    if (ok) router.push("/");
    else setError("ایمیل قبلاً ثبت شده یا خطا رخ داده است.");
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
          ایجاد حساب کاربری
        </h2>
        <form
          className="w-full flex flex-col gap-5 mt-6"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="نام کامل"
            className="input input-bordered w-full rounded-xl px-4 py-3 text-lg border-2 border-indigo-200 focus:border-pink-400"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <div className="flex gap-3 justify-center mt-2">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const av = `/avatars/avatar${num}.png`;
              return (
                <button
                  type="button"
                  key={num}
                  className={`rounded-full border-2 p-1 transition shadow-lg ${
                    avatar === av
                      ? "border-pink-500 ring-2 ring-pink-300"
                      : "border-transparent hover:border-pink-400"
                  }`}
                  onClick={() => setAvatar(av)}
                  aria-label={`انتخاب آواتار ${num}`}
                >
                  <Image
                    src={av}
                    alt={`Avatar ${num}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </button>
              );
            })}
          </div>
          <button
            type="submit"
            className="btn bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-extrabold w-full mt-2 rounded-xl py-3 text-lg shadow-xl hover:scale-105 transition-transform"
          >
            ثبت‌نام
          </button>
        </form>
        {error && (
          <div className="text-red-500 mt-4 text-base font-bold">{error}</div>
        )}
        <div className="flex justify-between w-full mt-6 text-base">
          <Link
            href="/login"
            className="text-pink-600 hover:underline font-bold"
          >
            حساب دارید؟ ورود
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
