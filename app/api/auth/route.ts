import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, verifyPassword } from "./prisma-auth";
import { sendVerificationEmail } from "./email";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { type, email, password, name, avatar } = await req.json();
  if (type === "signup") {
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "ایمیل قبلاً ثبت شده است." },
        { status: 400 }
      );
    }
    const token = crypto.randomBytes(32).toString("hex");
    await createUser({ name, email, password, avatar });
    await prisma.user.update({
      where: { email },
      data: { verificationToken: token },
    });
    await sendVerificationEmail(email, token); // This sends /api/auth/verify?token=... but should be /api/auth/route?token=...
    return NextResponse.json({
      success: true,
      message: "ایمیل تأیید ارسال شد.",
    });
  }
  if (type === "login") {
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "ایمیل شما تأیید نشده است. لطفاً ایمیل خود را تأیید کنید." },
        { status: 403 }
      );
    }
    const valid = await verifyPassword(user, password);
    if (!valid) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, avatar: user.avatar },
    });
  }
  return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
}

export async function GET(req: NextRequest) {
  // Email verification endpoint: /api/auth/route?token=...
  // Use a safe fallback for base URL (for Node.js URL parsing, not for fetch)
  const { searchParams } = new URL(
    req.url ?? "",
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost"
  );
  const token = searchParams.get("token");
  if (!token)
    return NextResponse.json(
      { error: "توکن ارسال نشده است." },
      { status: 400 }
    );
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });
  if (!user)
    return NextResponse.json({ error: "توکن نامعتبر است." }, { status: 400 });
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  });
  return NextResponse.redirect("/login?verified=1");
}
