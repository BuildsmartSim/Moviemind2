import type { PropsWithChildren } from 'react';
import { Card } from './Card';
import type { GateQuadrant } from '../lib/manifest';

interface GateFrameProps extends PropsWithChildren {
  title: string;
  quadrant: GateQuadrant;
}

const quadrantLabels: Record<GateQuadrant, string> = {
  HV_HA: 'High Valence / High Arousal',
  HV_LA: 'High Valence / Low Arousal',
  LV_HA: 'Low Valence / High Arousal',
  LV_LA: 'Low Valence / Low Arousal',
  Neutral: 'Neutral Axis'
};

export function GateFrame({ title, quadrant, children }: GateFrameProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-12">
      <Card className="relative overflow-visible">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-textPrimary">{title}</h1>
          <span className="text-sm uppercase tracking-[0.3em] text-textSecondary">
            {quadrantLabels[quadrant]}
          </span>
        </div>
        <div className="space-y-6">{children}</div>
      </Card>
    </div>
  );
}
