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
import { loginApi } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/model/useAuth";

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await loginApi(email, password);
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
        Gymshark login
      </h1>

      <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-store-fg-muted">
        Shop your styles, save top picks to your wishlist, track those orders &
        train with us.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 flex w-full flex-col gap-4"
        noValidate
      >
        <AuthFloatingInput
          id="login-email"
          label="Email address*"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthFloatingInput
          id="login-password"
          label="Password*"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          required
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

        <div className="text-center">
          <Link
            href="/account/forgot-password"
            className="text-sm text-store-ink underline underline-offset-2 hover:text-store-fg-muted"
          >
            Forgot password?
          </Link>
        </div>

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
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-store-ink">
        Don&apos;t have an account?{" "}
        <Link
          href="/account/register"
          className="font-semibold underline underline-offset-2 hover:text-store-fg-muted"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
