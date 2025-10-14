import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeTransition } from '../components/FadeTransition';
import { FooterNav } from '../components/FooterNav';
import { ImageChoiceGrid } from '../components/ImageChoiceGrid';
import { ParallaxLayer } from '../components/ParallaxLayer';
import { TopBar } from '../components/TopBar';
import type { MPCS1Manifest } from '../lib/manifest';

interface EntryProps {
  manifest: MPCS1Manifest;
  selectedGateId?: string;
  onSelectGate: (gateId: string) => void;
}

export default function Entry({ manifest, selectedGateId, onSelectGate }: EntryProps) {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<string | undefined>(selectedGateId);

  useEffect(() => {
    setChoice(selectedGateId);
  }, [selectedGateId]);

  const gateLookup = useMemo(() => {
    return new Map(manifest.gates.map((gate) => [gate.id, gate]));
  }, [manifest.gates]);

  const images = manifest.entry_round.map((entry) => {
    const gate = gateLookup.get(entry.gateId);
    return {
      src: entry.image,
      alt: gate ? gate.name : entry.gateId,
      key: entry.gateId
    };
  });

  const selected = choice ? gateLookup.get(choice) : undefined;

  const handleNext = () => {
    if (!choice) {
      return;
    }

    onSelectGate(choice);
    navigate(`/mpcs1/${choice}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-surface via-surfaceSoft/60 to-surface">
      <TopBar />
      <main className="flex flex-1 flex-col gap-10 pb-12">
        <section className="relative flex flex-col items-center gap-8 px-6 pt-8 text-center">
          <ParallaxLayer offset={20}>
            <h1 className="text-3xl font-semibold tracking-[0.2em] text-textPrimary">Choose Your Gate</h1>
            <p className="mt-3 max-w-2xl text-sm text-textSecondary">
              The MPCS-1 questionnaire begins with a portal. Trust your intuition, let the imagery draw you in, and move forward
              with the selection that resonates most tonight.
            </p>
          </ParallaxLayer>
        </section>
        <div className="px-6">
          <FadeTransition>
            <ImageChoiceGrid images={images} value={choice} onChange={setChoice} />
          </FadeTransition>
        </div>
        <FadeTransition>
          {selected ? (
            <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/5 bg-surfaceSoft/60 px-6 py-5 text-sm text-textSecondary shadow-ambient">
              <div className="flex flex-wrap items-center gap-3 text-textSecondary/80">
                <span className="text-xs uppercase tracking-[0.3em] text-textSecondary">Seed Axes</span>
                {manifest.entry_round
                  .find((entry) => entry.gateId === selected.id)?.seedAxes.map((axis) => (
                    <span
                      key={axis}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-textPrimary/80"
                    >
                      {axis}
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-6 text-center text-sm text-textSecondary">
              Select a gate to reveal its tonal axes.
            </div>
          )}
        </FadeTransition>
      </main>
      <FooterNav onNext={choice ? handleNext : undefined} />
    </div>
  );
}
