import React from 'react';
import {
  AcademicCapIcon,
  BeakerIcon,
  SparklesIcon,
  CubeIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const FacultyCourseTabs = ({ selectedStage, onSelectStage }) => {
  const tabs = [
    {
      id: 'all',
      name: 'All Equipment',
      yearBadge: 'Complete Catalog',
      icon: CubeIcon,
      desc: 'All certified dental tools, instruments & accessories'
    },
    {
      id: 'pre-clinical',
      name: 'Year 1 & 2 • Pre-Clinical',
      yearBadge: 'Phantom & Anatomy',
      icon: AcademicCapIcon,
      desc: 'Articulated typodonts, PK Thomas waxers, carvers & jaw models'
    },
    {
      id: 'operative',
      name: 'Year 3 • Restorative & Endo',
      yearBadge: 'Conservative BDS',
      icon: WrenchScrewdriverIcon,
      desc: 'Rubber dam kits, K-files, composite sculptors & matrix bands'
    },
    {
      id: 'surgery',
      name: 'Year 4 & 5 • Surgery & Perio',
      yearBadge: 'Clinical Patient Kit',
      icon: BeakerIcon,
      desc: 'Extraction forceps, Cryer elevators, periodontal scalers & syringes'
    },
    {
      id: 'bundles',
      name: 'All-in-One Exam Bundles',
      yearBadge: 'Save up to 30%',
      icon: SparklesIcon,
      desc: 'Professor-verified semester boxes with autoclavable cases'
    }
  ];

  return (
    <div className="w-full mb-8">
      {/* Scrollable Tab Container */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedStage === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectStage(tab.id)}
              className={`group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-left border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-teal-500/10 dark:bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-teal-500 group-hover:bg-teal-50 dark:group-hover:bg-teal-500/10'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs sm:text-sm font-bold block">{tab.name}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.yearBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                  {tab.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyCourseTabs;
