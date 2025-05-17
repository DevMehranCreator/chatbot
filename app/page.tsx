import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  // Fetch avatars from API (server-side, always use relative path)
  let avatars: string[] = [];
  try {
    const res = await fetch("/api/avatars", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch avatars");
    const data = await res.json();
    avatars = data.avatars || [];
  } catch {
    // Optionally log error or show fallback UI
    avatars = [];
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/60 dark:bg-gray-900/80 shadow-lg backdrop-blur-lg z-20 rounded-b-2xl border-b border-indigo-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-chatbot.svg"
            alt="Logo"
            width={44}
            height={44}
            className="rounded-full shadow-lg"
            priority
          />
          <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
            Testanto
          </span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="#features"
            className="text-indigo-700 dark:text-pink-200 hover:text-pink-500 font-semibold transition text-lg"
          >
            ویژگی‌ها
          </Link>
          <Link
            href="#about"
            className="text-indigo-700 dark:text-pink-200 hover:text-pink-500 font-semibold transition text-lg"
          >
            درباره ما
          </Link>
          <Link
            href="/testanto"
            className="text-indigo-700 dark:text-pink-200 hover:text-pink-500 font-semibold transition text-lg"
          >
            چت‌بات
          </Link>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow hover:scale-105 transition-transform">
              ورود
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-2 rounded-full border-2 border-pink-400 text-pink-600 font-bold bg-white/70 hover:bg-pink-50 shadow hover:scale-105 transition-transform">
              ثبت‌نام
            </button>
          </Link>
        </div>
      </nav>

      {/* Animated SVG background */}
      <div className="absolute inset-0 -z-10 animated-gradient-bg pointer-events-none" />
      <svg
        className="animated-bg absolute inset-0 w-full h-full -z-20"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          className="cell-blob blob1"
          cx="400"
          cy="400"
          rx="320"
          ry="220"
          fill="#ff6ec4"
          fillOpacity="0.22"
        />
        <ellipse
          className="cell-blob blob2"
          cx="1500"
          cy="700"
          rx="300"
          ry="200"
          fill="#7873f5"
          fillOpacity="0.16"
        />
        <ellipse
          className="cell-blob blob3"
          cx="1000"
          cy="200"
          rx="250"
          ry="180"
          fill="#42e695"
          fillOpacity="0.15"
        />
        <ellipse
          className="cell-blob blob4"
          cx="700"
          cy="900"
          rx="200"
          ry="140"
          fill="#f9d423"
          fillOpacity="0.13"
        />
      </svg>

      {/* Header Section */}
      <header className="flex flex-col items-center justify-center flex-1 py-20 px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
          به <span className="text-pink-500">تستانتو</span> خوش آمدید
        </h1>
        <p className="text-xl md:text-2xl text-indigo-800 dark:text-pink-200 mb-10 max-w-2xl mx-auto font-semibold">
          هوشمندترین چت‌بات فارسی با طراحی مدرن، امکانات پیشرفته و تجربه کاربری
          بی‌نظیر. همین حالا حساب کاربری بسازید و گفتگو را آغاز کنید!
        </p>
        <Link href="/testanto">
          <button className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 to-indigo-500 text-white font-extrabold text-2xl shadow-2xl hover:scale-105 transition-transform">
            شروع گفتگو
          </button>
        </Link>
      </header>

      {/* Avatar Picker */}
      <section className="flex flex-col items-center gap-4 py-8">
        <h2 className="text-2xl font-extrabold text-indigo-700 dark:text-pink-200 mb-4">
          آواتار خود را انتخاب کنید
        </h2>
        <div className="flex gap-4 flex-wrap justify-center glassmorphism p-4 rounded-2xl shadow-xl bg-white/40 dark:bg-gray-800/60">
          {avatars.map((avatar, idx) => (
            <button
              key={idx}
              className="rounded-full border-2 border-transparent hover:border-pink-400 transition p-1 focus:outline-none shadow-lg"
              disabled
              aria-label={`انتخاب آواتار ${idx + 1}`}
            >
              <Image
                src={avatar}
                alt={`Avatar ${idx + 1}`}
                width={72}
                height={72}
                className="rounded-full"
              />
            </button>
          ))}
        </div>
        <span className="text-base text-pink-500 dark:text-pink-300 mt-2">
          (برای انتخاب آواتار نیاز به ورود دارید)
        </span>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 px-4 max-w-5xl mx-auto grid md:grid-cols-3 gap-10"
      >
        <div className="bg-gradient-to-br from-indigo-100 via-pink-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <Image src="/avatars/avatar1.png" alt="AI" width={56} height={56} />
          <h3 className="font-extrabold text-xl mt-4 mb-2 text-indigo-600 dark:text-pink-200">
            پاسخ‌دهی هوشمند
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
            پاسخ‌های سریع و دقیق با هوش مصنوعی پیشرفته و پشتیبانی از زبان فارسی.
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-100 via-yellow-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <Image
            src="/avatars/avatar2.png"
            alt="History"
            width={56}
            height={56}
          />
          <h3 className="font-extrabold text-xl mt-4 mb-2 text-pink-600 dark:text-yellow-200">
            ذخیره تاریخچه چت
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
            تمام گفتگوهای شما به صورت امن و خصوصی ذخیره می‌شود و همیشه در دسترس
            است.
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 via-indigo-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <Image
            src="/avatars/avatar3.png"
            alt="Theme"
            width={56}
            height={56}
          />
          <h3 className="font-extrabold text-xl mt-4 mb-2 text-yellow-600 dark:text-indigo-200">
            تم تاریک و روشن
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
            امکان تغییر تم برای تجربه کاربری بهتر در هر شرایط نوری.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-pink-200 mb-6">
          درباره تستانتو
        </h2>
        <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
          تستانتو یک چت‌بات فارسی با طراحی مدرن و امکانات پیشرفته است که توسط
          مهران ساخته شده. هدف ما ارائه بهترین تجربه گفتگو با هوش مصنوعی برای
          کاربران ایرانی است.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white mt-auto shadow-inner border-t-2 border-indigo-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-chatbot.svg"
              alt="Logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="font-extrabold text-xl bg-gradient-to-r from-yellow-200 via-pink-100 to-indigo-200 bg-clip-text text-transparent">
              Testanto
            </span>
          </div>
          <div className="flex gap-6 text-lg">
            <a
              href="https://github.com/mehran-dev"
              target="_blank"
              rel="noopener"
              className="hover:text-yellow-300 transition"
            >
              <i className="fab fa-github"></i> گیت‌هاب
            </a>
            <a
              href="mailto:mehran@email.com"
              className="hover:text-pink-200 transition"
            >
              <i className="fas fa-envelope"></i> تماس
            </a>
            <Link href="/" className="hover:text-indigo-200 transition">
              صفحه اصلی
            </Link>
          </div>
          <div className="text-sm text-yellow-100 dark:text-gray-400 mt-2 md:mt-0">
            ساخته شده با <span className="text-pink-300">❤️</span> توسط{" "}
            <span className="font-bold text-white">مهران</span> |{" "}
            {new Date().getFullYear()}
          </div>
        </div>
      </footer>
      <style>{`
        .glassmorphism {
          backdrop-filter: blur(12px) saturate(180%);
          background: rgba(255,255,255,0.25);
        }
      `}</style>
    </div>
  );
}
