import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass = "bg-[#1A1A2E] animate-pulse rounded";

  const TableSkeleton = () => (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full">
        {/* Table Header */}
        <div className="flex gap-3 p-4 border-b border-[#6C63FF]/20 mb-2">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={`header-${colIdx}`}
              className={`${baseSkeletonClass} h-4 flex-1`}
              style={{
                width: colIdx === 0 ? '30%' : `${70 / (cols - 1)}%`,
                opacity: 0.6
              }}
            />
          ))}
        </div>

        {/* Table Rows */}
        <div className="space-y-2 p-2">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className="flex gap-3 items-center p-3 rounded-lg border border-[#1A1A2E] hover:border-[#6C63FF]/10 transition-colors"
              style={{ animationDelay: `${rowIdx * 75}ms` }}
            >
              {/* Row number / checkbox area */}
              <div className={`${baseSkeletonClass} h-4 w-4 rounded shrink-0`} />

              {Array.from({ length: cols }).map((_, colIdx) => (
                <div key={`cell-${rowIdx}-${colIdx}`} className="flex-1 flex items-center gap-2">
                  {colIdx === 0 && (
                    <div className={`${baseSkeletonClass} h-7 w-7 rounded-full shrink-0`} />
                  )}
                  <div className="flex-1 space-y-1">
                    <div
                      className={`${baseSkeletonClass} h-3.5 rounded`}
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                    {colIdx === 0 && (
                      <div
                        className={`${baseSkeletonClass} h-2.5 rounded opacity-50`}
                        style={{ width: `${40 + Math.random() * 20}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Action buttons */}
              <div className="flex gap-2 shrink-0">
                <div className={`${baseSkeletonClass} h-7 w-7 rounded-md`} />
                <div className={`${baseSkeletonClass} h-7 w-7 rounded-md`} />
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between p-4 mt-2 border-t border-[#6C63FF]/10">
          <div className={`${baseSkeletonClass} h-4 w-32 rounded`} />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`page-${idx}`} className={`${baseSkeletonClass} h-8 w-8 rounded-md`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CardsSkeleton = () => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    const gridClass = gridCols[cols] || gridCols[3];

    return (
      <div className={`grid ${gridClass} gap-4 p-2`}>
        {Array.from({ length: rows * cols }).map((_, idx) => (
          <div
            key={`card-${idx}`}
            className="bg-[#1A1A2E] rounded-xl border border-[#6C63FF]/10 p-5 space-y-4 animate-pulse"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${baseSkeletonClass} h-10 w-10 rounded-xl`} />
                <div className="space-y-1.5">
                  <div className={`${baseSkeletonClass} h-3.5 w-24 rounded`} />
                  <div className={`${baseSkeletonClass} h-2.5 w-16 rounded opacity-60`} />
                </div>
              </div>
              <div className={`${baseSkeletonClass} h-6 w-16 rounded-full`} />
            </div>

            {/* Card Body */}
            <div className="space-y-2">
              <div className={`${baseSkeletonClass} h-3 w-full rounded`} />
              <div className={`${baseSkeletonClass} h-3 w-5/6 rounded`} />
              <div className={`${baseSkeletonClass} h-3 w-4/6 rounded`} />
            </div>

            {/* Card Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#6C63FF]/10">
              {Array.from({ length: 3 }).map((_, statIdx) => (
                <div key={`stat-${idx}-${statIdx}`} className="space-y-1 text-center">
                  <div className={`${baseSkeletonClass} h-5 w-full rounded`} />
                  <div className={`${baseSkeletonClass} h-2.5 w-3/4 mx-auto rounded opacity-60`} />
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="flex gap-2">
              <div className={`${baseSkeletonClass} h-8 flex-1 rounded-lg`} />
              <div className={`${baseSkeletonClass} h-8 w-8 rounded-lg`} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ListSkeleton = () => (
    <div className="space-y-2 p-2">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`list-${rowIdx}`}
          className="bg-[#1A1A2E] rounded-xl border border-[#6C63FF]/10 p-4 animate-pulse"
          style={{ animationDelay: `${rowIdx * 60}ms` }}
        >
          <div className="flex items-center gap-4">
            {/* Left Icon/Avatar */}
            <div className="relative shrink-0">
              <div className={`${baseSkeletonClass} h-12 w-12 rounded-xl`} />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#0A0A0F] border-2 border-[#0A0A0F]">
                <div className={`${baseSkeletonClass} h-full w-full rounded-full`} />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`${baseSkeletonClass} h-4 w-40 rounded`} />
                <div className={`${baseSkeletonClass} h-5 w-16 rounded-full opacity-70`} />
              </div>
              <div className={`${baseSkeletonClass} h-3 w-3/4 rounded opacity-60`} />

              {/* Tags */}
              <div className="flex gap-2">
                {Array.from({ length: Math.min(cols, 3) }).map((_, tagIdx) => (
                  <div
                    key={`tag-${rowIdx}-${tagIdx}`}
                    className={`${baseSkeletonClass} h-5 rounded-full opacity-50`}
                    style={{ width: `${48 + tagIdx * 12}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Right Side Info */}
            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
              <div className={`${baseSkeletonClass} h-4 w-24 rounded`} />
              <div className={`${baseSkeletonClass} h-3 w-16 rounded opacity-60`} />
            </div>

            {/* Progress Bar (visible on larger screens) */}
            <div className="hidden md:block w-24 shrink-0">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <div className={`${baseSkeletonClass} h-2.5 w-8 rounded opacity-60`} />
                  <div className={`${baseSkeletonClass} h-2.5 w-6 rounded opacity-60`} />
                </div>
                <div className="h-1.5 bg-[#0A0A0F] rounded-full overflow-hidden">
                  <div
                    className={`${baseSkeletonClass} h-full rounded-full`}
                    style={{ width: `${30 + rowIdx * 12}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex items-center gap-2 shrink-0">
              <div className={`${baseSkeletonClass} h-8 w-8 rounded-lg`} />
              <div className={`${baseSkeletonClass} h-8 w-8 rounded-lg`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return <TableSkeleton />;
      case 'cards':
        return <CardsSkeleton />;
      case 'list':
        return <ListSkeleton />;
      default:
        return <TableSkeleton />;
    }
  };

  return (
    <div className="w-full bg-[#0A0A0F] min-h-[200px] rounded-xl">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-[#6C63FF]/10">
        <div className="space-y-2">
          <div className="bg-[#1A1A2E] animate-pulse rounded h-6 w-48" />
          <div className="bg-[#1A1A2E] animate-pulse rounded h-3.5 w-32 opacity-60" />
        </div>
        <div className="flex gap-3">
          <div className="bg-[#1A1A2E] animate-pulse rounded-lg h-9 w-32" />
          <div className="bg-[#1A1A2E] animate-pulse rounded-lg h-9 w-9" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      {type === 'table' && (
        <div className="flex flex-wrap gap-3 p-4 border-b border-[#6C63FF]/10">
          <div className="bg-[#1A1A2E] animate-pulse rounded-lg h-9 flex-1 min-w-[180px] max-w-xs" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`filter-${idx}`} className="bg-[#1A1A2E] animate-pulse rounded-lg h-9 w-24" />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton;