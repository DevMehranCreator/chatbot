import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// Helper: get user from session/cookie (for demo, use email in body)
async function getUserFromRequest(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

export async function POST(req: NextRequest) {
  const { email, message } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Save user message
  await prisma.chatMessage.create({
    data: {
      userId: user.id,
      content: message,
      role: "user",
    },
  });

  // کلید را در .env.local قرار دهید و اینجا بخوانید:
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "شما یک دستیار فارسی هستید. پاسخ‌ها را کامل، مودبانه و فارسی بده. اگر سوال طولانی بود، پاسخ را به طور کامل و با جزئیات ارائه کن.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.95,
      stream: true, // فعال‌سازی استریم
    }),
  });

  if (!res.ok || !res.body) {
    const error = await res.text();
    return NextResponse.json({ error: "AI error: " + error }, { status: 500 });
  }

  // بازگشت استریم به کلاینت
  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function GET(req: NextRequest) {
  // Get chat history for a user (by email param)
  // Use a safe fallback for base URL (for Node.js URL parsing, not for fetch)
  const { searchParams } = new URL(
    req.url ?? "",
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost"
  );
  const email = searchParams.get("email");
  if (!email)
    return NextResponse.json(
      { error: "ایمیل ارسال نشده است." },
      { status: 400 }
    );
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const history = await prisma.chatMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: { content: true, role: true, createdAt: true },
  });
  return NextResponse.json({ history });
}
