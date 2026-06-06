"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeSearch } from "@/lib/vietnam-address";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id?: string;
  label: string;
  placeholder?: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  id,
  label,
  placeholder = "Tìm kiếm...",
  options,
  value,
  onChange,
  disabled = false,
  className,
}: SearchableSelectProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) return options.slice(0, 80);
    return options
      .filter((o) => normalizeSearch(o.label).includes(q))
      .slice(0, 80);
  }, [options, query]);

  useEffect(() => {
    if (selected && !open) {
      setQuery(selected.label);
    }
    if (!value && !open) {
      setQuery("");
    }
  }, [selected, value, open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-1.5", className)}>
      <label
        htmlFor={inputId}
        className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => !disabled && setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange("");
          }}
          className="h-11 w-full rounded-lg border border-store-border bg-store-paper px-3 pr-9 text-sm text-store-ink-strong outline-none transition-colors focus:border-store-ink-strong disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="off"
        />
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-store-fg-muted" />
        {open && !disabled ? (
          <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-store-border bg-store-paper py-1 shadow-lg">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-store-fg-muted">
                Không tìm thấy
              </li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-store-surface",
                      opt.value === value
                        ? "font-bold text-store-ink-strong"
                        : "text-store-fg-muted",
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(opt.value);
                      setQuery(opt.label);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
