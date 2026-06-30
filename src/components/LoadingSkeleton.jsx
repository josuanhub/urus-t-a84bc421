import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass = "bg-[#1A1A2E] rounded animate-pulse";
  const shimmerClass = "bg-gradient-to-r from-[#1A1A2E] via-[#2A2A4E] to-[#1A1A2E] rounded animate-pulse";

  // ─── TABLE SKELETON ───────────────────────────────────────────────────────────
  if (type === 'table') {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-[#6C63FF]/20 bg-[#0A0A0F]">
        {/* Table Header */}
        <div className="grid gap-3 px-6 py-4 border-b border-[#6C63FF]/20 bg-[#1A1A2E]/40"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={`th-${colIdx}`} className="flex items-center gap-2">
              <div className={`h-3 rounded ${shimmerClass}`}
                style={{ width: colIdx === 0 ? '60%' : colIdx === cols - 1 ? '40%' : '70%' }}
              />
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#6C63FF]/10">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={`tr-${rowIdx}`}
              className="grid gap-3 px-6 py-4 hover:bg-[#1A1A2E]/20 transition-colors"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: cols }).map((_, colIdx) => (
                <div key={`td-${rowIdx}-${colIdx}`} className="flex items-center gap-3">
                  {colIdx === 0 && (
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 ${shimmerClass}`} />
                  )}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div
                      className={`h-3 ${shimmerClass}`}
                      style={{
                        width: colIdx === 0
                          ? `${55 + (rowIdx * 7) % 30}%`
                          : colIdx === cols - 1
                            ? '45%'
                            : `${60 + (colIdx * 11 + rowIdx * 5) % 25}%`
                      }}
                    />
                    {colIdx === 0 && (
                      <div className={`h-2 ${shimmerClass}`} style={{ width: '40%' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#6C63FF]/20 bg-[#1A1A2E]/20">
          <div className={`h-3 w-32 ${shimmerClass}`} />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-8 rounded-lg ${shimmerClass}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── CARDS SKELETON ───────────────────────────────────────────────────────────
  if (type === 'cards') {
    const colsClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[Math.min(cols, 4)] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
      <div className={`grid gap-4 ${colsClass}`}>
        {Array.from({ length: rows * cols }).map((_, idx) => (
          <div
            key={`card-${idx}`}
            className="rounded-xl border border-[#6C63FF]/20 bg-[#0A0A0F] p-5 flex flex-col gap-4 overflow-hidden relative"
          >
            {/* Card accent line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${shimmerClass}`} />

            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${shimmerClass}`} />
                <div className="flex flex-col gap-2">
                  <div className={`h-3.5 w-28 ${shimmerClass}`} />
                  <div className={`h-2.5 w-16 ${shimmerClass}`} />
                </div>
              </div>
              <div className={`w-6 h-6 rounded-md ${shimmerClass}`} />
            </div>

            {/* Card Body */}
            <div className="flex flex-col gap-3">
              <div className={`h-8 w-3/4 rounded-lg ${shimmerClass}`} />
              <div className="flex flex-col gap-2">
                <div className={`h-2.5 w-full ${shimmerClass}`} />
                <div className={`h-2.5 w-5/6 ${shimmerClass}`} />
                <div className={`h-2.5 w-4/6 ${shimmerClass}`} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className={`h-2 w-16 ${shimmerClass}`} />
                <div className={`h-2 w-8 ${shimmerClass}`} />
              </div>
              <div className={`h-1.5 w-full rounded-full ${baseSkeletonClass}`}>
                <div
                  className={`h-full rounded-full ${shimmerClass}`}
                  style={{ width: `${30 + (idx * 13) % 55}%` }}
                />
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-[#6C63FF]/10">
              <div className="flex gap-2">
                {[1, 2].map(i => (
                  <div key={i} className={`h-6 w-16 rounded-full ${shimmerClass}`} />
                ))}
              </div>
              <div className={`h-7 w-20 rounded-lg ${shimmerClass}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── LIST SKELETON ────────────────────────────────────────────────────────────
  if (type === 'list') {
    return (
      <div className="flex flex-col gap-2 w-full">
        {/* List Header */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1A1A2E]/40 border border-[#6C63FF]/20 mb-2">
          <div className={`h-3 w-40 ${shimmerClass}`} />
          <div className="flex gap-2">
            <div className={`h-7 w-24 rounded-lg ${shimmerClass}`} />
            <div className={`h-7 w-7 rounded-lg ${shimmerClass}`} />
          </div>
        </div>

        {/* List Items */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`li-${rowIdx}`}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-[#6C63FF]/10 bg-[#0A0A0F] hover:border-[#6C63FF]/25 transition-all"
          >
            {/* Index / Checkbox */}
            <div className={`w-5 h-5 rounded flex-shrink-0 ${shimmerClass}`} />

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${shimmerClass}`} />
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0A0F] ${shimmerClass}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 grid gap-1">
              <div className={`h-3.5 ${shimmerClass}`} style={{ width: `${45 + (rowIdx * 9) % 30}%` }} />
              <div className={`h-2.5 ${shimmerClass}`} style={{ width: `${30 + (rowIdx * 7) % 25}%` }} />
            </div>

            {/* Cols data */}
            {Array.from({ length: Math.max(0, cols - 1) }).map((_, colIdx) => (
              <div key={`li-col-${rowIdx}-${colIdx}`} className="hidden sm:flex flex-col gap-1 flex-shrink-0"
                style={{ minWidth: '80px' }}
              >
                <div className={`h-3 ${shimmerClass}`} style={{ width: `${50 + (colIdx * 11) % 30}%` }} />
                <div className={`h-2 ${shimmerClass}`} style={{ width: '40%' }} />
              </div>
            ))}

            {/* Badge */}
            <div className={`h-6 w-16 rounded-full flex-shrink-0 hidden md:block ${shimmerClass}`} />

            {/* Actions */}
            <div className="flex gap-1.5 flex-shrink-0">
              {[1, 2].map(i => (
                <div key={i} className={`w-7 h-7 rounded-lg ${shimmerClass}`} />
              ))}
            </div>
          </div>
        ))}

        {/* List Footer */}
        <div className="flex items-center justify-between px-4 py-3 mt-2">
          <div className={`h-2.5 w-48 ${shimmerClass}`} />
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg ${shimmerClass}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;