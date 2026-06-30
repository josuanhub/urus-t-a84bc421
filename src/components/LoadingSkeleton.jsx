import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass =
    'bg-gradient-to-r from-[#1A1A2E] via-[#16213e] to-[#1A1A2E] rounded animate-pulse';

  // TABLE VARIANT
  if (type === 'table') {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0F]">
        {/* Table Header */}
        <div className="grid border-b border-white/5 bg-[#1A1A2E]/60 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, ci) => (
            <div key={ci} className="flex items-center px-2">
              <div className={`h-3 w-24 ${baseSkeletonClass} opacity-60`} />
            </div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/5">
          {Array.from({ length: rows }).map((_, ri) => (
            <div
              key={ri}
              className="grid px-4 py-4 transition-colors hover:bg-white/[0.02]"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: cols }).map((_, ci) => (
                <div key={ci} className="flex items-center gap-2 px-2">
                  {ci === 0 && (
                    <div className={`h-7 w-7 flex-shrink-0 rounded-full ${baseSkeletonClass}`} />
                  )}
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div
                      className={`h-3 ${baseSkeletonClass}`}
                      style={{ width: `${60 + Math.floor(((ri * cols + ci) * 17) % 35)}%` }}
                    />
                    {ci === 0 && (
                      <div
                        className={`h-2 ${baseSkeletonClass} opacity-50`}
                        style={{ width: `${40 + Math.floor(((ri + ci) * 13) % 25)}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between border-t border-white/5 bg-[#1A1A2E]/30 px-6 py-3">
          <div className={`h-3 w-28 ${baseSkeletonClass} opacity-40`} />
          <div className="flex gap-2">
            {[1, 2, 3].map((p) => (
              <div key={p} className={`h-7 w-7 rounded ${baseSkeletonClass} opacity-40`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CARDS VARIANT
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
      <div className={`grid gap-4 ${gridCols}`}>
        {Array.from({ length: rows }).map((_, ri) => (
          <div
            key={ri}
            className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#1A1A2E]/60 p-5 backdrop-blur-sm"
          >
            {/* Card Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 flex-shrink-0 rounded-xl ${baseSkeletonClass}`} />
                <div className="flex flex-col gap-1.5">
                  <div
                    className={`h-3.5 ${baseSkeletonClass}`}
                    style={{ width: `${80 + Math.floor((ri * 23) % 40)}px` }}
                  />
                  <div
                    className={`h-2.5 ${baseSkeletonClass} opacity-50`}
                    style={{ width: `${55 + Math.floor((ri * 11) % 30)}px` }}
                  />
                </div>
              </div>
              <div className={`h-5 w-14 rounded-full ${baseSkeletonClass} opacity-60`} />
            </div>

            {/* Card Divider */}
            <div className="h-px w-full bg-white/5" />

            {/* Card Body */}
            <div className="flex flex-col gap-2.5">
              <div className={`h-2.5 w-full ${baseSkeletonClass}`} />
              <div
                className={`h-2.5 ${baseSkeletonClass}`}
                style={{ width: `${70 + Math.floor((ri * 17) % 25)}%` }}
              />
              <div
                className={`h-2.5 ${baseSkeletonClass} opacity-60`}
                style={{ width: `${50 + Math.floor((ri * 7) % 30)}%` }}
              />
            </div>

            {/* Card Stats */}
            <div className="mt-1 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, si) => (
                <div
                  key={si}
                  className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.03] p-2"
                >
                  <div className={`h-4 w-10 ${baseSkeletonClass}`} />
                  <div className={`h-2 w-8 ${baseSkeletonClass} opacity-50`} />
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1.5">
                {[1, 2].map((a) => (
                  <div
                    key={a}
                    className={`h-5 w-5 rounded-full ${baseSkeletonClass} opacity-60`}
                  />
                ))}
              </div>
              <div className={`h-8 w-20 rounded-lg ${baseSkeletonClass} opacity-70`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // LIST VARIANT
  if (type === 'list') {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-[#0A0A0F] p-2">
        {/* List Header */}
        <div className="flex items-center justify-between rounded-lg bg-[#1A1A2E]/60 px-4 py-3">
          <div className={`h-3 w-32 ${baseSkeletonClass} opacity-70`} />
          <div className="flex gap-2">
            <div className={`h-7 w-24 rounded-lg ${baseSkeletonClass} opacity-50`} />
            <div className={`h-7 w-16 rounded-lg ${baseSkeletonClass} opacity-50`} />
          </div>
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: rows }).map((_, ri) => (
            <div
              key={ri}
              className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-all hover:border-white/5 hover:bg-white/[0.02]"
            >
              {/* Index */}
              <div
                className={`h-5 w-5 flex-shrink-0 rounded text-center text-xs ${baseSkeletonClass} opacity-40`}
              />

              {/* Avatar */}
              <div className={`h-9 w-9 flex-shrink-0 rounded-full ${baseSkeletonClass}`} />

              {/* Main Info */}
              <div className="flex flex-1 flex-col gap-1.5">
                <div
                  className={`h-3 ${baseSkeletonClass}`}
                  style={{ width: `${120 + Math.floor((ri * 19) % 80)}px` }}
                />
                <div
                  className={`h-2.5 ${baseSkeletonClass} opacity-50`}
                  style={{ width: `${80 + Math.floor((ri * 11) % 60)}px` }}
                />
              </div>

              {/* Cols Data */}
              <div className="hidden items-center gap-6 sm:flex">
                {Array.from({ length: Math.max(0, cols - 1) }).map((_, ci) => (
                  <div key={ci} className="flex flex-col items-end gap-1">
                    <div
                      className={`h-3 ${baseSkeletonClass}`}
                      style={{ width: `${40 + Math.floor(((ri + ci) * 13) % 30)}px` }}
                    />
                    <div
                      className={`h-2 ${baseSkeletonClass} opacity-40`}
                      style={{ width: `${25 + Math.floor(((ri * ci + 1) * 7) % 20)}px` }}
                    />
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className={`hidden h-5 w-14 flex-shrink-0 rounded-full ${baseSkeletonClass} opacity-60 md:block`} />

              {/* Actions */}
              <div className="flex gap-1.5">
                <div className={`h-7 w-7 rounded-lg ${baseSkeletonClass} opacity-50`} />
                <div className={`h-7 w-7 rounded-lg ${baseSkeletonClass} opacity-50`} />
              </div>
            </div>
          ))}
        </div>

        {/* List Footer */}
        <div className="flex items-center justify-between rounded-lg bg-[#1A1A2E]/30 px-4 py-3">
          <div className={`h-2.5 w-36 ${baseSkeletonClass} opacity-40`} />
          <div className="flex items-center gap-2">
            <div className={`h-7 w-16 rounded-lg ${baseSkeletonClass} opacity-40`} />
            <div className={`h-7 w-8 rounded-lg ${baseSkeletonClass} opacity-40`} />
            <div className={`h-7 w-16 rounded-lg ${baseSkeletonClass} opacity-40`} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;