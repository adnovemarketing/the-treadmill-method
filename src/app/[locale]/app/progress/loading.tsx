import React from 'react';

export default function ProgressLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      {/* Header Skeleton */}
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
        <div className="flex flex-col gap-2">
          <div className="h-4 w-36 bg-zinc-900 rounded-full animate-pulse" />
          <div className="h-7 w-64 bg-zinc-900 rounded-xl animate-pulse mt-1" />
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl h-24 animate-pulse" />
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl h-24 animate-pulse" />
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl h-24 animate-pulse" />
        </div>

        {/* History List Skeleton */}
        <div className="w-full bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4 animate-pulse">
          <div className="h-4 w-48 bg-zinc-950 rounded pb-3 border-b border-zinc-900" />
          <div className="flex flex-col gap-3">
            <div className="h-14 bg-zinc-950 rounded-2xl" />
            <div className="h-14 bg-zinc-950 rounded-2xl" />
            <div className="h-14 bg-zinc-950 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
