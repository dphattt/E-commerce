import nodemailer from "nodemailer";

type VerificationEmailParams = {
  to: string;
  name?: string;
  verificationUrl: string;
};

function smtpPort(): number {
  const raw = process.env.SMTP_PORT;
  if (!raw) return 587;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 587;
}

function smtpSecure(): boolean {
  return process.env.SMTP_SECURE === "true";
}

function mailFrom(): string {
  return process.env.MAIL_FROM || process.env.SMTP_USER || "";
}

function hasSmtpConfig(): boolean {
  return Boolean(process.env.SMTP_HOST && mailFrom());
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: VerificationEmailParams): Promise<void> {
  if (!hasSmtpConfig()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[auth] Email verification link for ${to}: ${verificationUrl}`,
      );
      return;
    }
    throw new Error("SMTP configuration is missing");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort(),
    secure: smtpSecure(),
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  const displayName = name?.trim() || "there";
  await transporter.sendMail({
    from: mailFrom(),
    to,
    subject: "Verify your email address",
    text: [
      `Hi ${displayName},`,
      "",
      "Please verify your email address to finish creating your account.",
      verificationUrl,
      "",
      "This link expires in 24 hours.",
    ].join("\n"),
    html: `
      <p>Hi ${displayName},</p>
      <p>Please verify your email address to finish creating your account.</p>
      <p><a href="${verificationUrl}">Verify email address</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
