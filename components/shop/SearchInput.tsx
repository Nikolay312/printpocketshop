interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <div className="relative w-full sm:max-w-sm">
      {/* Icon */}
      <span
        className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted"
        aria-hidden
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products"
        className="
          w-full rounded-md border border-border bg-background
          pl-10 pr-4 py-2.5 text-sm text-foreground
          placeholder:text-muted
          transition
          focus:outline-none focus:border-[var(--accent)] focus-visible:shadow-[var(--ring)]
        "
        aria-label="Search products"
      />
    </div>
  );
}
