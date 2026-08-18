import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { EFFORT_SCALE } from '@/core/programmes/effortScale';
import { BookOpen, Heart, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ResourcesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'RECURSOS E GUIA' : 'MEMBER RESOURCES'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? 'Guia do Membro & Segurança' : 'Essential Guidance & Safety'}
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl">
            {isPtBr
              ? 'Tudo o que você precisa saber para executar sua caminhada com conforto, segurança e consistência.'
              : 'Everything you need to know to execute your routine safely, comfortably, and consistently.'}
          </p>
        </div>

        {/* 1. QUICK START */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <h2 className="text-sm font-heading font-extrabold text-brand-lime uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-lime" />
            QUICK START
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-brand-lime">1. Check your plan</span>
              <p className="text-[11px] text-zinc-400">Review your assigned programme and target weekly schedule.</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-brand-lime">2. Choose your walking time</span>
              <p className="text-[11px] text-zinc-400">Place planned sessions into your calendar as non-negotiable appointments.</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-brand-lime">3. Prepare for your first walk</span>
              <p className="text-[11px] text-zinc-400">Wear comfortable footwear and inspect treadmill safety controls.</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-brand-lime">4. Complete Session 1</span>
              <p className="text-[11px] text-zinc-400">Open Session 1 and log your post-walk check-in upon completion.</p>
            </div>
          </div>
        </div>

        {/* 2. UNDERSTANDING EFFORT */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <h2 className="text-sm font-heading font-extrabold text-brand-teal uppercase tracking-wide flex items-center gap-2">
            <Heart className="w-4 h-4 text-brand-teal" />
            UNDERSTANDING EFFORT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1.5">
              <span className="font-heading font-extrabold text-brand-lime">{EFFORT_SCALE.easy.name} ({EFFORT_SCALE.easy.rpeScale})</span>
              <p className="text-zinc-300">{EFFORT_SCALE.easy.description}</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1.5">
              <span className="font-heading font-extrabold text-brand-teal">{EFFORT_SCALE.comfortable.name} ({EFFORT_SCALE.comfortable.rpeScale})</span>
              <p className="text-zinc-300">{EFFORT_SCALE.comfortable.description}</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1.5">
              <span className="font-heading font-extrabold text-zinc-100">{EFFORT_SCALE.brisk.name} ({EFFORT_SCALE.brisk.rpeScale})</span>
              <p className="text-zinc-300">{EFFORT_SCALE.brisk.description}</p>
            </div>
          </div>
        </div>

        {/* 3. BEFORE EVERY WALK */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <h2 className="text-sm font-heading font-extrabold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-lime" />
            BEFORE EVERY WALK
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            <li className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
              <span className="text-brand-lime font-black">•</span> Comfortable clothing
            </li>
            <li className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
              <span className="text-brand-lime font-black">•</span> Suitable footwear
            </li>
            <li className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
              <span className="text-brand-lime font-black">•</span> Water available
            </li>
            <li className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
              <span className="text-brand-lime font-black">•</span> Understand treadmill safety controls
            </li>
            <li className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
              <span className="text-brand-lime font-black">•</span> Check today&apos;s session
            </li>
            <li className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center gap-2">
              <span className="text-brand-lime font-black">•</span> Begin Easy
            </li>
          </ul>
        </div>

        {/* 4. FREQUENT QUESTIONS */}
        <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <h2 className="text-sm font-heading font-extrabold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-teal" />
            COMMON QUESTIONS
          </h2>

          <div className="flex flex-col gap-3 text-xs">
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-zinc-100">WHAT IF I MISS A WALK?</span>
              <p className="text-zinc-400 leading-relaxed">
                Do not restart. Do not double the next session. Continue with the next uncompleted Core Session.
              </p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-zinc-100">WHAT IF IT FEELS TOO HARD?</span>
              <p className="text-zinc-400 leading-relaxed">
                Slow down. Reduce incline if applicable. Return to Easy effort. End early if necessary. Do not push through concerning symptoms or new/worsening pain.
              </p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-1">
              <span className="font-heading font-extrabold text-zinc-100">WHAT IF IT FEELS TOO EASY?</span>
              <p className="text-zinc-400 leading-relaxed">
                Do not dramatically increase everything at once. Complete the planned progression first.
              </p>
            </div>
          </div>
        </div>

        {/* 5. HEALTH & SAFETY NOTICE */}
        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-xs font-heading font-extrabold uppercase tracking-wide">
              HEALTH & SAFETY NOTICE
            </h2>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed italic">
            The Treadmill Method provides general educational guidance about walking and physical activity. It does not provide medical advice, diagnosis, treatment or individual clinical exercise prescription.
          </p>
          <p className="text-[11px] text-zinc-300 leading-relaxed italic">
            If you have a medical condition, have been inactive for a long period, have concerns about starting exercise, are pregnant, have recently undergone surgery, experience significant joint or mobility problems, or have previously been advised to restrict physical activity, seek appropriate advice from a qualified healthcare professional before starting where appropriate.
          </p>
          <p className="text-[11px] text-zinc-300 leading-relaxed italic">
            Begin gradually and choose an effort appropriate for your current ability. Stop exercising and seek appropriate medical attention if you experience concerning symptoms such as chest pain, fainting, severe or unusual shortness of breath, or other symptoms that cause concern. Do not push through new or worsening pain.
          </p>
        </div>
      </main>
    </div>
  );
}
