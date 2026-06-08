type ScorePanelProps = {
  score: number;
  roundNumber: number;
};

export function ScorePanel({ score, roundNumber }: ScorePanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-line bg-panel/90 p-5">
        <div className="text-xs font-semibold uppercase text-ivory/58">Score</div>
        <div className="mt-1 text-3xl font-black text-gold">{score}</div>
      </div>
      <div className="rounded-2xl border border-line bg-panel/90 p-5">
        <div className="text-xs font-semibold uppercase text-ivory/58">Manche</div>
        <div className="mt-1 text-3xl font-black text-ivory">{roundNumber}/12</div>
      </div>
    </div>
  );
}
