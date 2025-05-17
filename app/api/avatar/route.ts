import { NextRequest, NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var _userAvatars: Record<string, string> | undefined;
}
if (!globalThis._userAvatars) globalThis._userAvatars = {};
const userAvatars: Record<string, string> = globalThis._userAvatars!;

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  try {
    const { email, avatar } = await req.json();
    if (!email || !avatar)
      return NextResponse.json(
        { error: "ایمیل و آواتار الزامی است." },
        { status: 400 }
      );
    userAvatars[email] = avatar;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  // Fix: ensure req.url is always a string
  const url = req.url ?? "";
  // Use a safe fallback for base URL (for Node.js URL parsing, not for fetch)
  const { searchParams } = new URL(
    url,
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost"
  );
  const email = searchParams.get("email");
  if (!email)
    return NextResponse.json(
      { error: "ایمیل ارسال نشده است." },
      { status: 400 }
    );
  return NextResponse.json({ avatar: userAvatars[email] || null });
}
