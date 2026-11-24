import { useState } from 'react';
import { Briefcase, MapPin, Search, ExternalLink, Info } from 'lucide-react';

// Turn "Data Analyst" into "data-analyst" for sites that put the search in the address.
function slug(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Build a real search link on each job site from the role and city the user typed.
// We do not show any job listings ourselves: the sites below have the real, current ones.
function buildPortals(role, city) {
  const r = role.trim() || 'Data Analyst';
  const c = city.trim();
  const rq = encodeURIComponent(r);
  const cq = encodeURIComponent(c);

  return [
    {
      name: 'LinkedIn Jobs',
      color: '#0a66c2',
      note: 'Largest network; set alerts for new postings.',
      url: `https://www.linkedin.com/jobs/search/?keywords=${rq}${c ? `&location=${cq}` : '&location=India'}`,
    },
    {
      name: 'Naukri',
      color: '#ff7555',
      note: 'Most widely used Indian job site.',
      url: c
        ? `https://www.naukri.com/${slug(r)}-jobs-in-${slug(c)}?k=${rq}&l=${cq}`
        : `https://www.naukri.com/${slug(r)}-jobs?k=${rq}`,
    },
    {
      name: 'Foundit (Monster India)',
      color: '#6e00be',
      note: 'Formerly Monster India.',
      url: `https://www.foundit.in/srp/results?query=${rq}${c ? `&locations=${cq}` : ''}`,
    },
    {
      name: 'Wellfound',
      color: '#8a8a8a',
      note: 'Startup jobs (formerly AngelList Talent).',
      url: c ? `https://wellfound.com/role/l/${slug(r)}/${slug(c)}` : `https://wellfound.com/role/${slug(r)}`,
    },
    {
      name: 'Instahyre',
      color: '#2bb673',
      note: 'Opens the home page: sign in, then search for your role there.',
      url: 'https://www.instahyre.com/',
    },
  ];
}

export function JobBoard() {
  const [role, setRole] = useState('Data Analyst');
  const [city, setCity] = useState('');
  const portals = buildPortals(role, city);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="p-3 bg-phase-rose/15 rounded-xl text-phase-rose">
          <Briefcase size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display text-text-main">Job Search</h2>
          <p className="text-text-dim">Type a role and city, then open the search on real job sites.</p>
        </div>
      </header>

      {/* Search inputs */}
      <div className="bg-surface rounded-2xl border border-border-line p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
        <label className="relative block">
          <span className="sr-only">Role</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            type="text"
            placeholder="Role, e.g. Data Analyst"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            maxLength={60}
            className="w-full bg-bg-main border border-border-line rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-phase-rose placeholder:text-text-faint"
          />
        </label>
        <label className="relative block">
          <span className="sr-only">City</span>
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            type="text"
            placeholder="City, e.g. Ahmedabad (leave empty for all of India)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={40}
            className="w-full bg-bg-main border border-border-line rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-phase-rose placeholder:text-text-faint"
          />
        </label>
      </div>

      {/* Portal links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {portals.map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flat-card p-5 border border-border-line hover:shadow-md transition-shadow flex items-start justify-between gap-4 group"
          >
            <div className="space-y-1 min-w-0">
              <h3 className="font-bold text-text-main font-display flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} aria-hidden="true" />
                {p.name}
              </h3>
              <p className="text-xs text-text-dim">{p.note}</p>
              <p className="text-[11px] text-text-faint truncate">
                {p.name === 'Instahyre' ? 'instahyre.com' : `"${role.trim() || 'Data Analyst'}"${city.trim() ? ` in ${city.trim()}` : ''}`}
              </p>
            </div>
            <span className="shrink-0 flex items-center gap-1.5 bg-phase-rose group-hover:bg-phase-rose/85 text-white px-4 py-2 rounded-xl text-xs font-bold">
              Search <ExternalLink size={12} />
            </span>
          </a>
        ))}
      </div>

      <p className="flex items-start gap-2 text-xs text-text-faint">
        <Info size={14} className="shrink-0 mt-0.5" />
        This page doesn't list jobs itself. Each button opens a live search on that site, so the results and salaries you see there are real and current.
      </p>
    </div>
  );
}
