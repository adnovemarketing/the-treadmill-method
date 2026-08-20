import React from 'react';
import { redirect } from 'next/navigation';
import { MemberNav } from '@/components/member/MemberNav';
import { createSupabaseServerAppClient } from '@/lib/supabase/server';
import { checkAndLinkUserEntitlement } from '@/lib/entitlement';
import { getUserPersonalisedProfile } from '@/lib/personalisationServer';
import { getUserProgrammeProgress, getUserPostProgrammeProgress } from '@/lib/progressServer';
import { calculateProgrammeProgress, getSessionById } from '@/core/programmes/helpers';
import { Activity, Clock, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';

interface ProgressPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { locale = 'en-gb' } = await params;
  const isPtBr = locale.toLowerCase() === 'pt-br';

  // 1. Authenticate user server-side
  const supabase = await createSupabaseServerAppClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect(`/${locale}/login`);
  }

  const user = data.user;

  // 2. Enforce entitlement guard
  const entitlement = await checkAndLinkUserEntitlement(user.id, user.email || '');
  if (!entitlement.hasEntitlement) {
    redirect(`/${locale}/no-access`);
  }

  // 3. Parallel execution of independent progress & personalisation reads after entitlement verification
  const [personalisation, progressRecords, postRecords] = await Promise.all([
    getUserPersonalisedProfile(user.id, locale),
    getUserProgrammeProgress(user.id),
    getUserPostProgrammeProgress(user.id),
  ]);

  if (!personalisation.success || !personalisation.plan) {
    redirect(`/${locale}/no-access`);
  }

  const plan = personalisation.plan;
  const completedIds = progressRecords.map((r) => r.programme_session_id);
  const completedDurations = progressRecords.map((r) => r.duration_minutes);

  const summary = calculateProgrammeProgress(plan.programme, completedIds, completedDurations);

  const totalPostMinutes = postRecords.reduce((acc, r) => acc + r.duration_minutes, 0);
  const combinedTotalWalkingMinutes = summary.totalDurationMinutes + totalPostMinutes;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between selection:bg-brand-lime selection:text-zinc-950">
      <MemberNav locale={locale} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-widest text-brand-lime font-heading font-extrabold uppercase bg-brand-lime/10 px-3 py-1 rounded-full w-fit">
            {isPtBr ? 'PAINEL DE PROGRESSO' : 'PROGRESS DASHBOARD'}
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-zinc-50 uppercase tracking-tight">
            {isPtBr ? 'Seu Histórico & Consistência' : 'Your Progress & Consistency'}
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            {isPtBr
              ? 'Acompanhe seu hábito diário de caminhada de forma limpa e objetiva.'
              : 'Track your walking routine built on steady execution and consistency.'}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPtBr ? 'TREINOS PRINCIPAIS' : 'CORE SESSIONS'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-brand-lime" />
            </div>
            <div>
              <span className="text-3xl font-heading font-black text-zinc-50">
                {summary.completedCount} / {summary.totalCoreSessions}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold block mt-1">
                {summary.progressPercent}% {isPtBr ? 'Concluído' : 'Completed'}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPtBr ? 'TEMPO TOTAL DE CAMINHADA' : 'TOTAL WALKING TIME'}
              </span>
              <Clock className="w-4 h-4 text-brand-teal" />
            </div>
            <div>
              <span className="text-3xl font-heading font-black text-brand-lime">
                {combinedTotalWalkingMinutes} <span className="text-lg text-zinc-400 font-normal">min</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-bold block mt-1">
                {isPtBr ? 'Acumulado até agora' : 'Total minutes logged'}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPtBr ? 'SEMANA ATUAL' : 'CURRENT WEEK'}
              </span>
              <Calendar className="w-4 h-4 text-brand-lime" />
            </div>
            <div>
              <span className="text-3xl font-heading font-black text-zinc-50">
                Week 0{summary.currentWeek}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold block mt-1">
                {isPtBr ? 'Em andamento' : 'Active walking phase'}
              </span>
            </div>
          </div>
        </div>

        {/* Consistency Summary */}
        <div className="w-full bg-zinc-900/30 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-3">
          <h2 className="text-xs font-heading font-extrabold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-teal" />
            {isPtBr ? 'RESUMO DE CONSISTÊNCIA' : 'CONSISTENCY SUMMARY'}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {summary.completedCount === 0
              ? isPtBr
                ? 'Você está prestes a realizar seu primeiro treino! Conclua o Treino 1 para iniciar seu histórico.'
                : 'You are ready to begin Session 1! Complete your first walk to start your consistency log.'
              : summary.isComplete
              ? isPtBr
                ? 'Parabéns! Você completou 100% dos treinos principais da sua jornada inicial de 21 dias.'
                : 'Outstanding! You have completed 100% of your core sessions in the 21-Day foundation.'
              : isPtBr
              ? `Você concluiu ${summary.completedCount} de ${summary.totalCoreSessions} treinos planejados. Mantenha a frequência e execute uma caminhada de cada vez.`
              : `You have completed ${summary.completedCount} of ${summary.totalCoreSessions} planned sessions. Focus on completing one walk at a time.`}
          </p>
        </div>

        {/* 21-Day Session History Log */}
        <div className="w-full bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
          <h2 className="text-xs font-heading font-extrabold text-zinc-100 uppercase tracking-wide border-b border-zinc-900 pb-3">
            {isPtBr ? 'HISTÓRICO DE SESSÕES REGISTRADAS (21 DIAS)' : '21-DAY SESSION HISTORY LOG'}
          </h2>

          {progressRecords.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              {isPtBr ? 'Nenhum treino registrado ainda.' : 'No completed sessions logged yet.'}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {progressRecords.map((record) => {
                const sessionDef = getSessionById(record.programme_session_id);
                const dateStr = new Date(record.completed_at).toLocaleDateString(locale, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={record.id}
                    className="bg-zinc-950 border border-zinc-900/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                      <div>
                        <h4 className="font-heading font-bold text-zinc-100">
                          {sessionDef?.title || record.programme_session_id}
                        </h4>
                        <span className="text-[10px] text-zinc-500">{dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-heading font-bold">
                      <span className="text-zinc-400">{record.duration_minutes} min</span>
                      {record.difficulty && (
                        <span className="text-[10px] bg-zinc-900 text-brand-lime px-2.5 py-1 rounded-full border border-zinc-800">
                          {record.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AFTER DAY 21 ACTIVITY LOG */}
        {postRecords.length > 0 && (
          <div className="w-full bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl flex flex-col gap-4">
            <h2 className="text-xs font-heading font-extrabold text-brand-lime uppercase tracking-wide border-b border-zinc-900 pb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-lime" />
              {isPtBr ? 'ATIVIDADE APÓS OS 21 DIAS' : 'AFTER DAY 21 ACTIVITY'}
            </h2>

            <div className="flex flex-col gap-2.5">
              {postRecords.map((record) => {
                const sessionDef = getSessionById(record.programme_session_id);
                const dateStr = new Date(record.completed_at).toLocaleDateString(locale, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={record.id}
                    className="bg-zinc-950 border border-brand-lime/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 text-brand-lime shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-zinc-100">
                            {sessionDef?.title || record.programme_session_id}
                          </h4>
                          <span className="text-[9px] font-heading font-extrabold uppercase bg-brand-lime/10 text-brand-lime px-2 py-0.5 rounded-full border border-brand-lime/30">
                            {`${record.action_type.toUpperCase()} · CYCLE ${record.cycle_number}`}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-heading font-bold">
                      <span className="text-zinc-400">{record.duration_minutes} min</span>
                      {record.difficulty && (
                        <span className="text-[10px] bg-zinc-900 text-brand-lime px-2.5 py-1 rounded-full border border-zinc-800">
                          {record.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
