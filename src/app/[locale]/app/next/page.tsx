import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { RefreshCw, TrendingUp, ShieldCheck, Trophy } from 'lucide-react';

interface NextPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AfterDay21Page({ params }: NextPageProps) {
  const { locale = 'en-gb' } = await params;
  const isPtBr = locale.toLowerCase() === 'pt-br';

  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect(`/${locale}/login`);
  }

  const user = data.user;
  const entitlement = await checkAndLinkUserEntitlement(user.id, user.email || '');

  if (!entitlement.hasEntitlement) {
    redirect(`/${locale}/no-access`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'APÓS OS 21 DIAS' : 'AFTER DAY 21'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            What&apos;s Next?
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            {isPtBr
              ? 'Diretrizes para dar continuidade à sua rotina de caminhada além dos 21 dias iniciais.'
              : 'Principles for continuing your routine and protecting your habit beyond the initial 21 days.'}
          </p>
        </div>

        {/* 1. REPEAT */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-lime shrink-0" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              REPEAT
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            If your current programme still feels appropriately challenging, repeat your final week before increasing anything.
          </p>
        </div>

        {/* 2. PROGRESS */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-teal shrink-0" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              PROGRESS
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            When sessions consistently feel comfortable, change one thing at a time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 font-heading font-bold text-zinc-300">
              Slightly more walking time; <span className="text-brand-lime font-black uppercase text-[10px] block mt-1">OR</span>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 font-heading font-bold text-zinc-300">
              Slightly more Comfortable walking; <span className="text-brand-teal font-black uppercase text-[10px] block mt-1">OR</span>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 font-heading font-bold text-zinc-300">
              A small increase in incline where appropriate.
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-bold italic">
            Do not increase everything simultaneously.
          </p>
        </div>

        {/* 3. MAINTAIN */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-lime shrink-0" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              MAINTAIN
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            Once you&apos;ve built a routine that works for your life, protecting that routine matters more than constantly making it harder.
          </p>
        </div>

        {/* CLOSING PRINCIPLE */}
        <div className="bg-brand-lime/10 border border-brand-lime/30 p-6 rounded-3xl flex flex-col items-center text-center gap-3">
          <Trophy className="w-8 h-8 text-brand-lime" />
          <h3 className="text-base md:text-lg font-heading font-black text-zinc-50 uppercase tracking-tight">
            Day 21 is the end of your starting phase — not the finish line.
          </h3>
        </div>
      </main>
    </div>
  );
}
