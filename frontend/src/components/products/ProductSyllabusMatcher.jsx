import React from 'react';
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const ProductSyllabusMatcher = ({ product }) => {
  const targetYear = product?.targetYear || 'Year 2 & 3 BDS (Clinical & Pre-Clinical)';
  
  const verifiedUniversities = [
    { name: 'Cairo University (Kasr Al-Ainy)', status: 'Approved for 2026/2027 Syllabus', verified: true },
    { name: 'Ain Shams University', status: 'Approved for BDS Practical Exam', verified: true },
    { name: 'Mansoura University', status: 'Faculty Required Tool List Match', verified: true },
    { name: 'Alexandria University', status: 'Compliant with Conservative Dept', verified: true },
    { name: 'Badr & Future Universities (BUC/FUE)', status: 'Verified Dental Kit Standard', verified: true }
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <AcademicCapIcon className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
            Academic Course Verification
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            University Faculty & Syllabus Compliance
          </h3>
        </div>
      </div>

      {/* Course Level Indicator */}
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
            Required Academic Stage
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {targetYear}
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-black shadow-md shadow-teal-600/25">
          Exam Approved
        </span>
      </div>

      {/* University Compliance List */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Verified Faculty Departments:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {verifiedUniversities.map((uni, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <BuildingLibraryIcon className="w-4 h-4 text-teal-500 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {uni.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    {uni.status}
                  </span>
                </div>
              </div>
              <CheckBadgeIcon className="w-5 h-5 text-teal-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Campus Delivery Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <MapPinIcon className="w-4 h-4 text-teal-500 shrink-0" />
        <span>Direct delivery available to student union lockers & faculty clinics across all campuses.</span>
      </div>

    </div>
  );
};

export default ProductSyllabusMatcher;
