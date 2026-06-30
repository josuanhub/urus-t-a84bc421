import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass = "bg-[#1A1A2E] rounded animate-pulse";
  const shimmerClass = "bg-gradient-to-r from-[#1A1A2E] via-[#2A2A4E] to-[#1A1A2E] rounded animate-pulse";

  if (type === 'table') {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-[#6C63FF]/20 bg-[#0A0A0F]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#6C63FF]/20 bg-[#1A1A2E]/40">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`h-4 ${shimmerClass} ${colIdx === 0 ? 'flex-[2]' : 'flex-1'}`}
            />
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#6C63FF]/10">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#1A1A2E]/30 transition-colors"
              style={{ animationDelay: `${rowIdx * 80}ms` }}
            >
              {/* Dot indicator */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${baseSkeletonClass}`} />

              {Array.from({ length: cols }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className={`h-3 ${shimmerClass} ${colIdx === 0 ? 'flex-[2]' : 'flex-1'} ${
                    colIdx === cols - 1 ? 'max-w-[80px]' : ''
                  }`}
                  style={{ animationDelay: `${(rowIdx * cols + colIdx) * 40}ms` }}
                />
              ))}

              {/* Action button placeholder */}
              <div className={`w-6 h-6 rounded flex-shrink-0 ${baseSkeletonClass}`} />
            </div>
          ))}
        </div>

        {/* Footer pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#6C63FF]/20 bg-[#1A1A2E]/20">
          <div className={`h-3 w-24 ${shimmerClass}`} />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded ${baseSkeletonClass}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'cards') {
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
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="rounded-xl border border-[#6C63FF]/20 bg-[#0A0A0F] p-4 flex flex-col gap-3 overflow-hidden relative"
            style={{ animationDelay: `${rowIdx * 100}ms` }}
          >
            {/* Accent top bar */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${shimmerClass}`} />

            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg flex-shrink-0 ${shimmerClass}`} />
                <div className="flex flex-col gap-1.5">
                  <div className={`h-3 w-24 ${shimmerClass}`} />
                  <div className={`h-2 w-16 ${shimmerClass}`} />
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full ${baseSkeletonClass}`} />
            </div>

            {/* Divider */}
            <div className="h-px bg-[#6C63FF]/10" />

            {/* Content lines */}
            <div className="flex flex-col gap-2">
              <div className={`h-3 w-full ${shimmerClass}`} />
              <div className={`h-3 w-4/5 ${shimmerClass}`} />
              <div className={`h-3 w-3/5 ${shimmerClass}`} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1 items-center bg-[#1A1A2E]/60 rounded-lg p-2">
                  <div className={`h-4 w-10 ${shimmerClass}`} />
                  <div className={`h-2 w-8 ${shimmerClass}`} />
                </div>
              ))}
            </div>

            {/* Badge row */}
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={`h-5 w-14 rounded-full ${shimmerClass}`} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-auto pt-1">
              <div className={`h-8 flex-1 rounded-lg ${shimmerClass}`} />
              <div className={`h-8 w-8 rounded-lg ${baseSkeletonClass}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="w-full flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#6C63FF]/20 bg-[#0A0A0F] relative overflow-hidden"
            style={{ animationDelay: `${rowIdx * 80}ms` }}
          >
            {/* Left accent */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-[3px] ${shimmerClass} rounded-l-xl`}
            />

            {/* Avatar / icon */}
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${shimmerClass} ml-2`} />

            {/* Text content */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`h-3.5 w-32 ${shimmerClass}`} />
                <div className={`h-4 w-14 rounded-full ${shimmerClass}`} />
              </div>
              <div className={`h-2.5 w-full max-w-xs ${shimmerClass}`} />
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className={`h-3 w-16 ${shimmerClass}`} />
              <div className={`h-2 w-10 ${shimmerClass}`} />
            </div>

            {/* Action icon */}
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 ${baseSkeletonClass}`} />
          </div>
        ))}

        {/* Load more placeholder */}
        <div className="flex justify-center pt-2">
          <div className={`h-9 w-32 rounded-lg ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;