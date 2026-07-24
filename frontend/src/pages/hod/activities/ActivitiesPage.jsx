import React, { useState } from 'react';
import { Cpu, Trophy, ChevronRight, Music2, Zap } from 'lucide-react';
import clsx from 'clsx';

// ─── New hierarchy pages ───────────────────────────────────────────────────────
import RealTimeIndustryProjects from './RealTimeIndustryProjects';
import Hackathons from './Hackathons';
import Sports from './Sports';
import OtherCurricularActivities from './OtherCurricularActivities';

// ─── Navigation tree ──────────────────────────────────────────────────────────
//
//  Activities (null)
//  ├── Technical Activities ('tech-menu')
//  │   ├── Real-Time Industry Projects ('industry-projects')
//  │   └── Hackathons                 ('hackathons')
//  └── Non-Technical Activities ('nontech-menu')
//      ├── Sports                     ('sports')
//      └── Other Curricular Activities('other-curricular')
//

const VIEW_COMPONENTS = {
  'industry-projects': RealTimeIndustryProjects,
  'hackathons':        Hackathons,
  'sports':            Sports,
  'other-curricular':  OtherCurricularActivities,
};

// ─── Card data ────────────────────────────────────────────────────────────────
const TOP_CARDS = [
  {
    id: 'tech-menu',
    label: 'Technical Activities',
    description: 'Real-time industry projects and hackathon participation records.',
    icon: Cpu,
    color: 'from-indigo-500 to-blue-600',
    badge: '2 categories',
  },
  {
    id: 'nontech-menu',
    label: 'Non-Technical Activities',
    description: 'Sports achievements and other curricular event participations.',
    icon: Trophy,
    color: 'from-emerald-500 to-teal-600',
    badge: '2 categories',
  },
];

const TECH_CARDS = [
  {
    id: 'industry-projects',
    label: 'Real-Time Industry Projects',
    description: 'Live and completed student industry projects with team members.',
    icon: Zap,
    color: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    description: 'Student hackathon participations, positions, and achievements.',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-600',
  },
];

const NON_TECH_CARDS = [
  {
    id: 'sports',
    label: 'Sports',
    description: 'District, state, and national level sports achievements.',
    icon: Trophy,
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'other-curricular',
    label: 'Other Curricular Activities',
    description: 'Cultural events, competitions, and co-curricular participations.',
    icon: Music2,
    color: 'from-pink-500 to-rose-600',
  },
];

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 dark:text-white font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ─── Selection card ───────────────────────────────────────────────────────────
function SelectCard({ card, onClick }) {
  const Icon = card.icon;
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <div className="flex items-start gap-4">
        <div className={clsx('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm', card.color)}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {card.label}
            </h3>
            {card.badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>
        </div>
        <ChevronRight
          size={18}
          className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5"
        />
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ActivitiesPage() {
  const [view, setView] = useState(null);

  // ── Breadcrumb builder ────────────────────────────────────────────────────
  const buildBreadcrumbs = () => {
    const crumbs = [{ label: 'Activities', onClick: view ? () => setView(null) : undefined }];

    if (view === 'tech-menu') {
      crumbs.push({ label: 'Technical Activities' });
    } else if (view === 'nontech-menu') {
      crumbs.push({ label: 'Non-Technical Activities' });
    } else if (view === 'industry-projects') {
      crumbs.push({ label: 'Technical Activities', onClick: () => setView('tech-menu') });
      crumbs.push({ label: 'Real-Time Industry Projects' });
    } else if (view === 'hackathons') {
      crumbs.push({ label: 'Technical Activities', onClick: () => setView('tech-menu') });
      crumbs.push({ label: 'Hackathons' });
    } else if (view === 'sports') {
      crumbs.push({ label: 'Non-Technical Activities', onClick: () => setView('nontech-menu') });
      crumbs.push({ label: 'Sports' });
    } else if (view === 'other-curricular') {
      crumbs.push({ label: 'Non-Technical Activities', onClick: () => setView('nontech-menu') });
      crumbs.push({ label: 'Other Curricular Activities' });
    }

    // Last crumb is current — not clickable
    if (crumbs.length > 0) crumbs[crumbs.length - 1].onClick = undefined;
    return crumbs;
  };

  const ActiveComponent = view && VIEW_COMPONENTS[view];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Activities</h2>
        <Breadcrumb items={buildBreadcrumbs()} />
      </div>

      {/* ── Landing: top-level ── */}
      {view === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {TOP_CARDS.map((card) => (
            <SelectCard key={card.id} card={card} onClick={() => setView(card.id)} />
          ))}
        </div>
      )}

      {/* ── Technical sub-menu ── */}
      {view === 'tech-menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {TECH_CARDS.map((card) => (
            <SelectCard key={card.id} card={card} onClick={() => setView(card.id)} />
          ))}
        </div>
      )}

      {/* ── Non-Technical sub-menu ── */}
      {view === 'nontech-menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {NON_TECH_CARDS.map((card) => (
            <SelectCard key={card.id} card={card} onClick={() => setView(card.id)} />
          ))}
        </div>
      )}

      {/* ── Active page ── */}
      {ActiveComponent && <ActiveComponent />}
    </div>
  );
}
