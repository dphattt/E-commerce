"use client";

import Link from "next/link";
import { Suspense } from "react";
import { AccountOrdersSectionWithParams } from "@/components/account/AccountOrdersSection";
import { SignOutButton } from "@/components/account/SignOutButton";
import { useAuth } from "@/features/auth";

/* ── types ── */
type MockUser = {
  name: string;
  xp: number;
  xpGoal: number;
  tier: number;
};

type QuickLink = {
  title: string;
  description: string | null;
  href: string;
  appIcon: boolean;
};

/* ── mock data (replace with real auth/API later) ── */
const mockUser: MockUser = {
  name: "DŨNG NGUYỄN",
  xp: 25,
  xpGoal: 1250,
  tier: 1,
};

const tierBenefits: string[] = [
  "15% Birthday reward",
  "Anniversary reward",
  "Exclusive offers",
];

const quickLinks: QuickLink[] = [
  {
    title: "ADDRESS BOOK",
    description: null,
    href: "/account/addresses",
    appIcon: false,
  },
  {
    title: "RETURNS",
    description: "Quick, easy and simple returns with Loop Returns.",
    href: "/account/returns",
    appIcon: false,
  },
  {
    title: "REFER A FRIEND",
    description:
      "Introduce your friends and give them $10 off, and to say thanks we'll give you $10 off your next order too.",
    href: "/account/refer",
    appIcon: false,
  },
  {
    title: "THE GYMSHARK APP",
    description:
      "Shop your faves, get exclusive drops, class bookings and more.",
    href: "#",
    appIcon: true,
  },
  {
    title: "THE TRAINING APP",
    description: "Choose your path, and train your way for free.",
    href: "#",
    appIcon: true,
  },
];

/* ── nav items ── */
type SidebarNavItem = {
  label: string;
  href: string;
};

const sidebarNav: SidebarNavItem[] = [
  { label: "REWARDS", href: "/account/rewards" },
  { label: "POINTS HISTORY", href: "/account/points-history" },
  { label: "LOYALTY OVERVIEW", href: "/account/loyalty" },
];

/* ── icons ── */
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-5 h-5 text-zinc-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-5 h-5 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function AppIcon() {
  return (
    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
      </svg>
    </div>
  );
}

/* ── page ── */
export default function AccountPage() {
  const { user } = useAuth();
  const { xp, xpGoal, tier } = mockUser;
  const name = (user?.name?.trim() || user?.email.split("@")[0] || "MY ACCOUNT")
    .trim()
    .toUpperCase();
  const xpToGo = xpGoal - xp;
  const xpPercent = Math.min((xp / xpGoal) * 100, 100);

  return (
    /* Break out of the layout's px/py to allow full-width hero */
    <div className="-mt-9 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ───────── Loyalty Hero ───────── */}
      <section
        className="px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(180deg, #dbdbdb, #dadbdb)",
          minHeight: "560px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="mx-auto w-full max-w-[1600px] grid grid-cols-1 gap-10 py-14 lg:grid-cols-[280px_1fr_320px] lg:items-center">
          {/* Left: name + sidebar nav */}
          <div>
            <h1 className="mb-8 text-3xl font-bold tracking-tight">{name}</h1>
            <nav className="flex flex-col gap-2">
              {sidebarNav.map((item: SidebarNavItem) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-bold tracking-widest transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: "#CECFD0",
                    color: "#424145",
                    padding: "16px 24px",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: XP + progress */}
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="flex items-start">
              <span className="text-[110px] font-extralight leading-none tabular-nums tracking-tight">
                {xp}
              </span>
              <span className="mt-5 ml-2 text-sm font-bold tracking-widest">
                XP
              </span>
            </div>

            <div className="mt-8 w-full max-w-sm">
              <div className="relative h-px bg-zinc-300">
                <div
                  className="absolute inset-y-0 left-0 bg-zinc-800"
                  style={{ width: `${xpPercent}%` }}
                />
                <div
                  className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-zinc-100"
                  style={{
                    left: `${xpPercent}%`,
                    transform: "translateX(-50%) translateY(-50%)",
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-500 tracking-wide">
                <span>
                  {xp}/{xpGoal}XP
                </span>
                <span>{xpToGo}XP TO GO</span>
              </div>
            </div>
          </div>

          {/* Right: tier benefits */}
          <div className="p-8">
            <p className="mb-6 text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase text-center">
              Tier {tier} Benefits
            </p>
            <ul className="flex flex-col gap-2">
              {tierBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-xs font-bold tracking-widest"
                  style={{
                    backgroundColor: "#CECFD0",
                    color: "#424145",
                    padding: "17.5px 17px",
                  }}
                >
                  <span className="text-zinc-400 font-semibold">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center">
              <ChevronDown />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Body ───────── */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div className="min-h-0">
            <Suspense
              fallback={
                <section
                  style={{ backgroundColor: "#F5F5F5", padding: "32px" }}
                  className="min-h-[320px]"
                >
                  <h2 className="mb-6 text-xs font-bold tracking-[0.2em] uppercase text-zinc-900">
                    Orders
                  </h2>
                  <p className="py-8 text-center text-sm text-zinc-500">
                    Loading orders...
                  </p>
                </section>
              }
            >
              <AccountOrdersSectionWithParams />
            </Suspense>
          </div>

          {/* Quick-link cards */}
          <div className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="flex items-center justify-between bg-zinc-100 hover:bg-zinc-200 p-5 min-h-[123px] transition-colors gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {link.appIcon && <AppIcon />}
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-900">
                      {link.title}
                    </p>
                    {link.description && (
                      <p className="mt-0.5 text-sm text-zinc-500 leading-snug line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight />
              </Link>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="mx-auto max-w-[1600px] mt-10 border-t border-zinc-200 pt-6 pb-10">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
