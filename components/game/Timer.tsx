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
    if (disabled) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        hasTickedRef.current = true;

        if (current <= 1) {
          return 0;
        }

        return current - 1;
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
    <div className="rounded-2xl border border-line bg-panel/90 p-4">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase text-ivory/62">
        <span>Temps</span>
        <span className="text-ivory">{remaining}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ivory/10">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
