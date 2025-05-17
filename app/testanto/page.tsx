"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../auth-context";
import Link from "next/link";

// ابزار زمان و تاریخ
const formatTime = (date: Date) =>
  date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
const formatDate = (date: Date) =>
  date.toLocaleDateString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

type MessageRole = "user" | "ai" | "typing";
interface Message {
  role: MessageRole;
  text: string;
  time?: string;
}

export default function Page() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // اسکرول خودکار به آخر پیام‌ها
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [aiMessages, aiLoading]);

  // امکانات جدید:
  // ۱. تاریخچه چت در LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("aiChatHistory");
    if (saved) setAiMessages(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("aiChatHistory", JSON.stringify(aiMessages));
  }, [aiMessages]);

  // ۲. انتخاب تم (روشن/تاریک)
  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-gray-950" : "bg-white";
  }, [theme]);

  // ۳. ارسال عکس (base64)
  const [image, setImage] = useState<string | null>(null);
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // پیام خوش‌آمدگویی هوشمند فقط یکبار
  useEffect(() => {
    if (aiMessages.length === 0) {
      setTimeout(() => {
        setAiMessages([
          {
            role: "ai",
            text: "سلام! من دستیار هوشمند شما هستم. هر سوالی داشتی بپرس یا حتی می‌تونی عکس بفرستی!",
            time: new Date().toISOString(),
          },
        ]);
      }, 600);
    }
  }, [aiMessages.length]);

  const addMessage = (msg: Message) => {
    setAiMessages((prev) => [
      ...prev,
      { ...msg, time: new Date().toISOString() },
    ]);
  };

  // کنترل استریم و دکمه استاپ
  const aiStreamController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/chat?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.history)
            setAiMessages(
              data.history.map(
                (m: {
                  role: MessageRole;
                  content: string;
                  createdAt: string;
                }) => ({
                  role: m.role,
                  text: m.content,
                  time: m.createdAt,
                })
              )
            );
        });
    }
  }, [user?.email]);

  const sendAiMessage = async () => {
    if (!aiInput.trim() || !user) return;
    addMessage({ role: "user", text: aiInput });
    setAiInput("");
    setAiLoading(true);
    addMessage({ role: "typing", text: "" });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, message: aiInput }),
      });
      const data = await res.json();
      if (data.response) {
        setAiMessages(
          data.history.map(
            (m: { role: MessageRole; content: string; createdAt: string }) => ({
              role: m.role,
              text: m.content,
              time: m.createdAt,
            })
          )
        );
      }
    } catch {}
    setAiLoading(false);
    aiStreamController.current = null;
  };

  // دکمه استاپ
  const stopAI = () => {
    aiStreamController.current?.abort();
    setAiLoading(false);
  };

  // آواتارها و فونت فارسی زیبا (وزیرمتن)
  const userAvatar = user?.avatar || "/user-avatar.svg";
  const aiAvatar = "/ai-avatar.svg";

  // وضعیت آنلاین/آفلاین ربات
  useEffect(() => {
    const check = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    check();
    return () => {
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  // Prevent access if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
          <Image
            src="/logo-chatbot.svg"
            alt="Logo"
            width={56}
            height={56}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">
            برای استفاده از چت‌بات باید وارد شوید
          </h2>
          <div className="flex gap-4 mt-4">
            <Link
              href="/login"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-2 rounded-full"
            >
              ورود
            </Link>
            <Link
              href="/signup"
              className="btn bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-full"
            >
              ثبت‌نام
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-2 py-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* بک‌گراند داینامیک زیبا */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <svg
          width="100%"
          height="100%"
          className="animate-spin-slow opacity-20"
        >
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
            </radialGradient>
          </defs>
          <circle
            cx="50%"
            cy="50%"
            r="340"
            stroke="url(#bgGrad)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="220"
            stroke="url(#bgGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="120"
            stroke="url(#bgGrad)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/5 animate-pulse" />
      </div>
      <div className="z-10 max-w-xl w-full flex flex-col items-center gap-8 font-vazirmatn">
        {/* Header/Navbar */}
        <div className="flex w-full justify-between items-center mb-2">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            چت هوش مصنوعی فارسی
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition border border-white/20"
              title="تغییر تم"
            >
              {theme === "dark" ? "☀️ روشن" : "🌙 تاریک"}
            </button>
            {user ? (
              <>
                <span className="flex items-center gap-1 text-white/80 text-sm">
                  <Image
                    src={user.avatar}
                    alt="avatar"
                    width={28}
                    height={28}
                    className="rounded-full border border-white/30"
                  />
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-full bg-red-500/80 text-white text-xs hover:bg-red-600 transition ml-2"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-3 py-1 rounded-full bg-indigo-500 text-white text-xs hover:bg-indigo-600 transition ml-2"
                >
                  ورود
                </a>
                <a
                  href="/signup"
                  className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs hover:bg-pink-600 transition"
                >
                  ثبت‌نام
                </a>
              </>
            )}
          </div>
        </div>
        {/* بخش چت با هوش مصنوعی */}
        <div
          className={`w-full max-w-lg ${
            theme === "dark" ? "bg-slate-900/90" : "bg-white/90"
          } border border-white/20 rounded-2xl shadow-2xl p-6 mt-8 backdrop-blur-md`}
        >
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            } mb-4 text-center`}
          >
            گفت‌وگو با هوش مصنوعی
          </h2>
          <div
            ref={chatContainerRef}
            className="flex flex-col gap-2 max-h-80 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1"
          >
            {/* نمایش وضعیت آنلاین */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>
              <span className="text-xs text-white/60">
                {isOnline ? "ربات آنلاین است" : "ربات آفلاین است"}
              </span>
            </div>
            {aiMessages.map((msg, idx) => {
              // نمایش تاریخ اگر روز جدید باشد
              let lastDate = "";
              const msgDate = msg.time ? formatDate(new Date(msg.time)) : "";
              const showDate = msgDate && msgDate !== lastDate;
              if (showDate) lastDate = msgDate;
              return (
                <React.Fragment key={idx}>
                  {showDate && (
                    <div className="text-xs text-center text-white/60 my-2 select-none">
                      {msgDate}
                    </div>
                  )}
                  <div
                    className={`flex items-end gap-2 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    style={{ direction: "rtl" }}
                  >
                    {msg.role === "user" && (
                      <Image
                        src={userAvatar}
                        alt="user"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-white/30 bg-white/20"
                        priority
                      />
                    )}
                    {msg.role === "ai" && (
                      <Image
                        src={aiAvatar}
                        alt="ai"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-white/30 bg-black/20"
                        priority
                      />
                    )}
                    <div className="flex flex-col items-end max-w-[80%]">
                      <div
                        className={`rounded-xl px-4 py-2 text-base whitespace-pre-line transition-all duration-300 shadow-md ${
                          msg.role === "user"
                            ? theme === "dark"
                              ? "bg-gradient-to-l from-white/20 to-white/5 text-white self-end"
                              : "bg-gradient-to-l from-black/10 to-black/0 text-black self-end"
                            : msg.role === "ai"
                            ? theme === "dark"
                              ? "bg-gradient-to-r from-black/40 to-black/10 text-white self-start"
                              : "bg-gradient-to-r from-gray-200 to-white text-black self-start"
                            : "bg-black/20 text-white self-start font-mono animate-pulse"
                        }`}
                        style={{ maxWidth: "80%" }}
                      >
                        {msg.text}
                      </div>
                      {msg.time && (
                        <span className="text-xs text-white/40 mt-1">
                          {formatTime(new Date(msg.time))}
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            {/* indicator متحرک سه نقطه برای تایپ ربات */}
            {aiLoading && !aiMessages.some((m) => m.role === "typing") && (
              <div className="flex items-center gap-2 self-start mt-2">
                <Image
                  src={aiAvatar}
                  alt="ai"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-white/30 bg-black/20"
                  priority
                />
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{ animationDelay: ".2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-white/30 rounded-full animate-bounce"
                    style={{ animationDelay: ".4s" }}
                  ></span>
                </div>
                <span className="text-white/80 font-bold text-base">
                  در حال نوشتن...
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className={`flex-1 rounded-full px-4 py-2 ${
                theme === "dark"
                  ? "bg-white/80 text-black"
                  : "bg-black/10 text-black"
              } focus:outline-none focus:ring-2 focus:ring-white/40 transition shadow`}
              placeholder="سوال خود را بنویسید..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !aiLoading) sendAiMessage();
              }}
              dir="rtl"
              disabled={aiLoading}
              autoFocus
            />
            <label className="flex items-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                disabled={aiLoading}
              />
              <span className="px-3 py-2 rounded-full bg-white/10 text-white text-lg hover:bg-white/20 transition border border-white/10 ml-2">
                📎
              </span>
            </label>
            <button
              onClick={sendAiMessage}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-black/80 to-black/60 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200 border border-white/10"
              disabled={aiLoading}
            >
              ارسال
            </button>
            {aiLoading && (
              <button
                onClick={stopAI}
                className="px-4 py-2 rounded-full bg-red-600 text-white font-bold shadow hover:bg-red-700 transition border border-white/10"
              >
                توقف
              </button>
            )}
          </div>
          {image && (
            <div className="flex items-center gap-2 mt-2">
              <Image
                src={image}
                alt="پیوست"
                className="w-16 h-16 rounded-xl object-cover border border-white/30"
              />
              <button
                onClick={() => setImage(null)}
                className="text-xs text-red-400 hover:underline"
              >
                حذف عکس
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button
              onClick={() => setAiInput("سلام!")}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition"
            >
              سلام!
            </button>
            <button
              onClick={() => setAiInput("یک شعر زیبا بگو.")}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition"
            >
              یک شعر زیبا بگو
            </button>
            <button
              onClick={() => setAiInput("در مورد هوش مصنوعی توضیح بده.")}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition"
            >
              درباره هوش مصنوعی
            </button>
            <button
              onClick={() => setAiInput("یک لطیفه بگو.")}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition"
            >
              یک لطیفه بگو
            </button>
            <button
              onClick={() => setAiInput("یک جمله انگیزشی بگو.")}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition"
            >
              جمله انگیزشی
            </button>
            <button
              onClick={() => {
                setAiMessages([]);
                localStorage.removeItem("aiChatHistory");
              }}
              className="px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs hover:bg-red-500/40 transition"
            >
              پاک‌کردن تاریخچه
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 22s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .scrollbar-thin { scrollbar-width: thin; }
        .scrollbar-thumb-white\/20 { scrollbar-color: rgba(255,255,255,0.2) transparent; }
      `}</style>
    </div>
  );
}
