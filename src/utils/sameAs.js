import { PHASES } from '../data/roadmap';
import { PLAN_SCHEDULE } from '../data/schedule';

const TYPE_LABELS = {
  courses: 'Course', books: 'Book', videos: 'Video',
  websites: 'Website', certs: 'Certification', projects: 'Project',
};

// If this roadmap item repeats another one (the "same" field in schedule.js),
// return details of the original so the page can say "Same as …". Otherwise null.
export function getSameAs(phaseKey, category, index) {
  const sameKey = PLAN_SCHEDULE[`${phaseKey}.${category}.${index}`]?.same;
  if (!sameKey) return null;
  const [origPhaseKey, origCategory, origIndex] = sameKey.split('.');
  const phase = PHASES.find(p => p.key === origPhaseKey);
  const row = phase?.[origCategory]?.[Number(origIndex)];
  if (!row) return null;
  return { title: row[0], phaseId: phase.id, phaseKey: origPhaseKey, typeLabel: TYPE_LABELS[origCategory] };
}
