import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (body.companyWebsite) return NextResponse.json({ success: true });
  const name = clean(body.name, 100);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 30);
  const subject = clean(body.subject, 160);
  const message = clean(body.message, 5000);
  if (!name || name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || subject.length < 3 || message.length < 10 || body.consent !== "on") {
    return NextResponse.json({ error: "Invalid form data" }, { status: 422 });
  }
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error("Contact form SMTP configuration is incomplete", missing);
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL || "serwis@cafixo.pl",
      replyTo: email,
      subject: `[4Swiss Trade] ${subject}`,
      text: `Imię i nazwisko: ${name}\nE-mail: ${email}\nTelefon: ${phone || "-"}\nJęzyk: ${clean(body.locale, 5)}\n\n${message}`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
