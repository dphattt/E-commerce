"use client";

import Link from "next/link";
import { useId, useState } from "react";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterPromoCard = {
  href: string;
  /** Main line on black panel */
  headline: string;
  /** Grey bar caption */
  caption: string;
};

export type FooterLegalLink = {
  label: string;
  href: string;
};

export type FooterSocial = {
  label: string;
  href: string;
  icon: "discord" | "facebook" | "pinterest" | "youtube" | "instagram" | "x" | "tiktok";
};

export type SiteFooterProps = {
  brandName?: string;
  columns?: FooterColumn[];
  promoCards?: FooterPromoCard[];
  legalLinks?: FooterLegalLink[];
  copyrightSuffix?: string;
  /** e.g. "ROW" — region label next to globe */
  regionLabel?: string;
  regionHref?: string;
  socials?: FooterSocial[];
  paymentMethods?: string[];
  className?: string;
};

const defaultColumns: FooterColumn[] = [
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/help/faq" },
      { label: "Delivery Information", href: "/help/delivery" },
      { label: "Returns Policy", href: "/help/returns" },
      { label: "Make A Return", href: "/help/make-return" },
      { label: "Orders", href: "/orders" },
      { label: "Submit a Fake", href: "/help/submit-fake" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "Login", href: "/account/login" },
      { label: "Register", href: "/account/register" },
    ],
  },
  {
    title: "Pages",
    links: [
      { label: "Gymshark Central", href: "/central" },
      { label: "Gymshark Loyalty", href: "/loyalty" },
      { label: "Careers", href: "/careers" },
      { label: "About Us", href: "/about" },
      { label: "Student Discount", href: "/students" },
      { label: "Training App", href: "/app" },
      { label: "Factory List", href: "/factories" },
    ],
  },
];

const defaultPromo = (brand: string): FooterPromoCard[] => [
  { href: "/blog", headline: `${brand} Central`, caption: "Blog" },
  { href: "/students", headline: `${brand} Students`, caption: "Students get 15% off" },
  { href: "/newsletter", headline: "✉", caption: "Email sign up" },
];

const defaultLegal: FooterLegalLink[] = [
  { label: "Terms and Conditions", href: "/legal/terms" },
  { label: "Terms of Use", href: "/legal/use" },
  { label: "Privacy Notice", href: "/legal/privacy" },
  { label: "Cookie Policy", href: "/legal/cookies" },
  { label: "Modern Slavery", href: "/legal/modern-slavery" },
];

const defaultPaymentMethods = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"];

