type TileProps = {
  children: React.ReactNode;
  tone?: "gold" | "dark";
  disabled?: boolean;
  selected?: boolean;
};

export function Tile({ children, tone = "dark", disabled = false, selected = false }: TileProps) {
  return (
    <div
      className={`flex aspect-square min-w-0 items-center justify-center rounded-xl border text-2xl font-black uppercase shadow-panel transition ${
        selected
          ? "border-gold bg-gold text-night ring-2 ring-gold/35"
          : tone === "gold"
          ? "border-gold/50 bg-gold text-night"
          : "border-line bg-ivory/[0.07] text-ivory"
      } ${disabled ? "opacity-30 grayscale" : ""}`}
    >
      {children}
    </div>
  );
}
