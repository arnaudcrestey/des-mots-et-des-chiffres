"use client";

import { useEffect, useRef, useState } from "react";
import { GAME_CONFIG } from "@/core/game/config";

type TimerProps = {
  activeKey: number;
  disabled: boolean;
  onExpire: () => void;
};

export function Timer({ activeKey, disabled, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState<number>(GAME_CONFIG.roundSeconds);
  const hasExpiredRef = useRef(false);
  const hasTickedRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;
    hasTickedRef.current = false;
    setRemaining(GAME_CONFIG.roundSeconds);
  }, [activeKey]);

  useEffect(() => {
    if (disabled) return;

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        hasTickedRef.current = true;
        return current <= 1 ? 0 : current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [disabled, activeKey]);

  useEffect(() => {
    if (disabled || remaining > 0 || hasExpiredRef.current || !hasTickedRef.current) {
      return;
    }

    hasExpiredRef.current = true;
    onExpire();
  }, [disabled, onExpire, remaining]);

  const percentage = (remaining / GAME_CONFIG.roundSeconds) * 100;

  return (
    <div className="rounded-xl border border-line bg-panel/90 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
      <div className="mb-1.5 flex items-center justify-between text-[0.65rem] font-black uppercase tracking-[0.12em] text-ivory/55">
        <span>Temps</span>
        <span className="text-xs text-ivory sm:text-sm">{remaining}s</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-ivory/10 sm:h-2">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