const defaultSocial: FooterSocial[] = [
  { label: "Discord", href: "https://discord.com", icon: "discord" },
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
];

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`size-5 shrink-0 text-store-fg-muted transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-4 shrink-0 text-store-fg-muted"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function SocialIcon({ name }: { name: FooterSocial["icon"] }) {
  const common = "size-4 text-store-on-accent";
  switch (name) {
    case "discord":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.175 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.994-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    default:
      return null;
  }
}

function LinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {links.map((item) => (
        <li key={item.href + item.label}>
          <Link
            href={item.href}
            className="text-sm text-store-fg-muted transition-colors hover:text-store-ink"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialRow({ socials }: { socials: FooterSocial[] }) {
  return (
    <>
      {socials.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="inline-flex size-10 items-center justify-center rounded-full bg-store-ink-strong text-store-on-accent transition-opacity hover:opacity-85"
        >
          <SocialIcon name={s.icon} />
        </Link>
      ))}
    </>
  );
}

function PromoCard({ card }: { card: FooterPromoCard }) {
  const isEnvelope = card.headline.trim() === "✉" || card.headline === "✉";
  return (
    <Link
      href={card.href}
      className="group block overflow-hidden rounded border border-store-border bg-store-paper shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex min-h-[72px] items-center justify-center bg-zinc-800 px-3 py-4 text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-white group-hover:opacity-90 sm:min-h-[76px] sm:text-xs dark:bg-zinc-700">
        {isEnvelope ? (
          <span className="text-lg" aria-hidden>
            ✉
          </span>
        ) : (
          <span>{card.headline}</span>
        )}
      </div>
      <div className="border-t border-store-border bg-[#e5e5e5] px-2 py-2.5 text-center text-[10px] font-semibold uppercase leading-snug tracking-wide text-store-ink-strong sm:text-[11px] dark:bg-store-border dark:text-store-ink">
        {card.caption}
      </div>
    </Link>
  );
}

export function SiteFooter({
  brandName = "GYMSHARK",
  columns = defaultColumns,
  promoCards,
  legalLinks = defaultLegal,
  copyrightSuffix = "Limited | All Rights Reserved. | We Do Gym.",
  regionLabel = "ROW",
  regionHref = "/region",
  socials = defaultSocial,
  paymentMethods = defaultPaymentMethods,
  className = "",
}: SiteFooterProps) {
  const cards = promoCards ?? defaultPromo(brandName);
  const baseId = useId();
  const [openMobile, setOpenMobile] = useState<string | null>(null);

  const toggle = (title: string) => {
    setOpenMobile((prev) => (prev === title ? null : title));
  };

  const year = new Date().getFullYear();

  const columnHeadingClass =
    "mb-4 text-sm font-bold uppercase leading-tight tracking-wide text-store-ink-strong";

  return (
    <footer
      className={`mt-auto border-t border-store-border bg-store-surface-2 text-store-ink dark:bg-store-paper ${className}`}
    >
      <div className="mx-auto max-w-[1600px] px-4 pt-8 pb-0 sm:px-[30px] sm:pt-[30px] lg:px-8 lg:pt-8">
        {/* lg+: nav cụm trái tối đa ~nửa khung; promo + social chiếm phần còn lại */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,50%)_minmax(280px,1fr)] lg:items-start lg:gap-x-10 lg:gap-y-0 lg:pb-[60px] xl:gap-x-12">
          <nav
            className="flex min-w-0 w-full max-w-full justify-start gap-6 min-[1100px]:gap-8 xl:gap-10"
            aria-label="Footer navigation"
          >
            {columns.map((col) => (
              <div key={col.title} className="min-w-0 flex-1 basis-0">
                <h2 className={columnHeadingClass}>{col.title}</h2>
                <LinkList links={col.links} />
              </div>
            ))}
          </nav>
          <div className="min-w-0 justify-self-stretch">
            <h2 className={columnHeadingClass}>
              More about {brandName}
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {cards.map((card, i) => (
                <PromoCard key={`${card.href}-${i}`} card={card} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              <SocialRow socials={socials} />
            </div>
          </div>
        </div>

        {/* sm–md: 6-col grid — Help | Account | Pages then full-width promo + social */}
        <div className="hidden sm:grid sm:grid-cols-6 sm:gap-x-8 sm:gap-y-10 sm:pb-12 lg:hidden">
          <nav className="contents" aria-label="Footer navigation">
            {columns.map((col) => (
              <div key={col.title} className="col-span-2 min-w-0">
                <h2 className={columnHeadingClass}>{col.title}</h2>
                <LinkList links={col.links} />
              </div>
            ))}
          </nav>
          <div className="col-span-6 min-w-0">
            <h2 className={columnHeadingClass}>
              More about {brandName}
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:max-w-3xl md:grid-cols-3">
              {cards.map((card, i) => (
                <PromoCard key={`${card.href}-t-${i}`} card={card} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              <SocialRow socials={socials} />
            </div>
          </div>
        </div>

        {/* Mobile: accordion + stacked promos */}
        <div className="sm:hidden">
          {columns.map((col) => {
            const id = `${baseId}-${col.title}`;
            const open = openMobile === col.title;
            return (
              <div key={col.title} className="border-b border-store-border">
                <button
                  type="button"
                  id={`${id}-btn`}
                  aria-expanded={open}
                  aria-controls={`${id}-panel`}
                  className="flex w-full items-center justify-between py-4 text-left"
                  onClick={() => toggle(col.title)}
                >
                  <span className="text-sm font-bold uppercase tracking-wide text-store-ink-strong">
                    {col.title}
                  </span>
                  <IconChevron open={open} />
                </button>
                {open && (
                  <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="pb-4">
                    <LinkList links={col.links} />
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-8">
            <h2 className={columnHeadingClass}>
              More about {brandName}
            </h2>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
              {cards.map((card, i) => (
                <div key={`m-${card.href}-${i}`} className="w-[min(260px,78vw)] shrink-0 snap-start">
                  <PromoCard card={card} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Social media">
              <SocialRow socials={socials} />
            </div>
          </div>
        </div>

        {/* Payment row — left aligned (reference); socials live under promo blocks above */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-store-border bg-store-surface-2 pt-8 sm:mt-10 sm:justify-start sm:gap-3 lg:mt-0 lg:bg-transparent lg:pt-10 dark:bg-store-paper"
          aria-label="Payment methods"
        >
          {paymentMethods.map((name) => (
            <span
              key={name}
              className="rounded border border-store-border bg-store-paper px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-store-ink dark:bg-store-surface"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Legal row */}
        <div className="mt-6 flex flex-col gap-4 border-t border-store-border pt-6 text-xs text-store-fg-muted sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-y-3 lg:mt-8 lg:pb-[60px]">
          <p className="order-2 sm:order-1">
            © {year} | {brandName} {copyrightSuffix}
          </p>
          <div className="order-1 flex flex-col gap-3 sm:order-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            <nav aria-label="Legal" className="flex flex-wrap gap-x-3 gap-y-2">
              {legalLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap underline-offset-2 hover:text-store-ink hover:underline"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link
              href={regionHref}
              className="inline-flex items-center gap-1.5 self-start font-medium text-store-ink hover:text-store-fg-muted sm:self-center"
            >
              <IconGlobe className="size-4 shrink-0" aria-hidden />
              <span>{regionLabel}</span>
              <IconChevronDown />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
