import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FooterNav } from '../components/FooterNav';
import { GateFrame } from '../components/GateFrame';
import { ImageChoiceGrid } from '../components/ImageChoiceGrid';
import { ProgressRail } from '../components/ProgressRail';
import { TextRoundCard } from '../components/TextRoundCard';
import { TopBar } from '../components/TopBar';
import type { AnswersState, GateAnswerMap, RoundAnswerKey } from '../App';
import type { MPCS1Manifest } from '../lib/manifest';

const ROUND_ORDER: RoundAnswerKey[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];
const TEXT_OPTIONS = [
  { id: 'A' as const, text: 'Lean into the energy, amplify what is already awake.' },
  { id: 'B' as const, text: 'Observe and document, no sudden moves yet.' },
  { id: 'C' as const, text: 'Pull back gently and reset the scene with intention.' }
];

interface GateProps {
  manifest: MPCS1Manifest;
  answers: AnswersState;
  onSetAnswer: (gateId: string, round: RoundAnswerKey, value: string) => void;
}

function splitVignette(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function Gate({ manifest, answers, onSetAnswer }: GateProps) {
  const params = useParams();
  const navigate = useNavigate();
  const gateId = params.gateId;

  const gate = manifest.gates.find((item) => item.id === gateId);
  const gateIndex = gate ? manifest.gates.findIndex((item) => item.id === gate.id) : -1;

  const storedAnswers: GateAnswerMap = gate && answers.gateAnswers[gate.id] ? answers.gateAnswers[gate.id] : {};

  const initialRoundIndex = useMemo(() => {
    if (!gate) {
      return 0;
    }

    for (let index = 0; index < ROUND_ORDER.length; index += 1) {
      const roundKey = ROUND_ORDER[index];
      if (!storedAnswers[roundKey]) {
        return index;
      }
    }

    return ROUND_ORDER.length - 1;
  }, [gate, storedAnswers]);

  const [roundIndex, setRoundIndex] = useState(initialRoundIndex);

  useEffect(() => {
    setRoundIndex(initialRoundIndex);
  }, [initialRoundIndex, gateId]);

  if (!gate || gateIndex === -1) {
    return <Navigate to="/" replace />;
  }

  const currentRoundKey = ROUND_ORDER[roundIndex];
  const currentAnswer = storedAnswers[currentRoundKey];

  const resolveRoundImages = (key: 'R1' | 'R3' | 'R5'): string[] => {
    if (key === 'R1') {
      return gate.rounds.R1_images;
    }

    if (key === 'R3') {
      return gate.rounds.R3_images;
    }

    if (key === 'R5') {
      const { R5_images } = gate.rounds;
      if (Array.isArray(R5_images)) {
        return R5_images;
      }

      if (R5_images === 'reuse_A+B_curated_4') {
        return [...gate.rounds.R1_images.slice(0, 2), ...gate.rounds.R3_images.slice(0, 2)];
      }
    }

    return [];
  };

  const handleBack = () => {
    if (roundIndex > 0) {
      setRoundIndex((index) => Math.max(0, index - 1));
      return;
    }

    navigate('/');
  };

  const handleNext = () => {
    if (!currentAnswer) {
      return;
    }

    if (roundIndex >= ROUND_ORDER.length - 1) {
      navigate('/results');
      return;
    }

    setRoundIndex((index) => Math.min(ROUND_ORDER.length - 1, index + 1));
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar onBack={handleBack} />
      <ProgressRail gateIndex={gateIndex} roundIndex={roundIndex} />
      <main className="flex flex-1 flex-col gap-6 pb-12">
        <GateFrame title={gate.name} quadrant={gate.quadrant}>
          {currentRoundKey === 'R1' || currentRoundKey === 'R3' || currentRoundKey === 'R5' ? (
            <ImageChoiceGrid
              images={resolveRoundImages(currentRoundKey).map((imageSrc, index) => ({
                src: imageSrc,
                alt: `${gate.name} vision ${index + 1}`,
                key: imageSrc
              }))}
              value={typeof currentAnswer === 'string' ? currentAnswer : undefined}
              onChange={(value) => onSetAnswer(gate.id, currentRoundKey, value)}
            />
          ) : null}

          {currentRoundKey === 'R2' || currentRoundKey === 'R4' || currentRoundKey === 'R6' ? (
            <TextRoundCard
              roundLabel={`Round ${currentRoundKey}`}
              vignette={[
                manifest.shared.text_card,
                ...splitVignette(
                  currentRoundKey === 'R2'
                    ? gate.rounds.R2_text_card
                    : currentRoundKey === 'R4'
                    ? gate.rounds.R4_text_card
                    : gate.rounds.R6_text_card
                )
              ]}
              options={TEXT_OPTIONS}
              value={typeof currentAnswer === 'string' ? currentAnswer : undefined}
              onChange={(value) => onSetAnswer(gate.id, currentRoundKey, value)}
            />
          ) : null}
        </GateFrame>
      </main>
      <FooterNav onBack={handleBack} onNext={currentAnswer ? handleNext : undefined} />
    </div>
  );
}
