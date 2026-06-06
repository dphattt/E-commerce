"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { googleLoginApi } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/model/useAuth";
import { getAuthFormErrorMessage } from "@/components/auth/auth-form-shared";

type GoogleAuthButtonProps = {
  onError: (message: string) => void;
};

export function GoogleAuthButton({ onError }: GoogleAuthButtonProps) {
  const router = useRouter();
  const { setSession } = useAuth();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-store-fg-muted">
        <span className="h-px flex-1 bg-store-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-store-border" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          text="continue_with"
          width="360"
          onSuccess={async ({ credential }) => {
            if (!credential) {
              onError("Google did not return a valid credential.");
              return;
            }

            try {
              const { token, user } = await googleLoginApi(credential);
              setSession(user, token);
              router.push("/account");
              router.refresh();
            } catch (err) {
              onError(getAuthFormErrorMessage(err));
            }
          }}
          onError={() => {
            onError("Google sign in was cancelled or failed.");
          }}
        />
      </div>
    </div>
  );
}
