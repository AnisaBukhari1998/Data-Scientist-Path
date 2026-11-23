import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Circle, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { PHASES } from '../data/roadmap';
import { PLAN_PERIODS, PLAN_SCHEDULE } from '../data/schedule';
import { useProgress } from '../context/ProgressContext';

const CATEGORIES = ['courses', 'books', 'videos', 'websites', 'certs', 'projects'];
const TYPE_LABELS = {
  courses: 'Course', books: 'Book', videos: 'Video',
  websites: 'Website', certs: 'Certificate', projects: 'Project',
};

// First day of each period, used to highlight the one you are in now.
const PERIOD_STARTS = {
  P0: '2026-12-01', Y1: '2027-07-01', Y2: '2028-07-01',
  Y3: '2029-07-01', Y4: '2030-07-01', Y5: '2031-07-01',
};

// Each roadmap row is an array; the URL and the "40h" estimate sit at different
// positions depending on the category, so find them by shape instead of position.
function readRow(row) {
  const url = row.find(v => typeof v === 'string' && v.startsWith('http')) || null;
  const hoursText = row.find(v => typeof v === 'string' && /^\d+h$/.test(v));
  return {
    title: row[0],
    detail: typeof row[1] === 'string' ? row[1] : '',
    url,
    hours: hoursText ? parseInt(hoursText, 10) : 0,
  };
}

function currentPeriodId(today = new Date()) {
  let current = 'P0';
  for (const period of PLAN_PERIODS) {
    if (today >= new Date(PERIOD_STARTS[period.id])) current = period.id;
  }
  return current;
}

export function FiveYearPlan() {
  const { isCompleted } = useProgress();
  const nowId = currentPeriodId();
  const [open, setOpen] = useState(() => ({ [nowId]: true }));

  // Build every item once: where it lives in the roadmap and where it sits in the plan.
  const allItems = useMemo(() => {
    const list = [];
    for (const phase of PHASES) {
      for (const category of CATEGORIES) {
        (phase[category] || []).forEach((row, index) => {
          const key = `${phase.key}.${category}.${index}`;
          const plan = PLAN_SCHEDULE[key] || null;
          list.push({ key, phase, category, index, ...readRow(row), plan });
        });
      }
    }
    return list;
  }, []);

  const byKey = useMemo(() => Object.fromEntries(allItems.map(i => [i.key, i])), [allItems]);

  // A repeated entry counts as done when either copy is done.
  const isDone = (item) => {
    if (isCompleted(item.phase.key, item.category, item.index)) return true;
    const original = item.plan?.same && byKey[item.plan.same];
    return original ? isCompleted(original.phase.key, original.category, original.index) : false;
  };

  const groups = [
    ...PLAN_PERIODS.map(period => ({ period, items: allItems.filter(i => i.plan?.p === period.id) })),
    {
      period: { id: 'none', dates: '', title: 'Not scheduled yet', focus: 'Items added to the roadmap after this plan was made. Add them to src/data/schedule.js.', goal: '' },
      items: allItems.filter(i => !i.plan),
    },
  ].filter(g => g.items.length > 0);

  // Hours only count new material: a repeated entry adds no extra study time.
  const hoursOf = (items) => items.filter(i => !i.plan?.same).reduce((sum, i) => sum + i.hours, 0);
  const doneHoursOf = (items) => items.filter(i => !i.plan?.same && isDone(i)).reduce((sum, i) => sum + i.hours, 0);

  const totalHours = hoursOf(allItems);
  const totalDone = doneHoursOf(allItems);
  const totalPct = totalHours ? Math.round((totalDone / totalHours) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-teal/15 rounded-xl text-phase-teal">
            <Calendar size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">5-Year Plan</h2>
            <p className="text-text-dim text-sm">
              All {allItems.length} roadmap items in study order: job-ready by July 2027, then one focus per year.
            </p>
          </div>
        </div>
        <div className="flat-card p-4 border border-border-line space-y-2">
          <div className="flex justify-between text-xs text-text-dim">
            <span>Overall: {totalDone.toLocaleString()} of {totalHours.toLocaleString()} hours of material done</span>
            <span className="font-bold text-text-main">{totalPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-bg-raise overflow-hidden">
            <div className="h-full bg-phase-teal rounded-full" style={{ width: `${totalPct}%` }} />
          </div>
          <p className="text-[11px] text-text-faint">
            Tick items off on their phase pages; this view follows your saved progress. Hours are the roadmap's estimates.
          </p>
        </div>
      </header>

      {groups.map(({ period, items }) => {
        const hours = hoursOf(items);
        const doneHours = doneHoursOf(items);
        const pct = hours ? Math.round((doneHours / hours) * 100) : 0;
        const isNow = period.id === nowId;
        const isOpen = !!open[period.id];
        const sorted = [...items].sort((a, b) =>
          CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.phase.id - b.phase.id || a.index - b.index
        );

        return (
          <section
            key={period.id}
            className={`flat-card border ${isNow ? 'border-phase-teal' : 'border-border-line'} overflow-hidden`}
          >
            <button
              type="button"
              onClick={() => setOpen(o => ({ ...o, [period.id]: !o[period.id] }))}
              className="w-full text-left p-5 flex items-start gap-3 cursor-pointer hover:bg-bg-raise transition-colors"
              aria-expanded={isOpen}
            >
              <span className="mt-1 text-text-faint">{isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-text-main">{period.title}</h3>
                  {period.dates && <span className="text-xs text-text-faint font-mono">{period.dates}</span>}
                  {isNow && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-phase-teal/15 text-phase-teal">
                      Now
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-dim">{period.focus}</p>
                {period.goal && <p className="text-xs text-text-dim"><span className="font-semibold text-text-main">Goal:</span> {period.goal}</p>}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-bg-raise overflow-hidden">
                    <div className="h-full bg-phase-teal rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-text-faint whitespace-nowrap">
                    {items.length} items · {hours.toLocaleString()}h · {pct}% done
                  </span>
                </div>
              </div>
            </button>

            {isOpen && (
              <ul className="border-t border-border-line divide-y divide-border-line">
                {sorted.map(item => {
                  const done = isDone(item);
                  const original = item.plan?.same ? byKey[item.plan.same] : null;
                  return (
                    <li key={item.key} className="px-5 py-3 flex items-start gap-3">
                      <span className={`mt-0.5 ${done ? 'text-phase-teal' : 'text-text-faint'}`} aria-label={done ? 'Done' : 'Not done'}>
                        {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm font-medium hover:underline inline-flex items-center gap-1 ${done ? 'text-text-dim line-through' : 'text-text-main'}`}
                            >
                              {item.title} <ExternalLink size={11} className="text-text-faint" />
                            </a>
                          ) : (
                            <span className={`text-sm font-medium ${done ? 'text-text-dim line-through' : 'text-text-main'}`}>{item.title}</span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-raise border border-border-line text-text-faint">
                            {TYPE_LABELS[item.category]}
                          </span>
                          {item.plan?.coursera && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-phase-gold/15 text-phase-gold font-semibold">
                              Coursera: finish by 10 Apr 2027
                            </span>
                          )}
                        </div>
                        {item.detail && <p className="text-[11px] text-text-faint truncate">{item.detail}</p>}
                        {original && (
                          <p className="text-[11px] text-text-dim">Repeats “{original.title}”, so it adds no extra study time.</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-text-dim">{original ? '0h' : `${item.hours}h`}</div>
                        <Link to={`/phase/${item.phase.key}`} className="text-[10px] text-text-faint hover:text-text-main hover:underline">
                          Phase {item.phase.id}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
