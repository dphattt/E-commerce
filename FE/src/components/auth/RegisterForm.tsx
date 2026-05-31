"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthFloatingInput } from "@/components/auth/AuthFloatingInput";
import {
  authSubmitButtonClassName,
  getAuthFormErrorMessage,
} from "@/components/auth/auth-form-shared";
import { GymsharkLogo } from "@/components/auth/GymsharkLogo";
import { registerApi } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/model/useAuth";

export function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");

    try {
      const { token, user } = await registerApi({ email, password, name });
      setSession(user, token);
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(getAuthFormErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10 sm:py-16">
      <GymsharkLogo className="mb-6" />

      <h1 className="text-base font-bold uppercase tracking-[0.12em] text-store-ink-strong">
        Gymshark signup
      </h1>

      <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-store-fg-muted">
        One account, across all apps, just to make things a little easier.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 flex w-full flex-col gap-4"
        noValidate
      >
        <AuthFloatingInput
          id="register-first-name"
          label="First Name"
          type="text"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <AuthFloatingInput
          id="register-last-name"
          label="Last Name"
          type="text"
          name="lastName"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <AuthFloatingInput
          id="register-dob"
          label="Date Of Birth"
          type="text"
          name="dateOfBirth"
          autoComplete="bday"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />

        <AuthFloatingInput
          id="register-email"
          label="Email address*"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthFloatingInput
          id="register-password"
          label="Password*"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-store-fg-muted hover:text-store-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-5" strokeWidth={1.5} />
              ) : (
                <Eye className="size-5" strokeWidth={1.5} />
              )}
            </button>
          }
        />

        <label className="flex cursor-pointer items-start gap-3 text-left text-xs leading-relaxed text-store-fg-muted">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded border-store-border accent-store-ink-strong"
          />
          <span>
            Tick here to receive emails about our products, apps, sales,
            exclusive content and more. See our{" "}
            <Link
              href="/legal/privacy"
              className="text-store-ink underline underline-offset-2 hover:text-store-fg-muted"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        {error ? (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={authSubmitButtonClassName}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-store-ink">
        Already have an account?{" "}
        <Link
          href="/account/login"
          className="font-semibold underline underline-offset-2 hover:text-store-fg-muted"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
