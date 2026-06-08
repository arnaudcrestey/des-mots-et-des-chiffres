"use client";

import { useState } from "react";
import { GameShell } from "@/components/game/GameShell";
import { PrimaryButton } from "@/components/game/PrimaryButton";

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <GameShell />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-5">
      <section className="flex flex-1 flex-col justify-between gap-8 py-6">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase text-gold">
            Jeu local premium
          </div>
          <div>
            <h1 className="text-5xl font-black leading-[0.96] text-ivory">
              DES MOTS
              <span className="block text-gold">& DES CHIFFRES</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-ivory/68">
              Douze manches rapides pour tester vocabulaire, intuition et calcul
              mental dans une interface pensée pour le tactile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-line bg-panel/86 p-4 shadow-panel">
            <div className="text-3xl font-black text-gold">6</div>
            <div className="mt-1 text-sm font-semibold text-ivory/68">
              manches Lettres
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel/86 p-4 shadow-panel">
            <div className="text-3xl font-black text-gold">6</div>
            <div className="mt-1 text-sm font-semibold text-ivory/68">
              manches Chiffres
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel/86 p-4 shadow-panel">
            <div className="text-3xl font-black text-gold">60s</div>
            <div className="mt-1 text-sm font-semibold text-ivory/68">
              par manche
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel/86 p-4 shadow-panel">
            <div className="text-3xl font-black text-gold">0</div>
            <div className="mt-1 text-sm font-semibold text-ivory/68">
              service externe
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <PrimaryButton onClick={() => setStarted(true)}>Commencer</PrimaryButton>
          <p className="text-center text-xs leading-5 text-ivory/44">
            Tout fonctionne localement, sans compte et sans base de données.
          </p>
        </div>
      </section>
    </main>
  );
}
