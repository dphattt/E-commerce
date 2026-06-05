"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthFloatingInput } from "@/components/auth/AuthFloatingInput";
import {
  authSubmitButtonClassName,
  getAuthFormErrorMessage,
} from "@/components/auth/auth-form-shared";
import { GymsharkLogo } from "@/components/auth/GymsharkLogo";
import { registerSchema, type RegisterFormValues } from "@/components/auth/validate";
import { registerApi } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/model/useAuth";

export function RegisterForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      marketingOptIn: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    const name = [values.firstName?.trim(), values.lastName?.trim()]
      .filter(Boolean)
      .join(" ");
    try {
      const { token, user } = await registerApi({ email: values.email, password: values.password, name });
      setSession(user, token);
      router.push("/account");
      router.refresh();
    } catch (err) {
      setServerError(getAuthFormErrorMessage(err));
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
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex w-full flex-col gap-4"
        noValidate
      >
        <AuthFloatingInput
          id="register-first-name"
          label="First Name"
          type="text"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <AuthFloatingInput
          id="register-last-name"
          label="Last Name"
          type="text"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />

        <AuthFloatingInput
          id="register-dob"
          label="Date Of Birth"
          type="text"
          autoComplete="bday"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />

        <AuthFloatingInput
          id="register-email"
          label="Email address*"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthFloatingInput
          id="register-password"
          label="Password*"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
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

        <AuthFloatingInput
          id="register-confirm-password"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
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
            className="mt-0.5 size-4 shrink-0 rounded border-store-border accent-store-ink-strong"
            {...register("marketingOptIn")}
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

        {serverError ? (
          <p role="alert" className="text-center text-sm text-destructive">
            {serverError}
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
