import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import { getUserProgrammeProgress } from '@/lib/progressServer';
import { calculateProgrammeProgress } from '@/core/programmes/helpers';
import { Trophy, Play, ArrowRight, Sparkles, Compass, Calendar, Target, Info } from 'lucide-react';

interface AppPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MemberDashboardPage({ params }: AppPageProps) {
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

  // Fetch personalised profile & completed progress
  const personalisation = await getUserPersonalisedProfile(user.id, locale);
  if (!personalisation.success || !personalisation.plan) {
    redirect(`/${locale}/no-access`);
  }

  const plan = personalisation.plan;
  const labels = personalisation.labels!;

  const progressRecords = await getUserProgrammeProgress(user.id);
  const completedIds = progressRecords.map((r) => r.programme_session_id);
  const progressSummary = calculateProgrammeProgress(plan.programme, completedIds);

  const nextSession = progressSummary.nextSession;
  const isProgrammeComplete = progressSummary.isComplete;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* SECTION 1: TODAY'S WALK (PRIMARY VISUAL PRIORITY) */}
        <div className="w-full bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-brand-lime/30 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />

          {isProgrammeComplete ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-brand-lime/10 border border-brand-lime/40 flex items-center justify-center text-brand-lime shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit mx-auto">
                  {isPtBr ? 'CONCLUÍDO' : 'INITIAL PROGRAMME COMPLETE'}
                </span>
                <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight mt-2">
                  {isPtBr ? 'Você completou os 9 Treinos Principais!' : 'You Completed All 9 Core Sessions!'}
                </h1>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  {isPtBr
                    ? 'Parabéns! Sua rotina inicial de 21 dias foi concluída com sucesso. Veja como prosseguir.'
                    : 'Congratulations! Your initial 21-Day foundation is complete. Learn how to maintain or progress your routine.'}
                </p>
              </div>
              <Link
                href={`/${locale}/app/next`}
                className="mt-2 inline-flex items-center gap-2 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-2xl transition-all shadow-lg"
              >
                <span>{isPtBr ? 'Ver Próximos Passos' : 'See What Comes Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : nextSession ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full border border-brand-lime/30">
                    {isPtBr ? "TREINO DE HOJE" : "TODAY'S WALK"}
                  </span>
                  <span className="text-xs font-heading font-extrabold text-zinc-400 uppercase">
                    {isPtBr ? `Semana ${nextSession.week} · Treino ${nextSession.sessionNumber}` : `Week ${nextSession.week} · Session ${nextSession.sessionNumber}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-heading font-bold text-zinc-300">
                  <span>⏱️ {nextSession.durationMinutes} min</span>
                  <span>⚡ Effort: {nextSession.effort}</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 tracking-tight uppercase">
                  {nextSession.title}
                </h1>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed max-w-2xl">
                  {nextSession.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/${locale}/app/session/${nextSession.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-lime text-zinc-950 hover:bg-brand-lime-hover font-heading font-bold text-sm tracking-wide px-8 py-4 rounded-2xl transition-all shadow-lg shadow-lime-500/10 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isPtBr ? 'INICIAR CAMINHADA' : 'START WALK'}</span>
                </Link>
                <Link
                  href={`/${locale}/app/journey`}
                  className="text-xs font-heading font-bold text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1"
                >
                  {isPtBr ? 'Ver todos os 9 treinos' : 'View all 9 sessions'}
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* SECTION 2: JOURNEY PROGRESS BAR */}
        <div className="w-full bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-heading font-extrabold text-zinc-200 uppercase tracking-wide">
              {isPtBr ? 'PROGRESSO DA JORNADA' : 'JOURNEY PROGRESS'}
            </span>
            <span className="font-heading font-extrabold text-brand-lime">
              {progressSummary.completedCount} / {progressSummary.totalCoreSessions} {isPtBr ? 'Treinos Concluídos' : 'Core Sessions Complete'}
            </span>
          </div>

          <div className="w-full h-3 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand-teal to-brand-lime rounded-full transition-all duration-500"
              style={{ width: `${progressSummary.progressPercent}%` }}
            />
          </div>

          {plan.sessions_per_week === 5 && (
            <p className="text-[11px] text-zinc-400 leading-normal flex items-start gap-1.5 mt-1">
              <Info className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
              <span>
                {isPtBr
                  ? 'Seu plano inclui 3 Treinos Principais + 2 Dias Suaves opcionais (10-20 min em esforço Suave) para flexibilidade de rotina.'
                  : 'Your plan includes 3 Core Sessions + 2 optional Easy Days (10–20 min Easy effort) for scheduling flexibility.'}
              </span>
            </p>
          )}
        </div>

        {/* SECTION 3: YOUR METHOD CARD */}
        <div className="w-full bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-lime" />
              <h2 className="text-xs font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
                {isPtBr ? 'SEU MÉTODO' : 'YOUR METHOD'}
              </h2>
            </div>
            <Link
              href={`/${locale}/app/plan`}
              className="text-[10px] font-heading font-extrabold text-brand-lime hover:underline uppercase"
            >
              {isPtBr ? 'Ver Detalhes' : 'View Full Plan'}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                {isPtBr ? 'PROGRAMA' : 'PROGRAMME'}
              </span>
              <span className="font-heading font-extrabold text-brand-lime">
                {labels.programmeLabel}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                {isPtBr ? 'NÍVEL' : 'LEVEL'}
              </span>
              <span className="font-heading font-extrabold text-zinc-200">
                {labels.startingLevelLabel}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-zinc-500">
                <Calendar className="w-3 h-3 text-brand-teal" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {isPtBr ? 'CRONOGRAMA' : 'SCHEDULE'}
                </span>
              </div>
              <span className="font-heading font-bold text-zinc-200">
                {labels.sessionsPerWeekLabel}
              </span>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-zinc-500">
                <Target className="w-3 h-3 text-brand-lime" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {isPtBr ? 'OBJETIVO' : 'GOAL'}
                </span>
              </div>
              <span className="font-heading font-bold text-zinc-200 truncate">
                {labels.goalFocusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4: PERSONAL STRATEGY PREVIEW */}
        <div className="w-full bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-teal" />
              <h2 className="text-xs font-heading font-extrabold text-zinc-100 uppercase tracking-wide">
                {isPtBr ? 'SUA ESTRATÉGIA CHAVE' : 'YOUR STRATEGY PREVIEW'}
              </h2>
            </div>
            <Link
              href={`/${locale}/app/strategy`}
              className="text-[10px] font-heading font-extrabold text-brand-lime hover:underline uppercase"
            >
              {isPtBr ? 'Ler Guia' : 'Read Strategy'}
            </Link>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex flex-col gap-1.5 text-xs">
            <span className="font-heading font-black text-brand-lime">
              {labels.personalStrategyLabel}
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {isPtBr
                ? 'Sua estratégia personalizada foi desenvolvida para contornar seu principal obstáculo e manter o ritmo.'
                : 'Your strategy is tailored to help you navigate your biggest daily obstacle and keep momentum.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
