import React from 'react';

export default function MemberDashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      {/* Minimal Header Skeleton */}
      <header className="w-full bg-zinc-950/90 border-b border-zinc-900 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="h-6 w-48 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="hidden lg:flex items-center gap-3">
            <div className="h-5 w-16 bg-zinc-900 rounded animate-pulse" />
            <div className="h-5 w-20 bg-zinc-900 rounded animate-pulse" />
            <div className="h-5 w-24 bg-zinc-900 rounded animate-pulse" />
            <div className="h-5 w-18 bg-zinc-900 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Primary Walk Card Skeleton */}
        <div className="w-full bg-zinc-900/40 border border-zinc-900 p-6 md:p-8 rounded-3xl flex flex-col gap-4 animate-pulse">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="h-4 w-32 bg-zinc-950 rounded-full" />
            <div className="h-4 w-24 bg-zinc-950 rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-zinc-950 rounded-xl mt-2" />
          <div className="h-4 w-full bg-zinc-950 rounded-lg" />
          <div className="h-4 w-2/3 bg-zinc-950 rounded-lg" />
          <div className="h-12 w-48 bg-brand-lime/10 border border-brand-lime/20 rounded-2xl mt-4" />
        </div>

        {/* Progress Bar Skeleton */}
        <div className="w-full bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-zinc-950 rounded" />
            <div className="h-4 w-20 bg-zinc-950 rounded" />
          </div>
          <div className="w-full h-3 bg-zinc-950 rounded-full" />
        </div>

        {/* Plan Cards Grid Skeleton */}
        <div className="w-full bg-zinc-900/20 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-4 animate-pulse">
          <div className="h-4 w-28 bg-zinc-950 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-16 bg-zinc-950 rounded-xl" />
            <div className="h-16 bg-zinc-950 rounded-xl" />
            <div className="h-16 bg-zinc-950 rounded-xl" />
            <div className="h-16 bg-zinc-950 rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
