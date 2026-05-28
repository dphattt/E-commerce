"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

function SignOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={20}
      height={20}
      aria-hidden
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function SignOutButton() {
  const { clearSession } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    clearSession();
    // Future commit: also call POST /api/auth/logout via http client
    // to clear the refresh cookie on the server.
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
    >
      <SignOutIcon />
      Sign Out
    </button>
  );
}
