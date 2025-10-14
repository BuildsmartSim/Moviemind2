import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { FadeTransition } from './components/FadeTransition';
import { loadManifest, type MPCS1Manifest } from './lib/manifest';
import Entry from './pages/Entry';
import Gate from './pages/Gate';
import Results from './pages/Results';

export type RoundAnswerKey = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';
export type GateAnswerMap = Partial<Record<RoundAnswerKey, string>>;

export interface AnswersState {
  entryGateId?: string;
  gateAnswers: Record<string, GateAnswerMap>;
}

const STORAGE_KEY = 'mm.mpcs1.answers.v1';

function loadStoredAnswers(): AnswersState {
  if (typeof window === 'undefined') {
    return { gateAnswers: {} };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { gateAnswers: {} };
    }

    const parsed = JSON.parse(stored) as AnswersState;
    return {
      entryGateId: parsed.entryGateId,
      gateAnswers: parsed.gateAnswers ?? {}
    };
  } catch (error) {
    console.warn('Failed to parse stored answers', error);
    return { gateAnswers: {} };
  }
}

export default function App() {
  const location = useLocation();
  const [manifest, setManifest] = useState<MPCS1Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswersState>(() => loadStoredAnswers());

  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .catch((err) => {
        console.error(err);
        setError('Unable to load MPCS-1 manifest.');
      });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const appState = useMemo(
    () => ({
      manifest,
      answers,
      setEntryGateId: (gateId: string) =>
        setAnswers((prev) => ({
          entryGateId: gateId,
          gateAnswers: prev.gateAnswers
        })),
      setGateRoundAnswer: (gateId: string, round: RoundAnswerKey, value: string) =>
        setAnswers((prev) => ({
          entryGateId: prev.entryGateId,
          gateAnswers: {
            ...prev.gateAnswers,
            [gateId]: {
              ...prev.gateAnswers[gateId],
              [round]: value
            }
          }
        })),
      reset: () => setAnswers({ gateAnswers: {} })
    }),
    [answers, manifest]
  );

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-textPrimary">
        <p>{error}</p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-textPrimary">
        <span className="animate-pulse text-sm uppercase tracking-[0.4em] text-textSecondary">Loading MPCS-1…</span>
      </div>
    );
  }

  return (
    <FadeTransition key={location.pathname}>
      <Routes location={location}>
        <Route
          path="/"
          element={
            <Entry
              manifest={manifest}
              selectedGateId={appState.answers.entryGateId}
              onSelectGate={appState.setEntryGateId}
            />
          }
        />
        <Route
          path="/mpcs1/:gateId"
          element={
            <Gate
              manifest={manifest}
              answers={appState.answers}
              onSetAnswer={appState.setGateRoundAnswer}
            />
          }
        />
        <Route
          path="/results"
          element={<Results manifest={manifest} answers={appState.answers} onReset={appState.reset} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FadeTransition>
  );
}
