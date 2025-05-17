import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const verifyUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/api/auth/route?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "تأیید ایمیل تستانتو",
    html: `<div style="font-family: Vazirmatn, sans-serif; direction: rtl; text-align: right;">
      <h2>تأیید ایمیل</h2>
      <p>برای فعال‌سازی حساب خود روی لینک زیر کلیک کنید:</p>
      <a href="${verifyUrl}" style="color:#7c3aed;font-weight:bold;">تأیید ایمیل</a>
      <p>اگر شما این درخواست را ارسال نکرده‌اید، این ایمیل را نادیده بگیرید.</p>
    </div>`,
  });
}
