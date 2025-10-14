import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { FooterNav } from '../components/FooterNav';
import { TopBar } from '../components/TopBar';
import type { AnswersState, RoundAnswerKey } from '../App';
import type { MPCS1Manifest } from '../lib/manifest';

interface ResultsProps {
  manifest: MPCS1Manifest;
  answers: AnswersState;
  onReset: () => void;
}

const ROUND_KEYS: RoundAnswerKey[] = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'];

export default function Results({ manifest, answers, onReset }: ResultsProps) {
  const navigate = useNavigate();

  const entryGate = useMemo(() => {
    if (!answers.entryGateId) {
      return undefined;
    }

    return manifest.gates.find((gate) => gate.id === answers.entryGateId);
  }, [answers.entryGateId, manifest.gates]);

  const gateSummaries = useMemo(() => {
    return Object.entries(answers.gateAnswers).map(([gateId, gateAnswers]) => {
      const gate = manifest.gates.find((item) => item.id === gateId);
      return {
        gateId,
        gateName: gate ? gate.name : gateId,
        answers: ROUND_KEYS.map((roundKey) => ({
          roundKey,
          value: gateAnswers?.[roundKey]
        }))
      };
    });
  }, [answers.gateAnswers, manifest.gates]);

  const handleRestart = () => {
    onReset();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar onBack={() => navigate(-1)} />
      <main className="flex flex-1 flex-col items-center gap-8 px-6 pb-16 pt-10">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-[0.2em] text-textPrimary">MPCS-1 Results</h1>
          <p className="mt-4 text-sm text-textSecondary">
            A lightweight snapshot of your journey through tonight&apos;s questionnaire. Reset any time to explore a different path.
          </p>
        </div>
        <div className="flex w-full max-w-4xl flex-col gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-textPrimary">Chosen Gate</h2>
            <p className="mt-2 text-sm text-textSecondary">
              {entryGate ? `${entryGate.name} (${entryGate.quadrant.replace(/_/g, ' / ')})` : 'No gate selected yet.'}
            </p>
          </Card>
          {gateSummaries.length > 0 ? (
            gateSummaries.map((summary) => (
              <Card key={summary.gateId}>
                <h3 className="text-base font-semibold text-textPrimary">{summary.gateName}</h3>
                <ul className="mt-4 space-y-2 text-sm text-textSecondary">
                  {summary.answers.map((answer) => (
                    <li key={answer.roundKey} className="flex items-center justify-between gap-3">
                      <span className="uppercase tracking-[0.3em] text-xs text-textSecondary/80">{answer.roundKey}</span>
                      <span className="text-textPrimary/90">{answer.value ?? '—'}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-sm text-textSecondary">You haven&apos;t completed any rounds yet. Continue exploring the gates.</p>
            </Card>
          )}
        </div>
      </main>
      <FooterNav onBack={() => navigate('/')} onNext={handleRestart} />
    </div>
  );
}
