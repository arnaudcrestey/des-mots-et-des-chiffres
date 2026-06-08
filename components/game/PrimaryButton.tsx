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
    "border border-line bg-ivory/8 text-ivory hover:bg-ivory/12 active:scale-[0.99]",
  ghost: "text-ivory/78 hover:text-ivory"
};

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = ""
}: PrimaryButtonProps) {
  return (
    <button
      className={`min-h-14 w-full rounded-xl px-5 py-4 text-center text-sm font-black uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
