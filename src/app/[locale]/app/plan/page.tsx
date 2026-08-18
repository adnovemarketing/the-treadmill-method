import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import { Sparkles, Target, Activity, Calendar, Clock, Compass, Info } from 'lucide-react';

interface PlanPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MyPlanPage({ params }: PlanPageProps) {
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

  const personalisation = await getUserPersonalisedProfile(user.id, locale);
  if (!personalisation.success || !personalisation.plan) {
    redirect(`/${locale}/no-access`);
  }

  const labels = personalisation.labels!;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'SEU PLANO INDIVIDUAL' : 'MY PLAN PROFILE'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? 'Seu Plano Personalizado' : 'Your Personalised Plan'}
          </h1>
          <p className="text-xs text-zinc-400">
            {isPtBr
              ? 'Estruturado deterministicamente com base no seu perfil físico, metas e rotina.'
              : 'Structured deterministically around your goals, readiness, and physical baseline.'}
          </p>
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goal */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Target className="w-4 h-4 text-brand-lime" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPtBr ? 'OBJETIVO PRINCIPAL' : 'YOUR GOAL'}
              </span>
            </div>
            <span className="text-lg font-heading font-black text-zinc-100">
              {labels.goalFocusLabel}
            </span>
          </div>

          {/* Programme */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Sparkles className="w-4 h-4 text-brand-lime" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPtBr ? 'PROGRAMA DE CAMINHADA' : 'YOUR PROGRAMME'}
              </span>
            </div>
            <span className="text-lg font-heading font-black text-brand-lime">
              {labels.programmeLabel}
            </span>
          </div>

          {/* Level */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity className="w-4 h-4 text-brand-teal" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPtBr ? 'NÍVEL INICIAL' : 'STARTING LEVEL'}
              </span>
            </div>
            <span className="text-base font-heading font-extrabold text-zinc-100">
              {labels.startingLevelLabel}
            </span>
          </div>

          {/* Schedule */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar className="w-4 h-4 text-brand-teal" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {isPtBr ? 'CRONOGRAMA SEMANAL' : 'WEEKLY SCHEDULE'}
              </span>
            </div>
            <span className="text-base font-heading font-extrabold text-zinc-100">
              {labels.sessionsPerWeekLabel}
            </span>
          </div>

          {/* Preferred Time */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-4 h-4 text-brand-lime" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {isPtBr ? 'HORÁRIO PREFERIDO' : 'PREFERRED TIME'}
              </span>
            </div>
            <span className="text-base font-heading font-extrabold text-zinc-100">
              {labels.preferredWorkoutTimeLabel}
            </span>
          </div>

          {/* Personal Strategy */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Compass className="w-4 h-4 text-brand-teal" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                {isPtBr ? 'ESTRATÉGIA CHAVE' : 'PERSONAL STRATEGY'}
              </span>
            </div>
            <span className="text-base font-heading font-extrabold text-brand-lime">
              {labels.personalStrategyLabel}
            </span>
          </div>
        </div>

        {/* Why We Selected This */}
        <div className="w-full bg-zinc-900/20 border border-brand-teal/20 p-6 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-brand-teal shrink-0" />
            <h2 className="text-sm font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
              {isPtBr ? 'POR QUE ESTE PLANO FOI SELECIONADO' : 'WHY WE SELECTED THIS'}
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            {labels.personalisedExplanation}
          </p>
        </div>
      </main>
    </div>
  );
}
