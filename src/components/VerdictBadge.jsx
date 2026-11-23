import { PROJECT_VERDICTS, VERDICTS } from '../data/projectVerdicts';

// Colour per verdict, using the app's theme colours (they adapt to dark mode).
const STYLES = {
  strong: 'bg-phase-teal/15 text-phase-teal border-phase-teal/30',
  good: 'bg-phase-violet/15 text-phase-violet border-phase-violet/30',
  practice: 'bg-bg-raise text-text-dim border-border-line',
  rework: 'bg-phase-amber/15 text-phase-amber border-phase-amber/30',
  skip: 'bg-phase-brick/10 text-phase-brick border-phase-brick/25',
};

// Small badge showing a project's portfolio verdict. Renders nothing for non-projects.
// With showTip, a "Rework" project also shows what to change.
export function VerdictBadge({ phaseKey, index, showTip = false }) {
  const entry = PROJECT_VERDICTS[`${phaseKey}.projects.${index}`];
  if (!entry) return null;
  const meta = VERDICTS[entry.v];
  return (
    <>
      <span
        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${STYLES[entry.v]}`}
        title={entry.tip ? `${meta.hint}: ${entry.tip}` : meta.hint}
      >
        Portfolio: {meta.label}
      </span>
      {showTip && entry.tip && (
        <span className="basis-full text-xs text-phase-amber">
          <span className="font-semibold">Tip:</span> {entry.tip}
        </span>
      )}
    </>
  );
}
