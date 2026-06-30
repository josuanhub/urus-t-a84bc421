import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass = "bg-[#1A1A2E] animate-pulse rounded";

  const TableSkeleton = () => (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="flex gap-3 px-4 py-3 border-b border-[#6C63FF]/20 mb-2">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={`header-${colIdx}`}
              className={`h-4 ${baseSkeletonClass} flex-1`}
              style={{ opacity: 0.6 }}
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className="flex gap-3 px-4 py-3 border-b border-white/5 items-center"
            style={{ animationDelay: `${rowIdx * 80}ms` }}
          >
            {/* Checkbox/Icon column */}
            <div className={`h-4 w-4 ${baseSkeletonClass} rounded-sm shrink-0`} />

            {Array.from({ length: cols }).map((_, colIdx) => (
              <div
                key={`cell-${rowIdx}-${colIdx}`}
                className={`h-3 ${baseSkeletonClass} flex-1`}
                style={{
                  maxWidth: colIdx === 0 ? '30%' : colIdx === cols - 1 ? '15%' : '100%',
                  animationDelay: `${(rowIdx * cols + colIdx) * 40}ms`,
                }}
              />
            ))}

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <div className={`h-7 w-7 ${baseSkeletonClass} rounded-md`} />
              <div className={`h-7 w-7 ${baseSkeletonClass} rounded-md`} />
            </div>
          </div>
        ))}

        {/* Footer pagination */}
        <div className="flex items-center justify-between px-4 py-3 mt-2">
          <div className={`h-3 w-32 ${baseSkeletonClass}`} />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`h-7 w-7 ${baseSkeletonClass} rounded-md`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CardsSkeleton = () => {
    const gridCols =
      cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
      <div className={`grid ${gridCols} gap-4 w-full`}>
        {Array.from({ length: rows * Math.min(cols, 3) }).map((_, idx) => (
          <div
            key={`card-${idx}`}
            className="bg-[#1A1A2E] rounded-xl border border-white/5 p-5 flex flex-col gap-4"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 ${baseSkeletonClass} rounded-xl`} />
                <div className="flex flex-col gap-2">
                  <div className={`h-3 w-24 ${baseSkeletonClass}`} />
                  <div className={`h-2 w-16 ${baseSkeletonClass}`} />
                </div>
              </div>
              <div className={`h-6 w-16 ${baseSkeletonClass} rounded-full`} />
            </div>

            {/* Card body */}
            <div className="flex flex-col gap-2">
              <div className={`h-2 w-full ${baseSkeletonClass}`} />
              <div className={`h-2 w-5/6 ${baseSkeletonClass}`} />
              <div className={`h-2 w-4/6 ${baseSkeletonClass}`} />
            </div>

            {/* Card stats */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1 items-center">
                  <div className={`h-5 w-10 ${baseSkeletonClass}`} />
                  <div className={`h-2 w-8 ${baseSkeletonClass}`} />
                </div>
              ))}
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className={`h-2 w-20 ${baseSkeletonClass}`} />
              <div className={`h-7 w-20 ${baseSkeletonClass} rounded-lg`} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ListSkeleton = () => (
    <div className="w-full flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`list-${rowIdx}`}
          className="bg-[#1A1A2E] rounded-xl border border-white/5 px-4 py-3 flex items-center gap-4"
          style={{ animationDelay: `${rowIdx * 70}ms` }}
        >
          {/* Leading icon/avatar */}
          <div className={`h-10 w-10 ${baseSkeletonClass} rounded-full shrink-0`} />

          {/* Content */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-36 ${baseSkeletonClass}`} />
              <div className={`h-5 w-16 ${baseSkeletonClass} rounded-full`} />
            </div>
            <div className={`h-2 w-64 max-w-full ${baseSkeletonClass}`} />
          </div>

          {/* Cols metadata */}
          <div className="hidden sm:flex items-center gap-6 shrink-0">
            {Array.from({ length: Math.min(cols, 3) }).map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1 items-end">
                <div className={`h-3 w-16 ${baseSkeletonClass}`} />
                <div className={`h-2 w-10 ${baseSkeletonClass}`} />
              </div>
            ))}
          </div>

          {/* Trailing actions */}
          <div className="flex gap-2 shrink-0">
            <div className={`h-8 w-8 ${baseSkeletonClass} rounded-lg`} />
            <div className={`h-8 w-8 ${baseSkeletonClass} rounded-lg`} />
          </div>
        </div>
      ))}

      {/* Load more */}
      <div className="flex justify-center pt-4">
        <div className={`h-9 w-32 ${baseSkeletonClass} rounded-lg`} />
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex flex-col gap-2">
        <div className={`h-5 w-40 ${baseSkeletonClass}`} />
        <div className={`h-3 w-24 ${baseSkeletonClass}`} />
      </div>
      <div className="flex gap-3">
        <div className={`h-9 w-28 ${baseSkeletonClass} rounded-lg`} />
        <div className={`h-9 w-9 ${baseSkeletonClass} rounded-lg`} />
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="flex flex-wrap gap-3 mb-5">
      <div className={`h-9 w-48 ${baseSkeletonClass} rounded-lg`} />
      <div className={`h-9 w-32 ${baseSkeletonClass} rounded-lg`} />
      <div className={`h-9 w-32 ${baseSkeletonClass} rounded-lg`} />
      <div className="ml-auto flex gap-2">
        <div className={`h-9 w-9 ${baseSkeletonClass} rounded-lg`} />
        <div className={`h-9 w-9 ${baseSkeletonClass} rounded-lg`} />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full bg-[#0A0A0F] p-4 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Cargando contenido..."
      role="status"
    >
      {/* Shimmer overlay effect via keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #1A1A2E 25%,
            #252545 50%,
            #1A1A2E 75%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear, pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
        }
      `}</style>

      {/* Top stats summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="bg-[#1A1A2E] rounded-xl border border-white/5 p-4 flex items-center gap-3"
          >
            <div className={`h-10 w-10 ${baseSkeletonClass} rounded-xl shrink-0`} />
            <div className="flex flex-col gap-2 flex-1">
              <div className={`h-2 w-16 ${baseSkeletonClass}`} />
              <div className={`h-4 w-12 ${baseSkeletonClass}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main content panel */}
      <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl p-4 sm:p-6">
        {renderHeader()}
        {renderFilters()}

        {type === 'table' && <TableSkeleton />}
        {type === 'cards' && <CardsSkeleton />}
        {type === 'list' && <ListSkeleton />}
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando datos del sistema t...</span>
    </div>
  );
};

export default LoadingSkeleton;