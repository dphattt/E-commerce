import nodemailer from "nodemailer";

type VerificationEmailParams = {
  to: string;
  name?: string;
  verificationUrl: string;
};

type PasswordResetEmailParams = {
  to: string;
  name?: string;
  resetUrl: string;
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

function transporter() {
  return nodemailer.createTransport({
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

  const displayName = name?.trim() || "there";
  await transporter().sendMail({
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

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailParams): Promise<void> {
  if (!hasSmtpConfig()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[auth] Password reset link for ${to}: ${resetUrl}`);
      return;
    }
    throw new Error("SMTP configuration is missing");
  }

  const displayName = name?.trim() || "there";
  await transporter().sendMail({
    from: mailFrom(),
    to,
    subject: "Reset your password",
    text: [
      `Hi ${displayName},`,
      "",
      "We received a request to reset your password.",
      resetUrl,
      "",
      "This link expires in 1 hour. If you did not request a password reset, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>Hi ${displayName},</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 1 hour. If you did not request a password reset, you can ignore this email.</p>
    `,
  });
}
