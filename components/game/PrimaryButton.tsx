type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-gold text-night shadow-glow hover:bg-[#e2c47f] active:scale-[0.99]",
  secondary:
    "border border-line bg-ivory/[0.075] text-ivory hover:bg-ivory/[0.11] active:scale-[0.99]",
  ghost: "text-ivory/78 hover:text-ivory",
};

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      className={[
        "min-h-11 w-full rounded-xl px-4 py-3 text-center text-xs font-black uppercase tracking-[0.12em] transition",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "sm:min-h-12 sm:text-sm",
        variants[variant],
        className,
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
